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
    paddingBottom: 70,
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
    marginBottom: 16,
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
  // Metadata section
  metaRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    width: 120,
  },
  metaValue: {
    fontSize: 9,
    color: '#1e293b',
    flex: 1,
  },
  metaSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  // Feature / Function section
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#7c3aed',
  },
  functionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 6,
  },
  functionDescription: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  preconditions: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 8,
  },
  preconditionsLabel: {
    fontWeight: 'bold',
  },
  // Test case table
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
    minHeight: 24,
  },
  tableRowAlt: {
    backgroundColor: '#fafafa',
  },
  tableHeaderCell: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#475569',
    padding: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableCell: {
    fontSize: 8,
    color: '#1e293b',
    padding: 4,
    lineHeight: 1.3,
  },
  tableCellCenter: {
    fontSize: 8,
    color: '#1e293b',
    padding: 4,
    textAlign: 'center',
  },
  passText: {
    fontSize: 8,
    color: '#16a34a',
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
  failText: {
    fontSize: 8,
    color: '#dc2626',
    fontWeight: 'bold',
    padding: 4,
    textAlign: 'center',
  },
  neutralText: {
    fontSize: 8,
    color: '#94a3b8',
    padding: 4,
    textAlign: 'center',
  },
  noTestCases: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  noFlows: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  // General comments section
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  commentText: {
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
})

// Column widths for test case table
const COL = {
  testNo: '8%',
  description: '22%',
  steps: '22%',
  expected: '20%',
  pass: '7%',
  fail: '7%',
  defect: '14%',
}

interface UatDocumentProps {
  projectName: string
  project: Record<string, unknown>
  features: TreeFeature[]
  logoUrl: string
}

export default function UatDocument({ projectName, project, features, logoUrl }: UatDocumentProps) {
  const p = project as Record<string, string | null | undefined>
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalFunctions = features.reduce((sum, f) => sum + (f.uatFlows?.length || 0), 0)
  const totalTestCases = features.reduce(
    (sum, f) =>
      sum + (f.uatFlows?.reduce((s, fl) => s + (fl.testCases?.length || 0), 0) || 0),
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
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

        {/* UAT Metadata */}
        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Testing Start:</Text>
            <Text style={styles.metaValue}>
              {[p.testingStartDate, p.testingStartTime].filter(Boolean).join(' ') || '—'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Testing End:</Text>
            <Text style={styles.metaValue}>
              {[p.testingEndDate, p.testingEndTime].filter(Boolean).join(' ') || '—'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Tester(s):</Text>
            <Text style={styles.metaValue}>{p.testerNames || '—'}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Features:</Text>
            <Text style={styles.metaValue}>{features.length}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Functions:</Text>
            <Text style={styles.metaValue}>{totalFunctions}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Test Cases:</Text>
            <Text style={styles.metaValue}>{totalTestCases}</Text>
          </View>
        </View>

        {/* Features with Functions and Test Cases */}
        {features.map((feature) => (
          <View key={feature.id}>
            <Text style={styles.featureTitle}>Feature: {feature.name}</Text>

            {!feature.uatFlows || feature.uatFlows.length === 0 ? (
              <Text style={styles.noFlows}>No functions defined for this feature.</Text>
            ) : (
              feature.uatFlows.map((flow) => (
                <View key={flow.id}>
                  <Text style={styles.functionTitle}>Function: {flow.name}</Text>

                  {flow.description && (
                    <Text style={styles.functionDescription}>{flow.description}</Text>
                  )}

                  {flow.preconditions && (
                    <Text style={styles.preconditions}>
                      <Text style={styles.preconditionsLabel}>Preconditions: </Text>
                      {flow.preconditions}
                    </Text>
                  )}

                  {flow.testCases && flow.testCases.length > 0 ? (
                    <View style={styles.table}>
                      <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderCell, { width: COL.testNo }]}>
                          Test No
                        </Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.description }]}>
                          Description of Tasks
                        </Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.steps }]}>
                          Steps to Execute
                        </Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.expected }]}>
                          Expected Results
                        </Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.pass }]}>Pass</Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.fail }]}>Fail</Text>
                        <Text style={[styles.tableHeaderCell, { width: COL.defect }]}>
                          Defect / Comments
                        </Text>
                      </View>
                      {flow.testCases.map((tc, idx) => (
                        <View
                          key={tc.id}
                          style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                          wrap={false}
                        >
                          <Text style={[styles.tableCellCenter, { width: COL.testNo }]}>
                            {tc.testNo}
                          </Text>
                          <Text style={[styles.tableCell, { width: COL.description }]}>
                            {tc.descriptionOfTasks}
                          </Text>
                          <Text style={[styles.tableCell, { width: COL.steps }]}>
                            {tc.stepsToExecute}
                          </Text>
                          <Text style={[styles.tableCell, { width: COL.expected }]}>
                            {tc.expectedResults}
                          </Text>
                          <Text
                            style={[
                              tc.pass ? styles.passText : styles.neutralText,
                              { width: COL.pass },
                            ]}
                          >
                            {tc.pass ? 'Y' : '—'}
                          </Text>
                          <Text
                            style={[
                              tc.fail ? styles.failText : styles.neutralText,
                              { width: COL.fail },
                            ]}
                          >
                            {tc.fail ? 'Y' : '—'}
                          </Text>
                          <Text style={[styles.tableCell, { width: COL.defect }]}>
                            {tc.defectComments || ''}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.noTestCases}>No test cases defined.</Text>
                  )}
                </View>
              ))
            )}
          </View>
        ))}

        {features.length === 0 && (
          <Text style={styles.noFlows}>
            No features defined yet. Add features and functions to generate your UAT document.
          </Text>
        )}

        {/* General Questions / Comments */}
        {p.generalComments && (
          <View>
            <Text style={styles.sectionTitle}>General Questions / Comments</Text>
            <Text style={styles.commentText}>{p.generalComments}</Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {projectName} — User Acceptance Testing Document
          </Text>
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
