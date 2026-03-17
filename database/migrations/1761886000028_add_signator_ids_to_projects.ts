import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('prd_signator_ids').notNullable().defaultTo('[]')
      table.json('uat_acceptance_signator_ids').notNullable().defaultTo('[]')
      table.json('uat_implementation_signator_ids').notNullable().defaultTo('[]')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('prd_signator_ids')
      table.dropColumn('uat_acceptance_signator_ids')
      table.dropColumn('uat_implementation_signator_ids')
    })
  }
}
