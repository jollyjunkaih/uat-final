import StepImage from '#models/step_image'
import Step from '#models/step'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir, readdir } from 'node:fs/promises'
import { join, parse as parsePath } from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import YamlWriterService from '#services/yaml_writer_service'

export default class StepImageService {
  private getPhotosDir(projectName: string, projectId: string): string {
    const writer = new YamlWriterService()
    return join(writer.getProjectDir(projectName, projectId), 'photos')
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
    return StepImage.query()
      .where('step_id', stepId)
      .orderBy('sequence', 'asc')
  }

  async findById(id: string): Promise<StepImage> {
    return StepImage.findOrFail(id)
  }

  async getNextSequence(stepId: string): Promise<number> {
    const result = await StepImage.query()
      .where('step_id', stepId)
      .max('sequence as maxSeq')
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
    const images = await StepImage.query()
      .where('step_id', stepId)
      .orderBy('sequence', 'asc')

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

    await StepImage.query()
      .where('step_id', stepId)
      .where('source', 'gif_extraction')
      .delete()

    for (let i = 0; i < pageCount; i++) {
      const frameBaseName = `${randomUUID()}-frame-${i + 1}`
      const framePath = join(photosDir, `${frameBaseName}.jpg`)

      await sharp(gifPath, { page: i })
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: 95 })
        .toFile(framePath)

      const sequence = await this.getNextSequence(stepId)
      await StepImage.create({
        stepId,
        fileName: frameBaseName,
        sequence,
        source: 'gif_extraction' as const,
      })
    }

    return step
  }

  async deleteGif(
    stepId: string,
    projectName: string,
    projectId: string
  ): Promise<Step> {
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

  async getGifPath(
    stepId: string,
    projectName: string,
    projectId: string
  ): Promise<string | null> {
    const step = await Step.findOrFail(stepId)
    if (!step.gifFileName) return null

    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, step.gifFileName)
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

    for (const img of extractedImages) {
      const filePath = await this.findImageFile(photosDir, img.fileName)
      if (filePath) {
        try {
          await unlink(filePath)
        } catch {
          // ignore
        }
      }
    }

    await StepImage.query()
      .where('step_id', step.id)
      .where('source', 'gif_extraction')
      .delete()
  }
}
