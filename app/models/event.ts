import { BaseModel, column, belongsTo, hasOne } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasOne } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatFlow from '#models/uat_flow'
import TriggerLink from '#models/trigger_link'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatFlowId: string

  @column()
  declare model: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare triggerType: 'create' | 'update' | 'delete'

  @column()
  declare condition: string | null

  @column()
  declare sequence: number

  @column()
  declare expectedOutcome: string

  @column()
  declare testStatus: 'no_tests' | 'tests_failing' | 'tests_passing'

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => UatFlow)
  declare uatFlow: BelongsTo<typeof UatFlow>

  @hasOne(() => TriggerLink)
  declare triggerLink: HasOne<typeof TriggerLink>
}
