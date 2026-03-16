import type StepImage from '#models/step_image'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class StepImageTransformer extends BaseTransformer<StepImage> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'stepId',
      'fileName',
      'sequence',
      'source',
      'createdAt',
    ])
  }
}
