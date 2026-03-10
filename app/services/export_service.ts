import Version from '#models/version'
import Feature from '#models/feature'
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from 'docx'

interface PrdData {
  features: any[]
  version: number | null
  fromSnapshot: boolean
}

interface UatData {
  features: any[]
  version: number | null
  fromSnapshot: boolean
}

export default class ExportService {
  async exportPrdAsDocx(projectId: string, versionNumber?: number): Promise<Buffer> {
    const data = await this.getPrdData(projectId, versionNumber)
    const doc = this.buildPrdDocument(data)
    return Packer.toBuffer(doc) as Promise<Buffer>
  }

  async exportUatAsDocx(projectId: string, versionNumber?: number): Promise<Buffer> {
    const data = await this.getUatData(projectId, versionNumber)
    const doc = this.buildUatDocument(data)
    return Packer.toBuffer(doc) as Promise<Buffer>
  }

  async exportPrdAsPdf(projectId: string, versionNumber?: number): Promise<Buffer> {
    const data = await this.getPrdData(projectId, versionNumber)
    return this.buildSimplePdf('PRD', data)
  }

  async exportUatAsPdf(projectId: string, versionNumber?: number): Promise<Buffer> {
    const data = await this.getUatData(projectId, versionNumber)
    return this.buildSimplePdf('UAT', data)
  }

  private async getPrdData(projectId: string, versionNumber?: number): Promise<PrdData> {
    if (versionNumber) {
      const version = await Version.query()
        .where('project_id', projectId)
        .where('document_type', 'prd')
        .where('version_number', versionNumber)
        .firstOrFail()
      return {
        features: (version.snapshot as any)?.features || [],
        version: version.versionNumber,
        fromSnapshot: true,
      }
    }

    const features = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .orderBy('sequence', 'asc')

    return {
      features: features.map((f) => f.serialize()),
      version: null,
      fromSnapshot: false,
    }
  }

  private async getUatData(projectId: string, versionNumber?: number): Promise<UatData> {
    if (versionNumber) {
      const version = await Version.query()
        .where('project_id', projectId)
        .where('document_type', 'uat')
        .where('version_number', versionNumber)
        .firstOrFail()
      return {
        features: (version.snapshot as any)?.features || [],
        version: version.versionNumber,
        fromSnapshot: true,
      }
    }

    const features = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .preload('uatFlows', (q) => {
        q.whereNull('deleted_at')
          .preload('events', (eq) => {
            eq.whereNull('deleted_at').orderBy('sequence', 'asc')
          })
          .orderBy('sequence', 'asc')
      })
      .orderBy('sequence', 'asc')

    return {
      features: features.map((f) => f.serialize()),
      version: null,
      fromSnapshot: false,
    }
  }

  private buildPrdDocument(data: PrdData): Document {
    const sections: Paragraph[] = []

    sections.push(
      new Paragraph({
        text: 'Product Requirements Document',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: data.version ? `Version ${data.version}` : 'Current Draft',
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: '' })
    )

    const features = data.features || []

    const moduleMap = new Map<string, any[]>()
    for (const f of features) {
      const mod = f.module || 'Unassigned'
      if (!moduleMap.has(mod)) moduleMap.set(mod, [])
      moduleMap.get(mod)!.push(f)
    }

    for (const [module, moduleFeatures] of moduleMap) {
      sections.push(
        new Paragraph({
          text: `Module: ${module}`,
          heading: HeadingLevel.HEADING_1,
        })
      )

      for (const feature of moduleFeatures) {
        sections.push(
          new Paragraph({
            text: feature.name,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Priority: ', bold: true }),
              new TextRun(feature.priority || 'N/A'),
              new TextRun({ text: '  |  Status: ', bold: true }),
              new TextRun(feature.status || 'N/A'),
            ],
          })
        )

        if (feature.description) {
          sections.push(new Paragraph({ text: feature.description }))
        }

        sections.push(new Paragraph({ text: '' }))
      }
    }

