import type Feature from '#models/feature'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class FeatureTransformer extends BaseTransformer<Feature> {
  toObject() {
    const base: Record<string, unknown> = this.pick(this.resource, [
      'id',
      'projectId',
      'name',
      'description',
      'module',
      'priority',
      'status',
      'ecosystem',
      'inScope',
      'outOfScope',
      'mockScreens',
      'processFlows',
      'ownerId',
      'version',
      'sequence',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ])

    if (this.resource.$preloaded.uatFlows) {
      base.uatFlows = this.resource.uatFlows.map((flow) => {
        const flowData: Record<string, unknown> = {
          id: flow.id,
          featureId: flow.featureId,
          name: flow.name,
          description: flow.description,
          preconditions: flow.preconditions,
          status: flow.status,
          version: flow.version,
          sequence: flow.sequence,
        }
        if (flow.$preloaded.steps) {
          flowData.steps = flow.steps.map((step) => ({
            id: step.id,
            uatFlowId: step.uatFlowId,
            name: step.name,
            description: step.description,
            sequence: step.sequence,
            gifFileName: step.gifFileName,
          }))
        }
        return flowData
      })
    }

    return base
  }
}
