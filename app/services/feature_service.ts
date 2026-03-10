import Feature from '#models/feature'
import { DateTime } from 'luxon'

export default class FeatureService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = Feature.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }
    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.module) {
      query.whereILike('module', `%${params.module}%`)
    }
    if (params.priority) {
      query.where('priority', String(params.priority))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.ownerId) {
      query.where('owner_id', String(params.ownerId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'name', 'created_at'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = Feature.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }
    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.module) {
      query.whereILike('module', `%${params.module}%`)
    }
    if (params.priority) {
      query.where('priority', String(params.priority))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.ownerId) {
      query.where('owner_id', String(params.ownerId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'name', 'created_at'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return Feature.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: Partial<Feature>) {
    return Feature.create(data)
  }

  async update(id: string, data: Partial<Feature>) {
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

  async reorder(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      await Feature.query().where('id', ids[i]).update({ sequence: i + 1 })
    }
  }
}
