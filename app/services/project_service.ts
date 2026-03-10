import Project from '#models/project'
import { DateTime } from 'luxon'

export default class ProjectService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = Project.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.ownerId) {
      query.where('owner_id', String(params.ownerId))
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = Project.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.ownerId) {
      query.where('owner_id', String(params.ownerId))
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return Project.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async findByIdWithRelations(id: string) {
    return Project.query()
      .where('id', id)
      .whereNull('deleted_at')
      .preload('owner')
      .preload('features')
      .firstOrFail()
  }

  async create(data: Partial<Project>) {
    return Project.create(data)
  }

  async update(id: string, data: Partial<Project>) {
    const record = await this.findById(id)
    record.merge(data)
    await record.save()
    return record
  }

  async delete(id: string) {
    const record = await this.findById(id)
    record.deletedAt = DateTime.now()
    await record.save()
    return record
  }
}
