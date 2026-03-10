import { router } from '@inertiajs/react'
import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import { useState, FormEvent } from 'react'
import { type Data } from '@generated/data'

interface ProjectsIndexProps {
  projects: {
    data: Data.Project[]
    meta: {
      total: number
      perPage: number
      currentPage: number
    }
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
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

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    router.post('/projects', formData, {
      onFinish: () => {
        setSubmitting(false)
        setShowForm(false)
        setFormData({ name: '', description: '' })
      },
    })
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">Manage your PRD and UAT projects</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Create New Project</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="project-name" className="block text-sm font-medium text-foreground">
                Project Name
              </label>
              <input
                id="project-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="project-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                placeholder="Describe the project (optional)"
              />
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
                {submitting ? 'Creating...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        {projects.data.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">No projects yet</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Create your first project to start defining features, UAT flows, and generating
              documents.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              New Project
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-lg border border-border shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Created</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {projects.data.map((project) => (
                    <tr key={project.id} className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div>
                          <span className="font-medium text-foreground">{project.name}</span>
                          {project.description && (
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={project.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/projects/${project.id}`}
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

            {projects.meta.total > projects.meta.perPage && (
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Showing {(projects.meta.currentPage - 1) * projects.meta.perPage + 1} to{' '}
                  {Math.min(projects.meta.currentPage * projects.meta.perPage, projects.meta.total)}{' '}
                  of {projects.meta.total} projects
                </span>
                <div className="flex gap-2">
                  {projects.meta.currentPage > 1 && (
                    <Link
                      href={`/projects?page=${projects.meta.currentPage - 1}`}
                      className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      Previous
                    </Link>
                  )}
                  {projects.meta.currentPage * projects.meta.perPage < projects.meta.total && (
                    <Link
                      href={`/projects?page=${projects.meta.currentPage + 1}`}
                      className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      Next
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
