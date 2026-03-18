import vine from '@vinejs/vine'

export const createUatTestLinkValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    expiresAt: vine.string().trim().optional(),
  })
)

export const submitUatTestValidator = vine.compile(
  vine.object({
    testerName: vine.string().trim().maxLength(255),
    signatorId: vine.string().trim().optional(),
    signature: vine.string(),
    results: vine.array(
      vine.object({
        stepId: vine.string(),
        featureId: vine.string(),
        uatFlowId: vine.string(),
        result: vine.enum(['working', 'not_working']),
        comment: vine.string().trim().optional(),
      })
    ),
  })
)
