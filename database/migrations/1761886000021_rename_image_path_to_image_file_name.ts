import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'steps'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('image_path', 'image_file_name')
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.renameColumn('image_file_name', 'image_path')
    })
  }
}
