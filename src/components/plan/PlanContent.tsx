import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Save, Loader2, Lock, X } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PlanContentProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const PlanContent = ({ currentSection, onSectionChange }: PlanContentProps) => {
  const { saveProgress, isSaving, isReadOnly, planData, isDirty, resetDirty } = usePlan();
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleSave = () => {
    saveProgress();
    resetDirty();
    toast.success("Progress saved successfully");
  };

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true);
    } else {
      navigate("/");
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelDialog(false);
    resetDirty();
    navigate("/");
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
      {isReadOnly && (
        <Alert className="mb-6 border-warning bg-warning/10">
          <Lock className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <strong>Read-only mode:</strong> This is a versioned plan (v{planData?.version_number}). 
            You can view the content but cannot make changes.
          </AlertDescription>
        </Alert>
      )}

      {!isReadOnly && (
        <div className="fixed bottom-2 right-8 shadow-2xl flex items-center gap-3 z-50">
          {isSaving && (
            <span className="text-sm text-muted-foreground flex items-center gap-2 bg-background px-3 py-2 rounded-md border">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          )}
          <Button
            onClick={handleCancel}
            size="lg"
            variant="outline"
            className="shadow-xl"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            size="lg"
            className="border border-black shadow-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Progress
          </Button>
        </div>
      )}

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have made changes that have not been saved. Are you sure you wish to go back to the landing page? 
              Any unsaved changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, stay here</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>
              Yes, go back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
