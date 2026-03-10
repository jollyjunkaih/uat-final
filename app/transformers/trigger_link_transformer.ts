import type TriggerLink from '#models/trigger_link'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class TriggerLinkTransformer extends BaseTransformer<TriggerLink> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'eventId',
      'triggerIdentifier',
      'triggerModel',
      'lastSyncAt',
      'testStatus',
      'isBroken',
      'createdAt',
      'updatedAt',
    ])
  }
}
