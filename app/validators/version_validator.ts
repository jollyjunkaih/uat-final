import vine from '@vinejs/vine'

export const createVersionValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    documentType: vine.enum(['prd', 'uat']),
  })
)
