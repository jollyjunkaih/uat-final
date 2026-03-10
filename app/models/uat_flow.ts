import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Feature from '#models/feature'
import Step from '#models/step'

export default class UatFlow extends BaseModel {
  static table = 'uat_flows'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare featureId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare preconditions: string | null

  @column()
  declare status: 'draft' | 'ready_for_test' | 'passed' | 'failed' | 'blocked'

  @column()
  declare version: number

  @column()
  declare sequence: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Feature)
  declare feature: BelongsTo<typeof Feature>

  @hasMany(() => Step)
  declare steps: HasMany<typeof Step>
}
