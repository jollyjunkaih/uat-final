import type { HttpContext } from '@adonisjs/core/http'
import FeatureService from '#services/feature_service'
import FeatureTransformer from '#transformers/feature_transformer'
import FeatureImageService from '#services/feature_image_service'
import type { FeatureImageType } from '#services/feature_image_service'
import { createFeatureValidator, updateFeatureValidator } from '#validators/feature_validator'
import { reorderEventsValidator } from '#validators/event_validator'
import YamlSyncService from '#services/yaml_sync_service'

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
    new YamlSyncService().syncAll(feature.projectId).catch(() => {})
    return ctx.response.json({ data: FeatureTransformer.transform(feature) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateFeatureValidator)
    const service = new FeatureService()
    const feature = await service.update(id, data)
    new YamlSyncService().syncAll(feature.projectId).catch(() => {})
    return ctx.response.json({ data: FeatureTransformer.transform(feature) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new FeatureService()
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromFeature(id)
    await service.delete(id)
    yamlSync.syncAll(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderEventsValidator)
    const service = new FeatureService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromFeature(ids[0])
      yamlSync.syncAll(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }

  // --- Feature Images (mock screens & process flows) ---

  private async handleImageUpload(ctx: HttpContext, type: FeatureImageType) {
    const featureId = ctx.params.id
    const file = ctx.request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp', 'svg'],
    })

    if (!file) {
      return ctx.response.badRequest({ error: 'No image file provided' })
    }
    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors[0]?.message || 'Invalid file' })
    }

    const imageService = new FeatureImageService()
    const { projectName, projectId } = await imageService.getProjectInfo(featureId)
    const feature = await imageService.uploadImage(featureId, projectName, projectId, file, type)
    return ctx.response.json({ data: FeatureTransformer.transform(feature) })
  }

  private async handleImageDelete(ctx: HttpContext, type: FeatureImageType) {
    const featureId = ctx.params.id
    const fileName = ctx.params.fileName

    const imageService = new FeatureImageService()
    const { projectName, projectId } = await imageService.getProjectInfo(featureId)
    const feature = await imageService.deleteImage(featureId, projectName, projectId, fileName, type)
    return ctx.response.json({ data: FeatureTransformer.transform(feature) })
  }

  async uploadMockScreen(ctx: HttpContext) {
    return this.handleImageUpload(ctx, 'mock-screens')
  }

  async deleteMockScreen(ctx: HttpContext) {
    return this.handleImageDelete(ctx, 'mock-screens')
  }

  async uploadProcessFlow(ctx: HttpContext) {
    return this.handleImageUpload(ctx, 'process-flows')
  }

  async deleteProcessFlow(ctx: HttpContext) {
    return this.handleImageDelete(ctx, 'process-flows')
  }
}
