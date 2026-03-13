import { useState } from 'react'

interface UatViewTabProps {
  projectId: string
  projectName: string
  project: Record<string, unknown>
}

export default function UatViewTab({ projectId, projectName }: UatViewTabProps) {
  const [loading, setLoading] = useState(false)
  const pdfUrl = `/api/projects/${projectId}/uat-pdf`

  async function handleDownload() {
    setLoading(true)
    try {
      const res = await fetch(pdfUrl)
      if (!res.ok) throw new Error('Failed to generate PDF')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = Object.assign(document.createElement('a'), {
        href: url,
        download: `${projectName.replace(/\s+/g, '_')}_UAT.pdf`,
      })
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">UAT View</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            User Acceptance Testing document with all functions and test cases.
          </p>
        </div>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
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
          {loading ? 'Generating...' : 'Download PDF'}
        </button>
      </div>

      <iframe
        src={pdfUrl}
        className="w-full rounded-lg border border-border"
        style={{ height: '80vh' }}
        title="UAT Document Preview"
      />
    </div>
  )
}
