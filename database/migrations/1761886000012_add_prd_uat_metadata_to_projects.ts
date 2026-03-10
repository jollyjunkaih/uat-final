import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Product Overview
      table.string('company_name').nullable()
      table.string('product_name').nullable()
      table.string('project_manager').nullable()
      table.string('contributors').nullable()
      table.string('prd_version').nullable()
      table.string('locations_of_sale').nullable()
      table.string('prd_date').nullable()
      table.string('prepared_by').nullable()

      // Purpose
      table.text('objective').nullable()
      table.text('target_market').nullable()
      table.text('target_audience').nullable()
      table.text('success_metrics').nullable()

      // User Interaction
      table.text('user_interactions').nullable()
      table.text('touchpoint').nullable()
      table.text('user_feedback').nullable()

      // Design & Branding
      table.text('form_factor').nullable()
      table.text('materials').nullable()
      table.json('branding_adjectives').nullable().defaultTo('[]')
      table.json('branding_tone').nullable().defaultTo('[]')
      table.text('visual_identity').nullable()
      table.text('packaging_presentation').nullable()

      // Software Architecture
      table.text('firmware_functions').nullable()
      table.text('cloud_application').nullable()
      table.text('smartphone_application').nullable()

      // Servicing & Updates
      table.text('servicing_updates').nullable()

      // Milestones
      table.string('target_release_date').nullable()

      // Additional Information
      table.text('diagrams_schematics').nullable()
      table.text('bom').nullable()
      table.text('additional_resources').nullable()
      table.text('additional_visual_identity').nullable()

      // UAT Metadata
      table.string('testing_start_date').nullable()
      table.string('testing_start_time').nullable()
      table.string('testing_end_date').nullable()
      table.string('testing_end_time').nullable()
      table.json('tester_names').nullable().defaultTo('[]')
      table.text('general_comments').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('company_name')
      table.dropColumn('product_name')
      table.dropColumn('project_manager')
      table.dropColumn('contributors')
      table.dropColumn('prd_version')
      table.dropColumn('locations_of_sale')
      table.dropColumn('prd_date')
      table.dropColumn('prepared_by')
      table.dropColumn('objective')
      table.dropColumn('target_market')
      table.dropColumn('target_audience')
      table.dropColumn('success_metrics')
      table.dropColumn('user_interactions')
      table.dropColumn('touchpoint')
      table.dropColumn('user_feedback')
      table.dropColumn('form_factor')
      table.dropColumn('materials')
      table.dropColumn('branding_adjectives')
      table.dropColumn('branding_tone')
      table.dropColumn('visual_identity')
      table.dropColumn('packaging_presentation')
      table.dropColumn('firmware_functions')
      table.dropColumn('cloud_application')
      table.dropColumn('smartphone_application')
      table.dropColumn('servicing_updates')
      table.dropColumn('target_release_date')
      table.dropColumn('diagrams_schematics')
      table.dropColumn('bom')
      table.dropColumn('additional_resources')
      table.dropColumn('additional_visual_identity')
      table.dropColumn('testing_start_date')
      table.dropColumn('testing_start_time')
      table.dropColumn('testing_end_date')
      table.dropColumn('testing_end_time')
      table.dropColumn('tester_names')
      table.dropColumn('general_comments')
    })
  }
}
