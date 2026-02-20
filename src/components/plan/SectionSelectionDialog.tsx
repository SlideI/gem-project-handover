import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export interface SectionOption {
  id: string;
  label: string;
  required?: boolean;
}

export const ALL_SECTIONS: SectionOption[] = [
  { id: "about-me", label: "About Me", required: true },
  { id: "identity", label: "Identity, Spirituality, and Cultural Needs", required: true },
  { id: "connections", label: "My Connections", required: true },
  { id: "health", label: "Health & Wellbeing Needs", required: true },
  { id: "disability", label: "Disability Needs" },
  { id: "education", label: "Education, Training or Employment Needs", required: true },
  { id: "planning-with", label: "Planning With", required: true },
  { id: "transition", label: "Transition to Adulthood" },
  { id: "youth-justice", label: "Youth Justice" },
  { id: "residence", label: "Residence & Homes" },
  { id: "care-request", label: "Care Request", required: true },
  { id: "visit-frequency", label: "Frequency of Visits", required: true },
  { id: "summary", label: "My Plan Summary", required: true },
];

interface SectionSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selectedSections: string[]) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  confirmButtonText?: string;
}

export const SectionSelectionDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Select Plan Sections",
  description = "Choose which sections to include in your plan. Required sections cannot be deselected. You can add omitted sections later if needed.",
  confirmButtonText = "Create Plan",
}: SectionSelectionDialogProps) => {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    ALL_SECTIONS.map(s => s.id)
  );

  const toggleSection = (sectionId: string) => {
    const section = ALL_SECTIONS.find(s => s.id === sectionId);
    if (section?.required) return;

    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectAll = () => {
    setSelectedSections(ALL_SECTIONS.map(s => s.id));
  };

  const selectRequired = () => {
    setSelectedSections(ALL_SECTIONS.filter(s => s.required).map(s => s.id));
  };

  const handleConfirm = () => {
    onConfirm(selectedSections);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={selectRequired}>
              Required Only
            </Button>
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {ALL_SECTIONS.map(section => (
              <div key={section.id} className="flex items-center space-x-3">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                  disabled={section.required}
                />
                <Label
                  htmlFor={section.id}
                  className={`flex-1 cursor-pointer ${
                    section.required ? "text-muted-foreground" : ""
                  }`}
                >
                  {section.label}
                  {section.required && (
                    <span className="ml-2 text-xs text-muted-foreground">(Required)</span>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Creating..." : confirmButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
