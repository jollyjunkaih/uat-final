import ViewOnlyLink from '#models/view_only_link'
import { DateTime } from 'luxon'

export default class ViewOnlyLinkService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = ViewOnlyLink.query()

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = ViewOnlyLink.query()

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return ViewOnlyLink.query().where('id', id).firstOrFail()
  }

  async create(data: Partial<ViewOnlyLink>) {
    return ViewOnlyLink.create(data)
  }

  async update(id: string, data: Partial<ViewOnlyLink>) {
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

  async findByToken(token: string) {
    return ViewOnlyLink.query().where('token', token).firstOrFail()
  }

  async recordAccess(id: string) {
    const record = await this.findById(id)
    record.accessCount = (record.accessCount || 0) + 1
    record.lastAccessedAt = DateTime.now()
    await record.save()
    return record
  }

  async revoke(id: string) {
    const record = await this.findById(id)
    record.isActive = false
    await record.save()
    return record
  }
}
