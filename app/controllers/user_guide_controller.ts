import type { HttpContext } from '@adonisjs/core/http'
import UserGuideService from '#services/user_guide_service'
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
}
