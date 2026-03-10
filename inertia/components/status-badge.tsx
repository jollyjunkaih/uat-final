import { Badge, type BadgeVariant } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

const statusConfig: Record<string, { variant: BadgeVariant; label: string }> = {
  draft: { variant: 'secondary', label: 'Draft' },
  in_review: { variant: 'outline', label: 'In Review' },
  approved: { variant: 'success', label: 'Approved' },
  deprecated: { variant: 'destructive', label: 'Deprecated' },
  pending: { variant: 'warning', label: 'Pending' },
  active: { variant: 'success', label: 'Active' },
  archived: { variant: 'secondary', label: 'Archived' },
  rejected: { variant: 'destructive', label: 'Rejected' },
  signed: { variant: 'success', label: 'Signed' },
  not_signed: { variant: 'warning', label: 'Not Signed' },
  ready_for_test: { variant: 'outline', label: 'Ready for Test' },
  passed: { variant: 'success', label: 'Passed' },
  failed: { variant: 'destructive', label: 'Failed' },
  blocked: { variant: 'warning', label: 'Blocked' },
  pending_approval: { variant: 'warning', label: 'Pending Approval' },
}

interface StatusBadgeProps {
  status: string
  className?: string
}

function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { variant: 'secondary' as BadgeVariant, label: status }

  const displayLabel = config.label || status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <Badge variant={config.variant} className={cn(className)}>
      {displayLabel}
    </Badge>
  )
}

export { StatusBadge }
