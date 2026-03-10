import type { HttpContext } from '@adonisjs/core/http'
import YamlImportService from '#services/yaml_import_service'
import YamlSyncService from '#services/yaml_sync_service'

export default class YamlImportController {
  async importPrd(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const file = ctx.request.file('file', { extnames: ['yaml', 'yml'], size: '2mb' })

    if (!file) {
      return ctx.response.badRequest({ error: 'A YAML file is required' })
    }

    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors })
    }

    const content = await this.readUploadedFile(file)
    const importService = new YamlImportService()
    await importService.importPrd(projectId, content)

    // Re-sync YAML from DB to ensure consistency
    new YamlSyncService().syncPrd(projectId).catch(() => {})

    return ctx.response.json({ data: { success: true } })
  }

  async importUat(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const file = ctx.request.file('file', { extnames: ['yaml', 'yml'], size: '2mb' })

    if (!file) {
      return ctx.response.badRequest({ error: 'A YAML file is required' })
    }

    if (file.hasErrors) {
      return ctx.response.badRequest({ error: file.errors })
    }

    const content = await this.readUploadedFile(file)
    const importService = new YamlImportService()
    await importService.importUat(projectId, content)

    // Re-sync YAML from DB to ensure consistency
    new YamlSyncService().syncUat(projectId).catch(() => {})

    return ctx.response.json({ data: { success: true } })
  }

  private async readUploadedFile(file: import('@adonisjs/core/bodyparser').MultipartFile): Promise<string> {
    const { readFileSync } = await import('node:fs')
    return readFileSync(file.tmpPath!, 'utf-8')
  }
}
