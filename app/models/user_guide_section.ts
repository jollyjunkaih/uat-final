import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'

export default class UserGuideSection extends BaseModel {
  static table = 'user_guide_sections'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare roleName: string

  @column()
  declare roleSlug: string

  @column()
  declare roleDescription: string | null

  @column()
  declare roleSequence: number

  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare module: string | null

  @column()
  declare sequence: number

  @column()
  declare content: string

  @column()
  declare status: 'draft' | 'published' | 'archived'

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
