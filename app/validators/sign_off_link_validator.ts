import vine from '@vinejs/vine'

export const submitSignOffValidator = vine.compile(
  vine.object({
    signerActualName: vine.string().trim().maxLength(255),
    signerComments: vine.string().trim().optional(),
    decision: vine.enum(['signed', 'rejected']),
  })
)
