import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'test_cases'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('uat_flow_id')
        .notNullable()
        .references('id')
        .inTable('uat_flows')
        .onDelete('CASCADE')
      table.integer('test_no').notNullable()
      table.text('description_of_tasks').notNullable()
      table.text('steps_to_execute').notNullable()
      table.text('expected_results').notNullable()
      table.boolean('pass').notNullable().defaultTo(false)
      table.boolean('fail').notNullable().defaultTo(false)
      table.text('defect_comments').nullable()
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
