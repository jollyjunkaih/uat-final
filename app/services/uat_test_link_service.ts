import UatTestLink from '#models/uat_test_link'
import UatTestSubmission from '#models/uat_test_submission'
import UatTestResult from '#models/uat_test_result'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class UatTestLinkService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = UatTestLink.query()

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }

    return query
  }

  async findById(id: string) {
    return UatTestLink.query().where('id', id).firstOrFail()
  }

  async findByToken(token: string) {
    return UatTestLink.query().where('token', token).firstOrFail()
  }

  async create(data: Partial<UatTestLink>) {
    return UatTestLink.create(data)
  }

  async revoke(id: string) {
    const record = await this.findById(id)
    record.isActive = false
    await record.save()
    return record
  }

  async getSubmissions(linkId: string) {
    return UatTestSubmission.query()
      .where('uat_test_link_id', linkId)
      .preload('results')
      .orderBy('created_at', 'desc')
  }

  async createSubmission(
    linkId: string,
    data: {
      testerName: string
      signatorId: string | null
      signature: string
      signerIp: string | null
      signerUserAgent: string | null
      results: Array<{
        stepId: string
        featureId: string
        uatFlowId: string
        result: 'working' | 'not_working'
        comment?: string | null
      }>
    }
  ) {
    const trx = await db.transaction()

    try {
      const submission = await UatTestSubmission.create(
        {
          uatTestLinkId: linkId,
          testerName: data.testerName,
          signatorId: data.signatorId,
          signature: data.signature,
          status: 'submitted',
          submittedAt: DateTime.now(),
          signerIp: data.signerIp,
          signerUserAgent: data.signerUserAgent,
        },
        { client: trx }
      )

      const resultRows = data.results.map((r) => ({
        uatTestSubmissionId: submission.id,
        stepId: r.stepId,
        featureId: r.featureId,
        uatFlowId: r.uatFlowId,
        result: r.result,
        comment: r.comment ?? null,
      }))

      await UatTestResult.createMany(resultRows, { client: trx })

      await trx.commit()
      return submission
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }
}
