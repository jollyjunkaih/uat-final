import UserGuideSection from '#models/user_guide_section'
import { DateTime } from 'luxon'

export default class UserGuideService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = UserGuideSection.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }
    if (params.roleSlug) {
      query.where('role_slug', String(params.roleSlug))
    }
    if (params.module) {
      query.whereILike('module', `%${params.module}%`)
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    query.orderBy('role_sequence', 'asc').orderBy('sequence', 'asc')

    return query
  }

  async findById(id: string) {
    return UserGuideSection.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: {
    projectId: string
    roleName: string
    roleSlug: string
    roleDescription?: string | null
    roleSequence: number
    title: string
    slug: string
    module?: string | null
    sequence: number
    content: string
    status?: string
  }) {
    return UserGuideSection.create({
      ...data,
      status: (data.status as 'draft' | 'published' | 'archived') || 'draft',
    })
  }

  async update(
    id: string,
    data: Partial<{
      roleName: string
      roleSlug: string
      roleDescription: string | null
      roleSequence: number
      title: string
      slug: string
      module: string | null
      sequence: number
      content: string
      status: string
    }>
  ) {
    const section = await this.findById(id)
    section.merge(data as Record<string, unknown>)
    await section.save()
    return section
  }

  async delete(id: string) {
    const section = await this.findById(id)
    section.deletedAt = DateTime.now()
    await section.save()
    return section
  }

  /**
   * Get all sections grouped by role for a project
   */
  async findGroupedByRole(projectId: string) {
    const sections = await UserGuideSection.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .orderBy('role_sequence', 'asc')
      .orderBy('sequence', 'asc')

    const roles: Array<{
      roleName: string
      roleSlug: string
      roleDescription: string | null
      roleSequence: number
      sections: typeof sections
    }> = []

    const roleMap = new Map<string, (typeof roles)[0]>()

    for (const section of sections) {
      let role = roleMap.get(section.roleSlug)
      if (!role) {
        role = {
          roleName: section.roleName,
          roleSlug: section.roleSlug,
          roleDescription: section.roleDescription,
          roleSequence: section.roleSequence,
          sections: [],
        }
        roleMap.set(section.roleSlug, role)
        roles.push(role)
      }
      role.sections.push(section)
    }

    return roles
  }

  /**
   * Bulk upsert sections from YAML import
   */
  async importFromYaml(
    projectId: string,
    yamlData: {
      roles: Array<{
        name: string
        slug: string
        description?: string | null
        sequence: number
        sections: Array<{
          title: string
          slug: string
          module?: string | null
          sequence: number
          content: string
        }>
      }>
    }
  ) {
    // Soft-delete existing sections for this project
    await UserGuideSection.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .update({ deleted_at: DateTime.now().toSQL() })

    const created: UserGuideSection[] = []

    for (const role of yamlData.roles) {
      for (const section of role.sections) {
        const record = await UserGuideSection.create({
          projectId,
          roleName: role.name,
          roleSlug: role.slug,
          roleDescription: role.description || null,
          roleSequence: role.sequence,
          title: section.title,
          slug: section.slug,
          module: section.module || null,
          sequence: section.sequence,
          content: section.content,
          status: 'draft',
        })
        created.push(record)
      }
    }

    return created
  }
}
