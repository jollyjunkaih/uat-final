import type { HttpContext } from '@adonisjs/core/http'
import SignOffRecordService from '#services/sign_off_record_service'
import SignOffRecordTransformer from '#transformers/sign_off_record_transformer'
import SignOffLinkTransformer from '#transformers/sign_off_link_transformer'
import SignOffLinkService from '#services/sign_off_link_service'
import VersionService from '#services/version_service'
import TokenService from '#services/token_service'
import { initiateSignOffValidator } from '#validators/sign_off_validator'
import { DateTime } from 'luxon'

export default class SignOffController {
  async index(ctx: HttpContext) {
    const versionId = ctx.request.input('versionId')
    const service = new SignOffRecordService()
    const params: Record<string, unknown> = {}
    if (versionId) params.versionId = versionId
    const records = await service.findAll(params)
    return ctx.inertia.render('sign-off/panel', {
      records: (await records).map((r) => SignOffRecordTransformer.transform(r)),
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new SignOffRecordService()
    const record = await service.findById(id)
    await record.load('signOffLinks')
    const transformed = SignOffRecordTransformer.transform(record)
    return ctx.response.json({
      data: {
        ...transformed,
        signOffLinks: record.signOffLinks.map((l) => SignOffLinkTransformer.transform(l)),
      },
    })
  }

  async initiate(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(initiateSignOffValidator)
    const signOffRecordService = new SignOffRecordService()
    const signOffLinkService = new SignOffLinkService()
    const versionService = new VersionService()

    const record = await signOffRecordService.create({
      versionId: data.versionId,
      signOffStage: data.signOffStage,
      requiredSignatures: data.requiredSignatures,
      requestedById: String(ctx.auth.user!.id),
      requestedAt: DateTime.now(),
      status: 'pending',
    })

    for (const approver of data.approvers) {
      const token = TokenService.generateToken()
      await signOffLinkService.create({
        signOffRecordId: record.id,
        token,
        signerName: approver.name,
        signerEmail: approver.email,
        status: 'pending',
        expiresAt: DateTime.now().plus({ days: 30 }),
      })
    }

    await versionService.update(data.versionId, { status: 'pending_approval' })

    ctx.session.flash('success', 'Sign-off initiated successfully')
    return ctx.response.redirect().back()
  }

  async revoke(ctx: HttpContext) {
    const id = ctx.params.id
    const signOffLinkService = new SignOffLinkService()
    const signOffRecordService = new SignOffRecordService()

    await signOffLinkService.revokeAllForRecord(id)
    await signOffRecordService.update(id, { status: 'rejected' })

    return ctx.response.redirect().back()
  }
}
