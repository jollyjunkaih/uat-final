import { useState, useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import { cn } from '~/lib/utils'

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
  steps: TreeStep[]
}

interface TreeFeature {
  id: string
  name: string
  uatFlows: TreeFlow[]
}

interface UatViewerTabProps {
  projectId: string
}

/* ─── Step Slideshow (per function) ─── */

function StepSlideshow({ steps }: { steps: TreeStep[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const total = steps.length
  const step = steps[currentIndex]

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, total - 1))
  }, [total])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Only handle if no input/textarea is focused
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goNext, goPrev])

  if (total === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No steps in this function yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {/* Step header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">
            {currentIndex + 1}. {step.name}
          </h4>
          {step.description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
          )}
        </div>
        <span className="ml-3 shrink-0 text-xs tabular-nums text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* GIF display */}
      <div
        className="flex items-center justify-center rounded-lg border border-border bg-muted/20"
        style={{ minHeight: '320px' }}
      >
        {step.gifFileName ? (
          <img
            key={step.id}
            src={`/api/steps/${step.id}/gif`}
            alt={`GIF for ${step.name}`}
            className="max-h-120 max-w-full rounded-lg object-contain"
          />
        ) : (
          <div className="text-center text-muted-foreground">
            <p className="text-sm">No GIF uploaded for this step</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          &larr; Prev
        </button>

        <div className="flex items-center gap-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all',
                idx === currentIndex
                  ? 'w-4 bg-primary'
                  : 'w-1.5 bg-border hover:bg-muted-foreground'
              )}
            />
          ))}
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex === total - 1}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  )
}

/* ─── Function Accordion ─── */

function FlowAccordion({ flows }: { flows: TreeFlow[] }) {
  const [openId, setOpenId] = useState<string | null>(flows[0]?.id ?? null)

  if (flows.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No functions in this feature yet.
      </p>
    )
  }

  return (
    <div className="divide-y divide-border rounded-lg border border-border">
      {flows.map((flow) => {
        const isOpen = openId === flow.id
        return (
          <div key={flow.id}>
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : flow.id)}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/50"
            >
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">{flow.name}</span>
                {flow.description && (
                  <span className="ml-2 text-xs text-muted-foreground">{flow.description}</span>
                )}
              </div>
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {flow.steps?.length ?? 0} step{(flow.steps?.length ?? 0) !== 1 ? 's' : ''}
                </span>
                <svg
                  className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform',
                    isOpen && 'rotate-180'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border bg-muted/10 px-4 py-4">
                <StepSlideshow steps={flow.steps || []} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Main UAT Viewer ─── */

export default function UatViewerTab({ projectId }: UatViewerTabProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['project-tree', projectId],
    queryFn: () => apiFetch<{ data: TreeFeature[] }>(`/api/projects/${projectId}/tree`),
  })

  const features = data?.data ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  if (features.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No features found. Add features, functions, and steps first.
        </p>
      </div>
    )
  }

  return (
    <Tabs defaultValue={features[0].id}>
      <TabsList>
        {features.map((feature) => (
          <TabsTrigger key={feature.id} value={feature.id}>
            {feature.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {features.map((feature) => (
        <TabsContent key={feature.id} value={feature.id}>
          <FlowAccordion flows={feature.uatFlows || []} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
