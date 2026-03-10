import type { HttpContext } from '@adonisjs/core/http'
import ProjectService from '#services/project_service'
import ProjectTransformer from '#transformers/project_transformer'
import FeatureTransformer from '#transformers/feature_transformer'
import UatFlowTransformer from '#transformers/uat_flow_transformer'
import Feature from '#models/feature'
import { createProjectValidator, updateProjectValidator } from '#validators/project_validator'

export default class ProjectsController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const service = new ProjectService()
    const paginated = await service.findPaginated({}, page, limit)
    return ctx.inertia.render('projects/index', {
      projects: {
        data: paginated.all().map((p) => ProjectTransformer.transform(p)),
        meta: {
          total: paginated.total,
          perPage: paginated.perPage,
          currentPage: paginated.currentPage,
        },
      },
    })
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new ProjectService()
    const project = await service.findByIdWithRelations(id)
    return ctx.inertia.render('projects/show', { project: ProjectTransformer.transform(project) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createProjectValidator)
    const service = new ProjectService()
    const project = await service.create({ ...data, ownerId: String(ctx.auth.user!.id) })
    return ctx.response.redirect().toPath(`/projects/${project.id}`)
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateProjectValidator)
    const service = new ProjectService()
    await service.update(id, data)
    return ctx.response.redirect().back()
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new ProjectService()
    await service.delete(id)
    return ctx.response.redirect().toPath('/projects')
  }

  async tree(ctx: HttpContext) {
    const id = ctx.params.id

    const features = await Feature.query()
      .where('project_id', id)
      .whereNull('deleted_at')
      .preload('uatFlows', (uatFlowQuery) => {
        uatFlowQuery.whereNull('deleted_at').preload('events', (eventQuery) => {
          eventQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
        }).orderBy('sequence', 'asc')
      })
      .orderBy('sequence', 'asc')

    const data = features.map((feature) => {
      const f = FeatureTransformer.transform(feature)
      return {
        ...f,
        uatFlows: feature.uatFlows.map((flow) => {
          const fl = UatFlowTransformer.transform(flow)
          return {
            ...fl,
            events: flow.events.map((event) => ({
              id: event.id,
              uatFlowId: event.uatFlowId,
              model: event.model,
              name: event.name,
              description: event.description,
              triggerType: event.triggerType,
              condition: event.condition,
              sequence: event.sequence,
              expectedOutcome: event.expectedOutcome,
              testStatus: event.testStatus,
              notes: event.notes,
            })),
          }
        }),
      }
    })

    return ctx.response.json({ data })
  }
}
