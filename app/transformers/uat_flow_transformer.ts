import type UatFlow from '#models/uat_flow'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UatFlowTransformer extends BaseTransformer<UatFlow> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'featureId',
      'name',
      'description',
      'preconditions',
      'status',
      'version',
      'sequence',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