    return new Document({ sections: [{ children: sections }] })
  }

  private buildUatDocument(data: UatData): Document {
    const sections: Paragraph[] = []

    sections.push(
      new Paragraph({
        text: 'User Acceptance Test Specification',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({
        text: data.version ? `Version ${data.version}` : 'Current Draft',
        alignment: AlignmentType.CENTER,
      }),
      new Paragraph({ text: '' })
    )

    const features = data.features || []

    for (const feature of features) {
      sections.push(
        new Paragraph({
          text: `Feature: ${feature.name}`,
          heading: HeadingLevel.HEADING_1,
        })
      )

      const flows = feature.uatFlows || feature.uat_flows || []

      for (const flow of flows) {
        sections.push(
          new Paragraph({
            text: flow.name,
            heading: HeadingLevel.HEADING_2,
          })
        )

        if (flow.description) {
          sections.push(new Paragraph({ text: flow.description }))
        }

        if (flow.preconditions) {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Preconditions: ', bold: true }),
                new TextRun(flow.preconditions),
              ],
            })
          )
        }

        const events = flow.events || []
        for (let i = 0; i < events.length; i++) {
          const event = events[i]
          const triggerType = event.triggerType || event.trigger_type || 'N/A'
          const expectedOutcome = event.expectedOutcome || event.expected_outcome || 'N/A'
          const testStatus = event.testStatus || event.test_status || 'no_tests'

          sections.push(
            new Paragraph({
              children: [new TextRun({ text: `Step ${i + 1}: ${event.name}`, bold: true })],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: 'Model: ', bold: true }),
                new TextRun(event.model || 'N/A'),
                new TextRun({ text: '  |  Trigger: ', bold: true }),
                new TextRun(triggerType),
                new TextRun({ text: '  |  Test Status: ', bold: true }),
                new TextRun(testStatus),
              ],
            })
          )

          if (event.condition) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Condition: ', bold: true }),
                  new TextRun(event.condition),
                ],
              })
            )
          }

          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: 'Expected Outcome: ', bold: true }),
                new TextRun(expectedOutcome),
              ],
            })
          )

          if (event.notes) {
            sections.push(
              new Paragraph({
                children: [
                  new TextRun({ text: 'Notes: ', bold: true }),
                  new TextRun(event.notes),
                ],
              })
            )
          }

          sections.push(new Paragraph({ text: '' }))
        }
      }
    }

    return new Document({ sections: [{ children: sections }] })
  }

  private buildSimplePdf(type: string, data: PrdData | UatData): Buffer {
    const lines: string[] = []
    const title =
      type === 'PRD' ? 'Product Requirements Document' : 'User Acceptance Test Specification'
    const versionLabel = data.version ? `Version ${data.version}` : 'Current Draft'

    lines.push(title)
    lines.push(versionLabel)
    lines.push('='.repeat(60))
    lines.push('')

    const features = data.features || []

    if (type === 'PRD') {
      const moduleMap = new Map<string, any[]>()
      for (const f of features) {
        const mod = f.module || 'Unassigned'
        if (!moduleMap.has(mod)) moduleMap.set(mod, [])
        moduleMap.get(mod)!.push(f)
      }
      for (const [module, moduleFeatures] of moduleMap) {
        lines.push(`Module: ${module}`)
        lines.push('-'.repeat(40))
        for (const feature of moduleFeatures) {
          lines.push(`  ${feature.name}`)
          lines.push(`    Priority: ${feature.priority || 'N/A'}  |  Status: ${feature.status || 'N/A'}`)
          if (feature.description) {
            lines.push(`    ${feature.description}`)
          }
          lines.push('')
        }
      }
    } else {
      for (const feature of features) {
        lines.push(`Feature: ${feature.name}`)
        lines.push('-'.repeat(40))
        const flows = feature.uatFlows || feature.uat_flows || []
        for (const flow of flows) {
          lines.push(`  Flow: ${flow.name}`)
          if (flow.description) lines.push(`    ${flow.description}`)
          if (flow.preconditions) lines.push(`    Preconditions: ${flow.preconditions}`)
          const events = flow.events || []
          for (let i = 0; i < events.length; i++) {
            const event = events[i]
            const triggerType = event.triggerType || event.trigger_type || 'N/A'
            const expectedOutcome = event.expectedOutcome || event.expected_outcome || 'N/A'
            lines.push(`    Step ${i + 1}: ${event.name}`)
            lines.push(`      Model: ${event.model || 'N/A'}  |  Trigger: ${triggerType}`)
            if (event.condition) lines.push(`      Condition: ${event.condition}`)
            lines.push(`      Expected: ${expectedOutcome}`)
          }
          lines.push('')
        }
      }
    }

    return Buffer.from(lines.join('\n'), 'utf-8')
  }
}
