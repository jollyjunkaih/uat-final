import type Step from '#models/step'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class StepTransformer extends BaseTransformer<Step> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'uatFlowId',
      'name',
      'description',
      'sequence',
      'gifFileName',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
