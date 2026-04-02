import { parse } from 'yaml'
import { DateTime } from 'luxon'
import Project from '#models/project'
import Feature from '#models/feature'
import UatFlow from '#models/uat_flow'
import Step from '#models/step'
import PrdCompetitor from '#models/prd_competitor'
import PrdMilestone from '#models/prd_milestone'
import PrdOpenQuestion from '#models/prd_open_question'
import PrdContact from '#models/prd_contact'
import StepImage from '#models/step_image'
import UserGuideService from '#services/user_guide_service'
import type { PrdYamlData, UatYamlData, FeaturesYamlData } from '#services/yaml_writer_service'

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
        if (!c.competitorName) continue
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
        if (!m.department) continue
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
        if (!q.question) continue
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
        if (!c.name) continue
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
            const step = await Step.create({
              uatFlowId: flow.id,
              name: stepData.name,
              description: stepData.description ?? null,
              sequence: stepData.sequence,
              gifFileName: (stepData as any).gifFileName ?? null,
            })

            // Support new imageFileNames array format
            const imageFileNames: string[] = (stepData as any).imageFileNames ?? []

            // Backward compatibility: old imageFileName (singular) format
            if (imageFileNames.length === 0 && (stepData as any).imageFileName) {
              imageFileNames.push((stepData as any).imageFileName)
            }

            for (let imgIdx = 0; imgIdx < imageFileNames.length; imgIdx++) {
              await StepImage.create({
                stepId: step.id,
                fileName: imageFileNames[imgIdx],
                sequence: imgIdx + 1,
                source: 'upload',
              })
            }
          }
        }
      }
    }
  }

  async importFeatures(projectId: string, yamlContent: string): Promise<void> {
    const parsed = parse(yamlContent)
    if (!parsed) throw new Error('Invalid YAML content')

    const { _projectId: _, _generatedAt: __, ...rawData } = parsed
    const data = rawData as FeaturesYamlData

    if (!data.features?.length) return

    await Project.findOrFail(projectId)

    const existingFeatures = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')

    const existingByName = new Map(existingFeatures.map((f) => [f.name, f]))
    const incomingNames = new Set(data.features.map((f) => f.name))

    // Soft-delete features no longer present in features.yaml
    for (const existing of existingFeatures) {
      if (!incomingNames.has(existing.name)) {
        existing.deletedAt = DateTime.now()
        await existing.save()
      }
    }

    for (const featureData of data.features) {
      let featureId: string
      const existing = existingByName.get(featureData.name)

      if (existing) {
        existing.merge({
          description: featureData.description ?? null,
          module: featureData.module ?? null,
          priority: featureData.priority as 'critical' | 'high' | 'medium' | 'low',
          status: featureData.status as 'draft' | 'in_review' | 'approved' | 'deprecated',
          ecosystem: featureData.ecosystem ?? null,
          inScope: featureData.inScope ?? null,
          outOfScope: featureData.outOfScope ?? null,
          sequence: featureData.sequence,
        })
        await existing.save()
        featureId = existing.id
      } else {
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
        featureId = feature.id
      }

      if (!featureData.uatFlows?.length) continue

      const existingFlows = await UatFlow.query()
        .where('feature_id', featureId)
        .whereNull('deleted_at')

      const existingFlowsByName = new Map(existingFlows.map((f) => [f.name, f]))
      const incomingFlowNames = new Set(featureData.uatFlows.map((f) => f.name))

      // Soft-delete flows no longer present in features.yaml
      for (const existingFlow of existingFlows) {
        if (!incomingFlowNames.has(existingFlow.name)) {
          existingFlow.deletedAt = DateTime.now()
          await existingFlow.save()
        }
      }

      for (const flowData of featureData.uatFlows) {
        const existingFlow = existingFlowsByName.get(flowData.name)
        if (existingFlow) {
          existingFlow.merge({
            description: flowData.description ?? null,
            preconditions: flowData.preconditions ?? null,
            status: flowData.status as 'draft' | 'ready_for_test' | 'passed' | 'failed' | 'blocked',
            sequence: flowData.sequence,
          })
          await existingFlow.save()
        } else {
          await UatFlow.create({
            featureId,
            name: flowData.name,
            description: flowData.description ?? null,
            preconditions: flowData.preconditions ?? null,
            status: flowData.status as 'draft' | 'ready_for_test' | 'passed' | 'failed' | 'blocked',
            sequence: flowData.sequence,
            version: 1,
          })
        }
      }
    }
  }

  async importUserGuide(projectId: string, yamlContent: string): Promise<void> {
    const parsed = parse(yamlContent)
    if (!parsed) throw new Error('Invalid YAML content')

    await Project.findOrFail(projectId)

    const roles = parsed.roles
    if (!roles?.length) return

    // Transform YAML roles to match the new steps-based schema
    const transformed = roles.map((role: any) => ({
      name: role.name,
      slug: role.slug,
      description: role.description || null,
      sequence: role.sequence,
      sections: (role.sections || []).map((section: any) => ({
        title: section.title,
        slug: section.slug,
        module: section.module || null,
        sequence: section.sequence,
        steps: this.extractSteps(section),
      })),
    }))

    const service = new UserGuideService()
    await service.importFromYaml(projectId, { roles: transformed })
  }

  /**
   * Extract steps from a YAML section.
   * Supports new `steps` array format and legacy `content` string (split by paragraphs).
   */
  private extractSteps(
    section: any
  ): Array<{ instruction: string; imageFileName?: string | null; sequence: number }> {
    // New format: steps array
    if (Array.isArray(section.steps)) {
      return section.steps.map((step: any, idx: number) => ({
        instruction: step.instruction,
        imageFileName: step.imageFileName || null,
        sequence: step.sequence ?? idx,
      }))
    }

    // Legacy format: content string — split by double newlines into steps
    if (typeof section.content === 'string' && section.content.trim()) {
      const paragraphs = section.content
        .split(/\n\s*\n/)
        .map((p: string) => p.trim())
        .filter(Boolean)
      return paragraphs.map((text: string, idx: number) => ({
        instruction: text,
        imageFileName: null,
        sequence: idx,
      }))
    }

    return []
  }
}
