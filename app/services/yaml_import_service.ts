import { parse } from 'yaml'
import Project from '#models/project'
import Feature from '#models/feature'
import UatFlow from '#models/uat_flow'
import Step from '#models/step'
import PrdCompetitor from '#models/prd_competitor'
import PrdMilestone from '#models/prd_milestone'
import PrdOpenQuestion from '#models/prd_open_question'
import PrdContact from '#models/prd_contact'
import type { PrdYamlData, UatYamlData } from '#services/yaml_writer_service'

export default class YamlImportService {
  async importPrd(projectId: string, yamlContent: string): Promise<void> {
    const parsed = parse(yamlContent)
    if (!parsed) throw new Error('Invalid YAML content')

    const { _projectId: _, _generatedAt: __, ...rawData } = parsed
    const data = rawData as PrdYamlData

    const project = await Project.findOrFail(projectId)

    // Update project PRD fields
    project.merge({
      companyName: data.metadata?.companyName ?? null,
      productName: data.metadata?.productName ?? null,
      projectManager: data.metadata?.projectManager ?? null,
      contributors: data.metadata?.contributors ?? null,
      prdVersion: data.metadata?.prdVersion ?? null,
      locationsOfSale: data.metadata?.locationsOfSale ?? null,
      prdDate: data.metadata?.prdDate ?? null,
      preparedBy: data.metadata?.preparedBy ?? null,
      objective: data.purpose?.objective ?? null,
      targetMarket: data.purpose?.targetMarket ?? null,
      targetAudience: data.purpose?.targetAudience ?? null,
      successMetrics: data.purpose?.successMetrics ?? null,
      userInteractions: data.userInteraction?.userInteractions ?? null,
      touchpoint: data.userInteraction?.touchpoint ?? null,
      userFeedback: data.userInteraction?.userFeedback ?? null,
      formFactor: data.designAndBranding?.formFactor ?? null,
      materials: data.designAndBranding?.materials ?? null,
      brandingAdjectives: data.designAndBranding?.brandingAdjectives ?? [],
      brandingTone: data.designAndBranding?.brandingTone ?? [],
      visualIdentity: data.designAndBranding?.visualIdentity ?? null,
      packagingPresentation: data.designAndBranding?.packagingPresentation ?? null,
      firmwareFunctions: data.softwareArchitecture?.firmwareFunctions ?? null,
      cloudApplication: data.softwareArchitecture?.cloudApplication ?? null,
      smartphoneApplication: data.softwareArchitecture?.smartphoneApplication ?? null,
      servicingUpdates: data.servicing?.servicingUpdates ?? null,
      targetReleaseDate: data.milestones?.targetReleaseDate ?? null,
      diagramsSchematics: data.additional?.diagramsSchematics ?? null,
      bom: data.additional?.bom ?? null,
      additionalResources: data.additional?.additionalResources ?? null,
      additionalVisualIdentity: data.additional?.additionalVisualIdentity ?? null,
    })
    await project.save()

    // Replace PRD sub-resources: delete existing, insert from YAML
    await PrdCompetitor.query().where('project_id', projectId).delete()
    if (data.competitors?.length) {
      for (let i = 0; i < data.competitors.length; i++) {
        const c = data.competitors[i]
        await PrdCompetitor.create({
          projectId,
          competitorName: c.competitorName,
          productNameOrLink: c.productNameOrLink ?? null,
          sequence: i + 1,
        })
      }
    }

    await PrdMilestone.query().where('project_id', projectId).delete()
    if (data.milestonesList?.length) {
      for (let i = 0; i < data.milestonesList.length; i++) {
        const m = data.milestonesList[i]
        await PrdMilestone.create({
          projectId,
          department: m.department,
          startDate: m.startDate ?? null,
          completionDate: m.completionDate ?? null,
          status: m.status,
          sequence: i + 1,
        })
      }
    }

    await PrdOpenQuestion.query().where('project_id', projectId).delete()
    if (data.openQuestions?.length) {
      for (let i = 0; i < data.openQuestions.length; i++) {
        const q = data.openQuestions[i]
        await PrdOpenQuestion.create({
          projectId,
          question: q.question,
          answer: q.answer ?? null,
          dateAnswered: q.dateAnswered ?? null,
          sequence: i + 1,
        })
      }
    }

    await PrdContact.query().where('project_id', projectId).delete()
    if (data.contacts?.length) {
      for (let i = 0; i < data.contacts.length; i++) {
        const c = data.contacts[i]
        await PrdContact.create({
          projectId,
          name: c.name,
          title: c.title ?? null,
          email: c.email ?? null,
          phone: c.phone ?? null,
          sequence: i + 1,
        })
      }
    }
  }

  async importUat(projectId: string, yamlContent: string): Promise<void> {
    const parsed = parse(yamlContent)
    if (!parsed) throw new Error('Invalid YAML content')

    const { _projectId: _, _generatedAt: __, ...rawData } = parsed
    const data = rawData as UatYamlData

    const project = await Project.findOrFail(projectId)

    // Update project UAT metadata fields
    project.merge({
      testingStartDate: data.metadata?.testingStartDate ?? null,
      testingStartTime: data.metadata?.testingStartTime ?? null,
      testingEndDate: data.metadata?.testingEndDate ?? null,
      testingEndTime: data.metadata?.testingEndTime ?? null,
      testerNames: data.metadata?.testerNames ?? [],
      generalComments: data.metadata?.generalComments ?? null,
    })
    await project.save()

    // Soft-delete existing features for this project
    await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() })

    if (!data.features?.length) return

    for (const featureData of data.features) {
      const feature = await Feature.create({
        projectId,
        name: featureData.name,
        description: featureData.description ?? null,
        module: featureData.module ?? null,
        priority: featureData.priority as 'critical' | 'high' | 'medium' | 'low',
        status: featureData.status as 'draft' | 'in_review' | 'approved' | 'deprecated',
        ecosystem: featureData.ecosystem ?? null,
        inScope: featureData.inScope ?? null,
        outOfScope: featureData.outOfScope ?? null,
        sequence: featureData.sequence,
        version: 1,
      })

      if (!featureData.uatFlows?.length) continue

      for (const flowData of featureData.uatFlows) {
        const flow = await UatFlow.create({
          featureId: feature.id,
          name: flowData.name,
          description: flowData.description ?? null,
          preconditions: flowData.preconditions ?? null,
          status: flowData.status as 'draft' | 'ready_for_test' | 'passed' | 'failed' | 'blocked',
          sequence: flowData.sequence,
          version: 1,
        })

        if (flowData.steps?.length) {
          for (const stepData of flowData.steps) {
            await Step.create({
              uatFlowId: flow.id,
              name: stepData.name,
              description: stepData.description ?? null,
              sequence: stepData.sequence,
              imageFileName: stepData.imageFileName ?? null,
            })
          }
        }
      }
    }
  }
}
