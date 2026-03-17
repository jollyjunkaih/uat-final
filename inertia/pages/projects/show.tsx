import { Link } from '@adonisjs/inertia/react'
import { cn } from '~/lib/utils'
import { useState } from 'react'
import { type Data } from '@generated/data'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '~/lib/api'
import { toast } from 'sonner'
import FeaturesTab from './tabs/features-tab'
import UatFlowsTab from './tabs/uat-flows-tab'
import PrdViewTab from './tabs/prd-view-tab'
import UatViewTab from './tabs/uat-view-tab'
import VersionsTab from './tabs/versions-tab'
import PrdEditTab from './tabs/prd-edit-tab'
import UatViewerTab from './tabs/uat-viewer-tab'
import UserGuideViewTab from './tabs/user-guide-view-tab'
import UserGuideEditTab from './tabs/user-guide-edit-tab'
import UserGuidePdfTab from './tabs/user-guide-pdf-tab'

interface ProjectShowProps {
  project: Data.Project
}

type Tab =
  | 'features'
  | 'uat-flows'
  | 'prd-edit'
  | 'prd-view'
  | 'uat-view'
  | 'uat-viewer'
  | 'user-guide'
  | 'user-guide-edit'
  | 'user-guide-pdf'
  | 'versions'

const tabs: { key: Tab; label: string }[] = [
  { key: 'features', label: 'Features' },
  { key: 'uat-flows', label: 'Functions' },
  { key: 'prd-edit', label: 'PRD Edit' },
  { key: 'prd-view', label: 'PRD View' },
  { key: 'uat-view', label: 'UAT PDF' },
  { key: 'uat-viewer', label: 'UAT Viewer' },
  { key: 'user-guide', label: 'User Guide' },
  { key: 'user-guide-edit', label: 'Guide Edit' },
  { key: 'user-guide-pdf', label: 'Guide PDF' },
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

function TabContent({ tab, project }: { tab: Tab; project: Data.Project }) {
  switch (tab) {
    case 'features':
      return <FeaturesTab projectId={project.id} moduleList={project.moduleList} />
    case 'uat-flows':
      return <UatFlowsTab projectId={project.id} />
    case 'prd-edit':
      return <PrdEditTab project={project} />
    case 'prd-view':
      return <PrdViewTab projectId={project.id} projectName={project.name} project={project} />
    case 'uat-view':
      return <UatViewTab projectId={project.id} projectName={project.name} project={project} />
    case 'uat-viewer':
      return <UatViewerTab projectId={project.id} />
    case 'user-guide':
      return <UserGuideViewTab projectId={project.id} />
    case 'user-guide-edit':
      return <UserGuideEditTab projectId={project.id} />
    case 'user-guide-pdf':
      return <UserGuidePdfTab projectId={project.id} projectName={project.name} />
    case 'versions':
      return <VersionsTab projectId={project.id} />
  }
}

function getInitialTab(): Tab {
  const params = new URLSearchParams(window.location.search)
  const tab = params.get('tab')
  const validTabs: Tab[] = [
    'features',
    'uat-flows',
    'prd-edit',
    'prd-view',
    'uat-view',
    'uat-viewer',
    'user-guide',
    'user-guide-edit',
    'user-guide-pdf',
    'versions',
  ]
  return validTabs.includes(tab as Tab) ? (tab as Tab) : 'features'
}

export default function ProjectShow({ project }: ProjectShowProps) {
  const [activeTab, setActiveTab] = useState<Tab>(getInitialTab)
  const queryClient = useQueryClient()

  const refetchMutation = useMutation({
    mutationFn: () =>
      apiFetch<{ data: { success: boolean } }>(`/api/yaml/refetch/${project.id}`, {
        method: 'POST',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries()
      toast.success('Data refetched from YAML files')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to refetch data')
    },
  })

  const convertGifsMutation = useMutation({
    mutationFn: () =>
      apiFetch<{ data: { processed: number; skipped: string[]; errors: string[] } }>(
        `/api/yaml/convert-gifs/${project.id}`,
        { method: 'POST' }
      ),
    onSuccess: (data) => {
      queryClient.invalidateQueries()
      const result = data.data
      toast.success(`Converted ${result.processed} GIF(s)`)
      if (result.skipped.length > 0) {
        toast.warning(`Skipped ${result.skipped.length} file(s)`)
      }
      if (result.errors.length > 0) {
        toast.error(`${result.errors.length} error(s) during conversion`)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to convert GIFs')
    },
  })

  function switchTab(tab: Tab) {
    setActiveTab(tab)
    const url = new URL(window.location.href)
    url.searchParams.set('tab', tab)
    window.history.replaceState({}, '', url.toString())
  }
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
                onClick={() => switchTab(tab.key)}
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
          <TabContent tab={activeTab} project={project} />
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

      <div className="fixed bottom-6 right-6 z-50 flex gap-2">
        <button
          onClick={() => convertGifsMutation.mutate()}
          disabled={convertGifsMutation.isPending}
          className={cn(
            'rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl',
            convertGifsMutation.isPending
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-purple-600 hover:bg-purple-700'
          )}
        >
          {convertGifsMutation.isPending ? 'Converting...' : 'CONVERT GIFS'}
        </button>
        <button
          onClick={() => refetchMutation.mutate()}
          disabled={refetchMutation.isPending}
          className={cn(
            'rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl',
            refetchMutation.isPending
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-blue-600 hover:bg-blue-700'
          )}
        >
          {refetchMutation.isPending ? 'Refetching...' : 'REFETCH'}
        </button>
      </div>
    </div>
  )
}
