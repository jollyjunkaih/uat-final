import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'

export default class Upload extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare fileName: string

  @column()
  declare filePath: string

  @column()
  declare mimeType: string

  @column()
  declare size: number

  @column()
  declare context: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>
}
