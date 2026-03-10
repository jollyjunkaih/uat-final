import type { HttpContext } from '@adonisjs/core/http'
import PrdCompetitor from '#models/prd_competitor'
import PrdMilestone from '#models/prd_milestone'
import PrdOpenQuestion from '#models/prd_open_question'
import PrdContact from '#models/prd_contact'
import {
  createCompetitorValidator,
  updateCompetitorValidator,
  createMilestoneValidator,
  updateMilestoneValidator,
  createOpenQuestionValidator,
  updateOpenQuestionValidator,
  createContactValidator,
  updateContactValidator,
} from '#validators/prd_validator'

export default class PrdController {
  // --- Competitors ---
  async competitorsIndex(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const data = await PrdCompetitor.query()
      .where('project_id', projectId)
      .orderBy('sequence', 'asc')
    return ctx.response.json({ data })
  }

  async competitorsStore(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createCompetitorValidator)
    const record = await PrdCompetitor.create(payload)
    return ctx.response.json({ data: record })
  }

  async competitorsUpdate(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateCompetitorValidator)
    const record = await PrdCompetitor.findOrFail(id)
    record.merge(payload)
    await record.save()
    return ctx.response.json({ data: record })
  }

  async competitorsDestroy(ctx: HttpContext) {
    const id = ctx.params.id
    const record = await PrdCompetitor.findOrFail(id)
    await record.delete()
    return ctx.response.json({ data: { success: true } })
  }

  // --- Milestones ---
  async milestonesIndex(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const data = await PrdMilestone.query()
      .where('project_id', projectId)
      .orderBy('sequence', 'asc')
    return ctx.response.json({ data })
  }

  async milestonesStore(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createMilestoneValidator)
    const record = await PrdMilestone.create(payload)
    return ctx.response.json({ data: record })
  }

  async milestonesUpdate(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateMilestoneValidator)
    const record = await PrdMilestone.findOrFail(id)
    record.merge(payload)
    await record.save()
    return ctx.response.json({ data: record })
  }

  async milestonesDestroy(ctx: HttpContext) {
    const id = ctx.params.id
    const record = await PrdMilestone.findOrFail(id)
    await record.delete()
    return ctx.response.json({ data: { success: true } })
  }

  // --- Open Questions ---
  async openQuestionsIndex(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const data = await PrdOpenQuestion.query()
      .where('project_id', projectId)
      .orderBy('sequence', 'asc')
    return ctx.response.json({ data })
  }

  async openQuestionsStore(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createOpenQuestionValidator)
    const record = await PrdOpenQuestion.create(payload)
    return ctx.response.json({ data: record })
  }

  async openQuestionsUpdate(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateOpenQuestionValidator)
    const record = await PrdOpenQuestion.findOrFail(id)
    record.merge(payload)
    await record.save()
    return ctx.response.json({ data: record })
  }

  async openQuestionsDestroy(ctx: HttpContext) {
    const id = ctx.params.id
    const record = await PrdOpenQuestion.findOrFail(id)
    await record.delete()
    return ctx.response.json({ data: { success: true } })
  }

  // --- Contacts ---
  async contactsIndex(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const data = await PrdContact.query()
      .where('project_id', projectId)
      .orderBy('sequence', 'asc')
    return ctx.response.json({ data })
  }

  async contactsStore(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createContactValidator)
    const record = await PrdContact.create(payload)
    return ctx.response.json({ data: record })
  }

  async contactsUpdate(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateContactValidator)
    const record = await PrdContact.findOrFail(id)
    record.merge(payload)
    await record.save()
    return ctx.response.json({ data: record })
  }

  async contactsDestroy(ctx: HttpContext) {
    const id = ctx.params.id
    const record = await PrdContact.findOrFail(id)
    await record.delete()
    return ctx.response.json({ data: { success: true } })
  }
}
