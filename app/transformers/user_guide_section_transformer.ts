import type UserGuideSection from '#models/user_guide_section'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserGuideSectionTransformer extends BaseTransformer<UserGuideSection> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'projectId',
      'roleName',
      'roleSlug',
      'roleDescription',
      'roleSequence',
      'title',
      'slug',
      'module',
      'sequence',
      'content',
      'status',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
