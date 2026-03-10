import type Event from '#models/event'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class EventTransformer extends BaseTransformer<Event> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'uatFlowId',
      'model',
      'name',
      'description',
      'triggerType',
      'condition',
      'sequence',
      'expectedOutcome',
      'testStatus',
      'notes',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
