import Version from '#models/version'
import Feature from '#models/feature'

export default class VersionService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = Version.query()

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }
    if (params.documentType) {
      query.where('document_type', String(params.documentType))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = Version.query()

    if (params.projectId) {
      query.where('project_id', String(params.projectId))
    }
    if (params.documentType) {
      query.where('document_type', String(params.documentType))
    }
    if (params.status) {
      query.where('status', String(params.status))
    }

    return query.paginate(page, limit)
  }

  async findById(id: string) {
    return Version.query().where('id', id).firstOrFail()
  }

  async create(data: Partial<Version>) {
    return Version.create(data)
  }

  async update(id: string, data: Partial<Version>) {
    const record = await this.findById(id)
    record.merge(data)
    await record.save()
    return record
  }

  async delete(id: string) {
    const record = await this.findById(id)
    await record.delete()
    return record
  }

  async createSnapshot(projectId: string, documentType: string, createdById: string) {
    const existingCount = await Version.query()
      .where('project_id', projectId)
      .where('document_type', documentType)
      .count('* as total')

    const nextVersionNumber = Number(existingCount[0].$extras.total) + 1

    const features = await Feature.query()
      .where('project_id', projectId)
      .whereNull('deleted_at')
      .preload('uatFlows', (uatFlowQuery) => {
        uatFlowQuery.whereNull('deleted_at').preload('steps', (stepQuery) => {
          stepQuery.whereNull('deleted_at').orderBy('sequence', 'asc')
            .preload('stepImages', (imgQuery) => {
              imgQuery.orderBy('sequence', 'asc')
            })
        }).orderBy('sequence', 'asc')
      })
      .orderBy('sequence', 'asc')

    const snapshot = features.map((feature) => feature.serialize())

    return Version.create({
      projectId,
      versionNumber: nextVersionNumber,
      documentType: documentType as 'prd' | 'uat',
      snapshot: { features: snapshot },
      status: 'draft',
      createdById,
    })
  }
}
