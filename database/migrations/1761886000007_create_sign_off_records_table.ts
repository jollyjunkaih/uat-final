import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sign_off_records'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('version_id')
        .notNullable()
        .references('id')
        .inTable('versions')
        .onDelete('CASCADE')
      table.string('document_type').notNullable()
      table.string('sign_off_stage').notNullable()
      table.integer('required_signatures').notNullable().defaultTo(1)
      table
        .integer('requested_by_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.timestamp('requested_at').notNullable()
      table.string('status').notNullable().defaultTo('pending')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
