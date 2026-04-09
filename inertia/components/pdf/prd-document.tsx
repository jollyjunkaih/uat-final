import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { TreeFeature } from '~/hooks/use-project-tree'
import type { PrdCompetitor, PrdMilestone, PrdOpenQuestion, PrdContact } from '~/hooks/use-prd-data'
import type { Upload } from '~/hooks/use-uploads'

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 'bold' },
    { src: 'Helvetica-Oblique', fontStyle: 'italic' },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 50,
    paddingBottom: 70,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  coverPage: {
    padding: 50,
    fontFamily: 'Helvetica',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverLogo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
  },
  coverMeta: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 16,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  subSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 10,
    color: '#1e293b',
    marginBottom: 8,
    lineHeight: 1.5,
  },
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  fieldCol: {
    flex: 1,
    paddingRight: 12,
  },
  // Table styles
  table: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  tableHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    padding: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCell: {
    fontSize: 9,
    color: '#1e293b',
    padding: 6,
  },
  // Feature styles
  featureCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  featureName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  badge: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeHigh: { backgroundColor: '#fef2f2', color: '#dc2626' },
  badgeMedium: { backgroundColor: '#fffbeb', color: '#d97706' },
  badgeLow: { backgroundColor: '#f1f5f9', color: '#64748b' },
  badgeApproved: { backgroundColor: '#f0fdf4', color: '#16a34a' },
  badgePending: { backgroundColor: '#fffbeb', color: '#d97706' },
  badgeDraft: { backgroundColor: '#f1f5f9', color: '#64748b' },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
  },
  scopeLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 4,
  },
  scopeValue: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  // UAT flow styles
  flowList: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
  },
  flowListLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  flowItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 4,
  },
  flowNumber: {
    fontSize: 9,
    color: '#94a3b8',
    width: 18,
    flexShrink: 0,
  },
  flowName: {
    fontSize: 9,
    color: '#1e293b',
    marginRight: 6,
  },
  badgePassed: { backgroundColor: '#f0fdf4', color: '#16a34a' },
  badgeFailed: { backgroundColor: '#fef2f2', color: '#dc2626' },
  badgeBlocked: { backgroundColor: '#fff7ed', color: '#c2410c' },
  badgeReady: { backgroundColor: '#eff6ff', color: '#1d4ed8' },
  // Upload image
  uploadImage: {
    width: 200,
    height: 150,
    objectFit: 'contain' as const,
    marginBottom: 8,
    marginRight: 12,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  emptyText: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  signatureSection: {
    marginTop: 24,
    marginBottom: 12,
  },
  signatureSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  signatureTableHeader: {
    flexDirection: 'row' as const,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  signatureTableRow: {
    flexDirection: 'row' as const,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    minHeight: 36,
  },
  signatureHeaderCell: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#475569',
    padding: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
  signatureCell: {
    fontSize: 9,
    color: '#1e293b',
    padding: 6,
    height: 160,
    justifyContent: 'center' as const,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    minWidth: 80,
    marginTop: 180,
  },
})

function getPriorityStyle(priority: string) {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'critical':
      return styles.badgeHigh
    case 'medium':
      return styles.badgeMedium
    default:
      return styles.badgeLow
  }
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'passed':
      return styles.badgePassed
    case 'in_review':
    case 'pending':
    case 'ready_for_test':
      return styles.badgeReady
    case 'failed':
      return styles.badgeFailed
    case 'blocked':
      return styles.badgeBlocked
    case 'draft':
      return styles.badgeDraft
    default:
      return styles.badgeDraft
  }
}

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <View style={styles.fieldRow}>{children}</View>
}

function FieldCol({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.fieldCol}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || '—'}</Text>
    </View>
  )
}

export interface PrdSignator {
  id: string
  name: string
  title: string | null
}

export interface FeatureImage {
  fileName: string
  sequence: number
}

export interface PrdDocumentProps {
  projectName: string
  project: Record<string, unknown>
  features: TreeFeature[]
  competitors: PrdCompetitor[]
  milestones: PrdMilestone[]
  openQuestions: PrdOpenQuestion[]
  contacts: PrdContact[]
  uploads: Upload[]
  logoUrl: string
  prdSignators?: PrdSignator[]
  projectDir?: string
}

