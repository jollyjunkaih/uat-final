import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import SignOffRecord from '#models/sign_off_record'

export default class SignOffLink extends BaseModel {
  static table = 'sign_off_links'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare signOffRecordId: string

  @column()
  declare token: string

  @column()
  declare signerName: string

  @column()
  declare signerEmail: string

  @column()
  declare status: 'pending' | 'signed' | 'rejected' | 'expired' | 'revoked'

  @column.dateTime()
  declare signedAt: DateTime | null

  @column()
  declare signerActualName: string | null

  @column()
  declare signerComments: string | null

  @column()
  declare signerIp: string | null

  @column()
  declare signerUserAgent: string | null

  @column.dateTime()
  declare expiresAt: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => SignOffRecord)
  declare signOffRecord: BelongsTo<typeof SignOffRecord>
}
