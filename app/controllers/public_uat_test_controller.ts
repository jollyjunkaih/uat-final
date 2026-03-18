import type { HttpContext } from '@adonisjs/core/http'
import UatTestLinkService from '#services/uat_test_link_service'
import AuditLogService from '#services/audit_log_service'
import { submitUatTestValidator } from '#validators/uat_test_validator'
import { DateTime } from 'luxon'
import Feature from '#models/feature'
import Signator from '#models/signator'
import Project from '#models/project'
import FeatureTransformer from '#transformers/feature_transformer'
import Step from '#models/step'

export default class PublicUatTestController {
  async show(ctx: HttpContext) {
    const token = ctx.params.token
    const service = new UatTestLinkService()
    const link = await service.findByToken(token)

    if (!link.isActive) {
      return ctx.inertia.render('share/expired', {
        reason: 'This UAT test link has been revoked.',
      })
    }

    if (link.expiresAt && link.expiresAt < DateTime.now()) {
      return ctx.inertia.render('share/expired', {
        reason: 'This UAT test link has expired.',
      })
    }

    const project = await Project.query().where('id', link.projectId).firstOrFail()

    const features = await Feature.query()
      .where('project_id', link.projectId)
      .whereNull('deleted_at')
      .preload('uatFlows', (uatFlowQuery) => {
        uatFlowQuery
          .whereNull('deleted_at')
          .preload('steps', (stepQuery) => {
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
          })
          .orderBy('sequence', 'asc')
      })
      .orderBy('sequence', 'asc')

    const signators = await Signator.query()
      .where('project_id', link.projectId)
      .orderBy('sequence', 'asc')

    return ctx.inertia.render('share/uat-test', {
      project: { id: project.id, name: project.name },
      features: FeatureTransformer.transform(features),
      signators: signators.map((s) => ({ id: s.id, name: s.name, title: s.title })),
      testLink: { id: link.id, token: link.token },
    })
  }

  async submit(ctx: HttpContext) {
    const token = ctx.params.token
    const service = new UatTestLinkService()
    const link = await service.findByToken(token)

    if (!link.isActive) {
      return ctx.response.status(410).json({ error: 'This UAT test link has been revoked.' })
    }

    if (link.expiresAt && link.expiresAt < DateTime.now()) {
      return ctx.response.status(410).json({ error: 'This UAT test link has expired.' })
    }

    const data = await ctx.request.validateUsing(submitUatTestValidator)

    // Server-side validation: ensure all steps are covered
    const totalSteps = await Step.query()
      .whereHas('uatFlow', (flowQuery) => {
        flowQuery
          .whereNull('deleted_at')
          .whereHas('feature', (featureQuery) => {
            featureQuery.where('project_id', link.projectId).whereNull('deleted_at')
          })
      })
      .whereNull('deleted_at')
      .count('* as total')

    const expectedCount = Number(totalSteps[0].$extras.total)
    if (data.results.length !== expectedCount) {
      return ctx.response.status(422).json({
        error: `Expected ${expectedCount} step results, got ${data.results.length}. All steps must be checked.`,
      })
    }

    const submission = await service.createSubmission(link.id, {
      testerName: data.testerName,
      signatorId: data.signatorId ?? null,
      signature: data.signature,
      signerIp: ctx.request.ip(),
      signerUserAgent: ctx.request.header('user-agent') ?? null,
      results: data.results.map((r) => ({
        stepId: r.stepId,
        featureId: r.featureId,
        uatFlowId: r.uatFlowId,
        result: r.result as 'working' | 'not_working',
        comment: r.comment ?? null,
      })),
    })

    const auditLogService = new AuditLogService()
    await auditLogService.log(
      null,
      'uat_test_submitted',
      'uat_test_submission',
      submission.id,
      { testerName: data.testerName },
      ctx.request.ip(),
      ctx.request.header('user-agent')
    )

    return ctx.response.json({ success: true })
  }
}
