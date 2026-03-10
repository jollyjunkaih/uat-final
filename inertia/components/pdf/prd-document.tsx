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
    borderBottomColor: '#2563eb',
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
    backgroundColor: '#2563eb',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
    marginTop: 16,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
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
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  badgeHigh: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  badgeMedium: {
    backgroundColor: '#fffbeb',
    color: '#d97706',
  },
  badgeLow: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  badgeApproved: {
    backgroundColor: '#f0fdf4',
    color: '#16a34a',
  },
  badgePending: {
    backgroundColor: '#fffbeb',
    color: '#d97706',
  },
  badgeDraft: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  badgeDefault: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  description: {
    fontSize: 10,
    color: '#475569',
    lineHeight: 1.5,
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
    color: '#2563eb',
  },
  summaryLabel: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 2,
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
      return styles.badgeApproved
    case 'in_review':
    case 'pending':
      return styles.badgePending
    case 'draft':
      return styles.badgeDraft
    default:
      return styles.badgeDefault
  }
}

interface PrdDocumentProps {
  projectName: string
  features: TreeFeature[]
  logoUrl: string
}

export default function PrdDocument({ projectName, features, logoUrl }: PrdDocumentProps) {
  const grouped: Record<string, TreeFeature[]> = {}
  for (const feature of features) {
    const module = feature.module || 'General'
    if (!grouped[module]) grouped[module] = []
    grouped[module].push(feature)
  }
  const modules = Object.keys(grouped).sort()
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
              <Text style={styles.headerSubtitle}>Product Requirements Document</Text>
            </View>
          </View>
          <Text style={styles.headerBadge}>PRD</Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{features.length}</Text>
            <Text style={styles.summaryLabel}>Total Features</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{modules.length}</Text>
            <Text style={styles.summaryLabel}>Modules</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {features.filter((f) => f.priority.toLowerCase() === 'high' || f.priority.toLowerCase() === 'critical').length}
            </Text>
            <Text style={styles.summaryLabel}>High Priority</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {features.filter((f) => f.status.toLowerCase() === 'approved').length}
            </Text>
            <Text style={styles.summaryLabel}>Approved</Text>
          </View>
        </View>

        {modules.map((moduleName) => (
          <View key={moduleName} wrap={false}>
            <Text style={styles.sectionTitle}>{moduleName}</Text>
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
                {feature.description ? (
                  <Text style={styles.description}>{feature.description}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{projectName} — Product Requirements Document</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${date}  |  Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}
