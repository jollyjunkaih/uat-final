import TestCase from '#models/test_case'
import { DateTime } from 'luxon'

export default class TestCaseService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = TestCase.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'test_no'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = TestCase.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence', 'test_no'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return TestCase.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: Partial<TestCase>) {
    return TestCase.create(data)
  }

  async update(id: string, data: Partial<TestCase>) {
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
      await TestCase.query().where('id', ids[i]).update({ sequence: i + 1 })
    }
  }
}
