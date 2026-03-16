import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { join, parse as parsePath } from 'node:path'
import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import Project from '#models/project'
import Feature from '#models/feature'
import UatPdfDocument from './uat_pdf_document.js'
import type { PdfFeature } from './uat_pdf_document.js'
import YamlWriterService from '#services/yaml_writer_service'

export default class UatPdfService {
  async generate(projectId: string): Promise<Buffer> {
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

    const writer = new YamlWriterService()
    const projectDir = writer.getProjectDir(project.name, projectId)
    const photosDir = join(projectDir, 'photos')

    const pdfFeatures: PdfFeature[] = await Promise.all(
      features.map(async (feature) => ({
        id: feature.id,
        name: feature.name,
        uatFlows: await Promise.all(
          (feature.uatFlows || []).map(async (flow) => ({
            id: flow.id,
            name: flow.name,
            description: flow.description,
            preconditions: flow.preconditions,
            status: flow.status,
            sequence: flow.sequence,
            steps: await Promise.all(
              (flow.steps || []).map(async (step) => ({
                id: step.id,
                name: step.name,
                description: step.description,
                sequence: step.sequence,
                imagePaths: await this.resolveStepImagePaths(photosDir, step.stepImages || []),
              }))
            ),
          }))
        ),
      }))
    )

    const logoPath = join(process.cwd(), 'inertia', 'public', 'byte of bread logo.png')

    const element = React.createElement(UatPdfDocument, {
      projectName: project.name,
      testingStartDate: project.testingStartDate,
      testingStartTime: project.testingStartTime,
      testingEndDate: project.testingEndDate,
      testingEndTime: project.testingEndTime,
      testerNames: Array.isArray(project.testerNames)
        ? project.testerNames.join(', ')
        : project.testerNames,
      generalComments: project.generalComments,
      features: pdfFeatures,
      logoPath,
    })

    return renderToBuffer(element as any)
  }

  private async resolveStepImagePaths(
    photosDir: string,
    stepImages: { fileName: string }[]
  ): Promise<string[]> {
    if (!existsSync(photosDir) || stepImages.length === 0) return []
    const paths: string[] = []
    for (const img of stepImages) {
      const resolved = await this.resolveImagePath(photosDir, img.fileName)
      if (resolved) paths.push(resolved)
    }
    return paths
  }

  private async resolveImagePath(
    photosDir: string,
    imageFileName: string
  ): Promise<string | null> {
    if (!existsSync(photosDir)) return null
    try {
      const files = await readdir(photosDir)
      const match = files.find((f) => parsePath(f).name === imageFileName)
      return match ? join(photosDir, match) : null
    } catch {
      return null
    }
  }
}
