import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: "about-me", label: "About Me" },
  { id: "identity", label: "Identity, Spirituality, and Cultural Needs" },
  { id: "connections", label: "My Connections" },
  { id: "health", label: "Health & Wellbeing Needs" },
  { id: "disability", label: "Disability Needs" },
  { id: "education", label: "Education, Training or Employment Needs" },
  { id: "planning-with", label: "Planning With" },
  { id: "transition", label: "Transition to Adulthood" },
  { id: "youth-justice", label: "Youth Justice" },
  { id: "residence", label: "Residence & Homes" },
  { id: "care-request", label: "Care Request" },
  { id: "summary", label: "My Plan Summary" },
];

interface SectionNavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const SectionNavigation = ({ currentSection, onSectionChange }: SectionNavigationProps) => {
  const currentIndex = sections.findIndex(s => s.id === currentSection);
  const previousSection = currentIndex > 0 ? sections[currentIndex - 1] : null;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;

  return (
    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-border">
      {previousSection && (
        <Button
          variant="outline"
          onClick={() => onSectionChange(previousSection.id)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous: {previousSection.label}</span>
          <span className="sm:hidden">Previous</span>
        </Button>
      )}
      {nextSection && (
        <Button
          onClick={() => onSectionChange(nextSection.id)}
          className="gap-2"
        >
          <span className="hidden sm:inline">Next: {nextSection.label}</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
