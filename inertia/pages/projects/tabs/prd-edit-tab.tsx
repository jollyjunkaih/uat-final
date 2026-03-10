import { useState, useCallback, useRef, type ChangeEvent } from 'react'
import { toast } from 'sonner'
import { apiFetch } from '~/lib/api'
import { type Data } from '@generated/data'
import {
  useCompetitors, useCreateCompetitor, useUpdateCompetitor, useDeleteCompetitor,
} from '~/hooks/use-prd-data'
import {
  useMilestones, useCreateMilestone, useUpdateMilestone, useDeleteMilestone,
} from '~/hooks/use-prd-data'
import {
  useOpenQuestions, useCreateOpenQuestion, useUpdateOpenQuestion, useDeleteOpenQuestion,
} from '~/hooks/use-prd-data'
import {
  useContacts, useCreateContact, useUpdateContact, useDeleteContact,
} from '~/hooks/use-prd-data'
import { useUploads, useUploadFile, useDeleteUpload } from '~/hooks/use-uploads'

interface PrdEditTabProps {
  project: Data.Project
}

const inputClass = 'mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring'
const labelClass = 'block text-sm font-medium text-foreground'
const sectionClass = 'rounded-lg border border-border bg-card p-4'
const sectionTitleClass = 'text-base font-semibold text-foreground cursor-pointer flex items-center gap-2'

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={sectionClass}>
      <button type="button" onClick={() => setOpen(!open)} className={sectionTitleClass}>
        <span className={`text-xs transition-transform ${open ? 'rotate-90' : ''}`}>&#9654;</span>
        {title}
      </button>
      {open && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  )
}

