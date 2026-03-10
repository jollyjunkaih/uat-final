import { router } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { useState, type FormEvent } from 'react'
import { type Data } from '@generated/data'

type SignOffRecord = Data.SignOffRecord & {
  links?: Array<{
    id: string
    approverName: string
    approverEmail: string
    status: string
    signedAt: string | null
  }>
}

interface SignOffPanelProps {
  records: SignOffRecord[]
  projectId?: string
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    signed: 'bg-green-100 text-green-800',
    expired: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status.replace('_', ' ')}
    </span>
  )
}

function DocTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    PRD: 'bg-blue-100 text-blue-800',
    UAT: 'bg-purple-100 text-purple-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors[type] || 'bg-gray-100 text-gray-800'
      )}
    >
      {type}
    </span>
  )
}

interface Approver {
  name: string
  email: string
}

export default function SignOffPanel({ records }: SignOffPanelProps) {
  const [showForm, setShowForm] = useState(false)
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    versionId: '',
    stage: 'prd_approval',
    requiredSignatures: 1,
  })
  const [approvers, setApprovers] = useState<Approver[]>([{ name: '', email: '' }])

  function addApprover() {
    setApprovers([...approvers, { name: '', email: '' }])
  }

  function removeApprover(index: number) {
    if (approvers.length > 1) {
      setApprovers(approvers.filter((_, i) => i !== index))
    }
  }

  function updateApprover(index: number, field: keyof Approver, value: string) {
    const updated = [...approvers]
    updated[index] = { ...updated[index], [field]: value }
    setApprovers(updated)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const payload = {
      ...formData,
      approvers: approvers.filter((a) => a.name && a.email),
    }

    router.post('/sign-off/initiate', payload as any, {
      onFinish: () => {
        setSubmitting(false)
        setShowForm(false)
        setFormData({ versionId: '', stage: 'prd_approval', requiredSignatures: 1 })
        setApprovers([{ name: '', email: '' }])
      },
    })
  }

  function toggleExpand(recordId: string) {
    setExpandedRecord(expandedRecord === recordId ? null : recordId)
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign-Off Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Initiate and track document approval workflows.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {showForm ? 'Cancel' : 'Initiate Sign-Off'}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Initiate New Sign-Off</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="signoff-version"
                  className="block text-sm font-medium text-foreground"
                >
                  Version ID
                </label>
                <input
                  id="signoff-version"
                  type="text"
                  required
                  value={formData.versionId}
                  onChange={(e) => setFormData({ ...formData, versionId: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="Enter version ID"
                />
              </div>
              <div>
                <label
                  htmlFor="signoff-stage"
                  className="block text-sm font-medium text-foreground"
                >
                  Stage
                </label>
                <select
                  id="signoff-stage"
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="prd_approval">PRD Approval</option>
                  <option value="uat_acceptance">UAT Acceptance</option>
                  <option value="uat_implementation">UAT Implementation</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="signoff-required"
                  className="block text-sm font-medium text-foreground"
                >
                  Required Signatures
                </label>
                <input
                  id="signoff-required"
                  type="number"
                  min={1}
                  value={formData.requiredSignatures}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      requiredSignatures: parseInt(e.target.value) || 1,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-foreground">Approvers</label>
                <button
                  type="button"
                  onClick={addApprover}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  + Add Approver
                </button>
              </div>
              <div className="mt-2 space-y-3">
                {approvers.map((approver, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={approver.name}
                      onChange={(e) => updateApprover(index, 'name', e.target.value)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={approver.email}
                      onChange={(e) => updateApprover(index, 'email', e.target.value)}
                      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    {approvers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeApprover(index)}
                        className="shrink-0 rounded-md border border-border px-2 py-2 text-sm text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'Initiating...' : 'Initiate Sign-Off'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-foreground">No sign-off records</h2>
            <p className="mt-2 max-w-sm text-muted-foreground">
              Initiate a sign-off to start the approval workflow for a document version.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
            >
              Initiate Sign-Off
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div
                key={record.id}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              >
                <button
                  onClick={() => toggleExpand(record.id)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left hover:bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <DocTypeBadge type={record.documentType} />
                    <span className="text-sm font-medium text-foreground">
                      {record.signOffStage.replace(/_/g, ' ')}
                    </span>
                    <StatusBadge status={record.status} />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {record.requiredSignatures} signature{record.requiredSignatures !== 1 ? 's' : ''}{' '}
                      required
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '—'}
                    </span>
                    <svg
                      className={cn(
                        'h-4 w-4 text-muted-foreground transition-transform',
                        expandedRecord === record.id && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expandedRecord === record.id && (
                  <div className="border-t border-border px-4 py-4">
                    {record.links && record.links.length > 0 ? (
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-2 font-medium text-muted-foreground">Approver</th>
                            <th className="pb-2 font-medium text-muted-foreground">Email</th>
                            <th className="pb-2 font-medium text-muted-foreground">Status</th>
                            <th className="pb-2 font-medium text-muted-foreground">Signed At</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {record.links.map((link) => (
                            <tr key={link.id}>
                              <td className="py-2 text-foreground">{link.approverName}</td>
                              <td className="py-2 text-muted-foreground">{link.approverEmail}</td>
                              <td className="py-2">
                                <StatusBadge status={link.status} />
                              </td>
                              <td className="py-2 text-muted-foreground">
                                {link.signedAt
                                  ? new Date(link.signedAt).toLocaleDateString()
                                  : 'Pending'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No sign-off links generated yet for this record.
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
