import { Link } from '@adonisjs/inertia/react'
import { useProjectTree } from '~/hooks/use-project-tree'
import { Badge, type BadgeVariant } from '~/components/ui/badge'

interface PrdViewTabProps {
  projectId: string
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
      return 'success'
    case 'in_review':
    case 'pending':
      return 'warning'
    case 'rejected':
    case 'deprecated':
      return 'destructive'
    case 'draft':
      return 'secondary'
    default:
      return 'outline'
  }
}

export default function PrdViewTab({ projectId }: PrdViewTabProps) {
  const { data, isLoading } = useProjectTree(projectId)
  const features = data?.data || []
  console.log(data)

  const grouped: Record<string, typeof features> = {}
  for (const feature of features) {
    const module = feature.module || 'General'
    if (!grouped[module]) grouped[module] = []
    grouped[module].push(feature)
  }
  const modules = Object.keys(grouped).sort()

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">PRD View</h3>
        <Link
          href={`/projects/${projectId}/prd`}
          className="text-sm font-medium text-primary hover:underline"
        >
          Full PRD Document
        </Link>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Product Requirements Document generated from your project features.
      </p>

      {isLoading ? (
        <div className="mt-6 flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : modules.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No features defined yet. Add features in the Features tab to generate your PRD.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {modules.map((moduleName) => (
            <section key={moduleName} className="space-y-3">
              <h4 className="text-base font-semibold text-foreground border-b border-border pb-2">
                {moduleName}
              </h4>
              <div className="space-y-3">
                {grouped[moduleName].map((feature) => (
                  <div
                    key={feature.id}
                    className="rounded-lg border border-border bg-background p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-start gap-2">
                      <h5 className="text-sm font-medium text-foreground flex-1 min-w-0">
                        {feature.name}
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={priorityVariant(feature.priority)}>
                          {feature.priority}
                        </Badge>
                        <Badge variant={statusVariant(feature.status)}>
                          {feature.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                    {feature.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
