import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'features'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.jsonb('mock_screens').defaultTo('[]')
      table.jsonb('process_flows').defaultTo('[]')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('mock_screens')
      table.dropColumn('process_flows')
    })
  }
}
