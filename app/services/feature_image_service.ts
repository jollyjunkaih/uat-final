import Feature from '#models/feature'
import Project from '#models/project'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir, readdir } from 'node:fs/promises'
import { join, parse as parsePath } from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import YamlWriterService from '#services/yaml_writer_service'
import YamlSyncService from '#services/yaml_sync_service'

export type FeatureImageType = 'mock-screens' | 'process-flows'

export default class FeatureImageService {
  private getProjectDir(projectName: string, projectId: string): string {
    const writer = new YamlWriterService()
    return writer.getProjectDir(projectName, projectId)
  }

  private getImgDir(
    projectName: string,
    projectId: string,
    featureId: string,
    type: FeatureImageType
  ): string {
    const subDir = type === 'mock-screens' ? 'features' : 'process-flows'
    return join(this.getProjectDir(projectName, projectId), 'img', subDir, featureId)
  }

  private getColumnName(type: FeatureImageType): 'mockScreens' | 'processFlows' {
    return type === 'mock-screens' ? 'mockScreens' : 'processFlows'
  }

  async findImageFile(dir: string, fileName: string): Promise<string | null> {
    try {
      const files = await readdir(dir)
      const match = files.find((f) => parsePath(f).name === fileName)
      return match ? join(dir, match) : null
    } catch {
      return null
    }
  }

  async uploadImage(
    featureId: string,
    projectName: string,
    projectId: string,
    file: MultipartFile,
    type: FeatureImageType
  ): Promise<Feature> {
    const imgDir = this.getImgDir(projectName, projectId, featureId, type)
    await mkdir(imgDir, { recursive: true })

    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(imgDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    const feature = await Feature.findOrFail(featureId)
    const column = this.getColumnName(type)
    const images = [...(feature[column] || [])]
    const nextSeq = images.length > 0 ? Math.max(...images.map((i) => i.sequence)) + 1 : 1
    images.push({ fileName: baseName, sequence: nextSeq })
    feature[column] = images
    await feature.save()

    new YamlSyncService().syncAll(projectId).catch(() => {})

    return feature
  }

  async deleteImage(
    featureId: string,
    projectName: string,
    projectId: string,
    fileName: string,
    type: FeatureImageType
  ): Promise<Feature> {
    const imgDir = this.getImgDir(projectName, projectId, featureId, type)

    const filePath = await this.findImageFile(imgDir, fileName)
    if (filePath) {
      try {
        await unlink(filePath)
      } catch {
        // File may already be deleted
      }
    }

    const feature = await Feature.findOrFail(featureId)
    const column = this.getColumnName(type)
    const images = (feature[column] || []).filter((i) => i.fileName !== fileName)
    // Recompact sequences
    images.forEach((img, idx) => {
      img.sequence = idx + 1
    })
    feature[column] = images
    await feature.save()

    new YamlSyncService().syncAll(projectId).catch(() => {})

    return feature
  }

  async getProjectInfo(featureId: string): Promise<{ projectName: string; projectId: string }> {
    const feature = await Feature.findOrFail(featureId)
    const project = await Project.findOrFail(feature.projectId)
    return { projectName: project.name, projectId: project.id }
  }
}
