import type { HttpContext } from '@adonisjs/core/http'
import Signator from '#models/signator'
import { createSignatorValidator, updateSignatorValidator } from '#validators/signator_validator'

export default class SignatorController {
  async index(ctx: HttpContext) {
    const projectId = ctx.request.input('projectId')
    const data = await Signator.query()
      .where('project_id', projectId)
      .orderBy('sequence', 'asc')
    return ctx.response.json({ data })
  }

  async store(ctx: HttpContext) {
    const payload = await ctx.request.validateUsing(createSignatorValidator)
    const record = await Signator.create(payload)
    return ctx.response.json({ data: record })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const payload = await ctx.request.validateUsing(updateSignatorValidator)
    const record = await Signator.findOrFail(id)
    record.merge(payload)
    await record.save()
    return ctx.response.json({ data: record })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const record = await Signator.findOrFail(id)
    await record.delete()
    return ctx.response.json({ data: { success: true } })
  }
}
