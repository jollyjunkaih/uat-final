import { BaseCommand, args } from '@adonisjs/ace'
import StepImageService from '#services/step_image_service'
import Project from '#models/project'

export default class ConvertGifs extends BaseCommand {
  static commandName = 'convert:gifs'
  static description = 'Convert GIF files from gifs/ directories into extracted frames in photos/ with DB records'

  static options = {
    startApp: true,
  }

  @args.string({ description: 'Project ID (or "all" to process every project)', required: false })
  declare projectId: string

  async run() {
    const service = new StepImageService()

    if (!this.projectId || this.projectId === 'all') {
      this.logger.info('Converting GIFs for all projects...')
      const { results } = await service.convertGifsForAllProjects()

      for (const r of results) {
        if (r.processed === 0 && r.skipped.length === 0 && r.errors.length === 0) continue
        this.logger.info(`\nProject: ${r.projectName}`)
        this.logger.info(`  Processed: ${r.processed}`)
        if (r.skipped.length > 0) {
          this.logger.warning(`  Skipped: ${r.skipped.length}`)
          for (const s of r.skipped) this.logger.warning(`    - ${s}`)
        }
        if (r.errors.length > 0) {
          this.logger.error(`  Errors: ${r.errors.length}`)
          for (const e of r.errors) this.logger.error(`    - ${e}`)
        }
      }

      const total = results.reduce((sum, r) => sum + r.processed, 0)
      this.logger.success(`\nDone. ${total} GIF(s) converted across ${results.length} project(s).`)
    } else {
      const project = await Project.find(this.projectId)
      if (!project) {
        this.logger.error(`Project not found: ${this.projectId}`)
        this.exitCode = 1
        return
      }

      this.logger.info(`Converting GIFs for project: ${project.name}`)
      const result = await service.convertGifsForProject(project.id, project.name)

      this.logger.info(`Processed: ${result.processed}`)
      if (result.skipped.length > 0) {
        this.logger.warning(`Skipped: ${result.skipped.length}`)
        for (const s of result.skipped) this.logger.warning(`  - ${s}`)
      }
      if (result.errors.length > 0) {
        this.logger.error(`Errors: ${result.errors.length}`)
        for (const e of result.errors) this.logger.error(`  - ${e}`)
      }
      this.logger.success('Done.')
    }
  }
}
