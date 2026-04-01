import Project from '#models/project'
import Feature from '#models/feature'
import UatFlow from '#models/uat_flow'
import Step from '#models/step'
import PrdCompetitor from '#models/prd_competitor'
import PrdMilestone from '#models/prd_milestone'
import PrdOpenQuestion from '#models/prd_open_question'
import PrdContact from '#models/prd_contact'
import YamlWriterService from '#services/yaml_writer_service'
import type { PrdYamlData, UatYamlData, FeaturesYamlData, PrdFeatureYamlData } from '#services/yaml_writer_service'

export default class YamlSyncService {
  private writer: YamlWriterService

  constructor() {
    this.writer = new YamlWriterService()
  }

  private async loadFeaturesWithFlows(projectId: string): Promise<PrdFeatureYamlData[]> {
    const features = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .preload('uatFlows', (q) => q.whereNull('deleted_at').orderBy('sequence', 'asc'))
      .orderBy('sequence', 'asc')

    return features.map((feature) => ({
      name: feature.name,
      description: feature.description,
      module: feature.module,
      priority: feature.priority,
      status: feature.status,
      ecosystem: feature.ecosystem,
      inScope: feature.inScope,
      outOfScope: feature.outOfScope,
      sequence: feature.sequence,
      uatFlows: feature.uatFlows.map((flow) => ({
        name: flow.name,
        description: flow.description,
        preconditions: flow.preconditions,
        status: flow.status,
        sequence: flow.sequence,
      })),
    }))
  }

  async syncPrd(projectId: string): Promise<void> {
    const project = await Project.findOrFail(projectId)

    const [competitors, milestones, openQuestions, contacts, features] = await Promise.all([
      PrdCompetitor.query().where('project_id', projectId).orderBy('sequence', 'asc'),
      PrdMilestone.query().where('project_id', projectId).orderBy('sequence', 'asc'),
      PrdOpenQuestion.query().where('project_id', projectId).orderBy('sequence', 'asc'),
      PrdContact.query().where('project_id', projectId).orderBy('sequence', 'asc'),
      this.loadFeaturesWithFlows(projectId),
    ])

    const data: PrdYamlData = {
      metadata: {
        companyName: project.companyName,
        productName: project.productName,
        projectManager: project.projectManager,
        contributors: project.contributors,
        prdVersion: project.prdVersion,
        locationsOfSale: project.locationsOfSale,
        prdDate: project.prdDate,
        preparedBy: project.preparedBy,
      },
      purpose: {
        objective: project.objective,
        targetMarket: project.targetMarket,
        targetAudience: project.targetAudience,
        successMetrics: project.successMetrics,
      },
      userInteraction: {
        userInteractions: project.userInteractions,
        touchpoint: project.touchpoint,
        userFeedback: project.userFeedback,
      },
      designAndBranding: {
        formFactor: project.formFactor,
        materials: project.materials,
        brandingAdjectives: project.brandingAdjectives || [],
        brandingTone: project.brandingTone || [],
        visualIdentity: project.visualIdentity,
        packagingPresentation: project.packagingPresentation,
      },
      softwareArchitecture: {
        firmwareFunctions: project.firmwareFunctions,
        cloudApplication: project.cloudApplication,
        smartphoneApplication: project.smartphoneApplication,
      },
      servicing: {
        servicingUpdates: project.servicingUpdates,
      },
      milestones: {
        targetReleaseDate: project.targetReleaseDate,
      },
      additional: {
        diagramsSchematics: project.diagramsSchematics,
        bom: project.bom,
        additionalResources: project.additionalResources,
        additionalVisualIdentity: project.additionalVisualIdentity,
      },
      competitors: competitors.map((c) => ({
        competitorName: c.competitorName,
        productNameOrLink: c.productNameOrLink,
      })),
      milestonesList: milestones.map((m) => ({
        department: m.department,
        startDate: m.startDate,
        completionDate: m.completionDate,
        status: m.status,
      })),
      openQuestions: openQuestions.map((q) => ({
        question: q.question,
        answer: q.answer,
        dateAnswered: q.dateAnswered,
      })),
      contacts: contacts.map((c) => ({
        name: c.name,
        title: c.title,
        email: c.email,
        phone: c.phone,
      })),
      features,
    }

    this.writer.writePrd(project.name, project.id, data)
  }

