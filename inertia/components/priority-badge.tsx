import { Badge, type BadgeVariant } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const priorityConfig: Record<string, { variant: BadgeVariant; label: string }> = {
  critical: { variant: 'destructive', label: 'Critical' },
  high: { variant: 'warning', label: 'High' },
  medium: { variant: 'outline', label: 'Medium' },
  low: { variant: 'secondary', label: 'Low' },
}

interface PriorityBadgeProps {
  priority: string
  className?: string
}

function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || {
    variant: 'secondary' as BadgeVariant,
    label: priority,
  }

  const displayLabel =
    config.label ||
    priority.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {displayLabel}
    </Badge>
  )
}

export { PriorityBadge }
