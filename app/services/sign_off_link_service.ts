import SignOffLink from '#models/sign_off_link'
import { DateTime } from 'luxon'

export default class SignOffLinkService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = SignOffLink.query()

    if (params.signOffRecordId) {
      query.where('sign_off_record_id', String(params.signOffRecordId))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.signerEmail) {
      query.whereILike('signer_email', `%${params.signerEmail}%`)
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = SignOffLink.query()

    if (params.signOffRecordId) {
      query.where('sign_off_record_id', String(params.signOffRecordId))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }
    if (params.signerEmail) {
      query.whereILike('signer_email', `%${params.signerEmail}%`)
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return SignOffLink.query().where('id', id).firstOrFail()
  }

  async create(data: Partial<SignOffLink>) {
    return SignOffLink.create(data)
  }

  async update(id: string, data: Partial<SignOffLink>) {
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
    return SignOffLink.query().where('token', token).firstOrFail()
  }

  async processSignature(
    token: string,
    data: {
      signerActualName: string
      signerComments: string | null
      decision: 'signed' | 'rejected'
      signerIp: string | null
      signerUserAgent: string | null
    }
  ) {
    const link = await this.findByToken(token)
    link.signerActualName = data.signerActualName
    link.signerComments = data.signerComments
    link.status = data.decision
    link.signedAt = DateTime.now()
    link.signerIp = data.signerIp
    link.signerUserAgent = data.signerUserAgent
    await link.save()
    return link
  }

  async revokeAllForRecord(recordId: string) {
    await SignOffLink.query()
      .where('sign_off_record_id', recordId)
      .where('status', 'pending')
      .update({ status: 'revoked' })
  }
}
