import { useState, useRef, type FormEvent } from 'react'
import { toast } from 'sonner'
import { useFeatures, type Feature } from '~/hooks/use-features'
import { useUatFlows, useCreateUatFlow, useUpdateUatFlow, useDeleteUatFlow, type UatFlow } from '~/hooks/use-uat-flows'
import { useSteps, useCreateStep, useUpdateStep, useDeleteStep, useUploadStepImage, useDeleteStepImage, type Step } from '~/hooks/use-steps'
import { StatusBadge } from '~/components/status-badge'
import { PriorityBadge } from '~/components/priority-badge'
import { cn } from '~/lib/utils'

interface UatFlowsTabProps {
  projectId: string
}

const inputClass = 'mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'

function FunctionForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: {
  initial?: Partial<UatFlow>
  onSubmit: (data: { name: string; description: string; preconditions: string }) => void
  onCancel: () => void
  submitting: boolean
  submitLabel: string
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [preconditions, setPreconditions] = useState(initial?.preconditions || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ name, description, preconditions })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-foreground">Function Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Create a Room Booking"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Describe this function (optional)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Preconditions</label>
        <textarea
          rows={2}
          value={preconditions}
          onChange={(e) => setPreconditions(e.target.value)}
          className={inputClass}
          placeholder="Preconditions that must be met (optional)"
        />
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

function StepForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Partial<Step>
  onSubmit: (data: { name: string; description: string }) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ name, description })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-foreground">Step Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g. Click the Submit button"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Describe this step (optional)"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-accent">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50">
          {submitting ? 'Saving...' : initial?.id ? 'Update' : 'Add Step'}
        </button>
      </div>
    </form>
  )
}

