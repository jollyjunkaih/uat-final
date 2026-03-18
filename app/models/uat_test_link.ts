import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'
import User from '#models/user'
import UatTestSubmission from '#models/uat_test_submission'

export default class UatTestLink extends BaseModel {
  static table = 'uat_test_links'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare token: string

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column()
  declare createdById: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>

  @hasMany(() => UatTestSubmission)
  declare submissions: HasMany<typeof UatTestSubmission>
}
