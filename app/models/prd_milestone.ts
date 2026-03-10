import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'

export default class PrdMilestone extends BaseModel {
  static table = 'prd_milestones'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare department: string

  @column()
  declare startDate: string | null

  @column()
  declare status: string

  @column()
  declare completionDate: string | null

  @column()
  declare sequence: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
