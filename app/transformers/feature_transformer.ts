import type Feature from '#models/feature'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class FeatureTransformer extends BaseTransformer<Feature> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'name',
      'description',
      'module',
      'priority',
      'status',
      'ownerId',
      'version',
      'sequence',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
