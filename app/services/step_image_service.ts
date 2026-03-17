import StepImage from '#models/step_image'
import Step from '#models/step'
import Feature from '#models/feature'
import UatFlow from '#models/uat_flow'
import Project from '#models/project'
import { randomUUID } from 'node:crypto'
import { copyFile, unlink, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, parse as parsePath } from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import YamlWriterService from '#services/yaml_writer_service'

export type ImageCategory = 'uat' | 'docs'

export default class StepImageService {
  private getProjectDir(projectName: string, projectId: string): string {
    const writer = new YamlWriterService()
    return writer.getProjectDir(projectName, projectId)
  }

  private getPhotosDir(
    projectName: string,
    projectId: string,
    category: ImageCategory = 'uat'
  ): string {
    return join(this.getProjectDir(projectName, projectId), 'photos', category)
  }

  private getGifsDir(
    projectName: string,
    projectId: string,
    category: ImageCategory = 'uat'
  ): string {
    return join(this.getProjectDir(projectName, projectId), 'gifs', category)
  }

  async findImageFile(photosDir: string, fileName: string): Promise<string | null> {
    try {
      const files = await readdir(photosDir)
      const match = files.find((f) => parsePath(f).name === fileName)
      return match ? join(photosDir, match) : null
    } catch {
      return null
    }
  }

  async findByStepId(stepId: string): Promise<StepImage[]> {
    return StepImage.query().where('step_id', stepId).orderBy('sequence', 'asc')
  }

  async findById(id: string): Promise<StepImage> {
    return StepImage.findOrFail(id)
  }

  async getNextSequence(stepId: string): Promise<number> {
    const result = await StepImage.query().where('step_id', stepId).max('sequence as maxSeq')
    const maxSeq = result[0]?.$extras?.maxSeq
    return (maxSeq ?? 0) + 1
  }

  async uploadPhoto(
    stepId: string,
    projectName: string,
    projectId: string,
    file: MultipartFile
  ): Promise<StepImage> {
    const photosDir = this.getPhotosDir(projectName, projectId)
    await mkdir(photosDir, { recursive: true })

    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(photosDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    const sequence = await this.getNextSequence(stepId)

    return StepImage.create({
      stepId,
      fileName: baseName,
      sequence,
      source: 'upload' as const,
    })
  }

  async deleteImage(id: string, projectName: string, projectId: string): Promise<void> {
    const image = await this.findById(id)
    const stepId = image.stepId
    const photosDir = this.getPhotosDir(projectName, projectId)

    const filePath = await this.findImageFile(photosDir, image.fileName)
    if (filePath) {
      try {
        await unlink(filePath)
      } catch {
        // File may already be deleted
      }
    }

    await image.delete()

    await this.recompactSequences(stepId)
  }

  async recompactSequences(stepId: string): Promise<void> {
    const images = await StepImage.query().where('step_id', stepId).orderBy('sequence', 'asc')

    for (let i = 0; i < images.length; i++) {
      if (images[i].sequence !== i + 1) {
        images[i].sequence = i + 1
        await images[i].save()
      }
    }
  }

  async getImageFilePath(
    imageId: string,
    projectName: string,
    projectId: string
  ): Promise<string | null> {
    const image = await this.findById(imageId)
    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, image.fileName)
  }

