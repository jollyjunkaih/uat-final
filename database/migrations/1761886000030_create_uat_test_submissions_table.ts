import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'uat_test_submissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('uat_test_link_id')
        .notNullable()
        .references('id')
        .inTable('uat_test_links')
        .onDelete('CASCADE')
      table.string('tester_name').notNullable()
      table
        .uuid('signator_id')
        .nullable()
        .references('id')
        .inTable('signators')
        .onDelete('SET NULL')
      table.text('signature').nullable()
      table.string('status').notNullable().defaultTo('pending')
      table.timestamp('submitted_at').nullable()
      table.string('signer_ip').nullable()
      table.text('signer_user_agent').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
