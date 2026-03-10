import vine from '@vinejs/vine'

export const createUatFlowValidator = vine.compile(
  vine.object({
    featureId: vine.string(),
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    preconditions: vine.string().trim().optional(),
  })
)

export const updateUatFlowValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional().nullable(),
    preconditions: vine.string().trim().optional().nullable(),
    status: vine.enum(['draft', 'ready_for_test', 'passed', 'failed', 'blocked']).optional(),
  })
)
