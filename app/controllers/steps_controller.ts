import type { HttpContext } from '@adonisjs/core/http'
import StepService from '#services/step_service'
import StepImageService from '#services/step_image_service'
import StepTransformer from '#transformers/step_transformer'
import StepImageTransformer from '#transformers/step_image_transformer'
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

  // --- Step Images ---

  async listImages(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const service = new StepImageService()
    const images = await service.findByStepId(stepId)
    return ctx.response.json({ data: images.map((img) => StepImageTransformer.transform(img)) })
  }

  async uploadPhoto(ctx: HttpContext) {
    const stepId = ctx.params.stepId
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

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const image = await service.uploadPhoto(stepId, project.name, projectId, file)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepImageTransformer.transform(image) })
  }

  async deleteStepImage(ctx: HttpContext) {
    const imageId = ctx.params.id
    const service = new StepImageService()
    const image = await service.findById(imageId)

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(image.stepId)
    const project = await Project.findOrFail(projectId)

    await service.deleteImage(imageId, project.name, projectId)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async getStepImageFile(ctx: HttpContext) {
    const imageId = ctx.params.id
    const service = new StepImageService()
    const image = await service.findById(imageId)

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(image.stepId)
    const project = await Project.findOrFail(projectId)

    const filePath = await service.getImageFilePath(imageId, project.name, projectId)
    if (!filePath) {
      return ctx.response.notFound({ error: 'Image file not found' })
    }
    return ctx.response.download(filePath)
  }

  // --- GIF ---

  async uploadGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const file = ctx.request.file('gif', {
      size: '50mb',
      extnames: ['gif'],
    })

    if (!file) {
      return ctx.response.badRequest({ error: 'No GIF file provided' })
    }
    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors[0]?.message || 'Invalid file' })
    }

    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const step = await service.uploadGif(stepId, project.name, projectId, file)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }

  async getGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const gifPath = await service.getGifPath(stepId, project.name, projectId)
    if (!gifPath) {
      return ctx.response.notFound({ error: 'No GIF for this step' })
    }
    return ctx.response.download(gifPath)
  }

  async deleteGif(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromStep(stepId)
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const step = await service.deleteGif(stepId, project.name, projectId)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: StepTransformer.transform(step) })
  }
}
