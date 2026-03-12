import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatFlow from '#models/uat_flow'

export default class Step extends BaseModel {
  static table = 'steps'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatFlowId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare sequence: number

  @column()
  declare imageFileName: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UatFlow)
  declare uatFlow: BelongsTo<typeof UatFlow>
}
