import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Feature from '#models/feature'
import Version from '#models/version'
import ViewOnlyLink from '#models/view_only_link'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare moduleList: unknown[]

  @column()
  declare prdRequiredSignatures: number

  @column()
  declare uatAcceptanceRequiredSignatures: number

  @column()
  declare uatImplementationRequiredSignatures: number

  @column()
  declare integrationEnabled: boolean

  @column()
  declare integrationConfig: Record<string, unknown> | null

  @column()
  declare status: string

  @column()
  declare ownerId: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => Feature)
  declare features: HasMany<typeof Feature>

  @hasMany(() => Version)
  declare versions: HasMany<typeof Version>

  @hasMany(() => ViewOnlyLink)
  declare viewOnlyLinks: HasMany<typeof ViewOnlyLink>
}
