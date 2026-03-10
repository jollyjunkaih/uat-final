import AuditLog from '#models/audit_log'

export default class AuditLogService {
  async findAll(params: Record<string, unknown> = {}) {
    const query = AuditLog.query()

    if (params.userId) {
      query.where('user_id', String(params.userId))
    }
    if (params.action) {
      query.where('action', String(params.action))
    }
    if (params.entityType) {
      query.where('entity_type', String(params.entityType))
    }
    if (params.entityId) {
      query.where('entity_id', String(params.entityId))
    }

    query.orderBy('created_at', 'desc')

    return query
  }

  async findPaginated(params: Record<string, unknown> = {}, page = 1, limit = 20) {
    const query = AuditLog.query()

    if (params.userId) {
      query.where('user_id', String(params.userId))
    }
    if (params.action) {
      query.where('action', String(params.action))
    }
    if (params.entityType) {
      query.where('entity_type', String(params.entityType))
    }
    if (params.entityId) {
      query.where('entity_id', String(params.entityId))
    }

    query.orderBy('created_at', 'desc')

    return query.paginate(page, limit)
  }

  async create(data: Partial<AuditLog>) {
    return AuditLog.create(data)
  }

  async log(
    userId: string | null,
    action: string,
    entityType: string,
    entityId: string | null,
    details: Record<string, unknown>,
    ipAddress?: string,
    userAgent?: string
  ) {
    return AuditLog.create({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    })
  }
}
