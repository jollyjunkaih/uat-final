import type Version from '#models/version'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class VersionTransformer extends BaseTransformer<Version> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'versionNumber',
      'documentType',
      'snapshot',
      'status',
      'createdById',
      'createdAt',
      'updatedAt',
    ])
  }
}
