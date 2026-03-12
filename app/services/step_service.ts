import Step from '#models/step'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir, readdir } from 'node:fs/promises'
import { join, parse as parsePath } from 'node:path'
import { DateTime } from 'luxon'
import type { MultipartFile } from '@adonisjs/core/bodyparser'
import YamlWriterService from '#services/yaml_writer_service'

export default class StepService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = Step.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = Step.query()

    if (!params.includeDeleted) {
      query.whereNull('deleted_at')
    }

    if (params.uatFlowId) {
      query.where('uat_flow_id', String(params.uatFlowId))
    }

    if (params.sortBy) {
      const direction = params.sortDirection === 'desc' ? 'desc' : 'asc'
      const sortField = String(params.sortBy)
      if (['sequence'].includes(sortField)) {
        query.orderBy(sortField, direction)
      }
    } else {
      query.orderBy('sequence', 'asc')
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return Step.query().where('id', id).whereNull('deleted_at').firstOrFail()
  }

  async create(data: Partial<Step>) {
    return Step.create(data)
  }

  async update(id: string, data: Partial<Step>) {
    const record = await this.findById(id)
    record.merge(data)
    await record.save()
    return record
  }

  async delete(id: string) {
    const record = await this.findById(id)
    record.deletedAt = DateTime.now()
    await record.save()
    return record
  }

  async reorder(ids: string[]) {
    for (let i = 0; i < ids.length; i++) {
      await Step.query().where('id', ids[i]).update({ sequence: i + 1 })
    }
  }

  private getPhotosDir(projectName: string, projectId: string): string {
    const writer = new YamlWriterService()
    return join(writer.getProjectDir(projectName, projectId), 'photos')
  }

  private async findImageFile(photosDir: string, imageFileName: string): Promise<string | null> {
    try {
      const files = await readdir(photosDir)
      const match = files.find((f) => parsePath(f).name === imageFileName)
      return match ? join(photosDir, match) : null
    } catch {
      return null
    }
  }

  async getImagePath(imageFileName: string, projectName: string, projectId: string): Promise<string | null> {
    const photosDir = this.getPhotosDir(projectName, projectId)
    return this.findImageFile(photosDir, imageFileName)
  }

  async uploadImage(stepId: string, projectName: string, projectId: string, file: MultipartFile) {
    const step = await this.findById(stepId)

    const photosDir = this.getPhotosDir(projectName, projectId)
    await mkdir(photosDir, { recursive: true })

    // Delete old image if exists
    if (step.imageFileName) {
      const oldPath = await this.findImageFile(photosDir, step.imageFileName)
      if (oldPath) {
        try {
          await unlink(oldPath)
        } catch {
          // File may already be deleted
        }
      }
    }

    const parsed = parsePath(file.clientName)
    const baseName = `${randomUUID()}-${parsed.name}`
    const fullName = `${baseName}${parsed.ext}`
    await file.move(photosDir, { name: fullName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    step.imageFileName = baseName
    await step.save()
    return step
  }

  async deleteImage(stepId: string, projectName: string, projectId: string) {
    const step = await this.findById(stepId)

    if (step.imageFileName) {
      const photosDir = this.getPhotosDir(projectName, projectId)
      const filePath = await this.findImageFile(photosDir, step.imageFileName)
      if (filePath) {
        try {
          await unlink(filePath)
        } catch {
          // File may already be deleted
        }
      }
      step.imageFileName = null
      await step.save()
    }

    return step
  }
}
