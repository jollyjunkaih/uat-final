import Event from '#models/event'
import { DateTime } from 'luxon'

export default class EventService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = Event.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }
    if (params.model) {
      query.whereILike('model', `%${params.model}%`)
    }
    if (params.triggerType) {
      query.where('trigger_type', String(params.triggerType))
    }
    if (params.testStatus) {
      query.where('test_status', String(params.testStatus))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = Event.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }
    if (params.model) {
      query.whereILike('model', `%${params.model}%`)
    }
    if (params.triggerType) {
      query.where('trigger_type', String(params.triggerType))
    }
    if (params.testStatus) {
      query.where('test_status', String(params.testStatus))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return Event.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: Partial<Event>) {
    return Event.create(data)
  }

  async update(id: string, data: Partial<Event>) {
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
      await Event.query().where('id', ids[i]).update({ sequence: i + 1 })
    }
  }
}
