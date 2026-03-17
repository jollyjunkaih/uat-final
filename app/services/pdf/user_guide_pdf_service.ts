import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import { join } from 'node:path'
import Project from '#models/project'
import UserGuideService from '#services/user_guide_service'
import UserGuidePdfDocument from './user_guide_pdf_document.js'
import type { PdfGuideRole } from './user_guide_pdf_document.js'

export default class UserGuidePdfService {
  async generate(projectId: string): Promise<Buffer> {
    const project = await Project.findOrFail(projectId)
    const service = new UserGuideService()
    const roles = await service.findGroupedByRole(projectId)

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
