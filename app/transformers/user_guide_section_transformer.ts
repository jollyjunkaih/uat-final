import type UserGuideSection from '#models/user_guide_section'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class UserGuideSectionTransformer extends BaseTransformer<UserGuideSection> {
  toObject() {
    const base: Record<string, unknown> = this.pick(this.resource, [
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
      'status',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])

    if (this.resource.$preloaded.steps) {
      base.steps = this.resource.steps.map((step) => ({
        id: step.id,
        sectionId: step.sectionId,
        instruction: step.instruction,
        imageFileName: step.imageFileName,
        sequence: step.sequence,
      }))
    }

    return base
  }
}
