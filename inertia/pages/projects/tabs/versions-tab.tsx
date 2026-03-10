import { useState, type FormEvent } from 'react'
import { Link } from '@inertiajs/react'
import { toast } from 'sonner'
import { useVersions, useCreateVersion } from '~/hooks/use-versions'
import { StatusBadge } from '~/components/status-badge'
import { cn } from '~/lib/utils'

interface VersionsTabProps {
  projectId: string
}

function DocTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    prd: 'bg-blue-100 text-blue-800',
    uat: 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[type] || 'bg-gray-100 text-gray-800'
      )}
    >
      {type.toUpperCase()}
    </span>
  )
}

export default function VersionsTab({ projectId }: VersionsTabProps) {
  const { data, isLoading } = useVersions(projectId)
  const createVersion = useCreateVersion(projectId)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [documentType, setDocumentType] = useState('prd')

  const versions = data?.data || []

  function handleCreate(e: FormEvent) {
    e.preventDefault()
    createVersion.mutate(
      { projectId, documentType },
      {
        onSuccess: () => {
          setShowCreateForm(false)
          toast.success('Version created')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Versions</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/versions?projectId=${projectId}`}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            All Versions
          </Link>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            {showCreateForm ? 'Cancel' : 'Create Version'}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Create New Version</h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="prd">PRD (Product Requirements Document)</option>
                <option value="uat">UAT (User Acceptance Testing)</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Creates an immutable snapshot of all current features and flows.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createVersion.isPending}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                {createVersion.isPending ? 'Creating...' : 'Create Version'}
              </button>
            </div>
          </form>
        </div>
      )}

      {versions.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No versions created yet. Create a version to snapshot your current features and flows.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-border shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Version</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {versions.map((version) => (
                <tr key={version.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">
                    v{version.versionNumber}
                  </td>
                  <td className="px-4 py-3">
                    <DocTypeBadge type={version.documentType} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={version.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {version.createdAt ? new Date(version.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/versions/${version.id}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
