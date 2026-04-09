import React, { useState, type FormEvent } from 'react'
import { usePage } from '@inertiajs/react'
import { toast } from 'sonner'
import {
  useFeatures,
  useCreateFeature,
  useUpdateFeature,
  useDeleteFeature,
  useUploadFeatureImage,
  useDeleteFeatureImage,
} from '~/hooks/use-features'
import { PriorityBadge } from '~/components/priority-badge'

interface FeaturesTabProps {
  projectId: string
  projectName: string
  moduleList: string[]
}

interface FeatureWithImages {
  id: string
  name: string
  description: string | null
  module: string | null
  priority: string
  status: string
  ecosystem: string | null
  inScope: string | null
  outOfScope: string | null
  ownerId: string
  mockScreens?: Array<{ fileName: string; sequence: number }>
  processFlows?: Array<{ fileName: string; sequence: number }>
  [key: string]: unknown
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60)
}

function getProjectDir(projectName: string, projectId: string): string {
  const slug = slugify(projectName) || 'unnamed'
  const shortId = projectId.substring(0, 8)
  return `${slug}-${shortId}`
}

function FeatureImageSection({
  featureId,
  projectDir,
  images,
  type,
  label,
  uploadImage,
  deleteImage,
}: {
  featureId: string
  projectDir: string
  images: Array<{ fileName: string; sequence: number }> | undefined
  type: 'mock-screens' | 'process-flows'
  label: string
  uploadImage: ReturnType<typeof useUploadFeatureImage>
  deleteImage: ReturnType<typeof useDeleteFeatureImage>
}) {
  const routePrefix = type === 'mock-screens' ? 'feature-images' : 'process-flow-images'
  const items = images || []

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    for (const file of Array.from(files)) {
      uploadImage.mutate({ featureId, file, type })
    }
    e.target.value = ''
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</span>
        <label className="cursor-pointer rounded border border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent">
          + Add
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((img) => (
            <div key={img.fileName} className="group relative">
              <img
                src={`/${routePrefix}/${projectDir}/${featureId}/${img.fileName}.png`}
                alt={img.fileName}
                className="h-20 w-auto rounded border border-border object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src.endsWith('.png')) {
                    target.src = target.src.replace('.png', '.jpg')
                  } else if (target.src.endsWith('.jpg')) {
                    target.src = target.src.replace('.jpg', '.jpeg')
                  } else if (target.src.endsWith('.jpeg')) {
                    target.src = target.src.replace('.jpeg', '.webp')
                  }
                }}
              />
              <button
                onClick={() => deleteImage.mutate({ featureId, fileName: img.fileName, type })}
                className="absolute -right-1 -top-1 hidden rounded-full bg-red-500 p-0.5 text-white shadow group-hover:block"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const priorities = ['critical', 'high', 'medium', 'low'] as const

