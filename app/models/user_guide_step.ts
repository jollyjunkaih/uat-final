import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import UserGuideSection from '#models/user_guide_section'

export default class UserGuideStep extends BaseModel {
  static table = 'user_guide_steps'

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare sectionId: string

  @column()
  declare instruction: string

  @column()
  declare imageFileName: string | null

  @column()
  declare sequence: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => UserGuideSection)
  declare section: BelongsTo<typeof UserGuideSection>
}
