import TriggerLink from '#models/trigger_link'

export default class TriggerLinkService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = TriggerLink.query()

    if (params.eventId) {
      query.where('event_id', String(params.eventId))
    }
    if (params.testStatus) {
      query.where('test_status', String(params.testStatus))
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = TriggerLink.query()

    if (params.eventId) {
      query.where('event_id', String(params.eventId))
    }
    if (params.testStatus) {
      query.where('test_status', String(params.testStatus))
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return TriggerLink.query().where('id', id).firstOrFail()
  }

  async create(data: Partial<TriggerLink>) {
    return TriggerLink.create(data)
  }

  async update(id: string, data: Partial<TriggerLink>) {
    const record = await this.findById(id)
    record.merge(data)
    await record.save()
    return record
  }

  async delete(id: string) {
    const record = await this.findById(id)
    await record.delete()
    return record
  }
}
