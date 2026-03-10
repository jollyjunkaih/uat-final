import type { HttpContext } from '@adonisjs/core/http'
import TestCaseService from '#services/test_case_service'
import TestCaseTransformer from '#transformers/test_case_transformer'
import {
  createTestCaseValidator,
  updateTestCaseValidator,
  reorderTestCasesValidator,
} from '#validators/test_case_validator'
import YamlSyncService from '#services/yaml_sync_service'

export default class TestCasesController {
  async index(ctx: HttpContext) {
    const page = ctx.request.input('page', 1)
    const limit = ctx.request.input('limit', 20)
    const uatFlowId = ctx.request.input('uatFlowId')
    const service = new TestCaseService()
    const params: Record<string, unknown> = {}
    if (uatFlowId) params.uatFlowId = uatFlowId
    const paginated = await service.findPaginated(params, page, limit)
    const data = paginated.all()
    const meta = paginated.getMeta()
    const response = await ctx.serialize(TestCaseTransformer.paginate(data, meta))
    return ctx.response.json(response)
  }

  async show(ctx: HttpContext) {
    const id = ctx.params.id
    const service = new TestCaseService()
    const testCase = await service.findById(id)
    return ctx.response.json({ data: TestCaseTransformer.transform(testCase) })
  }

  async store(ctx: HttpContext) {
    const data = await ctx.request.validateUsing(createTestCaseValidator)
    const service = new TestCaseService()
    const testCase = await service.create(data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromTestCase(testCase.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: TestCaseTransformer.transform(testCase) })
  }

  async update(ctx: HttpContext) {
    const id = ctx.params.id
    const data = await ctx.request.validateUsing(updateTestCaseValidator)
    const service = new TestCaseService()
    const testCase = await service.update(id, data)
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromTestCase(testCase.id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: TestCaseTransformer.transform(testCase) })
  }

  async destroy(ctx: HttpContext) {
    const id = ctx.params.id
    const yamlSync = new YamlSyncService()
    const projectId = await yamlSync.getProjectIdFromTestCase(id)
    const service = new TestCaseService()
    await service.delete(id)
    yamlSync.syncUat(projectId).catch(() => {})
    return ctx.response.json({ data: { success: true } })
  }

  async reorder(ctx: HttpContext) {
    const { ids } = await ctx.request.validateUsing(reorderTestCasesValidator)
    const service = new TestCaseService()
    await service.reorder(ids)
    if (ids.length > 0) {
      const yamlSync = new YamlSyncService()
      const projectId = await yamlSync.getProjectIdFromTestCase(ids[0])
      yamlSync.syncUat(projectId).catch(() => {})
    }
    return ctx.response.json({ data: { success: true } })
  }
}
