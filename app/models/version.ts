import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'
import User from '#models/user'
import SignOffRecord from '#models/sign_off_record'

export default class Version extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare versionNumber: number

  @column()
  declare documentType: 'prd' | 'uat'

  @column()
  declare snapshot: Record<string, unknown> | null

  @column()
  declare status: 'draft' | 'pending_approval' | 'approved' | 'rejected'

  @column()
  declare createdById: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>

  @hasMany(() => SignOffRecord)
  declare signOffRecords: HasMany<typeof SignOffRecord>
}
