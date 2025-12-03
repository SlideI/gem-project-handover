import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";

// Minimum expected fields per section to calculate total (these are the key fillable fields)
const SECTION_FIELD_COUNTS: Record<string, number> = {
  "about-me": 10,
  "identity": 5,
  "connections": 4,
  "health": 6,
  "disability": 4,
  "education": 5,
  "planning-with": 4,
  "transition": 5,
  "youth-justice": 4,
  "residence": 4,
  "care-request": 4
};

export const LiquidProgressBar = () => {
  const { sections, enabledSections } = usePlan();

  const { filledCount, totalCount, percentage } = useMemo(() => {
    let filled = 0;
    let total = 0;

    // Only count fields from enabled sections (or all if no enabled sections set)
    const sectionsToCount = enabledSections || Object.keys(SECTION_FIELD_COUNTS);

    sectionsToCount.forEach((sectionKey) => {
      // Skip summary section as it's auto-generated
      if (sectionKey === "summary") return;
      
      const expectedCount = SECTION_FIELD_COUNTS[sectionKey];
      if (!expectedCount) return;

      const sectionData = sections[sectionKey];
      if (!sectionData) {
        total += expectedCount;
        return;
      }

      // Count how many fields have non-empty values
      let sectionFilled = 0;
      Object.entries(sectionData.fields).forEach(([fieldId, value]) => {
        // Skip attachment fields and boolean-only fields
        if (fieldId.endsWith("-attachments")) return;
        
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
