import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'))
      table.string('name').notNullable()
      table.text('description').nullable()
      table.json('module_list').defaultTo('[]')
      table.integer('prd_required_signatures').notNullable().defaultTo(1)
      table.integer('uat_acceptance_required_signatures').notNullable().defaultTo(1)
      table.integer('uat_implementation_required_signatures').notNullable().defaultTo(1)
      table.boolean('integration_enabled').notNullable().defaultTo(false)
      table.json('integration_config').nullable()
      table.string('status').notNullable().defaultTo('active')
      table.integer('owner_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
