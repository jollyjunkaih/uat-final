import vine from '@vinejs/vine'

export const createViewOnlyLinkValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    documentType: vine.enum(['prd', 'uat']),
    version: vine.number(),
    password: vine.string().trim().optional(),
    expiresAt: vine.string().trim().optional(),
  })
)
