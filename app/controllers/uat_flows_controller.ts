import type { HttpContext } from '@adonisjs/core/http'
import UatFlowService from '#services/uat_flow_service'
import UatFlowTransformer from '#transformers/uat_flow_transformer'
import { createUatFlowValidator, updateUatFlowValidator } from '#validators/uat_flow_validator'
import { reorderEventsValidator } from '#validators/event_validator'

export default class UatFlowsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const featureId = ctx.request.input('featureId')
    const service = new UatFlowService()
    const params: Record<string, unknown> = {}
    if (featureId) params.featureId = featureId
    const paginated = await service.findPaginated(params, page, limit)

    const transformed = {
      data: paginated.all().map((f) => UatFlowTransformer.transform(f)),
      meta: {
        total: paginated.total,
        perPage: paginated.perPage,
        currentPage: paginated.currentPage,
      },
    }

    return ctx.response.json(transformed)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UatFlowService()
    const uatFlow = await service.findById(id)
    return ctx.response.json({ data: UatFlowTransformer.transform(uatFlow) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createUatFlowValidator)
    const service = new UatFlowService()
    const uatFlow = await service.create(data)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: UatFlowTransformer.transform(uatFlow) })
    }
    return ctx.response.redirect().back()
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateUatFlowValidator)
    const service = new UatFlowService()
    const uatFlow = await service.update(id, data)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: UatFlowTransformer.transform(uatFlow) })
    }
    return ctx.response.redirect().back()
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UatFlowService()
    await service.delete(id)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: { success: true } })
    }
    return ctx.response.redirect().back()
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new UatFlowService()
    await service.reorder(ids)
    return ctx.response.json({ data: { success: true } })
  }
}
