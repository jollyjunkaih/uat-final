import type { HttpContext } from '@adonisjs/core/http'
import FeatureService from '#services/feature_service'
import FeatureTransformer from '#transformers/feature_transformer'
import { createFeatureValidator, updateFeatureValidator } from '#validators/feature_validator'
import { reorderEventsValidator } from '#validators/event_validator'

export default class FeaturesController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const projectId = ctx.request.input('projectId')
    const service = new FeatureService()
    const params: Record<string, unknown> = {}
    if (projectId) params.projectId = projectId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(FeatureTransformer.paginate(data, meta))
    return ctx.response.json(response)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new FeatureService()
    const feature = await service.findById(id)
    return ctx.response.json({ data: FeatureTransformer.transform(feature) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createFeatureValidator)
    const service = new FeatureService()
    const feature = await service.create(data)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: FeatureTransformer.transform(feature) })
    }
    return ctx.response.redirect().back()
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateFeatureValidator)
    const service = new FeatureService()
    const feature = await service.update(id, data)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: FeatureTransformer.transform(feature) })
    }
    return ctx.response.redirect().back()
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new FeatureService()
    await service.delete(id)
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: { success: true } })
    }
    return ctx.response.redirect().back()
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new FeatureService()
    await service.reorder(ids)
    return ctx.response.json({ data: { success: true } })
  }
}
