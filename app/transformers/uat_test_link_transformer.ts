import type UatTestLink from '#models/uat_test_link'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UatTestLinkTransformer extends BaseTransformer<UatTestLink> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'token',
      'isActive',
      'expiresAt',
      'createdById',
      'createdAt',
      'updatedAt',
    ])
  }
}
