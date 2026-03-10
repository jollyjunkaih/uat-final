import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Event from '#models/event'

export default class TriggerLink extends BaseModel {
  static table = 'trigger_links'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare eventId: string

  @column()
  declare triggerIdentifier: string

  @column()
  declare triggerModel: string

  @column.dateTime()
  declare lastSyncAt: DateTime | null

  @column()
  declare testStatus: string

  @column()
  declare isBroken: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Event)
  declare event: BelongsTo<typeof Event>
}
