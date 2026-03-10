import { router } from '@inertiajs/react'
import { useState, FormEvent } from 'react'
import { type Data } from '@generated/data'
import { Link } from '@adonisjs/inertia/react'

interface SettingsProps {
  project: Data.Project
}

export default function Settings({ project }: SettingsProps) {
  const [formData, setFormData] = useState({
    prdRequiredSignatures: project.prdRequiredSignatures,
    uatAcceptanceRequiredSignatures: project.uatAcceptanceRequiredSignatures,
    uatImplementationRequiredSignatures: project.uatImplementationRequiredSignatures,
    integrationEnabled: project.integrationEnabled,
    integrationConfig: project.integrationConfig
      ? JSON.stringify(project.integrationConfig, null, 2)
      : '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setSaved(false)

    const payload = {
      ...formData,
      integrationConfig: formData.integrationConfig ? JSON.parse(formData.integrationConfig) : null,
    }

    router.patch(`/settings/${project.id}`, payload, {
      onSuccess: () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      },
      onFinish: () => {
        setSubmitting(false)
      },
    })
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center gap-3">
        <Link
          href={`/projects/${project.id}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {project.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
      </div>
      <p className="mt-1 text-muted-foreground">
        Configure approval chains and integrations for this project.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Approval Chain</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Set the number of required signatures for each document type and stage.
          </p>

          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="prd-signatures" className="block text-sm font-medium text-foreground">
                PRD Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed to sign off a PRD version.
              </p>
              <input
                id="prd-signatures"
                type="number"
                min={0}
                value={formData.prdRequiredSignatures}
                onChange={(e) =>
                  setFormData({ ...formData, prdRequiredSignatures: parseInt(e.target.value) || 0 })
                }
                className="mt-2 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="uat-acceptance-signatures"
                className="block text-sm font-medium text-foreground"
              >
                UAT Acceptance Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed for UAT acceptance sign-off.
              </p>
              <input
                id="uat-acceptance-signatures"
                type="number"
                min={0}
                value={formData.uatAcceptanceRequiredSignatures}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    uatAcceptanceRequiredSignatures: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-2 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label
                htmlFor="uat-implementation-signatures"
                className="block text-sm font-medium text-foreground"
              >
                UAT Implementation Required Signatures
              </label>
              <p className="text-xs text-muted-foreground">
                Number of approvals needed for UAT implementation sign-off.
              </p>
              <input
                id="uat-implementation-signatures"
                type="number"
                min={0}
                value={formData.uatImplementationRequiredSignatures}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    uatImplementationRequiredSignatures: parseInt(e.target.value) || 0,
                  })
                }
                className="mt-2 block w-32 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Integration</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enable external integrations and configure connection settings.
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={formData.integrationEnabled}
                onClick={() =>
                  setFormData({ ...formData, integrationEnabled: !formData.integrationEnabled })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  formData.integrationEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                    formData.integrationEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-foreground">Integration Enabled</label>
            </div>

            {formData.integrationEnabled && (
              <div>
                <label
                  htmlFor="integration-config"
                  className="block text-sm font-medium text-foreground"
                >
                  Integration Configuration (JSON)
                </label>
                <textarea
                  id="integration-config"
                  rows={6}
                  value={formData.integrationConfig}
                  onChange={(e) => setFormData({ ...formData, integrationConfig: e.target.value })}
                  className="mt-2 block w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder='{"apiUrl": "https://...", "apiKey": "..."}'
                />
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-sm font-medium text-green-600">Settings saved successfully.</span>
          )}
          <Link
            href={`/projects/${project.id}`}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  )
}
