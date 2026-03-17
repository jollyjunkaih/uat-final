import type Project from '#models/project'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class ProjectTransformer extends BaseTransformer<Project> {
  toObject() {
    return this.pick(this.resource, [
      'id',
      'name',
      'description',
      'moduleList',
      'prdRequiredSignatures',
      'uatAcceptanceRequiredSignatures',
      'uatImplementationRequiredSignatures',
      'prdSignatorIds',
      'uatAcceptanceSignatorIds',
      'uatImplementationSignatorIds',
      'integrationEnabled',
      'integrationConfig',
      'status',
      // Product Overview
      'companyName',
      'productName',
      'projectManager',
      'contributors',
      'prdVersion',
      'locationsOfSale',
      'prdDate',
      'preparedBy',
      // Purpose
      'objective',
      'targetMarket',
      'targetAudience',
      'successMetrics',
      // User Interaction
      'userInteractions',
      'touchpoint',
      'userFeedback',
      // Design & Branding
      'formFactor',
      'materials',
      'brandingAdjectives',
      'brandingTone',
      'visualIdentity',
      'packagingPresentation',
      // Software Architecture
      'firmwareFunctions',
      'cloudApplication',
      'smartphoneApplication',
      // Servicing & Updates
      'servicingUpdates',
      // Milestones
      'targetReleaseDate',
      // Additional Information
      'diagramsSchematics',
      'bom',
      'additionalResources',
      'additionalVisualIdentity',
      // UAT Metadata
      'testingStartDate',
      'testingStartTime',
      'testingEndDate',
      'testingEndTime',
      'testerNames',
      'generalComments',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
