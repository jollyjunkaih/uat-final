import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '~/lib/utils'
import { apiFetch } from '~/lib/api'

/* ─── Types ─── */

interface TreeStep {
  id: string
  name: string
  description: string | null
  sequence: number
  gifFileName: string | null
}

interface TreeFlow {
  id: string
  name: string
  description: string | null
  featureId: string
  steps: TreeStep[]
}

interface TreeFeature {
  id: string
  name: string
  uatFlows: TreeFlow[]
}

interface SignatorOption {
  id: string
  name: string
  title: string | null
}

interface UatTestProps {
  project: { id: string; name: string }
  features: TreeFeature[]
  signators: SignatorOption[]
  testLink: { id: string; token: string }
}

interface StepResult {
  result: 'working' | 'not_working' | null
  comment: string
}

interface LocalState {
  testerName: string
  signatorId: string | null
  results: Record<string, StepResult>
}

/* ─── localStorage helpers ─── */

function loadLocalState(token: string): LocalState | null {
  try {
    const raw = localStorage.getItem(`uat-test-${token}`)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveLocalState(token: string, state: LocalState) {
  localStorage.setItem(`uat-test-${token}`, JSON.stringify(state))
}

function clearLocalState(token: string) {
  localStorage.removeItem(`uat-test-${token}`)
}

/* ─── Progress helpers ─── */

function countCompleted(results: Record<string, StepResult>, stepIds: string[]) {
  return stepIds.filter((id) => results[id]?.result != null).length
}

/* ─── Signature Pad ─── */

function SignaturePad({
  onConfirm,
  onCancel,
}: {
  onConfirm: (base64: string) => void
  onCancel: () => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    isDrawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPos(e)
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current!.getContext('2d')!
    const pos = getPos(e)
    ctx.lineTo(pos.x, pos.y)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.stroke()
  }

  function stopDraw() {
    isDrawing.current = false
  }

  function clearCanvas() {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  function confirm() {
    const base64 = canvasRef.current!.toDataURL('image/png')
    onConfirm(base64)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Sign to Confirm</h3>
        <p className="text-sm text-gray-500">Draw your signature below to confirm your submission.</p>
        <canvas
          ref={canvasRef}
          width={460}
          height={200}
          className="w-full rounded-lg border-2 border-gray-300 bg-gray-50 cursor-crosshair"
          style={{ touchAction: 'none' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        <div className="flex gap-3">
          <button
            onClick={clearCanvas}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
          <div className="flex-1" />
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            className="rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Confirm &amp; Submit
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Step Card ─── */

function StepCard({
  step,
  result,
  onChange,
}: {
  step: TreeStep
  result: StepResult
  onChange: (r: StepResult) => void
}) {
  const hasResult = result.result != null

  return (
    <div
      className={cn(
        'rounded-lg border p-4 space-y-3 transition-colors',
        result.result === 'working'
          ? 'border-green-200 bg-green-50/50'
          : result.result === 'not_working'
            ? 'border-red-200 bg-red-50/50'
            : 'border-gray-200 bg-white'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 items-center justify-center pt-0.5">
          {result.result === 'working' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          ) : result.result === 'not_working' ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
              <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          ) : (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-medium text-gray-900">
            {step.sequence}. {step.name}
          </h5>
          {step.description && (
            <p className="mt-0.5 text-xs text-gray-500">{step.description}</p>
          )}
        </div>
      </div>

      {/* GIF display */}
      {step.gifFileName && (
        <div className="flex items-center justify-center rounded-lg border border-gray-100 bg-gray-50/50">
          <img
            src={`/api/steps/${step.id}/gif`}
            alt={`GIF for ${step.name}`}
            className="max-h-80 max-w-full rounded-lg object-contain"
          />
        </div>
      )}

      {/* Radio-style checkboxes */}
      <div className="flex items-center gap-4">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name={`step-${step.id}`}
            checked={result.result === 'working'}
            onChange={() => onChange({ ...result, result: 'working' })}
            className="h-4 w-4 accent-green-600"
          />
          <span className="text-sm font-medium text-green-700">Working</span>
        </label>
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="radio"
            name={`step-${step.id}`}
            checked={result.result === 'not_working'}
            onChange={() => onChange({ ...result, result: 'not_working' })}
            className="h-4 w-4 accent-red-600"
          />
          <span className="text-sm font-medium text-red-700">Not Working</span>
        </label>
      </div>

      {/* Comment textarea - appears when a checkbox is ticked */}
      {hasResult && (
        <textarea
          value={result.comment}
          onChange={(e) => onChange({ ...result, comment: e.target.value })}
          placeholder="Add comments (optional)..."
          rows={2}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
        />
      )}
    </div>
  )
}

/* ─── Progress Overview (accordion per feature) ─── */

function ProgressOverview({
  features,
  results,
}: {
  features: TreeFeature[]
  results: Record<string, StepResult>
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">Progress Overview</h3>
      <div className="divide-y divide-gray-100">
        {features.map((feature) => {
          const featureStepIds = feature.uatFlows.flatMap((f) => f.steps.map((s) => s.id))
          const featureCompleted = countCompleted(results, featureStepIds)
          const featureTotal = featureStepIds.length
          const isOpen = openIds.has(feature.id)

          return (
            <div key={feature.id} className="py-2 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggle(feature.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className={cn(
                        'h-3.5 w-3.5 text-gray-400 transition-transform',
                        isOpen && 'rotate-90'
                      )}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span className="text-xs font-medium text-gray-700">{feature.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {featureCompleted}/{featureTotal}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all',
                      featureCompleted === featureTotal && featureTotal > 0
                        ? 'bg-green-500'
                        : featureCompleted > 0
                          ? 'bg-blue-500'
                          : 'bg-gray-200'
                    )}
                    style={{ width: `${featureTotal > 0 ? (featureCompleted / featureTotal) * 100 : 0}%` }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="mt-2 space-y-2 pl-5">
                  {feature.uatFlows.map((flow) => {
                    const flowStepIds = flow.steps.map((s) => s.id)
                    const flowCompleted = countCompleted(results, flowStepIds)
                    return (
                      <ProgressBar
                        key={flow.id}
                        completed={flowCompleted}
                        total={flowStepIds.length}
                        label={flow.name}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Progress Bar ─── */

function ProgressBar({ completed, total, label }: { completed: number; total: number; label: string }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100">
        <div
          className={cn(
            'h-2 rounded-full transition-all',
            pct === 100 ? 'bg-green-500' : pct > 0 ? 'bg-blue-500' : 'bg-gray-200'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ─── Main Page ─── */

export default function UatTest({ project, features, signators, testLink }: UatTestProps) {
  const token = testLink.token

  // Determine initial state from localStorage
  const saved = loadLocalState(token)
  const [testerName, setTesterName] = useState(saved?.testerName ?? '')
  const [signatorId, setSignatorId] = useState<string | null>(saved?.signatorId ?? null)
  const [results, setResults] = useState<Record<string, StepResult>>(saved?.results ?? {})
  const [phase, setPhase] = useState<'select' | 'testing' | 'signature' | 'submitted'>(
    saved?.testerName ? 'testing' : 'select'
  )
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Persist to localStorage on every change
  useEffect(() => {
    if (phase === 'submitted') return
    if (testerName) {
      saveLocalState(token, { testerName, signatorId, results })
    }
  }, [testerName, signatorId, results, token, phase])

  // Gather all step IDs
  const allStepIds: string[] = []
  const stepMeta: Record<string, { featureId: string; uatFlowId: string }> = {}
  for (const feature of features) {
    for (const flow of feature.uatFlows) {
      for (const step of flow.steps) {
        allStepIds.push(step.id)
        stepMeta[step.id] = { featureId: feature.id, uatFlowId: flow.id }
      }
    }
  }

  const totalSteps = allStepIds.length
  const completedSteps = countCompleted(results, allStepIds)
  const allComplete = completedSteps === totalSteps && totalSteps > 0

  function handleSelectTester(signator: SignatorOption) {
    setTesterName(signator.name)
    setSignatorId(signator.id)
    setPhase('testing')
  }

  function updateStepResult(stepId: string, result: StepResult) {
    setResults((prev) => ({ ...prev, [stepId]: result }))
  }

  const handleSubmit = useCallback(
    async (signature: string) => {
      setSubmitting(true)
      setSubmitError(null)

      const payload = {
        testerName,
        signatorId: signatorId ?? undefined,
        signature,
        results: allStepIds.map((id) => ({
          stepId: id,
          featureId: stepMeta[id].featureId,
          uatFlowId: stepMeta[id].uatFlowId,
          result: results[id].result,
          comment: results[id].comment || undefined,
        })),
      }

      try {
        await apiFetch(`/share/uat-test/${token}`, {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        clearLocalState(token)
        setPhase('submitted')
      } catch (err: any) {
        setSubmitError(err.message || 'Submission failed. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
    [testerName, signatorId, allStepIds, stepMeta, results, token]
  )

  /* ─── Phase: Submitted ─── */
  if (phase === 'submitted') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">UAT Test Submitted</h1>
          <p className="text-sm text-gray-600">
            Thank you, {testerName}. Your test results have been recorded.
          </p>
          <p className="text-xs text-gray-400">{new Date().toLocaleString()}</p>
          <p className="text-xs text-gray-500 pt-2">You can close this page.</p>
        </div>
      </div>
    )
  }

  /* ─── Phase: Tester Selection ─── */
  if (phase === 'select') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 text-center">
            <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
            <p className="mt-1 text-sm text-gray-500">UAT Testing</p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Select Your Name</h2>
            <p className="mt-1 text-sm text-gray-500">Choose your name to begin testing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {signators.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectTester(s)}
                className="rounded-lg border border-gray-200 bg-white p-4 text-left transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-sm"
              >
                <div className="font-medium text-gray-900">{s.name}</div>
                {s.title && <div className="mt-0.5 text-xs text-gray-500">{s.title}</div>}
              </button>
            ))}
          </div>

          {signators.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">
              No signators configured for this project.
            </p>
          )}
        </main>
      </div>
    )
  }

  /* ─── Phase: Signature ─── */
  if (phase === 'signature') {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Preparing signature...</p>
        </div>
        <SignaturePad
          onConfirm={(base64) => handleSubmit(base64)}
          onCancel={() => setPhase('testing')}
        />
      </>
    )
  }

  /* ─── Phase: Testing ─── */

  // Find incomplete features/flows for the summary
  const incompleteFeatures: string[] = []
  for (const feature of features) {
    const featureStepIds = feature.uatFlows.flatMap((f) => f.steps.map((s) => s.id))
    if (countCompleted(results, featureStepIds) < featureStepIds.length) {
      incompleteFeatures.push(feature.name)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base font-semibold text-gray-900">{project.name}</h1>
              <p className="text-xs text-gray-500">
                Testing as <span className="font-medium">{testerName}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {completedSteps}/{totalSteps} steps
              </div>
              <div className="text-xs text-gray-500">
                {totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0}% complete
              </div>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className={cn(
                'h-1.5 rounded-full transition-all',
                allComplete ? 'bg-green-500' : completedSteps > 0 ? 'bg-blue-500' : 'bg-gray-200'
              )}
              style={{ width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Progress Cards */}
        <ProgressOverview features={features} results={results} />

        {/* Feature sections */}
        {features.map((feature) => (
          <section key={feature.id} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              {feature.name}
            </h2>

            {feature.uatFlows.map((flow) => {
              const flowStepIds = flow.steps.map((s) => s.id)
              const flowCompleted = countCompleted(results, flowStepIds)

              return (
                <div key={flow.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">{flow.name}</h3>
                      {flow.description && (
                        <p className="text-xs text-gray-500">{flow.description}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {flowCompleted}/{flowStepIds.length} steps
                    </span>
                  </div>

                  <div className="space-y-3">
                    {flow.steps.map((step) => (
                      <StepCard
                        key={step.id}
                        step={step}
                        result={results[step.id] ?? { result: null, comment: '' }}
                        onChange={(r) => updateStepResult(step.id, r)}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        ))}

        {/* Incomplete summary */}
        {!allComplete && incompleteFeatures.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h4 className="text-sm font-medium text-amber-800">Incomplete Features</h4>
            <ul className="mt-1 space-y-0.5">
              {incompleteFeatures.map((name) => (
                <li key={name} className="text-xs text-amber-700">
                  &bull; {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      {/* Fixed bottom submit bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          {submitError && (
            <p className="mb-2 text-xs text-red-600">{submitError}</p>
          )}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {allComplete ? (
                <span className="text-green-600 font-medium">All steps completed!</span>
              ) : (
                <span>
                  {totalSteps - completedSteps} step{totalSteps - completedSteps !== 1 ? 's' : ''} remaining
                </span>
              )}
            </div>
            <button
              onClick={() => setPhase('signature')}
              disabled={!allComplete || submitting}
              className={cn(
                'rounded-lg px-6 py-2.5 text-sm font-medium text-white transition-colors',
                allComplete
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gray-300 cursor-not-allowed'
              )}
            >
              {submitting ? 'Submitting...' : 'Submit Test Results'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
