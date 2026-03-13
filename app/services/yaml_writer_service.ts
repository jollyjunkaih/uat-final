import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { stringify } from 'yaml'
import { slugify } from '#utils/slugify'

export interface PrdYamlData {
  metadata: {
    companyName: string | null
    productName: string | null
    projectManager: string | null
    contributors: string | null
    prdVersion: string | null
    locationsOfSale: string | null
    prdDate: string | null
    preparedBy: string | null
  }
  purpose: {
    objective: string | null
    targetMarket: string | null
    targetAudience: string | null
    successMetrics: string | null
  }
  userInteraction: {
    userInteractions: string | null
    touchpoint: string | null
    userFeedback: string | null
  }
  designAndBranding: {
    formFactor: string | null
    materials: string | null
    brandingAdjectives: string[]
    brandingTone: string[]
    visualIdentity: string | null
    packagingPresentation: string | null
  }
  softwareArchitecture: {
    firmwareFunctions: string | null
    cloudApplication: string | null
    smartphoneApplication: string | null
  }
  servicing: {
    servicingUpdates: string | null
  }
  milestones: {
    targetReleaseDate: string | null
  }
  additional: {
    diagramsSchematics: string | null
    bom: string | null
    additionalResources: string | null
    additionalVisualIdentity: string | null
  }
  competitors: Array<{ competitorName: string; productNameOrLink: string | null }>
  milestonesList: Array<{
    department: string
    startDate: string | null
    completionDate: string | null
    status: string
  }>
  openQuestions: Array<{
    question: string
    answer: string | null
    dateAnswered: string | null
  }>
  contacts: Array<{
    name: string
    title: string | null
    email: string | null
    phone: string | null
  }>
}

export interface UatYamlData {
  metadata: {
    testingStartDate: string | null
    testingStartTime: string | null
    testingEndDate: string | null
    testingEndTime: string | null
    testerNames: string[]
    generalComments: string | null
  }
  features: Array<{
    name: string
    description: string | null
    module: string | null
    priority: string
    status: string
    ecosystem: string | null
    inScope: string | null
    outOfScope: string | null
    sequence: number
    uatFlows: Array<{
      name: string
      description: string | null
      preconditions: string | null
      status: string
      sequence: number
      steps: Array<{
        name: string
        description: string | null
        sequence: number
        imageFileName: string | null
      }>
    }>
  }>
}

export default class YamlWriterService {
  private basePath: string

  constructor(basePath?: string) {
    this.basePath = basePath || join(process.cwd(), 'yaml')
  }

  getProjectDir(projectName: string, projectId: string): string {
    const slug = slugify(projectName) || 'unnamed'
    const shortId = projectId.substring(0, 8)
    return join(this.basePath, `${slug}-${shortId}`)
  }

  private ensureDir(dirPath: string): void {
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }
  }

  writePrd(projectName: string, projectId: string, data: PrdYamlData): void {
    const dir = this.getProjectDir(projectName, projectId)
    this.ensureDir(dir)

    const yamlContent = {
      _projectId: projectId,
      _generatedAt: new Date().toISOString(),
      ...data,
    }

    writeFileSync(join(dir, 'prd.yaml'), stringify(yamlContent, { lineWidth: 0 }), 'utf-8')
  }

  writeUat(projectName: string, projectId: string, data: UatYamlData): void {
    const dir = this.getProjectDir(projectName, projectId)
    this.ensureDir(dir)

    const yamlContent = {
      _projectId: projectId,
      _generatedAt: new Date().toISOString(),
      ...data,
    }

    writeFileSync(join(dir, 'uat.yaml'), stringify(yamlContent, { lineWidth: 0 }), 'utf-8')
  }

  removeProjectDirectory(projectName: string, projectId: string): void {
    const dir = this.getProjectDir(projectName, projectId)
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
}
