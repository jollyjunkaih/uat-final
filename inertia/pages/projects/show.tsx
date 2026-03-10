import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import { useState } from 'react'
import { type Data } from '@generated/data'
import FeaturesTab from './tabs/features-tab'
import UatFlowsTab from './tabs/uat-flows-tab'
import PrdViewTab from './tabs/prd-view-tab'
import UatViewTab from './tabs/uat-view-tab'
import VersionsTab from './tabs/versions-tab'

interface ProjectShowProps {
  project: Data.Project
}

type Tab = 'features' | 'uat-flows' | 'prd-view' | 'uat-view' | 'versions'

const tabs: { key: Tab; label: string }[] = [
  { key: 'features', label: 'Features' },
  { key: 'uat-flows', label: 'UAT Flows' },
  { key: 'prd-view', label: 'PRD View' },
  { key: 'uat-view', label: 'UAT View' },
  { key: 'versions', label: 'Versions' },
]

function ProjectStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-yellow-100 text-yellow-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status}
    </span>
  )
}

function TabContent({
  tab,
  projectId,
  projectName,
  moduleList,
}: {
  tab: Tab
  projectId: string
  projectName: string
  moduleList: string[]
}) {
  switch (tab) {
    case 'features':
      return <FeaturesTab projectId={projectId} moduleList={moduleList} />
    case 'uat-flows':
      return <UatFlowsTab projectId={projectId} />
    case 'prd-view':
      return <PrdViewTab projectId={projectId} projectName={projectName} />
    case 'uat-view':
      return <UatViewTab projectId={projectId} projectName={projectName} />
    case 'versions':
      return <VersionsTab projectId={projectId} />
  }
}

export default function ProjectShow({ project }: ProjectShowProps) {
  const [activeTab, setActiveTab] = useState<Tab>('features')
  console.log(project)
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
              Projects
            </Link>
            <span className="text-muted-foreground">/</span>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.name}</h1>
          </div>
          {project.description && (
            <p className="mt-2 text-muted-foreground">{project.description}</p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <ProjectStatusBadge status={project.status} />
            <span className="text-sm text-muted-foreground">
              Created {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : '—'}
            </span>
          </div>
        </div>
        <Link
          href={`/settings/${project.id}`}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Settings
        </Link>
      </div>

      {project.moduleList.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.moduleList.map((module) => (
            <span
              key={module}
              className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
            >
              {module}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <div className="border-b border-border">
          <nav className="-mb-px flex gap-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'border-b-2 px-1 pb-3 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
          <TabContent tab={activeTab} projectId={project.id} projectName={project.name} moduleList={project.moduleList} />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4 rounded-lg border border-border bg-muted/30 p-4">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            PRD Signatures Required
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {project.prdRequiredSignatures}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            UAT Acceptance Signatures
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {project.uatAcceptanceRequiredSignatures}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            UAT Implementation Signatures
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {project.uatImplementationRequiredSignatures}
          </p>
        </div>
      </div>
    </div>
  )
}