  async syncFeatures(projectId: string): Promise<void> {
    const project = await Project.findOrFail(projectId)
    const features = await this.loadFeaturesWithFlows(projectId)
    const data: FeaturesYamlData = { features }
    this.writer.writeFeatures(project.name, project.id, data)
  }

  async syncUat(projectId: string): Promise<void> {
    const project = await Project.findOrFail(projectId)

    const features = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .preload('uatFlows', (uatFlowQuery) => {
        uatFlowQuery
          .whereNull('deleted_at')
          .preload('steps', (stepQuery) => {
            stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
              .preload('stepImages', (imgQuery) => {
                imgQuery.orderBy('sequence', 'asc')
              })
          })
          .orderBy('sequence', 'asc')
      })
      .orderBy('sequence', 'asc')

    const data: UatYamlData = {
      metadata: {
        testingStartDate: project.testingStartDate,
        testingStartTime: project.testingStartTime,
        testingEndDate: project.testingEndDate,
        testingEndTime: project.testingEndTime,
        testerNames: project.testerNames || [],
        generalComments: project.generalComments,
      },
      features: features.map((feature) => ({
        name: feature.name,
        description: feature.description,
        module: feature.module,
        priority: feature.priority,
        status: feature.status,
        ecosystem: feature.ecosystem,
        inScope: feature.inScope,
        outOfScope: feature.outOfScope,
        sequence: feature.sequence,
        uatFlows: feature.uatFlows.map((flow) => ({
          name: flow.name,
          description: flow.description,
          preconditions: flow.preconditions,
          status: flow.status,
          sequence: flow.sequence,
          steps: flow.steps.map((step) => ({
            name: step.name,
            description: step.description,
            sequence: step.sequence,
            gifFileName: step.gifFileName,
            imageFileNames: (step.stepImages || []).map((img) => img.fileName),
          })),
        })),
      })),
    }

    this.writer.writeUat(project.name, project.id, data)
  }

  async syncAll(projectId: string): Promise<void> {
    await Promise.all([this.syncPrd(projectId), this.syncUat(projectId), this.syncFeatures(projectId)])
  }

  async removeProject(projectId: string): Promise<void> {
    const project = await Project.find(projectId)
    if (project) {
      this.writer.removeProjectDirectory(project.name, project.id)
    }
  }

  async getProjectIdFromFeature(featureId: string): Promise<string> {
    const feature = await Feature.findOrFail(featureId)
    return feature.projectId
  }

  async getProjectIdFromUatFlow(uatFlowId: string): Promise<string> {
    const flow = await UatFlow.findOrFail(uatFlowId)
    const feature = await Feature.findOrFail(flow.featureId)
    return feature.projectId
  }

  async getProjectIdFromStep(stepId: string): Promise<string> {
    const step = await Step.findOrFail(stepId)
    return this.getProjectIdFromUatFlow(step.uatFlowId)
  }

  /** @deprecated Use getProjectIdFromStep instead */
  async getProjectIdFromEvent(eventId: string): Promise<string> {
    const { default: Event } = await import('#models/event')
    const event = await Event.findOrFail(eventId)
    return this.getProjectIdFromUatFlow(event.uatFlowId)
  }

  /** @deprecated Use getProjectIdFromStep instead */
  async getProjectIdFromTestCase(testCaseId: string): Promise<string> {
    const { default: TestCase } = await import('#models/test_case')
    const testCase = await TestCase.findOrFail(testCaseId)
    return this.getProjectIdFromUatFlow(testCase.uatFlowId)
  }
}
