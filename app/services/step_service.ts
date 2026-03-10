import Step from '#models/step'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { DateTime } from 'luxon'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

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

  async uploadImage(stepId: string, projectId: string, file: MultipartFile) {
    const step = await this.findById(stepId)

    // Delete old image if exists
    if (step.imagePath) {
      try {
        await unlink(app.makePath(step.imagePath))
      } catch {
        // File may already be deleted
      }
    }

    const dir = join(app.makePath('storage/uploads'), projectId, 'steps')
    await mkdir(dir, { recursive: true })

    const fileName = `${randomUUID()}-${file.clientName}`
    await file.move(dir, { name: fileName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    step.imagePath = `storage/uploads/${projectId}/steps/${fileName}`
    await step.save()
    return step
  }

  async deleteImage(stepId: string) {
    const step = await this.findById(stepId)

    if (step.imagePath) {
      try {
        await unlink(app.makePath(step.imagePath))
      } catch {
        // File may already be deleted
      }
      step.imagePath = null
      await step.save()
    }

    return step
  }
}
