import type { HttpContext } from '@adonisjs/core/http'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import YamlImportService from '#services/yaml_import_service'
import YamlSyncService from '#services/yaml_sync_service'
import StepImageService from '#services/step_image_service'
import Project from '#models/project'
import { slugify } from '#utils/slugify'

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

  async importUserGuide(ctx: HttpContext) {
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
    await importService.importUserGuide(projectId, content)

    return ctx.response.json({ data: { success: true } })
  }

  async refetchFromDisk(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const project = await Project.findOrFail(projectId)

    const slug = slugify(project.name) || 'unnamed'
    const shortId = projectId.substring(0, 8)
    const projectDir = join(process.cwd(), 'yaml', `${slug}-${shortId}`)

    const prdPath = join(projectDir, 'prd.yaml')
    const uatPath = join(projectDir, 'uat.yaml')
    const featuresPath = join(projectDir, 'features.yaml')
    const userGuidePath = join(projectDir, 'user-guide.yaml')

    const importService = new YamlImportService()

    if (existsSync(prdPath)) {
      const prdContent = readFileSync(prdPath, 'utf-8')
      await importService.importPrd(projectId, prdContent)
    }

    if (existsSync(uatPath)) {
      const uatContent = readFileSync(uatPath, 'utf-8')
      await importService.importUat(projectId, uatContent)
    }

    // Import features.yaml after uat.yaml so it can update feature/flow metadata
    // (upserts by name, preserving steps from uat.yaml)
    if (existsSync(featuresPath)) {
      const featuresContent = readFileSync(featuresPath, 'utf-8')
      await importService.importFeatures(projectId, featuresContent)
    }

    if (existsSync(userGuidePath)) {
      const userGuideContent = readFileSync(userGuidePath, 'utf-8')
      await importService.importUserGuide(projectId, userGuideContent)
    }

    new YamlSyncService().syncAll(projectId).catch(() => {})

    return ctx.response.json({ data: { success: true } })
  }

  async convertGifs(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const project = await Project.findOrFail(projectId)

    const service = new StepImageService()
    const result = await service.convertGifsForProject(project.id, project.name)

    // Re-sync YAML from DB to ensure consistency
    new YamlSyncService().syncUat(projectId).catch(() => {})

    return ctx.response.json({ data: result })
  }

  async convertGifsAll(ctx: HttpContext) {
    const service = new StepImageService()
    const { results } = await service.convertGifsForAllProjects()

    // Re-sync all affected projects
    const syncService = new YamlSyncService()
    for (const r of results) {
      if (r.processed > 0) {
        const project = await Project.query().where('name', r.projectName).first()
        if (project) {
          syncService.syncUat(project.id).catch(() => {})
        }
      }
    }

    return ctx.response.json({ data: { results } })
  }

  private async readUploadedFile(file: import('@adonisjs/core/bodyparser').MultipartFile): Promise<string> {
    return readFileSync(file.tmpPath!, 'utf-8')
  }
}
