import { Link } from '@inertiajs/react'
import { cn } from '~/lib/utils'

interface DashboardProps {
  stats: {
    projectCount: number
    featureCount: number
    pendingApprovals: number
    eventCount: number
    testPassRate: number
  }
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number | string
  accent?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className={cn('mt-2 text-3xl font-bold tracking-tight', accent)}>{value}</p>
    </div>
  )
}

export default function Dashboard({ stats }: DashboardProps) {
  const isEmpty =
    stats.projectCount === 0 &&
    stats.featureCount === 0 &&
    stats.pendingApprovals === 0 &&
    stats.eventCount === 0

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your PRD & UAT workspace</p>

      {isEmpty ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-16 text-center">
          <h2 className="mt-4 text-xl font-semibold text-foreground">No projects yet</h2>
          <p className="mt-2 max-w-sm text-muted-foreground">
            Get started by creating your first project. You can define features, build UAT flows,
            and generate PRD and UAT documents.
          </p>
          <Link
            href="/projects"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Projects" value={stats.projectCount} />
          <StatCard label="Features" value={stats.featureCount} />
          <StatCard
            label="Pending Approvals"
            value={stats.pendingApprovals}
            accent={stats.pendingApprovals > 0 ? 'text-destructive' : undefined}
          />
          <StatCard label="Events" value={stats.eventCount} />
        </div>
      )}

      {!isEmpty && (
        <div className="mt-8 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Test Pass Rate</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${stats.testPassRate}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">{stats.testPassRate}%</span>
          </div>
        </div>
      )}

      {!isEmpty && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/projects"
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
          >
            <h3 className="font-semibold text-foreground">Projects</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your projects and features
            </p>
          </Link>
          <Link
            href="/versions"
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
          >
            <h3 className="font-semibold text-foreground">Versions</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              View version history and sign-offs
            </p>
          </Link>
          <Link
            href="/sign-off"
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md"
          >
            <h3 className="font-semibold text-foreground">Sign-Offs</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage approval workflows
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}
