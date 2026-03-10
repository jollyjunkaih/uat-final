import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'sign_off_links'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('sign_off_record_id')
        .notNullable()
        .references('id')
        .inTable('sign_off_records')
        .onDelete('CASCADE')
      table.string('token', 64).notNullable().unique()
      table.string('signer_name').notNullable()
      table.string('signer_email').notNullable()
      table.string('status').notNullable().defaultTo('pending')
      table.timestamp('signed_at').nullable()
      table.string('signer_actual_name').nullable()
      table.text('signer_comments').nullable()
      table.string('signer_ip').nullable()
      table.text('signer_user_agent').nullable()
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
