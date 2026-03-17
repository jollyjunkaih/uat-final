import type { HttpContext } from '@adonisjs/core/http'
import { join } from 'node:path'
import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import UserGuideService from '#services/user_guide_service'
import UserGuideStep from '#models/user_guide_step'
import UserGuideSection from '#models/user_guide_section'
import Project from '#models/project'
import YamlWriterService from '#services/yaml_writer_service'
import UserGuideSectionTransformer from '#transformers/user_guide_section_transformer'
import UserGuidePdfService from '#services/pdf/user_guide_pdf_service'
import {
  createUserGuideSectionValidator,
  updateUserGuideSectionValidator,
} from '#validators/user_guide_validator'

export default class UserGuideController {
  /**
   * List all sections for a project (flat list)
   */
  async index(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const roleSlug = ctx.request.input('roleSlug')
    const service = new UserGuideService()
    const params: Record<string, unknown> = {}
    if (projectId) params.projectId = projectId
    if (roleSlug) params.roleSlug = roleSlug
    const sections = await service.findAll(params)
    const data = await ctx.serialize(UserGuideSectionTransformer.transform(sections))
    return ctx.response.json(data)
  }

  /**
   * Get sections grouped by role for a project
   */
  async grouped(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const service = new UserGuideService()
    const roles = await service.findGroupedByRole(projectId)

    const transformed = await Promise.all(
      roles.map(async (role) => {
        const serialized = await ctx.serialize(UserGuideSectionTransformer.transform(role.sections))
        return {
          roleName: role.roleName,
          roleSlug: role.roleSlug,
          roleDescription: role.roleDescription,
          roleSequence: role.roleSequence,
          sections: serialized.data,
        }
      })
    )

    return ctx.response.json({ data: transformed })
  }

  /**
   * Show a single section
   */
  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UserGuideService()
    const section = await service.findById(id)
    const data = await ctx.serialize(UserGuideSectionTransformer.transform(section))
    return ctx.response.json(data)
  }

  /**
   * Create a new section
   */
  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createUserGuideSectionValidator)
    const service = new UserGuideService()
    const section = await service.create(payload)
    const data = await ctx.serialize(UserGuideSectionTransformer.transform(section))
    return ctx.response.status(201).json(data)
  }

  /**
   * Update an existing section
   */
  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateUserGuideSectionValidator)
    const service = new UserGuideService()
    const section = await service.update(id, payload)
    const data = await ctx.serialize(UserGuideSectionTransformer.transform(section))
    return ctx.response.json(data)
  }

  /**
   * Soft-delete a section
   */
  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new UserGuideService()
    await service.delete(id)
    return ctx.response.json({ message: 'Section deleted' })
  }

  /**
   * Generate PDF for user guide
   */
  async pdf(ctx: HttpContext) {
    const projectId = ctx.params.projectId
    const service = new UserGuidePdfService()
    const buffer = await service.generate(projectId)
    ctx.response.header('Content-Type', 'application/pdf')
    ctx.response.header('Content-Disposition', 'inline; filename="user-guide.pdf"')
    return ctx.response.send(buffer)
  }

  /**
   * Serve the image file for a user guide step (GIF or static image)
   */
  async stepImage(ctx: HttpContext) {
    const stepId = ctx.params.stepId
    const step = await UserGuideStep.findOrFail(stepId)

    if (!step.imageFileName) {
      return ctx.response.notFound({ error: 'No image for this step' })
    }

    const section = await UserGuideSection.findOrFail(step.sectionId)
    const project = await Project.findOrFail(section.projectId)

    const writer = new YamlWriterService()
    const projectDir = writer.getProjectDir(project.name, project.id)

    // Check gifs/docs/ first (original GIFs), then photos/docs/ (extracted frames)
    for (const subDir of ['gifs/docs', 'photos/docs']) {
      const dir = join(projectDir, subDir)
      if (!existsSync(dir)) continue
      const files = await readdir(dir)
      const match = files.find((f) => {
        const dotIdx = f.lastIndexOf('.')
        const base = dotIdx > 0 ? f.substring(0, dotIdx) : f
        return base === step.imageFileName
      })
      if (match) {
        return ctx.response.download(join(dir, match))
      }
    }

    return ctx.response.notFound({ error: 'Image file not found on disk' })
  }
}
