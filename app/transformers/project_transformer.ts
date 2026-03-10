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
      'integrationEnabled',
      'integrationConfig',
      'status',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])
  }
}
