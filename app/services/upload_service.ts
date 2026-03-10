import Upload from '#models/upload'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'
import { unlink, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class UploadService {
  private getStoragePath(projectId: string) {
    return join(app.makePath('storage/uploads'), projectId)
  }

  async upload(projectId: string, file: MultipartFile, context = 'prd_additional_info') {
    const dir = this.getStoragePath(projectId)
    await mkdir(dir, { recursive: true })

    const fileName = `${randomUUID()}-${file.clientName}`
    await file.move(dir, { name: fileName })

    if (!file.filePath) {
      throw new Error('File upload failed')
    }

    const relativePath = `storage/uploads/${projectId}/${fileName}`

    return Upload.create({
      projectId,
      fileName: file.clientName,
      filePath: relativePath,
      mimeType: file.extname ? `image/${file.extname}` : 'application/octet-stream',
      size: file.size || 0,
      context,
    })
  }

  async findByProject(projectId: string, context?: string) {
    const query = Upload.query().where('project_id', projectId)
    if (context) {
      query.where('context', context)
    }
    return query.orderBy('created_at', 'asc')
  }

  async delete(id: string) {
    const record = await Upload.findOrFail(id)
    const fullPath = app.makePath(record.filePath)
    try {
      await unlink(fullPath)
    } catch {
      // File may already be deleted
    }
    await record.delete()
    return record
  }
}
