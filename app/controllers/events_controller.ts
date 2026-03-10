import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#services/event_service'
import EventTransformer from '#transformers/event_transformer'
import {
  createEventValidator,
  updateEventValidator,
  reorderEventsValidator,
} from '#validators/event_validator'

export default class EventsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const uatFlowId = ctx.request.input('uatFlowId')
    const service = new EventService()
    const params: Record<string, unknown> = {}
    if (uatFlowId) params.uatFlowId = uatFlowId
    const paginated = await service.findPaginated(params, page, limit)
    return ctx.response.json({
      data: paginated.all().map((e) => EventTransformer.transform(e)),
      meta: {
        total: paginated.total,
        perPage: paginated.perPage,
        currentPage: paginated.currentPage,
      },
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new EventService()
    const event = await service.findById(id)
    return ctx.response.json({ data: EventTransformer.transform(event) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createEventValidator)
    const service = new EventService()
    const event = await service.create(data)
    return ctx.response.json({ data: EventTransformer.transform(event) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateEventValidator)
    const service = new EventService()
    const event = await service.update(id, data)
    return ctx.response.json({ data: EventTransformer.transform(event) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new EventService()
    await service.delete(id)
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new EventService()
    await service.reorder(ids)
    return ctx.response.json({ data: { success: true } })
  }
}
