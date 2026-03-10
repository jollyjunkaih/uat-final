import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table
        .uuid('uat_flow_id')
        .notNullable()
        .references('id')
        .inTable('uat_flows')
        .onDelete('CASCADE')
      table.string('name', 255).notNullable()
      table.text('description').nullable()
      table.integer('sequence').notNullable().defaultTo(0)
      table.string('image_path', 500).nullable()
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
