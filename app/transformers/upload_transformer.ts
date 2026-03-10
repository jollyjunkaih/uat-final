import type Upload from '#models/upload'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UploadTransformer extends BaseTransformer<Upload> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'fileName',
      'filePath',
      'mimeType',
      'size',
      'context',
      'createdAt',
      'updatedAt',
    ])
  }
}
