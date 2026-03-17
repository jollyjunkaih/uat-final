import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { readdir, mkdir } from 'node:fs/promises'
import Project from '#models/project'
import UserGuideService from '#services/user_guide_service'
import YamlWriterService from '#services/yaml_writer_service'
import UserGuidePdfDocument from './user_guide_pdf_document.js'
import type { PdfGuideRole } from './user_guide_pdf_document.js'

export default class UserGuidePdfService {
  /**
   * Resolve an imageFileName to an absolute file path.
   * Checks photos/docs/ first (for pre-extracted frames), then falls back
   * to extracting frame 1 from gifs/docs/ via sharp.
   */
  private async resolveImagePath(
    imageFileName: string,
    projectDir: string
  ): Promise<string | null> {
    const photosDir = join(projectDir, 'photos', 'docs')
    const gifsDir = join(projectDir, 'gifs', 'docs')

    // Check photos/docs/ for an existing static image
    if (existsSync(photosDir)) {
      const photoFiles = await readdir(photosDir)
      const match = photoFiles.find((f) => {
        const dotIdx = f.lastIndexOf('.')
        const base = dotIdx > 0 ? f.substring(0, dotIdx) : f
        return base === imageFileName
      })
      if (match) return join(photosDir, match)
    }

    // Fall back to extracting frame 1 from the GIF
    if (existsSync(gifsDir)) {
      const gifFiles = await readdir(gifsDir)
      const gifMatch = gifFiles.find((f) => {
        const dotIdx = f.lastIndexOf('.')
        const base = dotIdx > 0 ? f.substring(0, dotIdx) : f
        return base === imageFileName
      })
      if (gifMatch) {
        await mkdir(photosDir, { recursive: true })
        const framePath = join(photosDir, `${imageFileName}-frame-1.jpg`)
        if (!existsSync(framePath)) {
          const sharp = (await import('sharp')).default
          await sharp(join(gifsDir, gifMatch), { page: 0 })
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .jpeg({ quality: 95 })
            .toFile(framePath)
        }
        return framePath
      }
    }

    return null
  }

  async generate(projectId: string): Promise<Buffer> {
    const project = await Project.findOrFail(projectId)
    const service = new UserGuideService()
    const roles = await service.findGroupedByRole(projectId)

    const writer = new YamlWriterService()
    const projectDir = writer.getProjectDir(project.name, project.id)

    // Collect all unique imageFileNames to resolve in parallel
    const imageFileNames = new Set<string>()
    for (const role of roles) {
      for (const section of role.sections) {
        for (const step of section.steps) {
          if (step.imageFileName) imageFileNames.add(step.imageFileName)
        }
      }
    }

    const imagePathMap = new Map<string, string>()
    await Promise.all(
      [...imageFileNames].map(async (fileName) => {
        const resolved = await this.resolveImagePath(fileName, projectDir)
        if (resolved) imagePathMap.set(fileName, resolved)
      })
    )

    const pdfRoles: PdfGuideRole[] = roles.map((role) => ({
      roleName: role.roleName,
      roleSlug: role.roleSlug,
      roleDescription: role.roleDescription,
      roleSequence: role.roleSequence,
      sections: role.sections.map((s) => ({
        id: s.id,
        title: s.title,
        module: s.module,
        sequence: s.sequence,
        status: s.status,
        steps: (s.steps || []).map((step) => ({
          id: step.id,
          instruction: step.instruction,
          imageFileName: step.imageFileName,
          imagePath: step.imageFileName ? (imagePathMap.get(step.imageFileName) ?? null) : null,
          sequence: step.sequence,
        })),
      })),
    }))

    const logoPath = join(process.cwd(), 'inertia', 'public', 'byte of bread logo.png')

    const element = React.createElement(UserGuidePdfDocument, {
      projectName: project.name,
      roles: pdfRoles,
      logoPath,
    })

    return renderToBuffer(element as any)
  }
}
