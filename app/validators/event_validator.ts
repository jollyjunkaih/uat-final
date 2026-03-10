import vine from '@vinejs/vine'

export const createEventValidator = vine.compile(
  vine.object({
    uatFlowId: vine.string(),
    model: vine.string().trim().maxLength(255),
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    triggerType: vine.enum(['create', 'update', 'delete']),
    condition: vine.string().trim().optional(),
    sequence: vine.number().optional(),
    expectedOutcome: vine.string().trim(),
    notes: vine.string().trim().optional(),
  })
)

export const updateEventValidator = vine.compile(
  vine.object({
    uatFlowId: vine.string().optional(),
    model: vine.string().trim().maxLength(255).optional(),
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional(),
    triggerType: vine.enum(['create', 'update', 'delete']).optional(),
    condition: vine.string().trim().optional(),
    sequence: vine.number().optional(),
    expectedOutcome: vine.string().trim().optional(),
    notes: vine.string().trim().optional(),
  })
)

export const reorderEventsValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.string()),
  })
)
