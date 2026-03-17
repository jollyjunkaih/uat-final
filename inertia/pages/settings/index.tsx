import { router } from '@inertiajs/react'
import { useState, FormEvent } from 'react'
import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'
import { useSignators, useCreateSignator, useUpdateSignator, useDeleteSignator } from '~/hooks/use-signators'
import type { Signator } from '~/hooks/use-signators'
import { toast } from 'sonner'

interface SettingsProps {
  project: Data.Project
}

function SignatorCheckboxList({
  label,
  description,
  signators,
  selectedIds,
  onChange,
}: {
  label: string
  description: string
  signators: Signator[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
}) {
  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((sid) => sid !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground mb-2">{description}</p>
      {signators.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">
          No signatories created yet. Add them in the Signatories section below.
        </p>
      ) : (
        <div className="space-y-1 rounded-md border border-input bg-background p-2 max-h-40 overflow-y-auto">
          {signators.map((s) => (
            <label
              key={s.id}
              className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(s.id)}
                onChange={() => toggle(s.id)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
              />
              <span className="text-foreground">{s.name}</span>
              {s.title && (
                <span className="text-muted-foreground text-xs">— {s.title}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Settings({ project }: SettingsProps) {
  const [formData, setFormData] = useState({
    prdRequiredSignatures: project.prdRequiredSignatures,
    uatAcceptanceRequiredSignatures: project.uatAcceptanceRequiredSignatures,
    uatImplementationRequiredSignatures: project.uatImplementationRequiredSignatures,
    prdSignatorIds: (project as any).prdSignatorIds || [],
    uatAcceptanceSignatorIds: (project as any).uatAcceptanceSignatorIds || [],
    uatImplementationSignatorIds: (project as any).uatImplementationSignatorIds || [],
    integrationEnabled: project.integrationEnabled,
    integrationConfig: project.integrationConfig
      ? JSON.stringify(project.integrationConfig, null, 2)
      : '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  // Signator CRUD
  const { data: signatorsData } = useSignators(project.id)
  const signators = signatorsData?.data || []
  const createSignator = useCreateSignator(project.id)
  const updateSignator = useUpdateSignator(project.id)
  const deleteSignator = useDeleteSignator(project.id)

  const [newName, setNewName] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editTitle, setEditTitle] = useState('')

  function handleAddSignator() {
    if (!newName.trim()) return
    createSignator.mutate(
      { projectId: project.id, name: newName.trim(), title: newTitle.trim() || undefined },
      {
        onSuccess: () => {
          setNewName('')
          setNewTitle('')
          toast.success('Signatory added')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function startEdit(s: Signator) {
    setEditingId(s.id)
    setEditName(s.name)
    setEditTitle(s.title || '')
  }

  function handleSaveEdit() {
    if (!editingId || !editName.trim()) return
    updateSignator.mutate(
      { id: editingId, name: editName.trim(), title: editTitle.trim() || null },
      {
        onSuccess: () => {
          setEditingId(null)
          toast.success('Signatory updated')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleDelete(id: string) {
    deleteSignator.mutate(id, {
      onSuccess: () => {
        // Remove from any assignment arrays
        setFormData((prev) => ({
          ...prev,
          prdSignatorIds: prev.prdSignatorIds.filter((sid: string) => sid !== id),
          uatAcceptanceSignatorIds: prev.uatAcceptanceSignatorIds.filter((sid: string) => sid !== id),
          uatImplementationSignatorIds: prev.uatImplementationSignatorIds.filter((sid: string) => sid !== id),
        }))
        toast.success('Signatory deleted')
      },
      onError: (err) => toast.error(err.message),
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSaved(false)

    const payload = {
      ...formData,
      integrationConfig: formData.integrationConfig ? JSON.parse(formData.integrationConfig) : null,
    }

    router.patch(`/settings/${project.id}`, payload, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      },
      onFinish: () => {
        setSubmitting(false)
      },
    })
  }

  const inputClass =
    'mt-2 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'
  const smallInputClass =
    'block w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </div>
      <p className="mt-1 text-muted-foreground">
        Configure approval chains, signatories, and integrations for this project.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Approval Chain */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Approval Chain</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set the number of required signatures and assign signatories for each document type and stage.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="prd-signatures" className="block text-sm font-medium text-foreground">
                PRD Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed to sign off a PRD version.
              </p>
              <input
                id="prd-signatures"
                type="number"
                min={0}
                value={formData.prdRequiredSignatures}
                onChange={(e) =>
                  setFormData({ ...formData, prdRequiredSignatures: parseInt(e.target.value) || 0 })
                }
                className={inputClass}
              />
              <SignatorCheckboxList
                label="Assigned PRD Signatories"
                description="Select who needs to sign off on PRD versions."
                signators={signators}
                selectedIds={formData.prdSignatorIds}
                onChange={(ids) => setFormData({ ...formData, prdSignatorIds: ids })}
              />
            </div>

            <div>
              <label
                htmlFor="uat-acceptance-signatures"
                className="block text-sm font-medium text-foreground"
              >
                UAT Acceptance Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed for UAT acceptance sign-off.
              </p>
              <input
                id="uat-acceptance-signatures"
                type="number"
                min={0}
                value={formData.uatAcceptanceRequiredSignatures}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    uatAcceptanceRequiredSignatures: parseInt(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
              <SignatorCheckboxList
                label="Assigned UAT Acceptance Signatories"
                description="Select who needs to sign off on UAT acceptance."
                signators={signators}
                selectedIds={formData.uatAcceptanceSignatorIds}
                onChange={(ids) => setFormData({ ...formData, uatAcceptanceSignatorIds: ids })}
              />
            </div>

            <div>
              <label
                htmlFor="uat-implementation-signatures"
                className="block text-sm font-medium text-foreground"
              >
                UAT Implementation Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed for UAT implementation sign-off.
              </p>
              <input
                id="uat-implementation-signatures"
                type="number"
                min={0}
                value={formData.uatImplementationRequiredSignatures}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    uatImplementationRequiredSignatures: parseInt(e.target.value) || 0,
                  })
                }
                className={inputClass}
              />
              <SignatorCheckboxList
                label="Assigned UAT Implementation Signatories"
                description="Select who needs to sign off on UAT implementation."
                signators={signators}
                selectedIds={formData.uatImplementationSignatorIds}
                onChange={(ids) =>
                  setFormData({ ...formData, uatImplementationSignatorIds: ids })
                }
              />
            </div>
          </div>
        </section>

        {/* Signatories Management */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Signatories</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the people who can be assigned as signatories. Add them here, then assign them to
            approval stages above.
          </p>

          <div className="mt-4 space-y-2">
            {signators.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
              >
                {editingId === s.id ? (
                  <>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Name"
                      className={smallInputClass + ' flex-1'}
                    />
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title (optional)"
                      className={smallInputClass + ' flex-1'}
                    />
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={updateSignator.isPending}
                      className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-accent"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-foreground">{s.name}</span>
                    {s.title && (
                      <span className="text-sm text-muted-foreground">{s.title}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="rounded px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      disabled={deleteSignator.isPending}
                      className="rounded px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}

            {signators.length === 0 && (
              <p className="text-sm italic text-muted-foreground py-2">
                No signatories added yet.
              </p>
            )}
          </div>

          <div className="mt-4 flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground">Name</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Signatory name"
                className={smallInputClass + ' mt-1'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSignator()
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-foreground">Title</label>
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Title (optional)"
                className={smallInputClass + ' mt-1'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSignator()
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleAddSignator}
              disabled={createSignator.isPending || !newName.trim()}
              className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </section>

        {/* Integration */}
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Integration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enable external integrations and configure connection settings.
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={formData.integrationEnabled}
                onClick={() =>
                  setFormData({ ...formData, integrationEnabled: !formData.integrationEnabled })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  formData.integrationEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    formData.integrationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-foreground">Integration Enabled</label>
            </div>

            {formData.integrationEnabled && (
              <div>
                <label
                  htmlFor="integration-config"
                  className="block text-sm font-medium text-foreground"
                >
                  Integration Configuration (JSON)
                </label>
                <textarea
                  id="integration-config"
                  rows={6}
                  value={formData.integrationConfig}
                  onChange={(e) => setFormData({ ...formData, integrationConfig: e.target.value })}
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder='{"apiUrl": "https://...", "apiKey": "..."}'
                />
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-600">Settings saved successfully.</span>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
