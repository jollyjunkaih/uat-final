import type { HttpContext } from '@adonisjs/core/http'
import EventService from '#services/event_service'
import EventTransformer from '#transformers/event_transformer'
import {
  createEventValidator,
  updateEventValidator,
  reorderEventsValidator,
} from '#validators/event_validator'
import YamlSyncService from '#services/yaml_sync_service'

export default class EventsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const uatFlowId = ctx.request.input('uatFlowId')
    const service = new EventService()
    const params: Record<string, unknown> = {}
    if (uatFlowId) params.uatFlowId = uatFlowId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(EventTransformer.paginate(data, meta))
    return ctx.response.json(response)
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
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromEvent(event.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: EventTransformer.transform(event) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateEventValidator)
    const service = new EventService()
    const event = await service.update(id, data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromEvent(event.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: EventTransformer.transform(event) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromEvent(id)
    const service = new EventService()
    await service.delete(id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new EventService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromEvent(ids[0])
      yamlSync.syncUat(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }
}