  async uploadGif(
    stepId: string,
    projectName: string,
    projectId: string,
    file: MultipartFile
  ): Promise<Step> {
    const step = await Step.findOrFail(stepId)
    const photosDir = this.getPhotosDir(projectName, projectId)
    await mkdir(photosDir, { recursive: true })

    if (step.gifFileName) {
      await this.deleteGifFiles(step, photosDir)
    }

    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(photosDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    step.gifFileName = baseName
    await step.save()

    const sharp = (await import('sharp')).default
    const gifPath = join(photosDir, fullName)
    const metadata = await sharp(gifPath, { animated: true }).metadata()
    const pageCount = Math.min(metadata.pages || 1, 100)

    await StepImage.query().where('step_id', stepId).where('source', 'gif_extraction').delete()

    const startSequence = await this.getNextSequence(stepId)
    await Promise.all(
      Array.from({ length: pageCount }, async (_, i) => {
        const frameBaseName = `${randomUUID()}-frame-${i + 1}`
        const framePath = join(photosDir, `${frameBaseName}.jpg`)

        await sharp(gifPath, { page: i })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 95 })
          .toFile(framePath)

        await StepImage.create({
          stepId,
          fileName: frameBaseName,
          sequence: startSequence + i,
          source: 'gif_extraction' as const,
        })
      })
    )

