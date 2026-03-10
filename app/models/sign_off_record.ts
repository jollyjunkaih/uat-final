import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Version from '#models/version'
import User from '#models/user'
import SignOffLink from '#models/sign_off_link'

export default class SignOffRecord extends BaseModel {
  static table = 'sign_off_records'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare versionId: string

  @column()
  declare documentType: string

  @column()
  declare signOffStage: 'prd_approval' | 'uat_acceptance' | 'uat_implementation'

  @column()
  declare requiredSignatures: number

  @column()
  declare requestedById: string

  @column.dateTime()
  declare requestedAt: DateTime

  @column()
  declare status: 'pending' | 'approved' | 'rejected'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Version)
  declare version: BelongsTo<typeof Version>

  @belongsTo(() => User, { foreignKey: 'requestedById' })
  declare requestedBy: BelongsTo<typeof User>

  @hasMany(() => SignOffLink)
  declare signOffLinks: HasMany<typeof SignOffLink>
}
