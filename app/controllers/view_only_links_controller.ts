import type { HttpContext } from '@adonisjs/core/http'
import ViewOnlyLinkService from '#services/view_only_link_service'
import TokenService from '#services/token_service'
import { createViewOnlyLinkValidator } from '#validators/view_only_link_validator'
import hash from '@adonisjs/core/services/hash'

export default class ViewOnlyLinksController {
  async index(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const service = new ViewOnlyLinkService()
    const params: Record<string, unknown> = {}
    if (projectId) params.projectId = projectId
    const links = await service.findAll(params)
    return ctx.response.json({ data: links })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createViewOnlyLinkValidator)
    const service = new ViewOnlyLinkService()
    const token = TokenService.generateToken()

    let passwordHash: string | null = null
    if (data.password) {
      passwordHash = await hash.make(data.password)
    }

    const link = await service.create({
      projectId: data.projectId,
      documentType: data.documentType,
      version: data.version,
      token,
      passwordHash,
      isActive: true,
      createdById: String(ctx.auth.user!.id),
      accessCount: 0,
    })

    const url = `/share/view/${token}`
    return ctx.response.json({ data: { link, url } })
  }

  async revoke(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new ViewOnlyLinkService()
    await service.revoke(id)
    return ctx.response.json({ data: { success: true } })
  }
}
