import vine from '@vinejs/vine'

const stepSchema = vine.object({
  instruction: vine.string().trim(),
  imageFileName: vine.string().trim().maxLength(500).optional().nullable(),
  sequence: vine.number().min(0),
})

export const createUserGuideSectionValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    roleName: vine.string().trim().maxLength(255),
    roleSlug: vine.string().trim().maxLength(255),
    roleDescription: vine.string().trim().optional(),
    roleSequence: vine.number().min(0),
    title: vine.string().trim().maxLength(255),
    slug: vine.string().trim().maxLength(255),
    module: vine.string().trim().maxLength(255).optional(),
    sequence: vine.number().min(0),
    steps: vine.array(stepSchema).optional(),
  })
)

export const updateUserGuideSectionValidator = vine.compile(
  vine.object({
    roleName: vine.string().trim().maxLength(255).optional(),
    roleSlug: vine.string().trim().maxLength(255).optional(),
    roleDescription: vine.string().trim().optional().nullable(),
    roleSequence: vine.number().min(0).optional(),
    title: vine.string().trim().maxLength(255).optional(),
    slug: vine.string().trim().maxLength(255).optional(),
    module: vine.string().trim().maxLength(255).optional().nullable(),
    sequence: vine.number().min(0).optional(),
    status: vine.enum(['draft', 'published', 'archived']).optional(),
    steps: vine.array(stepSchema).optional(),
  })
)
