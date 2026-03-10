import type SignOffRecord from '#models/sign_off_record'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class SignOffRecordTransformer extends BaseTransformer<SignOffRecord> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'versionId',
      'documentType',
      'signOffStage',
      'requiredSignatures',
      'requestedById',
      'requestedAt',
      'status',
      'createdAt',
      'updatedAt',
    ])
  }
}
