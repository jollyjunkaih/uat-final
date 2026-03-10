import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { parse } from 'yaml'
import TriggerLink from '#models/trigger_link'
import Event from '#models/event'
import { DateTime } from 'luxon'

interface YamlTrigger {
  name: string
  method: string
  field_updated?: string
  imports?: string[]
  conditions?: string
  execute: string
}

interface YamlTriggerGroup {
  model: string
  triggers: YamlTrigger[]
}

interface YamlTriggersConfig {
  triggers: YamlTriggerGroup[]
}

export default class IntegrationService {
  private yamlBasePath: string

  constructor(yamlBasePath?: string) {
    this.yamlBasePath = yamlBasePath || join(process.cwd(), '..', 'yaml')
  }

  getAvailableTriggers(): { model: string; name: string; method: string }[] {
    const triggersPath = join(this.yamlBasePath, 'triggers.yaml')

    if (!existsSync(triggersPath)) {
      return []
    }

    const content = readFileSync(triggersPath, 'utf-8')
    const config = parse(content) as YamlTriggersConfig

    if (!config?.triggers) return []

    const result: { model: string; name: string; method: string }[] = []
    for (const group of config.triggers) {
      for (const trigger of group.triggers) {
        result.push({
          model: group.model,
          name: trigger.name,
          method: trigger.method,
        })
      }
    }

    return result
  }

  async syncTriggerLinks(projectId: string): Promise<{
    synced: number
    broken: number
    errors: string[]
  }> {
    const availableTriggers = this.getAvailableTriggers()
    const triggerNames = new Set(availableTriggers.map((t) => `${t.model}:${t.name}`))

    const triggerLinks = await TriggerLink.query().whereHas('event', (eventQuery) => {
      eventQuery
        .whereNull('deleted_at')
        .whereHas('uatFlow', (flowQuery) => {
          flowQuery
            .whereNull('deleted_at')
            .whereHas('feature', (featureQuery) => {
              featureQuery.where('project_id', projectId).whereNull('deleted_at')
            })
        })
    })

    let synced = 0
    let broken = 0
    const errors: string[] = []

    for (const link of triggerLinks) {
      const key = `${link.triggerModel}:${link.triggerIdentifier}`

      if (!triggerNames.has(key)) {
        link.isBroken = true
        link.lastSyncAt = DateTime.now()
        await link.save()
        broken++
      } else {
        link.isBroken = false
        link.lastSyncAt = DateTime.now()
        await link.save()
        synced++
      }
    }

    return { synced, broken, errors }
  }

  async linkEventToTrigger(
    eventId: string,
    triggerIdentifier: string,
    triggerModel: string
  ): Promise<TriggerLink> {
    const existing = await TriggerLink.query().where('event_id', eventId).first()

    if (existing) {
      existing.triggerIdentifier = triggerIdentifier
      existing.triggerModel = triggerModel
      existing.isBroken = false
      existing.lastSyncAt = DateTime.now()
      await existing.save()
      return existing
    }

    return TriggerLink.create({
      eventId,
      triggerIdentifier,
      triggerModel,
      testStatus: 'no_tests',
      isBroken: false,
    })
  }

  async unlinkEvent(eventId: string): Promise<void> {
    await TriggerLink.query().where('event_id', eventId).delete()
  }

  async getProjectIntegrationStatus(projectId: string): Promise<{
    totalEvents: number
    linkedEvents: number
    brokenLinks: number
    testsPassing: number
    testsFailing: number
    noTests: number
  }> {
    const events = await Event.query()
      .whereNull('deleted_at')
      .whereHas('uatFlow', (flowQuery) => {
        flowQuery
          .whereNull('deleted_at')
          .whereHas('feature', (featureQuery) => {
            featureQuery.where('project_id', projectId).whereNull('deleted_at')
          })
      })

    const totalEvents = events.length

    const triggerLinks = await TriggerLink.query().whereIn(
      'event_id',
      events.map((e) => e.id)
    )

    return {
      totalEvents,
      linkedEvents: triggerLinks.length,
      brokenLinks: triggerLinks.filter((l) => l.isBroken).length,
      testsPassing: triggerLinks.filter((l) => l.testStatus === 'tests_passing').length,
      testsFailing: triggerLinks.filter((l) => l.testStatus === 'tests_failing').length,
      noTests: triggerLinks.filter((l) => l.testStatus === 'no_tests').length,
    }
  }
}
