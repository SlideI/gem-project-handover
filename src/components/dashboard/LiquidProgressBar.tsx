import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";

// Define expected fillable fields per section (non-prepopulated fields that users need to complete)
const EXPECTED_FIELDS: Record<string, string[]> = {
  "about-me": [
    "pronouns", "communication", "decisionInvolvement", "otInvolvement", "careGoal",
    "whanau", "supportPeople", "routines", "myStrengths", "myWorries", "moreAboutMe",
    "currentPlan", "feelingsAboutPlan", "planChanges"
  ],
  "identity": ["from", "whakapapa", "religious", "cultural-important", "faith-needs"],
  "connections": ["importantConnections", "relationshipsToMaintain", "newConnections", "whatHelps", "additionalInfo"],
  "health": ["currentHealth", "healthHistory", "medications", "mentalHealth", "healthGoals", "healthProviders"],
  "disability": ["disabilityDetails", "supportNeeds", "assistiveDevices", "disabilityServices", "accommodations"],
  "education": ["currentEducation", "learningStyle", "achievements", "challenges", "educationGoals", "supportServices"],
  "planning-with": ["participants", "planningProcess", "agreements", "nextSteps"],
  "transition": ["transitionGoals", "livingArrangements", "employmentGoals", "independentLiving", "supportNetwork"],
  "youth-justice": ["currentStatus", "conditions", "supportServices", "rehabilitationGoals"],
  "residence": ["currentResidence", "previousPlacements", "residenceGoals", "specialRequirements"],
  "care-request": ["requestDetails", "urgency", "supportNeeded", "preferredOutcome"]
};

export const LiquidProgressBar = () => {
  const { sections, enabledSections } = usePlan();

  const { filledCount, totalCount, percentage } = useMemo(() => {
    let filled = 0;
    let total = 0;

    // Only count fields from enabled sections (or all if no enabled sections set)
    const sectionsToCount = enabledSections || Object.keys(EXPECTED_FIELDS);

    sectionsToCount.forEach((sectionKey) => {
      const expectedFields = EXPECTED_FIELDS[sectionKey];
      if (!expectedFields) return;

      const sectionData = sections[sectionKey];
      if (!sectionData) return;

      expectedFields.forEach((fieldId) => {
        total++;
        const value = sectionData.fields[fieldId];
        // Consider field filled if it has a non-empty value
        if (value && typeof value === 'string' && value.trim() !== "" && value !== "[]" && value !== "{}") {
          filled++;
        }
      });
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
