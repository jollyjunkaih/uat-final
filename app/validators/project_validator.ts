import vine from '@vinejs/vine'

export const createProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255),
    description: vine.string().trim().optional(),
    prdRequiredSignatures: vine.number().min(1).optional(),
    uatAcceptanceRequiredSignatures: vine.number().min(1).optional(),
    uatImplementationRequiredSignatures: vine.number().min(1).optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    description: vine.string().trim().optional().nullable(),
    status: vine.enum(['active', 'archived']).optional(),
    prdRequiredSignatures: vine.number().min(1).optional(),
    uatAcceptanceRequiredSignatures: vine.number().min(1).optional(),
    uatImplementationRequiredSignatures: vine.number().min(1).optional(),
    integrationEnabled: vine.boolean().optional(),
    integrationConfig: vine.any().optional(),
  })
)
