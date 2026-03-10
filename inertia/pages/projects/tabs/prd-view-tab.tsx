import { useMemo } from 'react'
import { useProjectTree } from '~/hooks/use-project-tree'
import { useCompetitors, useMilestones, useOpenQuestions, useContacts } from '~/hooks/use-prd-data'
import { useUploads } from '~/hooks/use-uploads'
import { pdf } from '@react-pdf/renderer'
import { BlobProvider } from '@react-pdf/renderer'
import PrdDocument from '~/components/pdf/prd-document'
import logoSrc from '~/public/byte of bread logo.png'
import type { Data } from '@generated/data'

interface PrdViewTabProps {
  projectId: string
  projectName: string
  project: Data.Project
}

export default function PrdViewTab({ projectId, projectName, project }: PrdViewTabProps) {
  const { data: treeData, isLoading: treeLoading } = useProjectTree(projectId)
  const { data: competitorsData, isLoading: compLoading } = useCompetitors(projectId)
  const { data: milestonesData, isLoading: msLoading } = useMilestones(projectId)
  const { data: questionsData, isLoading: qLoading } = useOpenQuestions(projectId)
  const { data: contactsData, isLoading: ctLoading } = useContacts(projectId)
  const { data: uploadsData, isLoading: upLoading } = useUploads(projectId)

  const features = treeData?.data || []
  const competitors = competitorsData?.data || []
  const milestones = milestonesData?.data || []
  const openQuestions = questionsData?.data || []
  const contacts = contactsData?.data || []
  const uploads = uploadsData?.data || []

  const isLoading = treeLoading || compLoading || msLoading || qLoading || ctLoading || upLoading

  const document = useMemo(
    () => (
      <PrdDocument
        projectName={projectName}
        project={project as unknown as Record<string, unknown>}
        features={features}
        competitors={competitors}
        milestones={milestones}
        openQuestions={openQuestions}
        contacts={contacts}
        uploads={uploads}
        logoUrl={logoSrc}
      />
    ),
    [projectName, project, features, competitors, milestones, openQuestions, contacts, uploads]
  )

  async function handleDownload() {
    const blob = await pdf(document).toBlob()
    const url = URL.createObjectURL(blob)
    const a = Object.assign(window.document.createElement('a'), {
      href: url,
      download: `${projectName.replace(/\s+/g, '_')}_PRD.pdf`,
    })
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">PRD View</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Product Requirements Document generated from your project data.
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download PDF
        </button>
      </div>

      <BlobProvider document={document}>
        {({ url, loading }) => {
          if (loading) {
            return (
              <div className="flex items-center justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
              </div>
            )
          }
          if (!url) return null
          return (
            <iframe
              src={url}
              className="w-full rounded-lg border border-border"
              style={{ height: '80vh' }}
              title="PRD Document Preview"
            />
          )
        }}
      </BlobProvider>
    </div>
  )
}
