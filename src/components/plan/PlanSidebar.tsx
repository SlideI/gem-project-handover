import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";

interface Section {
  id: string;
  label: string;
  progress?: string;
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

interface PlanSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export const PlanSidebar = ({ currentSection, onSectionChange }: PlanSidebarProps) => {
  const [previousSection, setPreviousSection] = useState<string>(currentSection);
  const [animating, setAnimating] = useState(false);
  const [dotPosition, setDotPosition] = useState<{ startTop: number; endTop: number } | null>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        
        setDotPosition({ startTop, endTop });
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

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed h-screen overflow-y-auto">
      <div ref={containerRef} className="p-6 space-y-6 relative">
        {/* Animated yellow dot */}
        {animating && dotPosition && (
          <div
            className="w-3 h-3 rounded-full bg-yellow-400 z-20 absolute pointer-events-none animate-drop-dot"
            style={{
              left: '18px',
              top: `${dotPosition.startTop}px`,
              transform: 'translateX(-50%) translateY(-50%)',
              ['--end-top' as string]: `${dotPosition.endTop}px`,
            } as React.CSSProperties}
          />
        )}
        
        <div className="space-y-0">
          {sections.map((section, index) => (
            <div key={section.id} className="relative">
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors text-left",
                  currentSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <div
                  ref={(el) => sectionRefs.current.set(section.id, el)}
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0 z-10 relative",
                    currentSection === section.id
                      ? "bg-sidebar-primary"
                      : "bg-border"
                  )}
                />
                <span className="flex-1">{section.label}</span>
                {section.progress && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {section.progress}
                  </span>
                )}
              </button>
              {index < sections.length - 1 && (
                <div className="h-8 w-0.5 bg-border ml-[18px]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
