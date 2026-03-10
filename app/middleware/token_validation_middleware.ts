import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { DateTime } from 'luxon'
import SignOffLink from '#models/sign_off_link'
import ViewOnlyLink from '#models/view_only_link'

export default class TokenValidationMiddleware {
  async handle(ctx: HttpContext, next: NextFn, options: { type: 'sign_off' | 'view_only' }) {
    const token = ctx.params.token

    if (options.type === 'sign_off') {
      const link = await SignOffLink.query().where('token', token).first()

      if (!link) {
        return ctx.inertia.render('share/expired', { reason: 'Link not found' })
      }

      if (link.status !== 'pending') {
        return ctx.inertia.render('share/expired', {
          reason: `This link has already been ${link.status}`,
        })
      }

      if (link.expiresAt && DateTime.fromISO(link.expiresAt.toISO()!) < DateTime.now()) {
        link.status = 'expired'
        await link.save()
        return ctx.inertia.render('share/expired', { reason: 'This link has expired' })
      }

      ctx.params.signOffLink = link
    } else {
      const link = await ViewOnlyLink.query().where('token', token).first()

      if (!link || !link.isActive) {
        return ctx.inertia.render('share/expired', { reason: 'Link not found or revoked' })
      }

      if (link.expiresAt && DateTime.fromISO(link.expiresAt.toISO()!) < DateTime.now()) {
        return ctx.inertia.render('share/expired', { reason: 'This link has expired' })
      }

      ctx.params.viewOnlyLink = link
    }

    return next()
  }
}
