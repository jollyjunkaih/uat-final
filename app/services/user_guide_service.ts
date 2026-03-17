import UserGuideSection from '#models/user_guide_section'
import UserGuideStep from '#models/user_guide_step'
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

    query
      .preload('steps', (q) => q.orderBy('sequence', 'asc'))
      .orderBy('role_sequence', 'asc')
      .orderBy('sequence', 'asc')

    return query
  }

  async findById(id: string) {
    return UserGuideSection.query()
      .where('id', id)
      .whereNull('deleted_at')
      .preload('steps', (q) => q.orderBy('sequence', 'asc'))
      .firstOrFail()
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
    status?: string
    steps?: Array<{ instruction: string; imageFileName?: string | null; sequence: number }>
  }) {
    const section = await UserGuideSection.create({
      projectId: data.projectId,
      roleName: data.roleName,
      roleSlug: data.roleSlug,
      roleDescription: data.roleDescription || null,
      roleSequence: data.roleSequence,
      title: data.title,
      slug: data.slug,
      module: data.module || null,
      sequence: data.sequence,
      status: (data.status as 'draft' | 'published' | 'archived') || 'draft',
    })

    if (data.steps?.length) {
      for (const step of data.steps) {
        await UserGuideStep.create({
          sectionId: section.id,
          instruction: step.instruction,
          imageFileName: step.imageFileName || null,
          sequence: step.sequence,
        })
      }
    }

    await section.load('steps', (q) => q.orderBy('sequence', 'asc'))
    return section
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
      status: string
      steps: Array<{ instruction: string; imageFileName?: string | null; sequence: number }>
    }>
  ) {
    const section = await this.findById(id)

    const { steps, ...sectionData } = data
    section.merge(sectionData as Record<string, unknown>)
    await section.save()

    if (steps !== undefined) {
      // Replace all steps
      await UserGuideStep.query().where('section_id', id).delete()
      for (const step of steps) {
        await UserGuideStep.create({
          sectionId: id,
          instruction: step.instruction,
          imageFileName: step.imageFileName || null,
          sequence: step.sequence,
        })
      }
    }

    await section.load('steps', (q) => q.orderBy('sequence', 'asc'))
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
      .preload('steps', (q) => q.orderBy('sequence', 'asc'))
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
          steps: Array<{
            instruction: string
            imageFileName?: string | null
            sequence: number
          }>
        }>
      }>
    }
  ) {
    // Soft-delete existing sections for this project (cascade deletes steps)
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
          status: 'draft',
        })

        for (const step of section.steps) {
          await UserGuideStep.create({
            sectionId: record.id,
            instruction: step.instruction,
            imageFileName: step.imageFileName || null,
            sequence: step.sequence,
          })
        }

        created.push(record)
      }
    }

    return created
  }
}
