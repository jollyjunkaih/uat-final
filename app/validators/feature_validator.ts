import vine from '@vinejs/vine'

export const createFeatureValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    module: vine.string().trim().maxLength(255).optional(),
    priority: vine.enum(['critical', 'high', 'medium', 'low']),
    // ownerId: vine.string(),
  })
)

export const updateFeatureValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional().nullable(),
    module: vine.string().trim().maxLength(255).optional().nullable(),
    priority: vine.enum(['critical', 'high', 'medium', 'low']).optional(),
    status: vine.enum(['draft', 'in_review', 'approved', 'deprecated']).optional(),
    // ownerId: vine.string().optional(),
  })
)
