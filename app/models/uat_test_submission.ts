import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UatTestLink from '#models/uat_test_link'
import Signator from '#models/signator'
import UatTestResult from '#models/uat_test_result'

export default class UatTestSubmission extends BaseModel {
  static table = 'uat_test_submissions'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare uatTestLinkId: string

  @column()
  declare testerName: string

  @column()
  declare signatorId: string | null

  @column()
  declare signature: string | null

  @column()
  declare status: 'pending' | 'submitted'

  @column.dateTime()
  declare submittedAt: DateTime | null

  @column()
  declare signerIp: string | null

  @column()
  declare signerUserAgent: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UatTestLink)
  declare testLink: BelongsTo<typeof UatTestLink>

  @belongsTo(() => Signator)
  declare signator: BelongsTo<typeof Signator>

  @hasMany(() => UatTestResult)
  declare results: HasMany<typeof UatTestResult>
}
