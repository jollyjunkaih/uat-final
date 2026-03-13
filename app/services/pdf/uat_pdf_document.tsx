import React from 'react'
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer'

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
  stepContainer: {
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  stepTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 8,
    color: '#475569',
    marginBottom: 4,
    lineHeight: 1.4,
  },
  stepImage: {
    maxWidth: 300,
    maxHeight: 200,
    marginTop: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 4,
  },
  noSteps: {
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

export interface PdfStep {
  id: string
  name: string
  description: string | null
  sequence: number
  imagePath: string | null
}

export interface PdfUatFlow {
  id: string
  name: string
  description: string | null
  preconditions: string | null
  status: string
  sequence: number
  steps: PdfStep[]
}

export interface PdfFeature {
  id: string
  name: string
  uatFlows: PdfUatFlow[]
}

export interface UatPdfProps {
  projectName: string
  testingStartDate: string | null
  testingStartTime: string | null
  testingEndDate: string | null
  testingEndTime: string | null
  testerNames: string | null
  generalComments: string | null
  features: PdfFeature[]
  logoPath: string
}

export default function UatPdfDocument({
  projectName,
  testingStartDate,
  testingStartTime,
  testingEndDate,
  testingEndTime,
  testerNames,
  generalComments,
  features,
  logoPath,
}: UatPdfProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalFunctions = features.reduce((sum, f) => sum + (f.uatFlows?.length || 0), 0)
  const totalSteps = features.reduce(
    (sum, f) =>
      sum + (f.uatFlows?.reduce((s, fl) => s + (fl.steps?.length || 0), 0) || 0),
    0
  )

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logoPath} style={styles.logo} />
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>{projectName}</Text>
              <Text style={styles.headerSubtitle}>User Acceptance Testing Document</Text>
            </View>
          </View>
          <Text style={styles.headerBadge}>UAT</Text>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Testing Start:</Text>
            <Text style={styles.metaValue}>
              {[testingStartDate, testingStartTime].filter(Boolean).join(' ') || '—'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Testing End:</Text>
            <Text style={styles.metaValue}>
              {[testingEndDate, testingEndTime].filter(Boolean).join(' ') || '—'}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Tester(s):</Text>
            <Text style={styles.metaValue}>{testerNames || '—'}</Text>
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
            <Text style={styles.metaLabel}>Total Steps:</Text>
            <Text style={styles.metaValue}>{totalSteps}</Text>
          </View>
        </View>

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

                  {flow.steps && flow.steps.length > 0 ? (
                    flow.steps.map((step, idx) => (
                      <View key={step.id} style={styles.stepContainer} wrap={false}>
                        <Text style={styles.stepTitle}>
                          Step {idx + 1}: {step.name}
                        </Text>
                        {step.description && (
                          <Text style={styles.stepDescription}>{step.description}</Text>
                        )}
                        {step.imagePath && (
                          <Image
                            src={step.imagePath}
                            style={styles.stepImage}
                          />
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noSteps}>No steps defined.</Text>
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

        {generalComments && (
          <View>
            <Text style={styles.sectionTitle}>General Questions / Comments</Text>
            <Text style={styles.commentText}>{generalComments}</Text>
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
