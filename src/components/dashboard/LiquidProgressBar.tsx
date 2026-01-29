import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";

// Define which fields are conditionally hidden by "no needs identified" checkboxes
// Format: { checkboxFieldId: hiddenFieldCount }
const CONDITIONAL_FIELDS: Record<string, Record<string, number>> = {
  "health": {
    "no-oral-health-needs": 1,    // hides "oral-health-needs"
    "no-vision-needs": 1,          // hides "vision-needs"
    "no-hearing-needs": 1,         // hides "hearing-needs"
    "no-other-health-services": 1, // hides "other-health-services"
    "no-allergies": 1,             // hides "allergies"
    "no-substance-use": 2,         // hides "substance-use" + "substance-support"
    "no-other-health-needs": 1     // hides "other-health-needs"
  },
  "disability": {
    "no-disability-needs": 2       // hides "disability" table + "disability-services" table
  },
  "education": {
    "not-enrolled": -2             // special: when checked, SHOWS 1 field (rationale), HIDES 2 fields (year/class, school)
  },
  "youth-justice": {
    // police-opposition === "not-opposed" shows more fields, otherwise they're hidden
    // This is inverse logic - handled specially below
  }
};

// Base expected fields per section (when all conditional fields are visible)
const SECTION_BASE_FIELDS: Record<string, number> = {
  "about-me": 10,
  "identity": 5,
  "connections": 4,
  "health": 12,     // Increased to account for all conditional fields when visible
  "disability": 4,  // When conditional fields visible
  "education": 5,
  "planning-with": 4,
  "transition": 5,
  "youth-justice": 10,
  "residence": 4,
  "care-request": 4
};

export const LiquidProgressBar = () => {
  const { sections, enabledSections } = usePlan();

  const { filledCount, totalCount, percentage } = useMemo(() => {
    let filled = 0;
    let total = 0;

    // Only count fields from enabled sections (or all if no enabled sections set)
    const sectionsToCount = enabledSections || Object.keys(SECTION_BASE_FIELDS);

    sectionsToCount.forEach((sectionKey) => {
      // Skip summary section as it's auto-generated
      if (sectionKey === "summary") return;
      
      let expectedCount = SECTION_BASE_FIELDS[sectionKey];
      if (!expectedCount) return;

      const sectionData = sections[sectionKey];
      
      // Adjust expected count based on conditional field visibility
      const conditionalRules = CONDITIONAL_FIELDS[sectionKey];
      if (conditionalRules && sectionData) {
        Object.entries(conditionalRules).forEach(([checkboxId, hiddenCount]) => {
          const checkboxValue = sectionData.fields?.[checkboxId];
          
          // Special handling for education's "not-enrolled" (inverse logic)
          if (sectionKey === "education" && checkboxId === "not-enrolled") {
            if (checkboxValue === "true") {
              // When "not enrolled" is checked, it shows rationale but hides year/school fields
              expectedCount += hiddenCount; // hiddenCount is negative here (-2)
            }
          } else if (sectionKey === "youth-justice") {
            // Youth justice has complex conditional logic based on police opposition
            // Skip for now as it's more complex
          } else {
            // Standard "no needs identified" logic
            if (checkboxValue === "true") {
              // If checkbox is checked, reduce expected count by hidden fields
              expectedCount -= hiddenCount;
            }
          }
        });
      }

      // Ensure we don't go below 0
      expectedCount = Math.max(0, expectedCount);

      if (!sectionData) {
        total += expectedCount;
        return;
      }

      // Count how many fields have non-empty values
      let sectionFilled = 0;
      Object.entries(sectionData.fields).forEach(([fieldId, value]) => {
        // Skip attachment fields and boolean-only fields
        if (fieldId.endsWith("-attachments")) return;
        
        // Skip "no needs identified" checkboxes themselves from the filled count
        if (fieldId.startsWith("no-") && (value === "true" || value === "false")) {
          return;
        }
        
        if (value && typeof value === 'string') {
          const trimmed = value.trim();
          // Check for non-empty, non-default values
          if (trimmed !== "" && trimmed !== "[]" && trimmed !== "{}" && trimmed !== "[{}]" && trimmed !== "false") {
            sectionFilled++;
          }
        }
      });

      filled += sectionFilled;
      // Use the greater of expected count or actual filled count for total
      total += Math.max(expectedCount, sectionFilled);
    });

    const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
    return { filledCount: filled, totalCount: total, percentage: pct };
  }, [sections, enabledSections]);

  return (
    <Card className="p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Plan Progress</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {filledCount} of {totalCount} questions completed
            </span>
            <span className="text-2xl font-bold text-primary">{percentage}%</span>
          </div>
        </div>
        
        <div className="relative h-10 w-full overflow-hidden rounded-full bg-secondary/50 border border-border">
          {/* Liquid fill */}
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          >
            {/* Wave animation layers */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="liquid-wave liquid-wave-1" />
              <div className="liquid-wave liquid-wave-2" />
              <div className="liquid-wave liquid-wave-3" />
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </Card>
  );
};
