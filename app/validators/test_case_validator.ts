import vine from '@vinejs/vine'

export const createTestCaseValidator = vine.compile(
  vine.object({
    uatFlowId: vine.string(),
    testNo: vine.number(),
    descriptionOfTasks: vine.string().trim(),
    stepsToExecute: vine.string().trim(),
    expectedResults: vine.string().trim(),
    pass: vine.boolean().optional(),
    fail: vine.boolean().optional(),
    defectComments: vine.string().trim().optional(),
    sequence: vine.number().optional(),
  })
)

export const updateTestCaseValidator = vine.compile(
  vine.object({
    testNo: vine.number().optional(),
    descriptionOfTasks: vine.string().trim().optional(),
    stepsToExecute: vine.string().trim().optional(),
    expectedResults: vine.string().trim().optional(),
    pass: vine.boolean().optional(),
    fail: vine.boolean().optional(),
    defectComments: vine.string().trim().optional().nullable(),
    sequence: vine.number().optional(),
  })
)

export const reorderTestCasesValidator = vine.compile(
  vine.object({
    ids: vine.array(vine.string()),
  })
)
