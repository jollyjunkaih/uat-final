import type { HttpContext } from '@adonisjs/core/http'
import Project from '#models/project'
import Feature from '#models/feature'
import Event from '#models/event'
import SignOffRecord from '#models/sign_off_record'

export default class DashboardController {
  async index(ctx: HttpContext) {
    const projectCount = await Project.query()
      .whereNull('deleted_at')
      .count('* as total')

    const featureCount = await Feature.query()
      .whereNull('deleted_at')
      .count('* as total')

    const pendingApprovals = await SignOffRecord.query()
      .where('status', 'pending')
      .count('* as total')

    const eventCount = await Event.query()
      .whereNull('deleted_at')
      .count('* as total')

    const totalEvents = Number(eventCount[0].$extras.total)
    const passingEvents = await Event.query()
      .whereNull('deleted_at')
      .where('test_status', 'tests_passing')
      .count('* as total')

    const passingCount = Number(passingEvents[0].$extras.total)
    const testPassRate = totalEvents > 0 ? Math.round((passingCount / totalEvents) * 100) : 0

    const stats = {
      projectCount: Number(projectCount[0].$extras.total),
      featureCount: Number(featureCount[0].$extras.total),
      pendingApprovals: Number(pendingApprovals[0].$extras.total),
      eventCount: totalEvents,
      testPassRate,
    }

    return ctx.inertia.render('dashboard', { stats })
  }
}
