import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_guide_sections'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('project_id')
        .notNullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table.string('role_name').notNullable()
      table.string('role_slug').notNullable()
      table.text('role_description').nullable()
      table.integer('role_sequence').notNullable().defaultTo(0)
      table.string('title').notNullable()
      table.string('slug').notNullable()
      table.string('module').nullable()
      table.integer('sequence').notNullable().defaultTo(0)
      table.text('content').notNullable()
      table.string('status').notNullable().defaultTo('draft')
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['project_id', 'role_slug', 'sequence'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
