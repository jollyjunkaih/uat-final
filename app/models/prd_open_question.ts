import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'

export default class PrdOpenQuestion extends BaseModel {
  static table = 'prd_open_questions'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare question: string

  @column()
  declare answer: string | null

  @column()
  declare dateAnswered: string | null

  @column()
  declare sequence: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
