import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";
import { AboutMeSection } from "./sections/AboutMeSection";
import { IdentitySection } from "./sections/IdentitySection";
import { ConnectionsSection } from "./sections/ConnectionsSection";
import { HealthSection } from "./sections/HealthSection";
import { DisabilitySection } from "./sections/DisabilitySection";
import { EducationSection } from "./sections/EducationSection";
import { TransitionSection } from "./sections/TransitionSection";
import { YouthJusticeSection } from "./sections/YouthJusticeSection";
import { ResidenceSection } from "./sections/ResidenceSection";
import { SummarySection } from "./sections/SummarySection";

interface PlanContentProps {
  currentSection: string;
}

export const PlanContent = ({ currentSection }: PlanContentProps) => {
  const { saveProgress } = usePlan();

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
      case "transition":
        return <TransitionSection />;
      case "youth-justice":
        return <YouthJusticeSection />;
      case "residence":
        return <ResidenceSection />;
      case "summary":
        return <SummarySection />;
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Button
        onClick={handleSave}
        className="fixed bottom-8 right-8 shadow-lg"
        size="lg"
      >
        <Save className="h-4 w-4 mr-2" />
        Save Progress
      </Button>

      <Card className="p-8">
        {renderSection()}
      </Card>
    </div>
  );
};
