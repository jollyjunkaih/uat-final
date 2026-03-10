import { Link } from '@inertiajs/react'
import { useProjectTree, type TreeFeature } from '~/hooks/use-project-tree'
import { Badge, type BadgeVariant } from '~/components/ui/badge'

interface UatViewTabProps {
  projectId: string
}

function statusVariant(status: string): BadgeVariant {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'passed':
      return 'success'
    case 'in_review':
    case 'pending':
    case 'ready_for_test':
      return 'warning'
    case 'rejected':
    case 'failed':
      return 'destructive'
    case 'blocked':
      return 'warning'
    case 'draft':
      return 'secondary'
    default:
      return 'outline'
  }
}

function testStatusIndicator(status: string) {
  if (status === 'tests_passing') {
    return (
      <span className="inline-flex items-center gap-1 text-green-700 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500" />
        Passing
      </span>
    )
  }
  if (status === 'tests_failing') {
    return (
      <span className="inline-flex items-center gap-1 text-red-700 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-red-500" />
        Failing
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-gray-500 text-xs font-medium">
      <span className="w-2 h-2 rounded-full bg-gray-300" />
      No tests
    </span>
  )
}

function FeatureUatSection({ feature }: { feature: TreeFeature }) {
  const hasFlows = feature.uatFlows && feature.uatFlows.length > 0

  return (
    <section className="space-y-3">
      <h4 className="text-base font-semibold text-foreground border-b border-border pb-2">
        {feature.name}
        {feature.module && (
          <span className="ml-2 text-xs font-normal text-muted-foreground">({feature.module})</span>
        )}
      </h4>

      {!hasFlows ? (
        <p className="text-sm text-muted-foreground py-2">No UAT flows defined for this feature.</p>
      ) : (
        <div className="space-y-4">
          {feature.uatFlows.map((flow) => (
            <div
              key={flow.id}
              className="rounded-lg border border-border bg-background p-4 space-y-3"
            >
              <div className="flex flex-wrap items-start gap-2">
                <h5 className="text-sm font-medium text-foreground flex-1 min-w-0">
                  {flow.name}
                </h5>
                <Badge variant={statusVariant(flow.status)}>
                  {flow.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              {flow.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{flow.description}</p>
              )}
              {flow.preconditions && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Preconditions:</span> {flow.preconditions}
                </div>
              )}

              {flow.events && flow.events.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h6 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Events
                  </h6>
                  <div className="space-y-2">
                    {flow.events.map((event) => (
                      <div
                        key={event.id}
                        className="rounded border border-border bg-muted/30 p-3 space-y-1.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {event.name}
                          </span>
                          {testStatusIndicator(event.testStatus)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Model:</span> {event.model}
                          </div>
                          <div>
                            <span className="font-medium">Trigger:</span> {event.triggerType}
                          </div>
                          {event.condition && (
                            <div className="sm:col-span-2">
                              <span className="font-medium">Condition:</span> {event.condition}
                            </div>
                          )}
                          {event.expectedOutcome && (
                            <div className="sm:col-span-2">
                              <span className="font-medium">Expected:</span> {event.expectedOutcome}
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
      )}
    </section>
  )
}

export default function UatViewTab({ projectId }: UatViewTabProps) {
  const { data, isLoading } = useProjectTree(projectId)
  const features = data?.data || []

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">UAT View</h3>
        <Link
          href={`/projects/${projectId}/uat`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Full UAT Document
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        User Acceptance Testing document with all flows and events.
      </p>

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : features.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No features defined yet. Add features and UAT flows to generate your UAT document.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {features.map((feature) => (
            <FeatureUatSection key={feature.id} feature={feature} />
          ))}
        </div>
      )}
    </div>
  )
}
