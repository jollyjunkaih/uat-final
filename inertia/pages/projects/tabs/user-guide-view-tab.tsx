import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
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

interface UserGuideViewTabProps {
  projectId: string
}

function SectionCard({ section }: { section: GuideSection }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-accent/50"
      >
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
          {section.module && (
            <span className="mt-1 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {section.module}
            </span>
          )}
        </div>
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {section.steps?.length ?? 0} step{(section.steps?.length ?? 0) !== 1 ? 's' : ''}
          </span>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
              section.status === 'published'
                ? 'bg-green-100 text-green-800'
                : section.status === 'archived'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-yellow-100 text-yellow-800'
            )}
          >
            {section.status}
          </span>
          <svg
            className={cn(
              'h-4 w-4 text-muted-foreground transition-transform',
              expanded && 'rotate-180'
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
      {expanded && (
        <div className="border-t border-border px-5 py-4">
          {section.steps && section.steps.length > 0 ? (
            <ol className="space-y-3">
              {section.steps.map((step, idx) => (
                <li key={step.id} className="flex gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.instruction}
                    </p>
                    {step.imageFileName && (
                      <img
                        src={`/api/user-guide/step-image/${step.id}`}
                        alt={step.imageFileName}
                        className="mt-2 max-w-full rounded-lg border border-border"
                      />
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground italic">No steps defined.</p>
          )}
        </div>
      )}
    </div>
  )
}

function RoleAccordion({
  role,
  isOpen,
  onToggle,
}: {
  role: RoleGroup
  isOpen: boolean
  onToggle: () => void
}) {
  const roleColors: Record<string, string> = {
    requester: 'border-l-blue-500',
    'office-service-officer': 'border-l-emerald-500',
    'requesting-hod': 'border-l-amber-500',
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-card overflow-hidden border-l-4',
        roleColors[role.roleSlug] || 'border-l-gray-400'
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-accent/30"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{role.roleName}</h3>
          {role.roleDescription && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {role.roleDescription}
            </p>
          )}
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-3">
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {role.sections.length} section{role.sections.length !== 1 ? 's' : ''}
          </span>
          <svg
            className={cn(
              'h-5 w-5 text-muted-foreground transition-transform',
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
        <div className="border-t border-border px-6 py-4 space-y-3">
          {role.sections.map((section) => (
            <SectionCard key={section.id} section={section} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function UserGuideViewTab({ projectId }: UserGuideViewTabProps) {
  const [openRole, setOpenRole] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['user-guide-grouped', projectId],
    queryFn: () =>
      apiFetch<{ data: RoleGroup[] }>(`/api/user-guide/grouped/${projectId}`),
  })

  const roles = data?.data ?? []

  // Auto-open first role on load
  if (roles.length > 0 && openRole === null) {
    setTimeout(() => setOpenRole(roles[0].roleSlug), 0)
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
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-foreground">No User Guide Sections</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Import a user-guide.yaml file or create sections from the User Guide Edit tab.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User Guide</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Role-based documentation for the system. Select a role to view its guide sections.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {roles.length} role{roles.length !== 1 ? 's' : ''} &middot;{' '}
            {roles.reduce((acc, r) => acc + r.sections.length, 0)} sections
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {roles.map((role) => (
          <RoleAccordion
            key={role.roleSlug}
            role={role}
            isOpen={openRole === role.roleSlug}
            onToggle={() =>
              setOpenRole(openRole === role.roleSlug ? null : role.roleSlug)
            }
          />
        ))}
      </div>
    </div>
  )
}
