import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'trigger_links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE')
      table.string('trigger_identifier').notNullable()
      table.string('trigger_model').notNullable()
      table.timestamp('last_sync_at').nullable()
      table.string('test_status').notNullable().defaultTo('no_tests')
      table.boolean('is_broken').notNullable().defaultTo(false)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
