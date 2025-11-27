import { cn } from "@/lib/utils";

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
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border fixed h-screen overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-colors text-left",
                  currentSection === section.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full flex-shrink-0",
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
                <div className="h-4 w-0.5 bg-border ml-[18px] my-1" />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
