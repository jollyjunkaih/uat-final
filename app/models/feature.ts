import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Project from '#models/project'
import User from '#models/user'
import UatFlow from '#models/uat_flow'

export default class Feature extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare projectId: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare module: string | null

  @column()
  declare priority: 'critical' | 'high' | 'medium' | 'low'

  @column()
  declare status: 'draft' | 'in_review' | 'approved' | 'deprecated'

  @column()
  declare ecosystem: string | null

  @column()
  declare inScope: string | null

  @column()
  declare outOfScope: string | null

  @column()
  declare ownerId: string

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

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => UatFlow)
  declare uatFlows: HasMany<typeof UatFlow>
}
