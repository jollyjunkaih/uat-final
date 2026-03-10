import type { HttpContext } from '@adonisjs/core/http'
import ExportService from '#services/export_service'

export default class ExportController {
  async exportPrd(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const format = ctx.request.input('format', 'pdf')
    const versionNumber = ctx.request.input('version')
    const service = new ExportService()

    if (format === 'docx') {
      const buffer = await service.exportPrdAsDocx(projectId, versionNumber)
      return ctx.response
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .header('Content-Disposition', `attachment; filename="prd-${projectId}.docx"`)
        .send(buffer)
    }

    const buffer = await service.exportPrdAsPdf(projectId, versionNumber)
    return ctx.response
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="prd-${projectId}.pdf"`)
      .send(buffer)
  }

  async exportUat(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const format = ctx.request.input('format', 'pdf')
    const versionNumber = ctx.request.input('version')
    const service = new ExportService()

    if (format === 'docx') {
      const buffer = await service.exportUatAsDocx(projectId, versionNumber)
      return ctx.response
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .header('Content-Disposition', `attachment; filename="uat-${projectId}.docx"`)
        .send(buffer)
    }

    const buffer = await service.exportUatAsPdf(projectId, versionNumber)
    return ctx.response
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="uat-${projectId}.pdf"`)
      .send(buffer)
  }
}
