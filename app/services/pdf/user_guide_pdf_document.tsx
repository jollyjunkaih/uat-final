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
    borderBottomColor: '#0891b2',
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
    backgroundColor: '#0891b2',
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
  },
  metaSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
  roleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 16,
    marginBottom: 4,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#0891b2',
  },
  roleDescription: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 10,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 2,
  },
  sectionModule: {
    fontSize: 8,
    color: '#0891b2',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  stepRow: {
    flexDirection: 'row' as const,
    marginBottom: 4,
    gap: 6,
  },
  stepNumber: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0891b2',
    width: 16,
    textAlign: 'right' as const,
    marginTop: 1,
  },
  stepInstruction: {
    fontSize: 9,
    color: '#475569',
    lineHeight: 1.5,
    flex: 1,
  },
  stepImageContainer: {
    marginLeft: 22,
    marginBottom: 6,
    marginTop: 4,
  },
  stepImage: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'contain' as const,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  noSections: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  noRoles: {
    fontSize: 9,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 8,
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

export interface PdfGuideStep {
  id: string
  instruction: string
  imageFileName: string | null
  imagePath: string | null
  sequence: number
}

export interface PdfGuideSection {
  id: string
  title: string
  module: string | null
  sequence: number
  steps: PdfGuideStep[]
  status: string
}

export interface PdfGuideRole {
  roleName: string
  roleSlug: string
  roleDescription: string | null
  roleSequence: number
  sections: PdfGuideSection[]
}

export interface UserGuidePdfProps {
  projectName: string
  roles: PdfGuideRole[]
  logoPath: string
}

export default function UserGuidePdfDocument({
  projectName,
  roles,
  logoPath,
}: UserGuidePdfProps) {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalSections = roles.reduce((sum, r) => sum + r.sections.length, 0)
  const totalSteps = roles.reduce(
    (sum, r) => sum + r.sections.reduce((s, sec) => s + sec.steps.length, 0),
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
              <Text style={styles.headerSubtitle}>User Guide</Text>
            </View>
          </View>
          <Text style={styles.headerBadge}>GUIDE</Text>
        </View>

        <View style={styles.metaSection}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Roles:</Text>
            <Text style={styles.metaValue}>{roles.length}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Sections:</Text>
            <Text style={styles.metaValue}>{totalSections}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Total Steps:</Text>
            <Text style={styles.metaValue}>{totalSteps}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Generated:</Text>
            <Text style={styles.metaValue}>{date}</Text>
          </View>
        </View>

        {roles.length === 0 ? (
          <Text style={styles.noRoles}>
            No roles defined yet. Import a user-guide.yaml to generate the document.
          </Text>
        ) : (
          roles.map((role) => (
            <View key={role.roleSlug}>
              <Text style={styles.roleTitle}>{role.roleName}</Text>

              {role.roleDescription && (
                <Text style={styles.roleDescription}>{role.roleDescription}</Text>
              )}

              {role.sections.length === 0 ? (
                <Text style={styles.noSections}>No sections defined for this role.</Text>
              ) : (
                role.sections.map((section, sIdx) => (
                  <View key={section.id} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>
                      {sIdx + 1}. {section.title}
                    </Text>
                    {section.module && (
                      <Text style={styles.sectionModule}>{section.module}</Text>
                    )}
                    {section.steps.map((step, stepIdx) => (
                      <View key={step.id} wrap={false}>
                        <View style={styles.stepRow}>
                          <Text style={styles.stepNumber}>{stepIdx + 1}.</Text>
                          <Text style={styles.stepInstruction}>{step.instruction}</Text>
                        </View>
                        {step.imagePath && (
                          <View style={styles.stepImageContainer}>
                            <Image src={step.imagePath} style={styles.stepImage} />
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                ))
              )}
            </View>
          ))
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {projectName} — User Guide
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
