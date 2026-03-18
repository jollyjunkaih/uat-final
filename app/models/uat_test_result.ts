import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatTestSubmission from '#models/uat_test_submission'

export default class UatTestResult extends BaseModel {
  static table = 'uat_test_results'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatTestSubmissionId: string

  @column()
  declare stepId: string

  @column()
  declare featureId: string

  @column()
  declare uatFlowId: string

  @column()
  declare result: 'working' | 'not_working'

  @column()
  declare comment: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UatTestSubmission)
  declare submission: BelongsTo<typeof UatTestSubmission>
}
