import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { useFeatures, type Feature } from '~/hooks/use-features'
import { useUatFlows, useCreateUatFlow, useUpdateUatFlow, useDeleteUatFlow, type UatFlow } from '~/hooks/use-uat-flows'
import { useTestCases, useCreateTestCase, useUpdateTestCase, useDeleteTestCase, type TestCase } from '~/hooks/use-test-cases'
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

function TestCaseForm({
  initial,
  nextTestNo,
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: Partial<TestCase>
  nextTestNo: number
  onSubmit: (data: Partial<TestCase>) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [testNo, setTestNo] = useState(initial?.testNo ?? nextTestNo)
  const [descriptionOfTasks, setDescriptionOfTasks] = useState(initial?.descriptionOfTasks || '')
  const [stepsToExecute, setStepsToExecute] = useState(initial?.stepsToExecute || '')
  const [expectedResults, setExpectedResults] = useState(initial?.expectedResults || '')
  const [defectComments, setDefectComments] = useState(initial?.defectComments || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ testNo, descriptionOfTasks, stepsToExecute, expectedResults, defectComments: defectComments || undefined })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div>
          <label className="block text-xs font-medium text-foreground">Test No.</label>
          <input
            type="number"
            required
            value={testNo}
            onChange={(e) => setTestNo(Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-3">
          <label className="block text-xs font-medium text-foreground">Description of Tasks</label>
          <input
            type="text"
            required
            value={descriptionOfTasks}
            onChange={(e) => setDescriptionOfTasks(e.target.value)}
            className={inputClass}
            placeholder="What needs to be tested"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-foreground">Steps to Execute</label>
          <textarea
            rows={2}
            required
            value={stepsToExecute}
            onChange={(e) => setStepsToExecute(e.target.value)}
            className={inputClass}
            placeholder="Step-by-step instructions"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground">Expected Results</label>
          <textarea
            rows={2}
            required
            value={expectedResults}
            onChange={(e) => setExpectedResults(e.target.value)}
            className={inputClass}
            placeholder="What should happen"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-foreground">Defect / Comments</label>
        <input
          type="text"
          value={defectComments}
          onChange={(e) => setDefectComments(e.target.value)}
          className={inputClass}
          placeholder="Optional notes"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-border px-3 py-1 text-xs font-medium text-foreground hover:bg-accent">
          Cancel
        </button>
        <button type="submit" disabled={submitting} className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50">
          {submitting ? 'Saving...' : initial?.id ? 'Update' : 'Add Test Case'}
        </button>
      </div>
    </form>
  )
}

function TestCasesSection({ flow, projectId }: { flow: UatFlow; projectId: string }) {
  const { data, isLoading } = useTestCases(flow.id)
  const createTestCase = useCreateTestCase(projectId)
  const updateTestCase = useUpdateTestCase(projectId)
  const deleteTestCase = useDeleteTestCase(projectId)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const testCases = data?.data || []
  const nextTestNo = testCases.length > 0 ? Math.max(...testCases.map((tc) => tc.testNo)) + 1 : 1

  function handleCreate(tcData: Partial<TestCase>) {
    createTestCase.mutate(
      { uatFlowId: flow.id, testNo: tcData.testNo!, descriptionOfTasks: tcData.descriptionOfTasks!, stepsToExecute: tcData.stepsToExecute!, expectedResults: tcData.expectedResults!, defectComments: tcData.defectComments },
      {
        onSuccess: () => { setShowAddForm(false); toast.success('Test case added') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleUpdate(tc: TestCase, tcData: Partial<TestCase>) {
    updateTestCase.mutate(
      { id: tc.id, uatFlowId: flow.id, ...tcData },
      {
        onSuccess: () => { setEditingId(null); toast.success('Test case updated') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handlePassFail(tc: TestCase, field: 'pass' | 'fail', value: boolean) {
    const update: Record<string, unknown> = { id: tc.id, uatFlowId: flow.id, [field]: value }
    if (field === 'pass' && value) update.fail = false
    if (field === 'fail' && value) update.pass = false
    updateTestCase.mutate(update as { id: string; uatFlowId: string }, {
      onSuccess: () => toast.success('Updated'),
      onError: (err) => toast.error(err.message),
    })
  }

  function handleDelete(tc: TestCase) {
    deleteTestCase.mutate(
      { id: tc.id, uatFlowId: flow.id },
      {
        onSuccess: () => { setDeletingId(null); toast.success('Test case deleted') },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test Cases</span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          {showAddForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showAddForm && (
        <div className="mb-3 rounded border border-border bg-muted/30 p-3">
          <TestCaseForm
            nextTestNo={nextTestNo}
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            submitting={createTestCase.isPending}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      ) : testCases.length === 0 ? (
        <p className="text-xs italic text-muted-foreground">No test cases yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">No.</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Description</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Steps</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Expected</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground text-center">Pass</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground text-center">Fail</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Defect / Comments</th>
                <th className="px-2 py-1.5 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {testCases.map((tc) =>
                editingId === tc.id ? (
                  <tr key={tc.id}>
                    <td colSpan={8} className="p-2">
                      <TestCaseForm
                        initial={tc}
                        nextTestNo={tc.testNo}
                        onSubmit={(tcData) => handleUpdate(tc, tcData)}
                        onCancel={() => setEditingId(null)}
                        submitting={updateTestCase.isPending}
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={tc.id} className="hover:bg-muted/30">
                    <td className="px-2 py-1.5 font-medium">{tc.testNo}</td>
                    <td className="px-2 py-1.5 max-w-[150px] truncate">{tc.descriptionOfTasks}</td>
                    <td className="px-2 py-1.5 max-w-[150px] truncate">{tc.stepsToExecute}</td>
                    <td className="px-2 py-1.5 max-w-[150px] truncate">{tc.expectedResults}</td>
                    <td className="px-2 py-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={tc.pass}
                        onChange={(e) => handlePassFail(tc, 'pass', e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <input
                        type="checkbox"
                        checked={tc.fail}
                        onChange={(e) => handlePassFail(tc, 'fail', e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </td>
                    <td className="px-2 py-1.5 max-w-[120px] truncate text-muted-foreground">{tc.defectComments || '—'}</td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setEditingId(tc.id)} className="text-xs text-primary hover:underline">Edit</button>
                        {deletingId === tc.id ? (
                          <>
                            <button onClick={() => handleDelete(tc)} className="text-xs text-red-600 hover:underline">Yes</button>
                            <button onClick={() => setDeletingId(null)} className="text-xs text-muted-foreground hover:underline">No</button>
                          </>
                        ) : (
                          <button onClick={() => setDeletingId(tc.id)} className="text-xs text-red-600 hover:underline">Del</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
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
                      <TestCasesSection flow={flow} projectId={projectId} />
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
        Functions are organized by feature. Expand a feature to manage its functions and test cases.
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
