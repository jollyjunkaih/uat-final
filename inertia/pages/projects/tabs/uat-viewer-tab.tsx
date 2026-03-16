import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'

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
  steps: TreeStep[]
}

interface TreeFeature {
  id: string
  name: string
  uatFlows: TreeFlow[]
}

interface FlatStep {
  step: TreeStep
  flowName: string
  featureName: string
  globalIndex: number
}

interface UatViewerTabProps {
  projectId: string
}

export default function UatViewerTab({ projectId }: UatViewerTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const { data, isLoading } = useQuery({
    queryKey: ['project-tree', projectId],
    queryFn: () => apiFetch<{ data: { features: TreeFeature[] } }>(`/api/projects/${projectId}/tree`),
  })

  // Flatten all steps across features/flows
  const flatSteps: FlatStep[] = []
  if (data?.data?.features) {
    let idx = 0
    for (const feature of data.data.features) {
      for (const flow of feature.uatFlows || []) {
        for (const step of flow.steps || []) {
          flatSteps.push({
            step,
            flowName: flow.name,
            featureName: feature.name,
            globalIndex: idx++,
          })
        }
      }
    }
  }

  const totalSteps = flatSteps.length
  const current = flatSteps[currentIndex] || null

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (totalSteps === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No steps found. Add features, functions, and steps first.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      {/* Breadcrumb */}
      {current && (
        <div className="border-b border-border px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{current.featureName}</span>
            <span>&gt;</span>
            <span>{current.flowName}</span>
            <span>&gt;</span>
            <span className="font-medium text-foreground">
              Step {currentIndex + 1} of {totalSteps}
            </span>
          </div>
        </div>
      )}

      {/* Main content */}
      {current && (
        <div className="p-6">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-foreground">{current.step.name}</h3>
            {current.step.description && (
              <p className="mt-2 text-sm text-muted-foreground">{current.step.description}</p>
            )}
          </div>

          {/* GIF display */}
          <div className="flex items-center justify-center rounded-lg border border-border bg-muted/20 p-4" style={{ minHeight: '400px' }}>
            {current.step.gifFileName ? (
              <img
                key={current.step.id}
                src={`/api/steps/${current.step.id}/gif`}
                alt={`GIF for ${current.step.name}`}
                className="max-h-[500px] max-w-full rounded-lg object-contain"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p className="text-lg">No GIF available for this step</p>
                <p className="mt-1 text-sm">Upload a GIF in the Functions tab</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border px-6 py-4">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>&larr;</span> Previous
        </button>

        <div className="flex items-center gap-1">
          {flatSteps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 w-2 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-primary' : 'bg-border hover:bg-muted-foreground'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === totalSteps - 1}
          className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next <span>&rarr;</span>
        </button>
      </div>
    </div>
  )
}
