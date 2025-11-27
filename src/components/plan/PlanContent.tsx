import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";
import { AboutMeSection } from "./sections/AboutMeSection";
import { IdentitySection } from "./sections/IdentitySection";
import { ConnectionsSection } from "./sections/ConnectionsSection";
import { HealthSection } from "./sections/HealthSection";
import { DisabilitySection } from "./sections/DisabilitySection";
import { EducationSection } from "./sections/EducationSection";
import { PlanningWithSection } from "./sections/PlanningWithSection";
import { TransitionSection } from "./sections/TransitionSection";
import { YouthJusticeSection } from "./sections/YouthJusticeSection";
import { ResidenceSection } from "./sections/ResidenceSection";
import { CareRequestSection } from "./sections/CareRequestSection";
import { SummarySection } from "./sections/SummarySection";
import { SectionNavigation } from "./SectionNavigation";

interface PlanContentProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const PlanContent = ({ currentSection, onSectionChange }: PlanContentProps) => {
  const { saveProgress, isSaving } = usePlan();

  const handleSave = () => {
    saveProgress();
    toast.success("Progress saved successfully");
  };

  const renderSection = () => {
    switch (currentSection) {
      case "about-me":
        return <AboutMeSection />;
      case "identity":
        return <IdentitySection />;
      case "connections":
        return <ConnectionsSection />;
      case "health":
        return <HealthSection />;
      case "disability":
        return <DisabilitySection />;
      case "education":
        return <EducationSection />;
      case "planning-with":
        return <PlanningWithSection />;
      case "transition":
        return <TransitionSection />;
      case "youth-justice":
        return <YouthJusticeSection />;
      case "residence":
        return <ResidenceSection />;
      case "care-request":
        return <CareRequestSection />;
      case "summary":
        return <SummarySection />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="fixed bottom-20 right-8 shadow-2xl flex items-center gap-3 z-50">
        {isSaving && (
          <span className="text-sm text-muted-foreground flex items-center gap-2 bg-background px-3 py-2 rounded-md border">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        )}
        <Button
          onClick={handleSave}
          size="lg"
          className="border border-black shadow-xl"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Progress
        </Button>
      </div>

      <Card className="p-8">
        {renderSection()}
        <SectionNavigation 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        />
      </Card>
    </div>
  );
};
