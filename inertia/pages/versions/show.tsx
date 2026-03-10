import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import { type Data } from '@generated/data'

interface VersionShowProps {
  version: Data.Version & {
    signOffRecords?: Data.SignOffRecord[]
  }
}

function DocTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    PRD: 'bg-blue-100 text-blue-800',
    UAT: 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[type] || 'bg-gray-100 text-gray-800'
      )}
    >
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    signed: 'bg-green-100 text-green-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status}
    </span>
  )
}

function SnapshotViewer({ snapshot }: { snapshot: any }) {
  if (!snapshot) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No snapshot data available for this version.
        </p>
      </div>
    )
  }

  // If snapshot has features, render them in a structured way
  if (snapshot.features && Array.isArray(snapshot.features)) {
    return (
      <div className="space-y-4">
        {snapshot.features.map((feature: any, index: number) => (
          <div key={index} className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-foreground">
              {feature.name || `Feature ${index + 1}`}
            </h4>
            {feature.description && (
              <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
            )}
            {feature.acceptanceCriteria && (
              <div className="mt-3">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acceptance Criteria
                </p>
                <ul className="mt-1 list-inside list-disc text-sm text-foreground">
                  {(Array.isArray(feature.acceptanceCriteria)
                    ? feature.acceptanceCriteria
                    : [feature.acceptanceCriteria]
                  ).map((criteria: string, i: number) => (
                    <li key={i}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // If snapshot has flows (UAT), render them
  if (snapshot.flows && Array.isArray(snapshot.flows)) {
    return (
      <div className="space-y-4">
        {snapshot.flows.map((flow: any, index: number) => (
          <div key={index} className="rounded-lg border border-border bg-card p-4">
            <h4 className="font-semibold text-foreground">{flow.name || `Flow ${index + 1}`}</h4>
            {flow.steps && Array.isArray(flow.steps) && (
              <ol className="mt-3 list-inside list-decimal space-y-1 text-sm text-foreground">
                {flow.steps.map((step: any, i: number) => (
                  <li key={i}>
                    {typeof step === 'string' ? step : step.description || JSON.stringify(step)}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Fallback: render as formatted JSON
  return (
    <pre className="overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-sm text-foreground">
      <code>{JSON.stringify(snapshot, null, 2)}</code>
    </pre>
  )
}

export default function VersionShow({ version }: VersionShowProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/versions" className="text-sm text-muted-foreground hover:text-foreground">
              Versions
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Version {version.versionNumber} - {version.documentType}
            </h1>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <DocTypeBadge type={version.documentType} />
            <StatusBadge status={version.status} />
            <span className="text-sm text-muted-foreground">
              Created {version.createdAt ? new Date(version.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold text-foreground">Snapshot Content</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The document content captured at the time this version was created.
          </p>
          <div className="mt-4">
            <SnapshotViewer snapshot={version.snapshot} />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground">Sign-Off Records</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Approval status from designated signatories.
          </p>

          {!version.signOffRecords || version.signOffRecords.length === 0 ? (
            <div className="mt-4 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                No sign-off records for this version yet. Initiate a sign-off from the{' '}
                <Link href="/sign-off/panel" className="font-medium text-primary hover:underline">
                  Sign-Off Management
                </Link>{' '}
                panel.
              </p>
            </div>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border border-border shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Stage</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">
                      Required Signatures
                    </th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Requested At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {version.signOffRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">
                        {record.signOffStage.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.requiredSignatures}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.requestedAt
                          ? new Date(record.requestedAt).toLocaleDateString()
                          : 'Pending'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
