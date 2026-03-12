import type { HttpContext } from '@adonisjs/core/http'
import StepService from '#services/step_service'
import StepTransformer from '#transformers/step_transformer'
import {
  createStepValidator,
  updateStepValidator,
  reorderStepsValidator,
} from '#validators/step_validator'
import YamlSyncService from '#services/yaml_sync_service'
import Project from '#models/project'

export default class StepsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const uatFlowId = ctx.request.input('uatFlowId')
    const service = new StepService()
    const params: Record<string, unknown> = {}
    if (uatFlowId) params.uatFlowId = uatFlowId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(StepTransformer.paginate(data, meta))
    return ctx.response.json(response)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new StepService()
    const step = await service.findById(id)
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createStepValidator)
    const service = new StepService()
    const step = await service.create(data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(step.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateStepValidator)
    const service = new StepService()
    const step = await service.update(id, data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(step.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(id)
    const service = new StepService()
    await service.delete(id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderStepsValidator)
    const service = new StepService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromStep(ids[0])
      yamlSync.syncUat(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }

  async uploadImage(ctx: HttpContext) {
    const id = ctx.params.id
    const file = ctx.request.file('image', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    })

    if (!file) {
      return ctx.response.badRequest({ error: 'No image file provided' })
    }

    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors[0]?.message || 'Invalid file' })
    }

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(id)
    const project = await Project.findOrFail(projectId)

    const service = new StepService()
    const step = await service.uploadImage(id, project.name, projectId, file)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async getImage(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new StepService()
    const step = await service.findById(id)

    if (!step.imageFileName) {
      return ctx.response.notFound({ error: 'No image for this step' })
    }

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(id)
    const project = await Project.findOrFail(projectId)

    const filePath = await service.getImagePath(step.imageFileName, project.name, projectId)
    if (!filePath) {
      return ctx.response.notFound({ error: 'Image file not found' })
    }

    return ctx.response.download(filePath)
  }

  async deleteImage(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(id)
    const project = await Project.findOrFail(projectId)

    const service = new StepService()
    const step = await service.deleteImage(id, project.name, projectId)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }
}
