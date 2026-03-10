import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'uat_flows'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('feature_id')
        .notNullable()
        .references('id')
        .inTable('features')
        .onDelete('CASCADE')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.text('preconditions').nullable()
      table.string('status').notNullable().defaultTo('draft')
      table.integer('version').notNullable().defaultTo(1)
      table.integer('sequence').notNullable().defaultTo(0)
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
