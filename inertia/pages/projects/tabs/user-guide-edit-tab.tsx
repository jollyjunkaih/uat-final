import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch, apiUpload } from '~/lib/api'
import { toast } from 'sonner'
import { cn } from '~/lib/utils'

interface GuideStep {
  id: string
  sectionId: string
  instruction: string
  imageFileName: string | null
  sequence: number
}

interface GuideSection {
  id: string
  projectId: string
  roleName: string
  roleSlug: string
  roleDescription: string | null
  roleSequence: number
  title: string
  slug: string
  module: string | null
  sequence: number
  steps: GuideStep[]
  status: string
  createdAt: string
  updatedAt: string | null
}

interface RoleGroup {
  roleName: string
  roleSlug: string
  roleDescription: string | null
  roleSequence: number
  sections: GuideSection[]
}

interface UserGuideEditTabProps {
  projectId: string
}

/* ── Step Editor Row ── */

interface EditableStep {
  instruction: string
  imageFileName: string
}

function StepRow({
  step,
  index,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  step: EditableStep
  index: number
  onChange: (updated: EditableStep) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}) {
  return (
    <div className="flex gap-2 items-start group">
      <span className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {index + 1}
      </span>
      <div className="flex-1 space-y-1.5">
        <textarea
          value={step.instruction}
          onChange={(e) => onChange({ ...step, instruction: e.target.value })}
          rows={2}
          placeholder="Step instruction..."
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <input
          type="text"
          value={step.imageFileName}
          onChange={(e) => onChange({ ...step, imageFileName: e.target.value })}
          placeholder="Image file name (optional)"
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
      <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
          title="Move up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-20"
          title="Move down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="rounded p-0.5 text-red-400 hover:text-red-600"
          title="Remove step"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  )
}

/* ── Inline Section Editor ── */

