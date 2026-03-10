import type { HttpContext } from '@adonisjs/core/http'
import IntegrationService from '#services/integration_service'

export default class IntegrationController {
  async syncTriggers(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const service = new IntegrationService()

    const result = await service.syncTriggerLinks(projectId)
    return ctx.response.json({ data: result })
  }

  async getStatus(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const service = new IntegrationService()

    const status = await service.getProjectIntegrationStatus(projectId)
    const triggers = service.getAvailableTriggers()

    return ctx.response.json({
      data: {
        ...status,
        availableTriggers: triggers,
      },
    })
  }
}
