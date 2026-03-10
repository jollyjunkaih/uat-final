import { cn } from '~/lib/utils'

const testStatusConfig: Record<string, { color: string; label: string }> = {
  no_tests: { color: 'bg-gray-400', label: 'No Tests' },
  tests_failing: { color: 'bg-red-500', label: 'Tests Failing' },
  tests_passing: { color: 'bg-green-500', label: 'Tests Passing' },
}

interface TestStatusIndicatorProps {
  status: string
  showLabel?: boolean
  className?: string
}

function TestStatusIndicator({ status, showLabel = true, className }: TestStatusIndicatorProps) {
  const config = testStatusConfig[status] || { color: 'bg-gray-400', label: status }

  const displayLabel =
    config.label ||
    status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('inline-block h-2.5 w-2.5 rounded-full', config.color)} />
      {showLabel && <span className="text-xs text-gray-600">{displayLabel}</span>}
    </span>
  )
}

export { TestStatusIndicator }
