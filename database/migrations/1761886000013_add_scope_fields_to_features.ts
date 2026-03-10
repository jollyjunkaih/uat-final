import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'features'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('ecosystem').nullable()
      table.text('in_scope').nullable()
      table.text('out_of_scope').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ecosystem')
      table.dropColumn('in_scope')
      table.dropColumn('out_of_scope')
    })
  }
}
