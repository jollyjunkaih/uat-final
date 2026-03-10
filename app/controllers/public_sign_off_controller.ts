import type { HttpContext } from '@adonisjs/core/http'
import SignOffLinkService from '#services/sign_off_link_service'
import SignOffLinkTransformer from '#transformers/sign_off_link_transformer'
import SignOffRecordService from '#services/sign_off_record_service'
import VersionService from '#services/version_service'
import AuditLogService from '#services/audit_log_service'
import { submitSignOffValidator } from '#validators/sign_off_link_validator'
import { DateTime } from 'luxon'

export default class PublicSignOffController {
  async show(ctx: HttpContext) {
    const token = ctx.params.token
    const signOffLinkService = new SignOffLinkService()
    const link = await signOffLinkService.findByToken(token)

    if (link.status !== 'pending') {
      return ctx.response.status(410).json({
        error: `This sign-off link has already been ${link.status}.`,
      })
    }

    if (link.expiresAt && link.expiresAt < DateTime.now()) {
      return ctx.response.status(410).json({ error: 'This sign-off link has expired.' })
    }

    const signOffRecordService = new SignOffRecordService()
    const record = await signOffRecordService.findById(link.signOffRecordId)
    await record.load('version')

    const versionService = new VersionService()
    const version = await versionService.findById(record.versionId)

    return ctx.inertia.render('share/sign', {
      document: {
        snapshot: version.snapshot,
        documentType: record.documentType,
        versionNumber: version.versionNumber,
      },
      signOffLink: SignOffLinkTransformer.transform(link),
    })
  }

  async submit(ctx: HttpContext) {
    const token = ctx.params.token
    const data = await ctx.request.validateUsing(submitSignOffValidator)
    const signOffLinkService = new SignOffLinkService()
    const signOffRecordService = new SignOffRecordService()
    const auditLogService = new AuditLogService()

    const link = await signOffLinkService.processSignature(token, {
      signerActualName: data.signerActualName,
      signerComments: data.signerComments ?? null,
      decision: data.decision,
      signerIp: ctx.request.ip(),
      signerUserAgent: ctx.request.header('user-agent') ?? null,
    })

    await signOffRecordService.checkCompletion(link.signOffRecordId)

    await auditLogService.log(
      null,
      `sign_off_${data.decision}`,
      'sign_off_link',
      link.id,
      {
        signerName: data.signerActualName,
        signerEmail: link.signerEmail,
        decision: data.decision,
      },
      ctx.request.ip(),
      ctx.request.header('user-agent')
    )

    ctx.session.flash('success', `Document has been ${data.decision} successfully.`)
    return ctx.response.redirect().back()
  }
}
