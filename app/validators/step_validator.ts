import vine from '@vinejs/vine'

export const createStepValidator = vine.compile(
  vine.object({
    uatFlowId: vine.string().trim(),
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    sequence: vine.number().optional(),
  })
)

export const updateStepValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional().nullable(),
    sequence: vine.number().optional(),
  })
)

export const reorderStepsValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.string()),
  })
)