export default function PrdEditTab({ project }: PrdEditTabProps) {
  const projectData = project as unknown as Record<string, unknown>
  const projectId = project.id
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const saveField = useCallback((field: string, value: unknown) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      apiFetch(`/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify({ [field]: value }),
      }).catch((err) => toast.error(err.message))
    }, 800)
  }, [projectId])

  function fieldProps(field: string) {
    return {
      defaultValue: (projectData[field] as string) || '',
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => saveField(field, e.target.value),
    }
  }

  // PRD Sub-resources
  const competitors = useCompetitors(projectId)
  const createCompetitor = useCreateCompetitor(projectId)
  const updateCompetitor = useUpdateCompetitor(projectId)
  const deleteCompetitor = useDeleteCompetitor(projectId)

  const milestones = useMilestones(projectId)
  const createMilestone = useCreateMilestone(projectId)
  const updateMilestone = useUpdateMilestone(projectId)
  const deleteMilestone = useDeleteMilestone(projectId)

  const openQuestions = useOpenQuestions(projectId)
  const createOpenQuestion = useCreateOpenQuestion(projectId)
  const updateOpenQuestion = useUpdateOpenQuestion(projectId)
  const deleteOpenQuestion = useDeleteOpenQuestion(projectId)

  const contacts = useContacts(projectId)
  const createContact = useCreateContact(projectId)
  const updateContact = useUpdateContact(projectId)
  const deleteContact = useDeleteContact(projectId)

  const uploads = useUploads(projectId)
  const uploadFile = useUploadFile(projectId)
  const deleteUpload = useDeleteUpload(projectId)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Edit PRD</h3>
      <p className="text-sm text-muted-foreground">Fill in the Product Requirements Document sections. Changes are saved automatically.</p>

      {/* Product Overview */}
      <Section title="Product Overview" defaultOpen>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Company Name</label>
            <input type="text" className={inputClass} {...fieldProps('companyName')} />
          </div>
          <div>
            <label className={labelClass}>Product Name</label>
            <input type="text" className={inputClass} {...fieldProps('productName')} />
          </div>
          <div>
            <label className={labelClass}>Project Manager / Owner</label>
            <input type="text" className={inputClass} {...fieldProps('projectManager')} />
          </div>
          <div>
            <label className={labelClass}>Contributors</label>
            <input type="text" className={inputClass} {...fieldProps('contributors')} placeholder="PM, Designer, Engineer, Analyst" />
          </div>
          <div>
            <label className={labelClass}>Version</label>
            <input type="text" className={inputClass} {...fieldProps('prdVersion')} />
          </div>
          <div>
            <label className={labelClass}>Locations of Sale</label>
            <input type="text" className={inputClass} {...fieldProps('locationsOfSale')} />
          </div>
          <div>
            <label className={labelClass}>Date</label>
            <input type="text" className={inputClass} {...fieldProps('prdDate')} />
          </div>
          <div>
            <label className={labelClass}>Prepared By</label>
            <input type="text" className={inputClass} {...fieldProps('preparedBy')} />
          </div>
        </div>
      </Section>

      {/* Purpose */}
      <Section title="Purpose">
        <div>
          <label className={labelClass}>Objective</label>
          <textarea rows={3} className={inputClass} {...fieldProps('objective')} placeholder="Explain what problem the product is solving and what it will do" />
        </div>
        <div>
          <label className={labelClass}>Target Market</label>
          <textarea rows={2} className={inputClass} {...fieldProps('targetMarket')} placeholder="What is the market for this product?" />
        </div>
        <div>
          <label className={labelClass}>Target Audience</label>
          <textarea rows={2} className={inputClass} {...fieldProps('targetAudience')} placeholder="Get more specific with customer segmentation" />
        </div>
        <div>
          <label className={labelClass}>Success Metrics</label>
          <textarea rows={2} className={inputClass} {...fieldProps('successMetrics')} placeholder="Describe what success looks like for this project" />
        </div>
      </Section>

      {/* Competition */}
      <Section title="Competition">
        <div className="space-y-2">
          {(competitors.data?.data || []).map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input
                type="text"
                className={inputClass}
                defaultValue={c.competitorName}
                placeholder="Competitor name"
                onBlur={(e) => { if (e.target.value !== c.competitorName) updateCompetitor.mutate({ id: c.id, competitorName: e.target.value }) }}
              />
              <input
                type="text"
                className={inputClass}
                defaultValue={c.productNameOrLink || ''}
                placeholder="Product / Link"
                onBlur={(e) => { if (e.target.value !== (c.productNameOrLink || '')) updateCompetitor.mutate({ id: c.id, productNameOrLink: e.target.value }) }}
              />
              <button onClick={() => deleteCompetitor.mutate(c.id)} className="text-xs text-red-600 hover:underline shrink-0">Remove</button>
            </div>
          ))}
          <button
            onClick={() => createCompetitor.mutate({ projectId, competitorName: '' })}
            className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            + Add Competitor
          </button>
        </div>
      </Section>

      {/* User Interaction */}
      <Section title="User Interaction">
        <div>
          <label className={labelClass}>User Interactions</label>
          <textarea rows={2} className={inputClass} {...fieldProps('userInteractions')} placeholder="Describe how users will interact with the product" />
        </div>
        <div>
          <label className={labelClass}>Touchpoint</label>
          <textarea rows={2} className={inputClass} {...fieldProps('touchpoint')} placeholder="Describe the number of buttons and displays and its functionality" />
        </div>
        <div>
          <label className={labelClass}>User Feedback</label>
          <textarea rows={2} className={inputClass} {...fieldProps('userFeedback')} placeholder="Describe any haptic or auditory feedback" />
        </div>
      </Section>

      {/* Design & Branding */}
      <Section title="Design and Branding">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Form Factor</label>
            <textarea rows={2} className={inputClass} {...fieldProps('formFactor')} placeholder="Dimensions, weight, mounting options" />
          </div>
          <div>
            <label className={labelClass}>Materials</label>
            <textarea rows={2} className={inputClass} {...fieldProps('materials')} placeholder="Material types and special treatments" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Branding Adjectives</label>
          <input type="text" className={inputClass}
            defaultValue={Array.isArray(projectData.brandingAdjectives) ? (projectData.brandingAdjectives as string[]).join(', ') : ''}
            placeholder="modern, durable, sleek (comma-separated)"
            onBlur={(e) => saveField('brandingAdjectives', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </div>
        <div>
          <label className={labelClass}>Branding Tone</label>
          <input type="text" className={inputClass}
            defaultValue={Array.isArray(projectData.brandingTone) ? (projectData.brandingTone as string[]).join(', ') : ''}
            placeholder="approachable, professional, bold (comma-separated)"
            onBlur={(e) => saveField('brandingTone', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          />
        </div>
        <div>
          <label className={labelClass}>Visual Identity</label>
          <textarea rows={2} className={inputClass} {...fieldProps('visualIdentity')} placeholder="Key colors, logo placement, and design elements" />
        </div>
        <div>
          <label className={labelClass}>Packaging & Presentation</label>
          <textarea rows={2} className={inputClass} {...fieldProps('packagingPresentation')} placeholder="Branding requirements for packaging, unboxing experience" />
        </div>
      </Section>

      {/* Software Architecture */}
      <Section title="Software Architecture and Data Processing">
        <div>
          <label className={labelClass}>Firmware Functions / Algorithms</label>
          <textarea rows={3} className={inputClass} {...fieldProps('firmwareFunctions')} placeholder="Outline the key firmware functions and algorithms" />
        </div>
        <div>
          <label className={labelClass}>Cloud Application</label>
          <textarea rows={3} className={inputClass} {...fieldProps('cloudApplication')} placeholder="Overview of cloud infrastructure and backend services" />
        </div>
        <div>
          <label className={labelClass}>Smartphone Application</label>
          <textarea rows={3} className={inputClass} {...fieldProps('smartphoneApplication')} placeholder="Core features of the smartphone application" />
        </div>
      </Section>

      {/* Servicing & Updates */}
      <Section title="Servicing and Updates">
        <div>
          <label className={labelClass}>Servicing & Updates</label>
          <textarea rows={4} className={inputClass} {...fieldProps('servicingUpdates')} placeholder="Explain how the product will be serviced. Determine must-haves vs nice-to-haves." />
        </div>
      </Section>

      {/* Milestones & Timeline */}
      <Section title="Milestones & Timeline">
        <div>
          <label className={labelClass}>Target Release Date</label>
          <input type="text" className={inputClass} {...fieldProps('targetReleaseDate')} />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Key Milestones</label>
          {(milestones.data?.data || []).map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <input type="text" className={inputClass} defaultValue={m.department} placeholder="Department"
                onBlur={(e) => { if (e.target.value !== m.department) updateMilestone.mutate({ id: m.id, department: e.target.value }) }} />
              <input type="text" className={inputClass} defaultValue={m.startDate || ''} placeholder="Start date"
                onBlur={(e) => updateMilestone.mutate({ id: m.id, startDate: e.target.value })} />
              <select className={inputClass} defaultValue={m.status}
                onChange={(e) => updateMilestone.mutate({ id: m.id, status: e.target.value })}>
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <input type="text" className={inputClass} defaultValue={m.completionDate || ''} placeholder="Completion date"
                onBlur={(e) => updateMilestone.mutate({ id: m.id, completionDate: e.target.value })} />
              <button onClick={() => deleteMilestone.mutate(m.id)} className="text-xs text-red-600 hover:underline shrink-0">Remove</button>
            </div>
          ))}
          <button
            onClick={() => createMilestone.mutate({ projectId, department: '' })}
            className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            + Add Milestone
          </button>
        </div>
      </Section>

      {/* Open Questions */}
      <Section title="Open Questions">
        <div className="space-y-2">
          {(openQuestions.data?.data || []).map((q) => (
            <div key={q.id} className="flex items-start gap-2">
              <textarea className={inputClass} rows={1} defaultValue={q.question} placeholder="Question"
                onBlur={(e) => { if (e.target.value !== q.question) updateOpenQuestion.mutate({ id: q.id, question: e.target.value }) }} />
              <textarea className={inputClass} rows={1} defaultValue={q.answer || ''} placeholder="Answer"
                onBlur={(e) => updateOpenQuestion.mutate({ id: q.id, answer: e.target.value })} />
              <input type="text" className={inputClass + ' max-w-32'} defaultValue={q.dateAnswered || ''} placeholder="Date"
                onBlur={(e) => updateOpenQuestion.mutate({ id: q.id, dateAnswered: e.target.value })} />
              <button onClick={() => deleteOpenQuestion.mutate(q.id)} className="text-xs text-red-600 hover:underline shrink-0 mt-2">Remove</button>
            </div>
          ))}
          <button
            onClick={() => createOpenQuestion.mutate({ projectId, question: '' })}
            className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            + Add Question
          </button>
        </div>
      </Section>

      {/* Additional Information */}
      <Section title="Additional Information">
        <div>
          <label className={labelClass}>Diagrams & Schematics</label>
          <textarea rows={2} className={inputClass} {...fieldProps('diagramsSchematics')} placeholder="Renderings, CAD models, and technical drawings" />
        </div>
        <div>
          <label className={labelClass}>Bill of Materials (BOM)</label>
          <textarea rows={2} className={inputClass} {...fieldProps('bom')} placeholder="Complete list of parts with cost estimates and suppliers" />
        </div>
        <div>
          <label className={labelClass}>Additional Resources</label>
          <textarea rows={2} className={inputClass} {...fieldProps('additionalResources')} placeholder="Supporting documentation and research" />
        </div>
        <div>
          <label className={labelClass}>Visual Identity</label>
          <textarea rows={2} className={inputClass} {...fieldProps('additionalVisualIdentity')} placeholder="Logo vector file, color scheme, and other design elements" />
        </div>
        <div>
          <label className={labelClass}>Images</label>
          <div className="mt-2 space-y-2">
            {(uploads.data?.data || []).map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded border border-border p-2">
                <img src={`/uploads/${u.filePath.replace('storage/uploads/', '')}`} alt={u.fileName} className="h-16 w-16 rounded object-cover" />
                <span className="text-sm text-foreground flex-1 truncate">{u.fileName}</span>
                <button onClick={() => deleteUpload.mutate(u.id)} className="text-xs text-red-600 hover:underline">Remove</button>
              </div>
            ))}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
              + Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    uploadFile.mutate({ file }, {
                      onSuccess: () => toast.success('Image uploaded'),
                      onError: (err) => toast.error(err.message),
                    })
                  }
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        </div>
      </Section>

      {/* Contact Information */}
      <Section title="Contact Information">
        <div className="space-y-2">
          {(contacts.data?.data || []).map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input type="text" className={inputClass} defaultValue={c.name} placeholder="Name"
                onBlur={(e) => { if (e.target.value !== c.name) updateContact.mutate({ id: c.id, name: e.target.value }) }} />
              <input type="text" className={inputClass} defaultValue={c.title || ''} placeholder="Title"
                onBlur={(e) => updateContact.mutate({ id: c.id, title: e.target.value })} />
              <input type="text" className={inputClass} defaultValue={c.email || ''} placeholder="Email"
                onBlur={(e) => updateContact.mutate({ id: c.id, email: e.target.value })} />
              <input type="text" className={inputClass} defaultValue={c.phone || ''} placeholder="Phone"
                onBlur={(e) => updateContact.mutate({ id: c.id, phone: e.target.value })} />
              <button onClick={() => deleteContact.mutate(c.id)} className="text-xs text-red-600 hover:underline shrink-0">Remove</button>
            </div>
          ))}
          <button
            onClick={() => createContact.mutate({ projectId, name: '' })}
            className="rounded bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20"
          >
            + Add Contact
          </button>
        </div>
      </Section>
    </div>
  )
}
