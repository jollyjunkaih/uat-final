import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'
import User from '#models/user'

export default class ViewOnlyLink extends BaseModel {
  static table = 'view_only_links'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare documentType: string

  @column()
  declare version: number

  @column()
  declare token: string

  @column()
  declare passwordHash: string | null

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare expiresAt: DateTime | null

  @column()
  declare createdById: string

  @column.dateTime()
  declare lastAccessedAt: DateTime | null

  @column()
  declare accessCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'createdById' })
  declare createdBy: BelongsTo<typeof User>
}
