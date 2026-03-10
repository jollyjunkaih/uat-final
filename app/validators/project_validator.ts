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

    // Product Overview
    companyName: vine.string().trim().maxLength(255).optional().nullable(),
    productName: vine.string().trim().maxLength(255).optional().nullable(),
    projectManager: vine.string().trim().maxLength(255).optional().nullable(),
    contributors: vine.string().trim().maxLength(255).optional().nullable(),
    prdVersion: vine.string().trim().maxLength(255).optional().nullable(),
    locationsOfSale: vine.string().trim().maxLength(255).optional().nullable(),
    prdDate: vine.string().trim().maxLength(255).optional().nullable(),
    preparedBy: vine.string().trim().maxLength(255).optional().nullable(),

    // Purpose
    objective: vine.string().trim().optional().nullable(),
    targetMarket: vine.string().trim().optional().nullable(),
    targetAudience: vine.string().trim().optional().nullable(),
    successMetrics: vine.string().trim().optional().nullable(),

    // User Interaction
    userInteractions: vine.string().trim().optional().nullable(),
    touchpoint: vine.string().trim().optional().nullable(),
    userFeedback: vine.string().trim().optional().nullable(),

    // Design & Branding
    formFactor: vine.string().trim().optional().nullable(),
    materials: vine.string().trim().optional().nullable(),
    brandingAdjectives: vine.array(vine.string()).optional(),
    brandingTone: vine.array(vine.string()).optional(),
    visualIdentity: vine.string().trim().optional().nullable(),
    packagingPresentation: vine.string().trim().optional().nullable(),

    // Software Architecture
    firmwareFunctions: vine.string().trim().optional().nullable(),
    cloudApplication: vine.string().trim().optional().nullable(),
    smartphoneApplication: vine.string().trim().optional().nullable(),

    // Servicing & Updates
    servicingUpdates: vine.string().trim().optional().nullable(),

    // Milestones
    targetReleaseDate: vine.string().trim().maxLength(255).optional().nullable(),

    // Additional Information
    diagramsSchematics: vine.string().trim().optional().nullable(),
    bom: vine.string().trim().optional().nullable(),
    additionalResources: vine.string().trim().optional().nullable(),
    additionalVisualIdentity: vine.string().trim().optional().nullable(),

    // UAT Metadata
    testingStartDate: vine.string().trim().maxLength(255).optional().nullable(),
    testingStartTime: vine.string().trim().maxLength(255).optional().nullable(),
    testingEndDate: vine.string().trim().maxLength(255).optional().nullable(),
    testingEndTime: vine.string().trim().maxLength(255).optional().nullable(),
    testerNames: vine.array(vine.string()).optional(),
    generalComments: vine.string().trim().optional().nullable(),
  })
)
