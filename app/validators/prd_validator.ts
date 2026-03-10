import vine from '@vinejs/vine'

// Competitors
export const createCompetitorValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    competitorName: vine.string().trim().maxLength(255),
    productNameOrLink: vine.string().trim().maxLength(500).optional(),
  })
)

export const updateCompetitorValidator = vine.compile(
  vine.object({
    competitorName: vine.string().trim().maxLength(255).optional(),
    productNameOrLink: vine.string().trim().maxLength(500).optional().nullable(),
  })
)

// Milestones
export const createMilestoneValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    department: vine.string().trim().maxLength(255),
    startDate: vine.string().trim().maxLength(255).optional(),
    status: vine.string().trim().maxLength(255).optional(),
    completionDate: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateMilestoneValidator = vine.compile(
  vine.object({
    department: vine.string().trim().maxLength(255).optional(),
    startDate: vine.string().trim().maxLength(255).optional().nullable(),
    status: vine.string().trim().maxLength(255).optional(),
    completionDate: vine.string().trim().maxLength(255).optional().nullable(),
  })
)

// Open Questions
export const createOpenQuestionValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    question: vine.string().trim(),
    answer: vine.string().trim().optional(),
    dateAnswered: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateOpenQuestionValidator = vine.compile(
  vine.object({
    question: vine.string().trim().optional(),
    answer: vine.string().trim().optional().nullable(),
    dateAnswered: vine.string().trim().maxLength(255).optional().nullable(),
  })
)

// Contacts
export const createContactValidator = vine.compile(
  vine.object({
    projectId: vine.string(),
    name: vine.string().trim().maxLength(255),
    title: vine.string().trim().maxLength(255).optional(),
    email: vine.string().trim().maxLength(255).optional(),
    phone: vine.string().trim().maxLength(255).optional(),
  })
)

export const updateContactValidator = vine.compile(
  vine.object({
    name: vine.string().trim().maxLength(255).optional(),
    title: vine.string().trim().maxLength(255).optional().nullable(),
    email: vine.string().trim().maxLength(255).optional().nullable(),
    phone: vine.string().trim().maxLength(255).optional().nullable(),
  })
)
