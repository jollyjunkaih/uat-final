import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

type Role = 'admin' | 'product_owner' | 'business_analyst' | 'qa_lead' | 'qa_engineer' | 'viewer'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { roles: Role[] }) {
    const user = ctx.auth.user!
    if (!options.roles.includes(user.role)) {
      return ctx.response.forbidden({ error: 'You do not have permission to access this resource' })
    }
    return next()
  }
}