export default function PrdDocument({
  projectName,
  project,
  features,
  competitors,
  milestones,
  openQuestions,
  contacts,
  uploads,
  logoUrl,
  prdSignators = [],
  projectDir,
}: PrdDocumentProps) {
  const p = project as Record<string, string | string[] | null | undefined>
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const grouped: Record<string, TreeFeature[]> = {}
  for (const feature of features) {
    const module = feature.module || 'General'
    if (!grouped[module]) grouped[module] = []
    grouped[module].push(feature)
  }
  const modules = Object.keys(grouped).sort()

  const brandingAdj = Array.isArray(p.brandingAdjectives)
    ? p.brandingAdjectives.join(', ')
    : (p.brandingAdjectives as string) || ''
  const brandingT = Array.isArray(p.brandingTone)
    ? p.brandingTone.join(', ')
    : (p.brandingTone as string) || ''

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.coverPage}>
        <Image src={logoUrl} style={styles.coverLogo} />
        <Text style={styles.coverTitle}>{projectName}</Text>
        <Text style={styles.coverSubtitle}>Product Requirements Document</Text>
        {p.companyName && <Text style={styles.coverMeta}>Company: {p.companyName as string}</Text>}
        {p.prdVersion && <Text style={styles.coverMeta}>Version: {p.prdVersion as string}</Text>}
        {p.preparedBy && (
          <Text style={styles.coverMeta}>Prepared By: {p.preparedBy as string}</Text>
        )}
        <Text style={styles.coverMeta}>{date}</Text>
      </Page>

      {/* Content Pages */}
      <Page size="A4" style={styles.page}>
        {/* Product Overview */}
        <Text style={styles.sectionTitle}>1. Product Overview</Text>
        <FieldRow>
          <FieldCol label="Company Name" value={p.companyName as string} />
          <FieldCol label="Product Name" value={p.productName as string} />
        </FieldRow>
        <FieldRow>
          <FieldCol label="Project Manager" value={p.projectManager as string} />
          <FieldCol label="Contributors" value={p.contributors as string} />
        </FieldRow>
        <FieldRow>
          <FieldCol label="Version" value={p.prdVersion as string} />
          <FieldCol label="Locations of Sale" value={p.locationsOfSale as string} />
        </FieldRow>
        <FieldRow>
          <FieldCol label="Date" value={p.prdDate as string} />
          <FieldCol label="Prepared By" value={p.preparedBy as string} />
        </FieldRow>

        {/* Purpose */}
        <Text style={styles.sectionTitle}>2. Purpose</Text>
        <Field label="Objective" value={p.objective as string} />
        <Field label="Target Market" value={p.targetMarket as string} />
        <Field label="Target Audience" value={p.targetAudience as string} />
        <Field label="Success Metrics" value={p.successMetrics as string} />

        {/* Competition */}
        <Text style={styles.sectionTitle}>3. Competition</Text>
        {competitors.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '10%' }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: '45%' }]}>Competitor Name</Text>
              <Text style={[styles.tableHeaderCell, { width: '45%' }]}>Product / Link</Text>
            </View>
            {competitors.map((c, i) => (
              <View key={c.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '10%' }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: '45%' }]}>{c.competitorName}</Text>
                <Text style={[styles.tableCell, { width: '45%' }]}>
                  {c.productNameOrLink || '—'}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No competitors defined.</Text>
        )}

        {/* Features & Scope */}
        <Text style={styles.sectionTitle}>4. Features & Scope</Text>
        {modules.map((moduleName) => (
          <View key={moduleName}>
            <Text style={styles.subSectionTitle}>{moduleName}</Text>
            {grouped[moduleName].map((feature) => (
              <View key={feature.id} style={styles.featureCard}>
                <View style={styles.featureHeader}>
                  <Text style={styles.featureName}>{feature.name}</Text>
                  <View style={styles.badgeRow}>
                    <Text style={[styles.badge, getPriorityStyle(feature.priority)]}>
                      {feature.priority}
                    </Text>
                    <Text style={[styles.badge, getStatusStyle(feature.status)]}>
                      {feature.status.replace(/_/g, ' ')}
                    </Text>
                  </View>
                </View>
                {feature.description && (
                  <Text style={styles.description}>{feature.description}</Text>
                )}
                {(feature as unknown as Record<string, string>).ecosystem && (
                  <>
                    <Text style={styles.scopeLabel}>Ecosystem</Text>
                    <Text style={styles.scopeValue}>
                      {(feature as unknown as Record<string, string>).ecosystem}
                    </Text>
                  </>
                )}
                {(feature as unknown as Record<string, string>).inScope && (
                  <>
                    <Text style={styles.scopeLabel}>In Scope</Text>
                    <Text style={styles.scopeValue}>
                      {(feature as unknown as Record<string, string>).inScope}
                    </Text>
                  </>
                )}
                {(feature as unknown as Record<string, string>).outOfScope && (
                  <>
                    <Text style={styles.scopeLabel}>Out of Scope</Text>
                    <Text style={styles.scopeValue}>
                      {(feature as unknown as Record<string, string>).outOfScope}
                    </Text>
                  </>
                )}
                {feature.uatFlows && feature.uatFlows.length > 0 && (
                  <View style={styles.flowList}>
                    <Text style={styles.flowListLabel}>UAT Flows</Text>
                    {feature.uatFlows.map((flow, flowIdx) => (
                      <View key={flowIdx} style={styles.flowItem} wrap={false}>
                        <Text style={styles.flowNumber}>{flowIdx + 1}.</Text>
                        <Text style={[styles.flowName, { flex: 1 }]}>
                          {flow.name
                            .split(' ')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ')}
                        </Text>
                        <Text style={[styles.badge, getStatusStyle(flow.status)]}>
                          {flow.status
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                {projectDir && (() => {
                  const mockScreens = (feature as unknown as Record<string, unknown>).mockScreens as FeatureImage[] | undefined
                  return mockScreens && mockScreens.length > 0 ? (
                    <View style={styles.flowList}>
                      <Text style={styles.flowListLabel}>Mock Screens</Text>
                      <View style={styles.imageRow}>
                        {mockScreens.map((screen) => (
                          <Image
                            key={screen.fileName}
                            src={`/feature-images/${projectDir}/${feature.id}/${screen.fileName}.png`}
                            style={styles.uploadImage}
                          />
                        ))}
                      </View>
                    </View>
                  ) : null
                })()}
                {projectDir && (() => {
                  const processFlows = (feature as unknown as Record<string, unknown>).processFlows as FeatureImage[] | undefined
                  return processFlows && processFlows.length > 0 ? (
                    <View style={styles.flowList}>
                      <Text style={styles.flowListLabel}>Process Flows</Text>
                      <View style={styles.imageRow}>
                        {processFlows.map((flow) => (
                          <Image
                            key={flow.fileName}
                            src={`/process-flow-images/${projectDir}/${feature.id}/${flow.fileName}.png`}
                            style={styles.uploadImage}
                          />
                        ))}
                      </View>
                    </View>
                  ) : null
                })()}
              </View>
            ))}
          </View>
        ))}

        {features.length === 0 && <Text style={styles.emptyText}>No features defined yet.</Text>}

        {/* User Interaction */}
        <Text style={styles.sectionTitle}>5. User Interaction</Text>
        <Field label="User Interactions" value={p.userInteractions as string} />
        <Field label="Touchpoint" value={p.touchpoint as string} />
        <Field label="User Feedback" value={p.userFeedback as string} />

        {/* Design & Branding */}
        <Text style={styles.sectionTitle}>6. Design & Branding</Text>
        <FieldRow>
          <FieldCol label="Form Factor" value={p.formFactor as string} />
          <FieldCol label="Materials" value={p.materials as string} />
        </FieldRow>
        <FieldRow>
          <FieldCol label="Branding Adjectives" value={brandingAdj} />
          <FieldCol label="Branding Tone" value={brandingT} />
        </FieldRow>
        <Field label="Visual Identity" value={p.visualIdentity as string} />
        <Field label="Packaging / Presentation" value={p.packagingPresentation as string} />

        {/* Software Architecture */}
        <Text style={styles.sectionTitle}>7. Software Architecture</Text>
        <Field label="Firmware / Functions" value={p.firmwareFunctions as string} />
        <Field label="Cloud Application" value={p.cloudApplication as string} />
        <Field label="Smartphone Application" value={p.smartphoneApplication as string} />

        {/* Servicing & Updates */}
        <Text style={styles.sectionTitle}>8. Servicing & Updates</Text>
        <Field label="" value={p.servicingUpdates as string} />

        {/* Milestones & Timeline */}
        <Text style={styles.sectionTitle}>9. Milestones & Timeline</Text>
        {p.targetReleaseDate && (
          <Field label="Target Release Date" value={p.targetReleaseDate as string} />
        )}
        {milestones.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: '28%' }]}>Department</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Start Date</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { width: '24%' }]}>Completion Date</Text>
            </View>
            {milestones.map((m, i) => (
              <View key={m.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: '28%' }]}>{m.department}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{m.startDate || '—'}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{m.status || '—'}</Text>
                <Text style={[styles.tableCell, { width: '24%' }]}>{m.completionDate || '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No milestones defined.</Text>
        )}

        {/* Open Questions */}
        <Text style={styles.sectionTitle}>10. Open Questions</Text>
        {openQuestions.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: '37%' }]}>Question</Text>
              <Text style={[styles.tableHeaderCell, { width: '37%' }]}>Answer</Text>
              <Text style={[styles.tableHeaderCell, { width: '18%' }]}>Date Answered</Text>
            </View>
            {openQuestions.map((q, i) => (
              <View key={q.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: '37%' }]}>{q.question}</Text>
                <Text style={[styles.tableCell, { width: '37%' }]}>{q.answer || '—'}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{q.dateAnswered || '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No open questions.</Text>
        )}

        {/* Additional Information */}
        <Text style={styles.sectionTitle}>11. Additional Information</Text>
        <Field label="Diagrams / Schematics" value={p.diagramsSchematics as string} />
        <Field label="Bill of Materials" value={p.bom as string} />
        <Field label="Additional Resources" value={p.additionalResources as string} />
        <Field label="Visual Identity" value={p.additionalVisualIdentity as string} />
        {uploads.length > 0 && (
          <View>
            <Text style={styles.subSectionTitle}>Uploaded Images</Text>
            <View style={styles.imageRow}>
              {uploads.map((upload) => (
                <Image
                  key={upload.id}
                  src={`/uploads/${upload.filePath.split('/').slice(-2).join('/')}`}
                  style={styles.uploadImage}
                />
              ))}
            </View>
          </View>
        )}

        {/* Contact Information */}
        <Text style={styles.sectionTitle}>12. Contact Information</Text>
        {contacts.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { width: '8%' }]}>#</Text>
              <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Name</Text>
              <Text style={[styles.tableHeaderCell, { width: '22%' }]}>Title</Text>
              <Text style={[styles.tableHeaderCell, { width: '25%' }]}>Email</Text>
              <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Phone</Text>
            </View>
            {contacts.map((c, i) => (
              <View key={c.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{i + 1}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{c.name}</Text>
                <Text style={[styles.tableCell, { width: '22%' }]}>{c.title || '—'}</Text>
                <Text style={[styles.tableCell, { width: '25%' }]}>{c.email || '—'}</Text>
                <Text style={[styles.tableCell, { width: '20%' }]}>{c.phone || '—'}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No contacts defined.</Text>
        )}

        {prdSignators.length > 0 && (
          <View style={styles.signatureSection} wrap={false}>
            <Text style={styles.signatureSectionTitle}>13. Required Signatures</Text>
            <View>
              <View style={styles.signatureTableHeader}>
                <Text style={[styles.signatureHeaderCell, { width: '25%' }]}>Name</Text>
                <Text style={[styles.signatureHeaderCell, { width: '25%' }]}>Title</Text>
                <Text style={[styles.signatureHeaderCell, { width: '25%' }]}>Signature</Text>
                <Text style={[styles.signatureHeaderCell, { width: '25%' }]}>Date</Text>
              </View>
              {prdSignators.map((s) => (
                <View key={s.id} style={styles.signatureTableRow}>
                  <View style={[styles.signatureCell, { width: '25%' }]}>
                    <Text>{s.name}</Text>
                  </View>
                  <View style={[styles.signatureCell, { width: '25%' }]}>
                    <Text>{s.title || '—'}</Text>
                  </View>
                  <View style={[styles.signatureCell, { width: '25%' }]}>
                    <View style={styles.signatureLine} />
                  </View>
                  <View style={[styles.signatureCell, { width: '25%' }]}>
                    <View style={styles.signatureLine} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{projectName} — Product Requirements Document</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `${date}  |  Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  )
}
