import type { HttpContext } from '@adonisjs/core/http'
import UatFlowService from '#services/uat_flow_service'
import UatFlowTransformer from '#transformers/uat_flow_transformer'
import { createUatFlowValidator, updateUatFlowValidator } from '#validators/uat_flow_validator'
import { reorderEventsValidator } from '#validators/event_validator'
import YamlSyncService from '#services/yaml_sync_service'

export default class UatFlowsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const featureId = ctx.request.input('featureId')
    const service = new UatFlowService()
    const params: Record<string, unknown> = {}
    if (featureId) params.featureId = featureId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(UatFlowTransformer.paginate(data, meta))
    return ctx.response.json(response)
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
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromUatFlow(uatFlow.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: UatFlowTransformer.transform(uatFlow) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateUatFlowValidator)
    const service = new UatFlowService()
    const uatFlow = await service.update(id, data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromUatFlow(uatFlow.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: UatFlowTransformer.transform(uatFlow) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromUatFlow(id)
    const service = new UatFlowService()
    await service.delete(id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new UatFlowService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromUatFlow(ids[0])
      yamlSync.syncUat(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }
}
