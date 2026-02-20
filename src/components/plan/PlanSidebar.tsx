import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { usePlan } from "@/contexts/PlanContext";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddSectionDialog } from "./AddSectionDialog";
import { ALL_SECTIONS } from "./SectionSelectionDialog";

interface Section {
  id: string;
  label: string;
  progress?: string;
}

const allSections: Section[] = [
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
  { id: "visit-frequency", label: "Frequency of Visits" },
  { id: "summary", label: "My Plan Summary" },
];

interface PlanSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const PlanSidebar = ({ currentSection, onSectionChange }: PlanSidebarProps) => {
  const { enabledSections, updateEnabledSections, isReadOnly, sections: sectionsData } = usePlan();
  const [previousSection, setPreviousSection] = useState<string>(currentSection);
  const [animating, setAnimating] = useState(false);
  const [dotPosition, setDotPosition] = useState<{ startTop: number; endTop: number; left: number } | null>(null);
  const [showAddSectionDialog, setShowAddSectionDialog] = useState(false);
  const [isAddingSections, setIsAddingSections] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter sections based on enabled sections (null means all enabled)
  const sections = enabledSections
    ? allSections.filter(s => enabledSections.includes(s.id))
    : allSections;

  // Check if there are optional sections to manage (either omitted or removable)
  const hasOptionalSections = enabledSections !== null;

  useEffect(() => {
    if (currentSection !== previousSection && containerRef.current) {
      const prevEl = sectionRefs.current.get(previousSection);
      const currEl = sectionRefs.current.get(currentSection);
      
      if (prevEl && currEl) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const prevRect = prevEl.getBoundingClientRect();
        const currRect = currEl.getBoundingClientRect();
        
        const startTop = prevRect.top - containerRect.top + prevRect.height / 2;
        const endTop = currRect.top - containerRect.top + currRect.height / 2;
        const left = prevRect.left - containerRect.left + prevRect.width / 2;
        
        setDotPosition({ startTop, endTop, left });
        setAnimating(true);
        
        setTimeout(() => {
          setAnimating(false);
          setDotPosition(null);
          setPreviousSection(currentSection);
        }, 400);
      } else {
        setPreviousSection(currentSection);
      }
    }
  }, [currentSection, previousSection]);

  const handleAddSections = async (newSections: string[]) => {
    setIsAddingSections(true);
    try {
      await updateEnabledSections(newSections);
      setShowAddSectionDialog(false);
    } finally {
      setIsAddingSections(false);
    }
  };

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed h-screen overflow-y-auto">
      <div ref={containerRef} className="p-6 relative">
        {/* Animated yellow dot */}
        {animating && dotPosition && (
          <div
            className="w-3 h-3 rounded-full bg-yellow-400 z-20 absolute pointer-events-none animate-drop-dot"
            style={{
              left: `${dotPosition.left}px`,
              top: `${dotPosition.startTop}px`,
              transform: 'translate(-50%, -50%)',
              ['--end-top' as string]: `${dotPosition.endTop}px`,
            } as React.CSSProperties}
          />
        )}
        
        <nav>
          {sections.map((section, index) => (
            <div key={section.id} className="relative">
              <button
                onClick={() => onSectionChange(section.id)}
                className="w-full flex items-start gap-3 py-5 px-2 text-sm font-medium text-left"
              >
                {/* Circle indicator */}
                <div
                  ref={(el) => sectionRefs.current.set(section.id, el)}
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0 mt-0.5 transition-colors",
                    currentSection === section.id
                      ? "bg-sidebar-primary"
                      : "bg-border"
                  )}
                />
                {/* Label */}
                <span
                  className={cn(
                    "flex-1 transition-colors",
                    currentSection === section.id
                      ? "text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
                  )}
                >
                  {section.label}
                </span>
                {section.progress && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {section.progress}
                  </span>
                )}
              </button>
              {/* Connecting line */}
              {index < sections.length - 1 && (
                <div 
                  className="absolute w-0.5 bg-border"
                  style={{
                    height: '34px',
                    left: '14px',
                    bottom: '-17px',
                  }}
                />
              )}
            </div>
          ))}
        </nav>

        {/* Manage Sections Button */}
        {!isReadOnly && hasOptionalSections && (
          <div className="mt-6 px-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={() => setShowAddSectionDialog(true)}
            >
              <Plus className="h-4 w-4" />
              Manage Sections
            </Button>
          </div>
        )}
      </div>

      <AddSectionDialog
        open={showAddSectionDialog}
        onOpenChange={setShowAddSectionDialog}
        currentEnabledSections={enabledSections || allSections.map(s => s.id)}
        onConfirm={handleAddSections}
        isLoading={isAddingSections}
        sectionsData={sectionsData}
      />
    </aside>
  );
};
