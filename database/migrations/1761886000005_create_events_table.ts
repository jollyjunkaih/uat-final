import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('uat_flow_id')
        .notNullable()
        .references('id')
        .inTable('uat_flows')
        .onDelete('CASCADE')
      table.string('model').notNullable()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('trigger_type').notNullable()
      table.text('condition').nullable()
      table.integer('sequence').notNullable().defaultTo(0)
      table.text('expected_outcome').notNullable()
      table.string('test_status').notNullable().defaultTo('no_tests')
      table.text('notes').nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
