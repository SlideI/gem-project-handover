import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { isSensitiveField, isSectionActionsHidden } from "@/lib/sensitiveFields";

interface Action {
  action: string;
  responsible: string;
  deadline: string;
  support: string;
  completed: boolean;
}

interface SectionData {
  category: string;
  actions: Action[];
  fields: Record<string, string>;
}

interface PlanPdfDocumentProps {
  sections: Record<string, SectionData>;
  selectedSections: string[];
  planTitle: string;
  addEmptyRows?: boolean;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.6,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: "2 solid #333",
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 10,
    marginBottom: 8,
    color: "#333",
  },
  fillableSpace: {
    borderBottom: "1 solid #999",
    minHeight: 30,
    marginBottom: 8,
  },
  actionTable: {
    marginTop: 12,
    marginBottom: 12,
  },
  actionTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    padding: 6,
    fontSize: 10,
    fontWeight: "bold",
    borderBottom: "1 solid #333",
  },
  actionTableRow: {
    flexDirection: "row",
    padding: 6,
    fontSize: 9,
    borderBottom: "1 solid #ddd",
    minHeight: 30,
  },
  actionCol1: { flex: 2 },
  actionCol2: { flex: 1.5 },
  actionCol3: { flex: 1 },
  actionCol4: { flex: 1.5 },
  emptyRow: {
    minHeight: 30,
    borderBottom: "1 solid #ddd",
  },
  subsectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  pageNumber: {
    position: "absolute",
    bottom: 20,
    right: 40,
    fontSize: 9,
    color: "#666",
  },
});

const sectionLabels: Record<string, string> = {
  "about-me": "About Me",
  "identity": "Identity, Spirituality, and Cultural Needs",
  "connections": "My Connections",
  "health": "Health & Wellbeing Needs",
  "disability": "Disability Needs",
  "education": "Education, Training or Employment Needs",
  "planning-with": "Planning With",
  "transition": "Transition to Adulthood",
  "youth-justice": "Youth Justice",
  "residence": "Residence & Homes",
  "care-request": "Care Request",
  "summary": "My Plan Summary",
};

export const PlanPdfDocument = ({ sections, selectedSections, planTitle, addEmptyRows = false }: PlanPdfDocumentProps) => {
  const renderFieldValue = (value: string | undefined) => {
    if (value && value.trim()) {
      return <Text style={styles.fieldValue}>{value}</Text>;
    }
    return <View style={styles.fillableSpace} />;
  };

  const renderActionTable = (actions: Action[]) => {
    const extraRows = addEmptyRows ? 3 : 0;
    const rowsToRender = Math.max(actions.length, 3) + extraRows;

    return (
      <View style={styles.actionTable}>
        <View style={styles.actionTableHeader}>
          <Text style={styles.actionCol1}>Action</Text>
          <Text style={styles.actionCol2}>Responsible</Text>
          <Text style={styles.actionCol3}>By When</Text>
          <Text style={styles.actionCol4}>Support</Text>
        </View>
        {Array.from({ length: rowsToRender }, (_, i) => {
          const action = actions[i];
          if (action && action.action) {
            return (
              <View key={i} style={styles.actionTableRow}>
                <Text style={styles.actionCol1}>{action.action}</Text>
                <Text style={styles.actionCol2}>{action.responsible}</Text>
                <Text style={styles.actionCol3}>{action.deadline}</Text>
                <Text style={styles.actionCol4}>{action.support}</Text>
              </View>
            );
          }
          return <View key={i} style={[styles.actionTableRow, styles.emptyRow]} />;
        })}
      </View>
    );
  };

  const renderSection = (sectionId: string, sectionData: SectionData) => {
    // Filter out sensitive fields from the PDF output
    const visibleFields = Object.entries(sectionData.fields).filter(
      ([fieldId]) => !isSensitiveField(sectionId, fieldId)
    );

    const hideActions = isSectionActionsHidden(sectionId);

    return (
      <View key={sectionId} wrap={false}>
        <Text style={styles.sectionTitle}>{sectionLabels[sectionId] || sectionData.category}</Text>
        
        {/* Render non-sensitive fields */}
        {visibleFields.map(([fieldId, value]) => (
          <View key={fieldId}>
            <Text style={styles.fieldLabel}>{fieldId.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</Text>
            {renderFieldValue(value)}
          </View>
        ))}

        {/* Add some fillable spaces if no visible fields */}
        {visibleFields.length === 0 && (
          <View>
            <Text style={styles.fieldLabel}>Notes:</Text>
            <View style={styles.fillableSpace} />
            <View style={styles.fillableSpace} />
            <View style={styles.fillableSpace} />
          </View>
        )}

        {/* Render action table if there are actions and they are not hidden */}
        {!hideActions && sectionData.actions && sectionData.actions.length > 0 && (
          <View>
            <Text style={styles.subsectionTitle}>Action Plan</Text>
            {renderActionTable(sectionData.actions)}
          </View>
        )}
      </View>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{planTitle}</Text>
        {selectedSections.map((sectionId) => {
          const sectionData = sections[sectionId];
          if (!sectionData) return null;
          return renderSection(sectionId, sectionData);
        })}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};
