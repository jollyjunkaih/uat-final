import { useState, type FormEvent } from 'react'
import { router } from '@inertiajs/react'
import { Badge, type BadgeVariant } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'

interface Feature {
  id: string
  name: string
  description: string
  module: string
  priority: string
  status: string
}

interface UatEvent {
  id: string
  name: string
  model: string
  triggerType: string
  condition: string
  expectedOutcome: string
  testStatus: string
}

interface UatFlow {
  id: string
  name: string
  description: string
  featureName: string
  status: string
  events: UatEvent[]
}

interface Document {
  type: string
  version: number
  projectName: string
  features?: Feature[]
  flows?: UatFlow[]
}

interface ViewProps {
  document: Document
  passwordRequired?: boolean
}

function priorityVariant(priority: string): BadgeVariant {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'destructive'
    case 'medium':
      return 'warning'
    case 'low':
      return 'secondary'
    default:
      return 'outline'
  }
}

function statusVariant(status: string): BadgeVariant {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'passed':
    case 'complete':
    case 'completed':
      return 'success'
    case 'in_progress':
    case 'in progress':
    case 'pending':
      return 'warning'
    case 'rejected':
    case 'failed':
      return 'destructive'
    case 'draft':
      return 'secondary'
    default:
      return 'outline'
  }
}

function testStatusIndicator(status: string) {
  const lower = status.toLowerCase()
  if (lower === 'passed') {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Passed
      </span>
    )
  }
  if (lower === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Failed
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-gray-500 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-gray-300" />
      {status || 'Not tested'}
    </span>
  )
}

function PasswordGate() {
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('password', password)
    router.visit(currentUrl.pathname + currentUrl.search)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">Password Required</h2>
          <p className="text-sm text-gray-600">
            This document is protected. Enter the password to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="share-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="share-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-1"
            />
          </div>
          <Button type="submit" className="w-full">
            View Document
          </Button>
        </form>
      </div>
    </div>
  )
}

function PrdContent({ features }: { features: Feature[] }) {
  const grouped: Record<string, Feature[]> = {}
  for (const feature of features) {
    const module = feature.module || 'General'
    if (!grouped[module]) grouped[module] = []
    grouped[module].push(feature)
  }

  const modules = Object.keys(grouped).sort()

  return (
    <div className="space-y-8">
      {modules.map((moduleName) => (
        <section key={moduleName} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {moduleName}
          </h2>
          <div className="space-y-3">
            {grouped[moduleName].map((feature) => (
              <div
                key={feature.id}
                className="rounded-lg border border-gray-200 bg-white p-4 space-y-2"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="text-sm font-medium text-gray-900 flex-1 min-w-0">
                    {feature.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={priorityVariant(feature.priority)}>
                      {feature.priority}
                    </Badge>
                    <Badge variant={statusVariant(feature.status)}>
                      {feature.status}
                    </Badge>
                  </div>
                </div>
                {feature.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {modules.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">No features defined.</p>
      )}
    </div>
  )
}

function UatContent({ flows }: { flows: UatFlow[] }) {
  const grouped: Record<string, UatFlow[]> = {}
  for (const flow of flows) {
    const featureName = flow.featureName || 'General'
    if (!grouped[featureName]) grouped[featureName] = []
    grouped[featureName].push(flow)
  }

  const featureNames = Object.keys(grouped).sort()

  return (
    <div className="space-y-8">
      {featureNames.map((featureName) => (
        <section key={featureName} className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            {featureName}
          </h2>
          <div className="space-y-4">
            {grouped[featureName].map((flow) => (
              <div
                key={flow.id}
                className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start gap-2">
                  <h3 className="text-sm font-medium text-gray-900 flex-1 min-w-0">
                    {flow.name}
                  </h3>
                  <Badge variant={statusVariant(flow.status)}>{flow.status}</Badge>
                </div>
                {flow.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{flow.description}</p>
                )}

                {flow.events && flow.events.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Events
                    </h4>
                    <div className="space-y-2">
                      {flow.events.map((event) => (
                        <div
                          key={event.id}
                          className="rounded border border-gray-100 bg-gray-50 p-3 space-y-1.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {event.name}
                            </span>
                            {testStatusIndicator(event.testStatus)}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
                            <div>
                              <span className="font-medium text-gray-500">Model:</span>{' '}
                              {event.model}
                            </div>
                            <div>
                              <span className="font-medium text-gray-500">Trigger:</span>{' '}
                              {event.triggerType}
                            </div>
                            {event.condition && (
                              <div className="sm:col-span-2">
                                <span className="font-medium text-gray-500">Condition:</span>{' '}
                                {event.condition}
                              </div>
                            )}
                            {event.expectedOutcome && (
                              <div className="sm:col-span-2">
                                <span className="font-medium text-gray-500">Expected:</span>{' '}
                                {event.expectedOutcome}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}

      {featureNames.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-8">No flows defined.</p>
      )}
    </div>
  )
}

export default function ShareView({ document, passwordRequired }: ViewProps) {
  if (passwordRequired) {
    return <PasswordGate />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-base font-semibold text-gray-900 min-w-0 truncate">
            {document.projectName}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{document.type.toUpperCase()}</Badge>
            <Badge variant="secondary">Version {document.version}</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {document.type === 'prd' && document.features ? (
          <PrdContent features={document.features} />
        ) : document.type === 'uat' && document.flows ? (
          <UatContent flows={document.flows} />
        ) : (
          <p className="text-sm text-gray-500 text-center py-8">No content available.</p>
        )}
      </main>
    </div>
  )
}
