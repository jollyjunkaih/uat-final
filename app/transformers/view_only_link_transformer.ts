import type ViewOnlyLink from '#models/view_only_link'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ViewOnlyLinkTransformer extends BaseTransformer<ViewOnlyLink> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'documentType',
      'version',
      'token',
      'isActive',
      'expiresAt',
      'createdById',
      'lastAccessedAt',
      'accessCount',
      'createdAt',
      'updatedAt',
    ])
  }
}
