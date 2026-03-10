import SignOffRecord from '#models/sign_off_record'
import SignOffLink from '#models/sign_off_link'

export default class SignOffRecordService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = SignOffRecord.query()

    if (params.versionId) {
      query.where('version_id', String(params.versionId))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = SignOffRecord.query()

    if (params.versionId) {
      query.where('version_id', String(params.versionId))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return SignOffRecord.query().where('id', id).firstOrFail()
  }

  async create(data: Partial<SignOffRecord>) {
    return SignOffRecord.create(data)
  }

  async update(id: string, data: Partial<SignOffRecord>) {
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

  async checkCompletion(recordId: string) {
    const record = await SignOffRecord.query()
      .where('id', recordId)
      .firstOrFail()

    const signedCount = await SignOffLink.query()
      .where('sign_off_record_id', recordId)
      .where('status', 'signed')
      .count('* as total')

    const rejectedCount = await SignOffLink.query()
      .where('sign_off_record_id', recordId)
      .where('status', 'rejected')
      .count('* as total')

    const signed = Number(signedCount[0].$extras.total)
    const rejected = Number(rejectedCount[0].$extras.total)

    if (rejected > 0) {
      record.status = 'rejected'
    } else if (signed >= record.requiredSignatures) {
      record.status = 'approved'
    }

    await record.save()
    return record
  }
}
