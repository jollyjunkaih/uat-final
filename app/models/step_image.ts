import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Step from '#models/step'

export default class StepImage extends BaseModel {
  static table = 'step_images'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare stepId: string

  @column()
  declare fileName: string

  @column()
  declare sequence: number

  @column()
  declare source: 'upload' | 'gif_extraction'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Step)
  declare step: BelongsTo<typeof Step>
}
