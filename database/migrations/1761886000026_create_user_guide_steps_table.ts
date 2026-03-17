import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_guide_steps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.db.rawQuery('gen_random_uuid()').knexQuery)
      table
        .uuid('section_id')
        .notNullable()
        .references('id')
        .inTable('user_guide_sections')
        .onDelete('CASCADE')
      table.text('instruction').notNullable()
      table.string('image_file_name', 500).nullable()
      table.integer('sequence').notNullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).nullable()

      table.index(['section_id', 'sequence'])
    })

    // Drop the content column from user_guide_sections
    this.schema.alterTable('user_guide_sections', (table) => {
      table.dropColumn('content')
    })
  }

  async down() {
    this.schema.alterTable('user_guide_sections', (table) => {
      table.text('content').notNullable().defaultTo('')
    })
    this.schema.dropTable(this.tableName)
  }
}
