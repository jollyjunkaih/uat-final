import type { HttpContext } from '@adonisjs/core/http'
import UploadService from '#services/upload_service'
import UploadTransformer from '#transformers/upload_transformer'

export default class UploadsController {
  async index(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const context = ctx.request.input('context')
    if (!projectId) {
      return ctx.response.badRequest({ error: 'projectId is required' })
    }
    const service = new UploadService()
    const uploads = await service.findByProject(projectId, context)
    return ctx.response.json({ data: uploads.map((u) => UploadTransformer.transform(u)) })
  }

  async store(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const context = ctx.request.input('context', 'prd_additional_info')
    if (!projectId) {
      return ctx.response.badRequest({ error: 'projectId is required' })
    }
    const file = ctx.request.file('file', {
      size: '10mb',
      extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    })
    if (!file) {
      return ctx.response.badRequest({ error: 'No file uploaded' })
    }
    if (file.hasErrors) {
      return ctx.response.badRequest({ errors: file.errors })
    }
    const service = new UploadService()
    const upload = await service.upload(projectId, file, context)
    return ctx.response.json({ data: UploadTransformer.transform(upload) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UploadService()
    await service.delete(id)
    return ctx.response.json({ data: { success: true } })
  }
}