    return step
  }

  async deleteGif(stepId: string, projectName: string, projectId: string): Promise<Step> {
    const step = await Step.findOrFail(stepId)
    const photosDir = this.getPhotosDir(projectName, projectId)

    if (step.gifFileName) {
      await this.deleteGifFiles(step, photosDir)
      step.gifFileName = null
      await step.save()
    }

    await this.recompactSequences(stepId)

    return step
  }

  async getGifPath(stepId: string, projectName: string, projectId: string): Promise<string | null> {
    const step = await Step.findOrFail(stepId)
    if (!step.gifFileName) return null

    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, step.gifFileName)
  }

  /**
   * Parse a GIF filename like "f1-flow0-step2-slug.gif" into feature/flow/step indices.
   * Returns null if the filename doesn't match.
   */
  private parseGifFileName(
    fileName: string
  ): { featureSeq: number; flowSeq: number; stepSeq: number } | null {
    const match = fileName.match(/^f(\d+)-flow(\d+)(?:-\d+)?-step(\d+)/)
    if (match) {
      return {
        featureSeq: Number.parseInt(match[1], 10) - 1, // f1 = sequence 0
        flowSeq: Number.parseInt(match[2], 10),
        stepSeq: Number.parseInt(match[3], 10),
      }
    }
    // Flow-level GIFs without step (e.g. "f2-flow0-browse-room.gif") → assign to step 0
    const flowMatch = fileName.match(/^f(\d+)-flow(\d+)/)
    if (flowMatch) {
      return {
        featureSeq: Number.parseInt(flowMatch[1], 10) - 1,
        flowSeq: Number.parseInt(flowMatch[2], 10),
        stepSeq: 0,
      }
    }
    return null
  }

  /**
   * Find a step in the DB by feature/flow/step sequence numbers for a given project.
   */
  private async findStepBySequences(
    projectId: string,
    featureSeq: number,
    flowSeq: number,
    stepSeq: number
  ): Promise<Step | null> {
    const feature = await Feature.query()
      .where('project_id', projectId)
      .where('sequence', featureSeq)
      .whereNull('deleted_at')
      .first()
    if (!feature) return null

    const flow = await UatFlow.query()
      .where('feature_id', feature.id)
      .where('sequence', flowSeq)
      .whereNull('deleted_at')
      .first()
    if (!flow) return null

    return Step.query()
      .where('uat_flow_id', flow.id)
      .where('sequence', stepSeq)
      .whereNull('deleted_at')
      .first()
  }

  /**
   * Process a single GIF file from disk for a given step:
   * copies to photos/, extracts frames, creates StepImage DB records, sets step.gifFileName.
   */
  private async processGifFile(
    gifPath: string,
    gifFileName: string,
    step: Step,
    photosDir: string
  ): Promise<number> {
    // Clean up existing GIF data for this step
    if (step.gifFileName) {
      await this.deleteGifFiles(step, photosDir)
    }

    const parsed = parsePath(gifFileName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`

    // Copy GIF to photos directory
    await copyFile(gifPath, join(photosDir, fullName))

    step.gifFileName = baseName
    await step.save()

    // Extract frames
    const sharp = (await import('sharp')).default
    const destGifPath = join(photosDir, fullName)
    const metadata = await sharp(destGifPath, { animated: true }).metadata()
    const pageCount = Math.min(metadata.pages || 1, 100)

    await StepImage.query().where('step_id', step.id).where('source', 'gif_extraction').delete()

    const startSequence = await this.getNextSequence(step.id)
    await Promise.all(
      Array.from({ length: pageCount }, async (_, i) => {
        const frameBaseName = `${randomUUID()}-frame-${i + 1}`
        const framePath = join(photosDir, `${frameBaseName}.jpg`)

        await sharp(destGifPath, { page: i })
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .jpeg({ quality: 95 })
          .toFile(framePath)

        await StepImage.create({
          stepId: step.id,
          fileName: frameBaseName,
          sequence: startSequence + i,
          source: 'gif_extraction' as const,
        })
      })
    )

    return pageCount
  }

  /**
   * Convert all GIFs in a project's gifs/ directory into photos + DB records.
   * Goes through all projects if no projectId is given.
   */
  async convertGifsForAllProjects(): Promise<{
    results: Array<{ projectName: string; processed: number; skipped: string[]; errors: string[] }>
  }> {
    const projects = await Project.query().whereNull('deleted_at')
    const results: Array<{
      projectName: string
      processed: number
      skipped: string[]
      errors: string[]
    }> = []

    for (const project of projects) {
      const result = await this.convertGifsForProject(project.id, project.name)
      results.push({ projectName: project.name, ...result })
    }

    return { results }
  }

  /**
   * Convert all GIFs in a single project's gifs/ directory.
   */
  async convertGifsForProject(
    projectId: string,
    projectName: string,
    category: ImageCategory = 'uat'
  ): Promise<{ processed: number; skipped: string[]; errors: string[] }> {
    const gifsDir = this.getGifsDir(projectName, projectId, category)
    const photosDir = this.getPhotosDir(projectName, projectId, category)

    const skipped: string[] = []
    const errors: string[] = []
    let processed = 0

    if (!existsSync(gifsDir)) {
      return { processed, skipped, errors }
    }

    await mkdir(photosDir, { recursive: true })

    const files = await readdir(gifsDir)
    const gifFiles = files.filter((f) => f.toLowerCase().endsWith('.gif'))

    for (const gifFile of gifFiles) {
      const parsed = this.parseGifFileName(gifFile)
      if (!parsed) {
        skipped.push(`${gifFile} (could not parse filename)`)
        continue
      }

      const step = await this.findStepBySequences(
        projectId,
        parsed.featureSeq,
        parsed.flowSeq,
        parsed.stepSeq
      )
      if (!step) {
        skipped.push(
          `${gifFile} (no step found for f${parsed.featureSeq + 1}-flow${parsed.flowSeq}-step${parsed.stepSeq})`
        )
        continue
      }

      try {
        const frameCount = await this.processGifFile(
          join(gifsDir, gifFile),
          gifFile,
          step,
          photosDir
        )
        processed++
        console.log(`  ${gifFile} → ${frameCount} frames → step "${step.name}"`)
      } catch (err) {
        errors.push(`${gifFile}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return { processed, skipped, errors }
  }

  private async deleteGifFiles(step: Step, photosDir: string): Promise<void> {
    if (step.gifFileName) {
      const gifPath = await this.findImageFile(photosDir, step.gifFileName)
      if (gifPath) {
        try {
          await unlink(gifPath)
        } catch {
          // File may already be deleted
        }
      }
    }

    const extractedImages = await StepImage.query()
      .where('step_id', step.id)
      .where('source', 'gif_extraction')

    await Promise.all(
      extractedImages.map(async (img) => {
        const filePath = await this.findImageFile(photosDir, img.fileName)
        if (filePath) {
          try {
            await unlink(filePath)
          } catch {
            // ignore
          }
        }
      })
    )

    await StepImage.query().where('step_id', step.id).where('source', 'gif_extraction').delete()
  }
}
