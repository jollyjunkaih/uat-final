import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'
import type { TreeFeature } from '~/hooks/use-project-tree'

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
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed',
    paddingBottom: 12,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    flexDirection: 'column' as const,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  headerBadge: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  featureSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
    marginTop: 16,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  featureModule: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 10,
  },
  noFlows: {
    fontSize: 10,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  flowCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  flowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  flowName: {
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
  badgeApproved: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
  badgePassed: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
  badgePending: {
    backgroundColor: '#fffbeb',
    color: '#d97706',
  },
  badgeFailed: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  badgeDefault: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  preconditions: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 6,
  },
  preconditionsLabel: {
    fontWeight: 'bold',
  },
  eventsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 4,
  },
  eventCard: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
    backgroundColor: '#ffffff',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  testStatusPassing: {
    fontSize: 8,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  testStatusFailing: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  testStatusNone: {
    fontSize: 8,
    color: '#94a3b8',
  },
  eventDetail: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
  },
  eventDetailLabel: {
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  summaryItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  summaryLabel: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
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
})

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'approved':
    case 'passed':
      return styles.badgePassed
    case 'in_review':
    case 'pending':
    case 'ready_for_test':
      return styles.badgePending
    case 'rejected':
    case 'failed':
      return styles.badgeFailed
    default:
      return styles.badgeDefault
  }
}

function getTestStatusStyle(status: string) {
  if (status === 'tests_passing') return styles.testStatusPassing
  if (status === 'tests_failing') return styles.testStatusFailing
  return styles.testStatusNone
}

function getTestStatusLabel(status: string) {
  if (status === 'tests_passing') return 'Passing'
  if (status === 'tests_failing') return 'Failing'
  return 'No tests'
}

interface UatDocumentProps {
  projectName: string
  features: TreeFeature[]
  logoUrl: string
}

export default function UatDocument({ projectName, features, logoUrl }: UatDocumentProps) {
  const totalFlows = features.reduce((sum, f) => sum + (f.uatFlows?.length || 0), 0)
  const totalEvents = features.reduce(
    (sum, f) => sum + (f.uatFlows?.reduce((s, fl) => s + (fl.events?.length || 0), 0) || 0),
    0
  )
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logoUrl} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{projectName}</Text>
              <Text style={styles.headerSubtitle}>User Acceptance Testing Document</Text>
            </View>
          </View>
          <Text style={styles.headerBadge}>UAT</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{features.length}</Text>
            <Text style={styles.summaryLabel}>Features</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalFlows}</Text>
            <Text style={styles.summaryLabel}>UAT Flows</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalEvents}</Text>
            <Text style={styles.summaryLabel}>Events</Text>
          </View>
        </View>

        {features.map((feature) => (
          <View key={feature.id}>
            <Text style={styles.featureSectionTitle}>{feature.name}</Text>
            {feature.module ? (
              <Text style={styles.featureModule}>Module: {feature.module}</Text>
            ) : null}

            {!feature.uatFlows || feature.uatFlows.length === 0 ? (
              <Text style={styles.noFlows}>No UAT flows defined for this feature.</Text>
            ) : (
              feature.uatFlows.map((flow) => (
                <View key={flow.id} style={styles.flowCard} wrap={false}>
                  <View style={styles.flowHeader}>
                    <Text style={styles.flowName}>{flow.name}</Text>
                    <Text style={[styles.badge, getStatusStyle(flow.status)]}>
                      {flow.status.replace(/_/g, ' ')}
                    </Text>
                  </View>

                  {flow.description ? (
                    <Text style={styles.description}>{flow.description}</Text>
                  ) : null}

                  {flow.preconditions ? (
                    <Text style={styles.preconditions}>
                      <Text style={styles.preconditionsLabel}>Preconditions: </Text>
                      {flow.preconditions}
                    </Text>
                  ) : null}

                  {flow.events && flow.events.length > 0 ? (
                    <View>
                      <Text style={styles.eventsTitle}>Events</Text>
                      {flow.events.map((event) => (
                        <View key={event.id} style={styles.eventCard}>
                          <View style={styles.eventHeader}>
                            <Text style={styles.eventName}>{event.name}</Text>
                            <Text style={getTestStatusStyle(event.testStatus)}>
                              {getTestStatusLabel(event.testStatus)}
                            </Text>
                          </View>
                          <Text style={styles.eventDetail}>
                            <Text style={styles.eventDetailLabel}>Model: </Text>
                            {event.model}
                            {'    '}
                            <Text style={styles.eventDetailLabel}>Trigger: </Text>
                            {event.triggerType}
                          </Text>
                          {event.condition ? (
                            <Text style={styles.eventDetail}>
                              <Text style={styles.eventDetailLabel}>Condition: </Text>
                              {event.condition}
                            </Text>
                          ) : null}
                          {event.expectedOutcome ? (
                            <Text style={styles.eventDetail}>
                              <Text style={styles.eventDetailLabel}>Expected: </Text>
                              {event.expectedOutcome}
                            </Text>
                          ) : null}
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))
            )}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{projectName} — User Acceptance Testing Document</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${date}  |  Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
