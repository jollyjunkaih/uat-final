import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatFlow from '#models/uat_flow'

export default class TestCase extends BaseModel {
  static table = 'test_cases'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatFlowId: string

  @column()
  declare testNo: number

  @column()
  declare descriptionOfTasks: string

  @column()
  declare stepsToExecute: string

  @column()
  declare expectedResults: string

  @column()
  declare pass: boolean

  @column()
  declare fail: boolean

  @column()
  declare defectComments: string | null

  @column()
  declare sequence: number

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UatFlow)
  declare uatFlow: BelongsTo<typeof UatFlow>
}
