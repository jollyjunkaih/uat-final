import type { HttpContext } from '@adonisjs/core/http'
import UatTestLinkService from '#services/uat_test_link_service'
import TokenService from '#services/token_service'
import { createUatTestLinkValidator } from '#validators/uat_test_validator'

export default class UatTestLinksController {
  async index(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const service = new UatTestLinkService()
    const params: Record<string, unknown> = {}
    if (projectId) params.projectId = projectId
    const links = await service.findAll(params)
    return ctx.response.json({ data: links })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createUatTestLinkValidator)
    const service = new UatTestLinkService()
    const token = TokenService.generateToken()

    const link = await service.create({
      projectId: data.projectId,
      token,
      isActive: true,
      createdById: ctx.auth.user!.id,
      ...(data.expiresAt ? { expiresAt: data.expiresAt as any } : {}),
    })

    const url = `/share/uat-test/${token}`
    return ctx.response.json({ data: { link, url } })
  }

  async revoke(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UatTestLinkService()
    await service.revoke(id)
    return ctx.response.json({ data: { success: true } })
  }

  async submissions(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UatTestLinkService()
    const submissions = await service.getSubmissions(id)
    return ctx.response.json({ data: submissions })
  }
}
