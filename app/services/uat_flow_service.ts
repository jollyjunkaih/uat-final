import UatFlow from '#models/uat_flow'
import { DateTime } from 'luxon'

export default class UatFlowService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = UatFlow.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.featureId) {
      query.where('feature_id', String(params.featureId))
    }
    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'name'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = UatFlow.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.featureId) {
      query.where('feature_id', String(params.featureId))
    }
    if (params.name) {
      query.whereILike('name', `%${params.name}%`)
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'name'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return UatFlow.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: Partial<UatFlow>) {
    return UatFlow.create(data)
  }

  async update(id: string, data: Partial<UatFlow>) {
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
      await UatFlow.query().where('id', ids[i]).update({ sequence: i + 1 })
    }
  }
}