function FeatureForm({
  moduleList,
  initial,
  onSubmit,
  onCancel,
  submitting,
  submitLabel,
}: {
  moduleList: string[]
  initial?: Partial<FeatureWithImages>
  onSubmit: (data: Record<string, string>) => void
  onCancel: () => void
  submitting: boolean
  submitLabel: string
}) {
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [module, setModule] = useState(initial?.module || '')
  const [priority, setPriority] = useState<string>(initial?.priority || 'medium')
  const [ecosystem, setEcosystem] = useState((initial as Record<string, unknown>)?.ecosystem as string || '')
  const [inScope, setInScope] = useState((initial as Record<string, unknown>)?.inScope as string || '')
  const [outOfScope, setOutOfScope] = useState((initial as Record<string, unknown>)?.outOfScope as string || '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit({ name, description, module, priority, ecosystem, inScope, outOfScope })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Feature name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Module</label>
          {moduleList.length > 0 ? (
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">No module</option>
              {moduleList.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              placeholder="Module name (optional)"
            />
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Describe this feature (optional)"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Other Product Compatibility & Ecosystem</label>
        <textarea
          rows={2}
          value={ecosystem}
          onChange={(e) => setEcosystem(e.target.value)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          placeholder="Describe how this feature integrates with other devices, platforms, or software systems (optional)"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-foreground">In Scope</label>
          <textarea
            rows={2}
            value={inScope}
            onChange={(e) => setInScope(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Core features & functionalities included (optional)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground">Out of Scope (Future Considerations)</label>
          <textarea
            rows={2}
            value={outOfScope}
            onChange={(e) => setOutOfScope(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="What will not be addressed in this version (optional)"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default function FeaturesTab({ projectId, projectName, moduleList }: FeaturesTabProps) {
  const { data, isLoading } = useFeatures(projectId)
  const createFeature = useCreateFeature(projectId)
  const updateFeature = useUpdateFeature(projectId)
  const deleteFeature = useDeleteFeature(projectId)
  const uploadImage = useUploadFeatureImage(projectId)
  const deleteImage = useDeleteFeatureImage(projectId)
  const user = usePage().props.user as { id: string } | undefined

  const projectDir = getProjectDir(projectName, projectId)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const features = (data?.data || []) as FeatureWithImages[]

  function handleCreate(formData: Record<string, string>) {
    createFeature.mutate(
      {
        projectId,
        name: formData.name,
        description: formData.description || undefined,
        module: formData.module || undefined,
        priority: formData.priority,
        ecosystem: formData.ecosystem || undefined,
        inScope: formData.inScope || undefined,
        outOfScope: formData.outOfScope || undefined,
        ownerId: user?.id || '',
      },
      {
        onSuccess: () => {
          setShowCreateForm(false)
          toast.success('Feature created')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleUpdate(id: string, formData: Record<string, string>) {
    updateFeature.mutate(
      {
        id,
        name: formData.name,
        description: formData.description || null,
        module: formData.module || null,
        priority: formData.priority,
        ecosystem: formData.ecosystem || null,
        inScope: formData.inScope || null,
        outOfScope: formData.outOfScope || null,
      },
      {
        onSuccess: () => {
          setEditingId(null)
          toast.success('Feature updated')
        },
        onError: (err) => toast.error(err.message),
      }
    )
  }

  function handleDelete(id: string) {
    deleteFeature.mutate(id, {
      onSuccess: () => {
        setDeletingId(null)
        toast.success('Feature deleted')
      },
      onError: (err) => toast.error(err.message),
    })
  }

  function handleStatusChange(feature: FeatureWithImages, newStatus: string) {
    updateFeature.mutate(
      { id: feature.id, status: newStatus },
      {
        onSuccess: () => toast.success('Status updated'),
        onError: (err) => toast.error(err.message),
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-border bg-card py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Features</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {features.length} feature{features.length !== 1 ? 's' : ''} defined
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          {showCreateForm ? 'Cancel' : 'Add Feature'}
        </button>
      </div>

      {showCreateForm && (
        <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">New Feature</h4>
          <FeatureForm
            moduleList={moduleList}
            onSubmit={handleCreate}
            onCancel={() => setShowCreateForm(false)}
            submitting={createFeature.isPending}
            submitLabel="Create Feature"
          />
        </div>
      )}

      {features.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No features yet. Click "Add Feature" to create your first feature.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-border shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Module</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {features.map((feature) =>
                editingId === feature.id ? (
                  <tr key={feature.id}>
                    <td colSpan={5} className="px-4 py-4">
                      <FeatureForm
                        moduleList={moduleList}
                        initial={feature}
                        onSubmit={(formData) => handleUpdate(feature.id, formData)}
                        onCancel={() => setEditingId(null)}
                        submitting={updateFeature.isPending}
                        submitLabel="Save Changes"
                      />
                    </td>
                  </tr>
                ) : (
                  <React.Fragment key={feature.id}>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <div>
                          <button
                            onClick={() => setExpandedId(expandedId === feature.id ? null : feature.id)}
                            className="flex items-center gap-1 font-medium text-foreground hover:text-primary"
                          >
                            <svg
                              className={`h-3.5 w-3.5 transition-transform ${expandedId === feature.id ? 'rotate-90' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            {feature.name}
                          </button>
                          {feature.description && (
                            <p className="mt-0.5 ml-5 text-xs text-muted-foreground line-clamp-1">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{feature.module || '—'}</td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={feature.priority} />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={feature.status}
                          onChange={(e) => handleStatusChange(feature, e.target.value)}
                          className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                        >
                          <option value="draft">Draft</option>
                          <option value="in_review">In Review</option>
                          <option value="approved">Approved</option>
                          <option value="deprecated">Deprecated</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingId(feature.id)}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            Edit
                          </button>
                          {deletingId === feature.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleDelete(feature.id)}
                                disabled={deleteFeature.isPending}
                                className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="text-sm text-muted-foreground hover:underline"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(feature.id)}
                              className="text-sm font-medium text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === feature.id && (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 bg-muted/20">
                          <FeatureImageSection
                            featureId={feature.id}
                            projectDir={projectDir}
                            images={feature.mockScreens}
                            type="mock-screens"
                            label="Mock Screens"
                            uploadImage={uploadImage}
                            deleteImage={deleteImage}
                          />
                          <FeatureImageSection
                            featureId={feature.id}
                            projectDir={projectDir}
                            images={feature.processFlows}
                            type="process-flows"
                            label="Process Flows"
                            uploadImage={uploadImage}
                            deleteImage={deleteImage}
                          />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
