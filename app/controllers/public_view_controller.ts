import type { HttpContext } from '@adonisjs/core/http'
import ViewOnlyLinkService from '#services/view_only_link_service'
import VersionService from '#services/version_service'
import VersionTransformer from '#transformers/version_transformer'
import { DateTime } from 'luxon'

export default class PublicViewController {
  async show(ctx: HttpContext) {
    const token = ctx.params.token
    const service = new ViewOnlyLinkService()
    const link = await service.findByToken(token)

    if (!link.isActive) {
      return ctx.response.status(410).json({ error: 'This link has been revoked.' })
    }

    if (link.expiresAt && link.expiresAt < DateTime.now()) {
      return ctx.response.status(410).json({ error: 'This link has expired.' })
    }

    if (link.passwordHash) {
      const password = ctx.request.input('password')
      if (!password) {
        return ctx.inertia.render('share/password', { token })
      }
      const hashModule = (await import('@adonisjs/core/services/hash')).default
      const isValid = await hashModule.verify(link.passwordHash, password)
      if (!isValid) {
        return ctx.inertia.render('share/password', { token, error: 'Invalid password.' })
      }
    }

    await service.recordAccess(link.id)

    const versionService = new VersionService()
    const versions = await versionService.findAll({
      projectId: link.projectId,
      documentType: link.documentType,
    })
    const versionList = await versions
    const version = versionList.find((v) => v.versionNumber === link.version) ?? versionList[0]

    return ctx.inertia.render('share/view', {
      document: {
        documentType: link.documentType,
        projectId: link.projectId,
      },
      version: version ? VersionTransformer.transform(version) : null,
    })
  }
}