function SectionEditor({
  section,
  onSaved,
  onCancel,
}: {
  section: GuideSection
  onSaved: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(section.title)
  const [module, setModule] = useState(section.module || '')
  const [status, setStatus] = useState(section.status)
  const [steps, setSteps] = useState<EditableStep[]>(
    (section.steps || []).map((s) => ({
      instruction: s.instruction,
      imageFileName: s.imageFileName || '',
    }))
  )

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch(`/api/user-guide/${section.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guide-grouped'] })
      toast.success('Section updated')
      onSaved()
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update section')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/api/user-guide/${section.id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guide-grouped'] })
      toast.success('Section deleted')
      onSaved()
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete section')
    },
  })

  function handleSave() {
    updateMutation.mutate({
      title,
      module: module || null,
      status,
      steps: steps.map((s, idx) => ({
        instruction: s.instruction,
        imageFileName: s.imageFileName || null,
        sequence: idx,
      })),
    })
  }

  function updateStep(idx: number, updated: EditableStep) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? updated : s)))
  }

  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx))
  }

  function moveStep(idx: number, dir: -1 | 1) {
    setSteps((prev) => {
      const arr = [...prev]
      const target = idx + dir
      ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
      return arr
    })
  }

  function addStep() {
    setSteps((prev) => [...prev, { instruction: '', imageFileName: '' }])
  }

  const hasSteps = steps.some((s) => s.instruction.trim())

  return (
    <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Module</label>
            <input
              type="text"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              placeholder="e.g., Office Services"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">
          Steps ({steps.length})
        </label>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <StepRow
              key={idx}
              step={step}
              index={idx}
              onChange={(updated) => updateStep(idx, updated)}
              onRemove={() => removeStep(idx)}
              onMoveUp={() => moveStep(idx, -1)}
              onMoveDown={() => moveStep(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Step
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to delete this section?')) {
              deleteMutation.mutate()
            }
          }}
          disabled={deleteMutation.isPending}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
        >
          {deleteMutation.isPending ? 'Deleting...' : 'Delete Section'}
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={updateMutation.isPending || !title.trim() || !hasSteps}
            className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── New Section Form ── */

function NewSectionForm({
  projectId,
  role,
  nextSequence,
  onCreated,
  onCancel,
}: {
  projectId: string
  role: RoleGroup
  nextSequence: number
  onCreated: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [module, setModule] = useState('')
  const [steps, setSteps] = useState<EditableStep[]>([
    { instruction: '', imageFileName: '' },
  ])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiFetch('/api/user-guide', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guide-grouped'] })
      toast.success('Section created')
      onCreated()
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create section')
    },
  })

  function handleCreate() {
    createMutation.mutate({
      projectId,
      roleName: role.roleName,
      roleSlug: role.roleSlug,
      roleDescription: role.roleDescription,
      roleSequence: role.roleSequence,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      module: module || null,
      sequence: nextSequence,
      steps: steps
        .filter((s) => s.instruction.trim())
        .map((s, idx) => ({
          instruction: s.instruction,
          imageFileName: s.imageFileName || null,
          sequence: idx,
        })),
    })
  }

  function addStep() {
    setSteps((prev) => [...prev, { instruction: '', imageFileName: '' }])
  }

  const hasSteps = steps.some((s) => s.instruction.trim())

  return (
    <div className="space-y-4 rounded-lg border border-green-200 bg-green-50/50 p-4">
      <h4 className="text-sm font-semibold text-foreground">New Section for {role.roleName}</h4>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slug) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '')
                )
              }
            }}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground mb-1">Module</label>
          <input
            type="text"
            value={module}
            onChange={(e) => setModule(e.target.value)}
            placeholder="e.g., Office Services"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground mb-2">Steps *</label>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <StepRow
              key={idx}
              step={step}
              index={idx}
              onChange={(updated) =>
                setSteps((prev) => prev.map((s, i) => (i === idx ? updated : s)))
              }
              onRemove={() => setSteps((prev) => prev.filter((_, i) => i !== idx))}
              onMoveUp={() => {
                setSteps((prev) => {
                  const arr = [...prev]
                  ;[arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]]
                  return arr
                })
              }}
              onMoveDown={() => {
                setSteps((prev) => {
                  const arr = [...prev]
                  ;[arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]
                  return arr
                })
              }}
              isFirst={idx === 0}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addStep}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-dashed border-border py-2 text-xs font-medium text-muted-foreground hover:border-primary hover:text-foreground"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Step
        </button>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={createMutation.isPending || !title.trim() || !hasSteps}
          className="rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {createMutation.isPending ? 'Creating...' : 'Create Section'}
        </button>
      </div>
    </div>
  )
}

/* ── Role Edit Panel ── */

function RoleEditPanel({
  role,
  projectId,
}: {
  role: RoleGroup
  projectId: string
}) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)

  return (
    <div className="space-y-3">
      {role.sections.map((section) =>
        editingId === section.id ? (
          <SectionEditor
            key={section.id}
            section={section}
            onSaved={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        ) : (
          <div
            key={section.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:bg-accent/30"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  #{section.sequence}
                </span>
                <span className="text-sm font-medium text-foreground">{section.title}</span>
                {section.module && (
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                    {section.module}
                  </span>
                )}
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    section.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : section.status === 'archived'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-yellow-100 text-yellow-800'
                  )}
                >
                  {section.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {section.steps?.length ?? 0} step{(section.steps?.length ?? 0) !== 1 ? 's' : ''}
                {section.steps?.[0]?.instruction && (
                  <span className="ml-1 text-muted-foreground/60">
                    — {section.steps[0].instruction.slice(0, 80)}...
                  </span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditingId(section.id)}
              className="ml-3 shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent"
            >
              Edit
            </button>
          </div>
        )
      )}

      {showNewForm ? (
        <NewSectionForm
          projectId={projectId}
          role={role}
          nextSequence={
            role.sections.length > 0
              ? Math.max(...role.sections.map((s) => s.sequence)) + 1
              : 0
          }
          onCreated={() => setShowNewForm(false)}
          onCancel={() => setShowNewForm(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Section
        </button>
      )}
    </div>
  )
}

/* ── Main Edit Tab ── */

export default function UserGuideEditTab({ projectId }: UserGuideEditTabProps) {
  const [activeRole, setActiveRole] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['user-guide-grouped', projectId],
    queryFn: () =>
      apiFetch<{ data: RoleGroup[] }>(`/api/user-guide/grouped/${projectId}`),
  })

  const importMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData()
      formData.append('file', file)
      return apiUpload(`/api/yaml/import/user-guide/${projectId}`, formData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guide-grouped'] })
      toast.success('User guide imported')
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Import failed')
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) importMutation.mutate(file)
    e.target.value = ''
  }

  const roles = data?.data ?? []

  // Auto-select first role
  if (roles.length > 0 && activeRole === null) {
    setTimeout(() => setActiveRole(roles[0].roleSlug), 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-foreground">No User Guide Sections</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Import a user-guide.yaml file to populate the guide, then edit sections here.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={importMutation.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          {importMutation.isPending ? 'Importing...' : 'Import YAML'}
        </button>
      </div>
    )
  }

  const selectedRole = roles.find((r) => r.roleSlug === activeRole)

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Edit User Guide</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a role and edit its guide sections. Each section contains ordered steps with optional images.
        </p>
      </div>

      {/* Role selector tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {roles.map((role) => {
          const colors: Record<string, string> = {
            requester: 'border-blue-500',
            'office-service-officer': 'border-emerald-500',
            'requesting-hod': 'border-amber-500',
          }
          return (
            <button
              key={role.roleSlug}
              onClick={() => setActiveRole(role.roleSlug)}
              className={cn(
                'border-b-2 px-4 pb-3 text-sm font-medium transition-colors',
                activeRole === role.roleSlug
                  ? cn('text-foreground', colors[role.roleSlug] || 'border-primary')
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {role.roleName}
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({role.sections.length})
              </span>
            </button>
          )
        })}
      </div>

      {/* Section list for active role */}
      {selectedRole && (
        <div>
          {selectedRole.roleDescription && (
            <p className="mb-4 text-sm text-muted-foreground italic">
              {selectedRole.roleDescription}
            </p>
          )}
          <RoleEditPanel role={selectedRole} projectId={projectId} />
        </div>
      )}
    </div>
  )
}
