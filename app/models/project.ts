import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Feature from '#models/feature'
import Version from '#models/version'
import ViewOnlyLink from '#models/view_only_link'
import Upload from '#models/upload'
import PrdCompetitor from '#models/prd_competitor'
import PrdMilestone from '#models/prd_milestone'
import PrdOpenQuestion from '#models/prd_open_question'
import PrdContact from '#models/prd_contact'
import Signator from '#models/signator'
import UatTestLink from '#models/uat_test_link'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare moduleList: unknown[]

  @column()
  declare prdRequiredSignatures: number

  @column()
  declare uatAcceptanceRequiredSignatures: number

  @column()
  declare uatImplementationRequiredSignatures: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: string | string[]) =>
      typeof value === 'string' ? JSON.parse(value) : value || [],
  })
  declare prdSignatorIds: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: string | string[]) =>
      typeof value === 'string' ? JSON.parse(value) : value || [],
  })
  declare uatAcceptanceSignatorIds: string[]

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: string | string[]) =>
      typeof value === 'string' ? JSON.parse(value) : value || [],
  })
  declare uatImplementationSignatorIds: string[]

  @column()
  declare integrationEnabled: boolean

  @column()
  declare integrationConfig: Record<string, unknown> | null

  @column()
  declare status: string

  @column()
  declare ownerId: string

  // Product Overview
  @column()
  declare companyName: string | null

  @column()
  declare productName: string | null

  @column()
  declare projectManager: string | null

  @column()
  declare contributors: string | null

  @column()
  declare prdVersion: string | null

  @column()
  declare locationsOfSale: string | null

  @column()
  declare prdDate: string | null

  @column()
  declare preparedBy: string | null

  // Purpose
  @column()
  declare objective: string | null

  @column()
  declare targetMarket: string | null

  @column()
  declare targetAudience: string | null

  @column()
  declare successMetrics: string | null

  // User Interaction
  @column()
  declare userInteractions: string | null

  @column()
  declare touchpoint: string | null

  @column()
  declare userFeedback: string | null

  // Design & Branding
  @column()
  declare formFactor: string | null

  @column()
  declare materials: string | null

  @column()
  declare brandingAdjectives: string[]

  @column()
  declare brandingTone: string[]

  @column()
  declare visualIdentity: string | null

  @column()
  declare packagingPresentation: string | null

  // Software Architecture
  @column()
  declare firmwareFunctions: string | null

  @column()
  declare cloudApplication: string | null

  @column()
  declare smartphoneApplication: string | null

  // Servicing & Updates
  @column()
  declare servicingUpdates: string | null

  // Milestones
  @column()
  declare targetReleaseDate: string | null

  // Additional Information
  @column()
  declare diagramsSchematics: string | null

  @column()
  declare bom: string | null

  @column()
  declare additionalResources: string | null

  @column()
  declare additionalVisualIdentity: string | null

  // UAT Metadata
  @column()
  declare testingStartDate: string | null

  @column()
  declare testingStartTime: string | null

  @column()
  declare testingEndDate: string | null

  @column()
  declare testingEndTime: string | null

  @column()
  declare testerNames: string[]

  @column()
  declare generalComments: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => Feature)
  declare features: HasMany<typeof Feature>

  @hasMany(() => Version)
  declare versions: HasMany<typeof Version>

  @hasMany(() => ViewOnlyLink)
  declare viewOnlyLinks: HasMany<typeof ViewOnlyLink>

  @hasMany(() => Upload)
  declare uploads: HasMany<typeof Upload>

  @hasMany(() => PrdCompetitor)
  declare competitors: HasMany<typeof PrdCompetitor>

  @hasMany(() => PrdMilestone)
  declare milestones: HasMany<typeof PrdMilestone>

  @hasMany(() => PrdOpenQuestion)
  declare openQuestions: HasMany<typeof PrdOpenQuestion>

  @hasMany(() => PrdContact)
  declare contacts: HasMany<typeof PrdContact>

  @hasMany(() => Signator)
  declare signators: HasMany<typeof Signator>

  @hasMany(() => UatTestLink)
  declare uatTestLinks: HasMany<typeof UatTestLink>
}
