import { router } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { useState, FormEvent } from 'react'
import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

interface VersionsIndexProps {
  versions: {
    data: Data.Version[]
    metadata: {
      total: number
      perPage: number
      currentPage: number
    }
  }
  projectId?: string
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

export default function VersionsIndex({ versions, projectId }: VersionsIndexProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    projectId: projectId || '',
    documentType: 'PRD',
  })
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    router.post('/versions', formData, {
      onFinish: () => {
        setSubmitting(false)
        setShowForm(false)
        setFormData({ projectId: projectId || '', documentType: 'PRD' })
      },
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Versions & Sign-Offs
          </h1>
          <p className="mt-1 text-muted-foreground">
            Track document versions and their approval status
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'Create Version'}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Create New Version</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {!projectId && (
              <div>
                <label
                  htmlFor="version-project"
                  className="block text-sm font-medium text-foreground"
                >
                  Project ID
                </label>
                <input
                  id="version-project"
                  type="text"
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter project ID"
                />
              </div>
            )}
            <div>
              <label htmlFor="version-type" className="block text-sm font-medium text-foreground">
                Document Type
              </label>
              <select
                id="version-type"
                value={formData.documentType}
                onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="PRD">PRD</option>
                <option value="UAT">UAT</option>
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Version'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        {versions.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">No versions yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Create a version to snapshot your current PRD or UAT document for sign-off.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Create Version
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Version #</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Document Type</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Created At</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {versions.data.map((version) => (
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
    </div>
  )
}
