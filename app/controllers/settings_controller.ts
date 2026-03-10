import type { HttpContext } from '@adonisjs/core/http'
import ProjectService from '#services/project_service'
import ProjectTransformer from '#transformers/project_transformer'
import { updateProjectValidator } from '#validators/project_validator'
import YamlSyncService from '#services/yaml_sync_service'

export default class SettingsController {
  async show(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const service = new ProjectService()
    const project = await service.findById(projectId)
    return ctx.inertia.render('settings/index', { project: ProjectTransformer.transform(project) })
  }

  async update(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const data = await ctx.request.validateUsing(updateProjectValidator)
    const service = new ProjectService()
    await service.update(projectId, data)
    new YamlSyncService().syncAll(projectId).catch(() => {})
    return ctx.response.redirect().back()
  }
}
