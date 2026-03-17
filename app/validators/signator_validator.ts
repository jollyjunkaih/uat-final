import vine from '@vinejs/vine'

export const createSignatorValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    name: vine.string().trim().maxLength(255),
    title: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateSignatorValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    title: vine.string().trim().maxLength(255).optional().nullable(),
  })
)
