import type { HttpContext } from '@adonisjs/core/http'
import VersionService from '#services/version_service'
import VersionTransformer from '#transformers/version_transformer'
import SignOffRecordTransformer from '#transformers/sign_off_record_transformer'
import { createVersionValidator } from '#validators/version_validator'

export default class VersionsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const projectId = ctx.request.input('projectId')
    const service = new VersionService()
    const params: Record<string, unknown> = {}
    if (projectId) params.projectId = projectId
    const paginated = await service.findPaginated(params, page, limit)

    const transformed = {
      data: paginated.all().map((v) => VersionTransformer.transform(v)),
      meta: {
        total: paginated.total,
        perPage: paginated.perPage,
        currentPage: paginated.currentPage,
      },
    }

    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json(transformed)
    }

    return ctx.inertia.render('versions/index', {
      versions: transformed,
      projectId,
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new VersionService()
    const version = await service.findById(id)
    await version.load('signOffRecords')
    const transformed = VersionTransformer.transform(version)
    return ctx.inertia.render('versions/show', {
      version: {
        ...transformed,
        signOffRecords: version.signOffRecords.map((r) => SignOffRecordTransformer.transform(r)),
      },
    })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createVersionValidator)
    const service = new VersionService()
    const version = await service.createSnapshot(data.projectId, data.documentType, String(ctx.auth.user!.id))
    if (ctx.request.accepts(['html', 'json']) === 'json') {
      return ctx.response.json({ data: VersionTransformer.transform(version) })
    }
    return ctx.response.redirect().back()
  }
}
