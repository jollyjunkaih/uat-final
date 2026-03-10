import vine from '@vinejs/vine'

export const initiateSignOffValidator = vine.compile(
  vine.object({
    versionId: vine.string(),
    signOffStage: vine.enum(['prd_approval', 'uat_acceptance', 'uat_implementation']),
    requiredSignatures: vine.number().min(1),
    approvers: vine.array(
      vine.object({
        name: vine.string().trim(),
        email: vine.string().email(),
      })
    ),
  })
)
