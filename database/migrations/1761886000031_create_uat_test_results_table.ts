import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'uat_test_results'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table
        .uuid('uat_test_submission_id')
        .notNullable()
        .references('id')
        .inTable('uat_test_submissions')
        .onDelete('CASCADE')
      table
        .uuid('step_id')
        .notNullable()
        .references('id')
        .inTable('steps')
        .onDelete('CASCADE')
      table
        .uuid('feature_id')
        .notNullable()
        .references('id')
        .inTable('features')
        .onDelete('CASCADE')
      table
        .uuid('uat_flow_id')
        .notNullable()
        .references('id')
        .inTable('uat_flows')
        .onDelete('CASCADE')
      table.string('result').notNullable()
      table.text('comment').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