function StepsSection({ flow, projectId }: { flow: UatFlow; projectId: string }) {
  const { data, isLoading } = useSteps(flow.id)
  const createStep = useCreateStep(projectId)
  const updateStep = useUpdateStep(projectId)
  const deleteStep = useDeleteStep(projectId)
  const uploadImage = useUploadStepImage(projectId)
  const deleteImage = useDeleteStepImage(projectId)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const steps = data?.data || []

  function handleCreate(stepData: { name: string; description: string }) {
    createStep.mutate(
      { uatFlowId: flow.id, name: stepData.name, description: stepData.description || undefined },
      {
        onSuccess: () => { setShowAddForm(false); toast.success('Step added') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleUpdate(step: Step, stepData: { name: string; description: string }) {
    updateStep.mutate(
      { id: step.id, uatFlowId: flow.id, name: stepData.name, description: stepData.description || null },
      {
        onSuccess: () => { setEditingId(null); toast.success('Step updated') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleDelete(step: Step) {
    deleteStep.mutate(
      { id: step.id, uatFlowId: flow.id },
      {
        onSuccess: () => { setDeletingId(null); toast.success('Step deleted') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleImageUpload(step: Step, file: File) {
    uploadImage.mutate(
      { stepId: step.id, uatFlowId: flow.id, file },
      {
        onSuccess: () => toast.success('Image uploaded'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleImageDelete(step: Step) {
    deleteImage.mutate(
      { stepId: step.id, uatFlowId: flow.id },
      {
        onSuccess: () => toast.success('Image removed'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Steps</span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          {showAddForm ? 'Cancel' : '+ Add Step'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-3 rounded border border-border bg-muted/30 p-3">
          <StepForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitting={createStep.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : steps.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">No steps yet.</p>
      ) : (
        <div className="space-y-2">
          {steps.map((step, index) =>
            editingId === step.id ? (
              <div key={step.id} className="rounded border border-border bg-muted/30 p-3">
                <StepForm
                  initial={step}
                  onSubmit={(stepData) => handleUpdate(step, stepData)}
                  onCancel={() => setEditingId(null)}
                  submitting={updateStep.isPending}
                />
              </div>
            ) : (
              <div key={step.id} className="rounded border border-border bg-background p-3">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium text-foreground">{step.name}</span>
                    </div>
                    {step.description && (
                      <p className="mt-1 ml-7 text-xs text-muted-foreground">{step.description}</p>
                    )}
                    {step.imageFileName && (
                      <div className="mt-2 ml-7">
                        <img
                          src={`/api/steps/${step.id}/image`}
                          alt={`Step ${index + 1}`}
                          className="max-h-48 rounded border border-border object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[step.id] = el }}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(step, file)
                        e.target.value = ''
                      }}
                    />
                    <button
                      onClick={() => fileInputRefs.current[step.id]?.click()}
                      className="rounded px-1.5 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
                      title={step.imageFileName ? 'Replace image' : 'Upload image'}
                    >
                      {uploadImage.isPending ? '...' : 'Img'}
                    </button>
                    {step.imageFileName && (
                      <button
                        onClick={() => handleImageDelete(step)}
                        className="rounded px-1 py-0.5 text-xs text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Remove image"
                      >
                        x
                      </button>
                    )}
                    <button onClick={() => setEditingId(step.id)} className="text-xs text-primary hover:underline">Edit</button>
                    {deletingId === step.id ? (
                      <>
                        <button onClick={() => handleDelete(step)} className="text-xs text-red-600 hover:underline">Yes</button>
                        <button onClick={() => setDeletingId(null)} className="text-xs text-muted-foreground hover:underline">No</button>
                      </>
                    ) : (
                      <button onClick={() => setDeletingId(step.id)} className="text-xs text-red-600 hover:underline">Del</button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function FeatureSection({ feature, projectId }: { feature: Feature; projectId: string }) {
  const [expanded, setExpanded] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedFlowId, setExpandedFlowId] = useState<string | null>(null)

  const { data, isLoading } = useUatFlows(expanded ? feature.id : null)
  const createFlow = useCreateUatFlow(projectId)
  const updateFlow = useUpdateUatFlow(projectId)
  const deleteFlow = useDeleteUatFlow(projectId)

  const flows = data?.data || []

  function handleCreate(formData: { name: string; description: string; preconditions: string }) {
    createFlow.mutate(
      {
        featureId: feature.id,
        name: formData.name,
        description: formData.description || undefined,
        preconditions: formData.preconditions || undefined,
      },
      {
        onSuccess: () => {
          setShowCreateForm(false)
          toast.success('Function created')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleUpdate(flow: UatFlow, formData: { name: string; description: string; preconditions: string }) {
    updateFlow.mutate(
      {
        id: flow.id,
        featureId: flow.featureId,
        name: formData.name,
        description: formData.description || null,
        preconditions: formData.preconditions || null,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          toast.success('Function updated')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleDelete(flow: UatFlow) {
    deleteFlow.mutate(
      { id: flow.id, featureId: flow.featureId },
      {
        onSuccess: () => {
          setDeletingId(null)
          toast.success('Function deleted')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleStatusChange(flow: UatFlow, newStatus: string) {
    updateFlow.mutate(
      { id: flow.id, featureId: flow.featureId, status: newStatus },
      {
        onSuccess: () => toast.success('Status updated'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/30"
      >
        <div className="flex items-center gap-3">
          <span className={cn('text-sm transition-transform', expanded && 'rotate-90')}>
            &#9654;
          </span>
          <span className="font-medium text-foreground">{feature.name}</span>
          <PriorityBadge priority={feature.priority} />
          <StatusBadge status={feature.status} />
        </div>
        {feature.module && (
          <span className="text-xs text-muted-foreground">{feature.module}</span>
        )}
      </button>

      {expanded && (
        <div className="border-t border-border px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {isLoading ? 'Loading...' : `${flows.length} function${flows.length !== 1 ? 's' : ''}`}
            </span>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              {showCreateForm ? 'Cancel' : 'Add Function'}
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-4 rounded-lg border border-border bg-muted/30 p-3">
              <FunctionForm
                onSubmit={handleCreate}
                onCancel={() => setShowCreateForm(false)}
                submitting={createFlow.isPending}
                submitLabel="Create Function"
              />
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
            </div>
          ) : flows.length === 0 ? (
            <div className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                No functions for this feature yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {flows.map((flow) =>
                editingId === flow.id ? (
                  <div key={flow.id} className="rounded-lg border border-border bg-muted/30 p-3">
                    <FunctionForm
                      initial={flow}
                      onSubmit={(formData) => handleUpdate(flow, formData)}
                      onCancel={() => setEditingId(null)}
                      submitting={updateFlow.isPending}
                      submitLabel="Save Changes"
                    />
                  </div>
                ) : (
                  <div
                    key={flow.id}
                    className="rounded-lg border border-border bg-background p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setExpandedFlowId(expandedFlowId === flow.id ? null : flow.id)}
                            className="text-xs text-muted-foreground"
                          >
                            <span className={cn('inline-block transition-transform', expandedFlowId === flow.id && 'rotate-90')}>&#9654;</span>
                          </button>
                          <span className="text-sm font-medium text-foreground">{flow.name}</span>
                          <select
                            value={flow.status}
                            onChange={(e) => handleStatusChange(flow, e.target.value)}
                            className="rounded-md border border-input bg-background px-2 py-0.5 text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                          >
                            <option value="draft">Draft</option>
                            <option value="ready_for_test">Ready for Test</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Failed</option>
                            <option value="blocked">Blocked</option>
                          </select>
                        </div>
                        {flow.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 ml-5">{flow.description}</p>
                        )}
                        {flow.preconditions && (
                          <p className="mt-1 text-xs text-muted-foreground ml-5">
                            <span className="font-medium">Preconditions:</span> {flow.preconditions}
                          </p>
                        )}
                      </div>
                      <div className="ml-3 flex items-center gap-2">
                        <button
                          onClick={() => setEditingId(flow.id)}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Edit
                        </button>
                        {deletingId === flow.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(flow)}
                              disabled={deleteFlow.isPending}
                              className="text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="text-xs text-muted-foreground hover:underline"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeletingId(flow.id)}
                            className="text-xs font-medium text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    {expandedFlowId === flow.id && (
                      <StepsSection flow={flow} projectId={projectId} />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function UatFlowsTab({ projectId }: UatFlowsTabProps) {
  const { data, isLoading } = useFeatures(projectId)
  const features = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">Functions</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Functions are organized by feature. Expand a feature to manage its functions and steps.
      </p>

      {features.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No features defined yet. Create features first in the Features tab, then add functions here.
          </p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {features.map((feature) => (
            <FeatureSection key={feature.id} feature={feature} projectId={projectId} />
          ))}
        </div>
      )}
    </div>
  )
}
