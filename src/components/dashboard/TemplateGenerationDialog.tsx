import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Section {
  id: string;
  label: string;
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
  { id: "summary", label: "My Plan Summary" },
];

const templateTypes = [
  { id: "courts", label: "Courts" },
  { id: "remand-home", label: "Remand Home" },
  { id: "care", label: "Care" },
  { id: "all", label: "All" },
];

// Function to get random 6 sections based on template type
const getRandomSectionsForTemplate = (templateId: string): string[] => {
  const sectionIds = allSections.map(s => s.id);
  
  // Shuffle array and pick 6 random sections
  const shuffled = [...sectionIds].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
};

interface TemplateGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  planTitle: string;
}

export const TemplateGenerationDialog = ({ 
  open, 
  onOpenChange, 
  planId, 
  planTitle 
}: TemplateGenerationDialogProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // When template changes, auto-select random 6 sections
  useEffect(() => {
    if (selectedTemplate) {
      const randomSections = getRandomSectionsForTemplate(selectedTemplate);
      setSelectedSections(randomSections);
    } else {
      setSelectedSections([]);
    }
  }, [selectedTemplate]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedTemplate(null);
      setSelectedSections([]);
    }
  }, [open]);

  const handleGenerate = () => {
    // For now, just close the dialog - actual generation logic can be added later
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Template</DialogTitle>
          <DialogDescription>
            Select a template type for "{planTitle}". Sections will be pre-selected based on the template.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Template Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Template Type</Label>
            <RadioGroup 
              value={selectedTemplate || ""} 
              onValueChange={setSelectedTemplate}
              className="space-y-2"
            >
              {templateTypes.map((template) => (
                <div key={template.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={template.id} id={`template-${template.id}`} />
                  <Label
                    htmlFor={`template-${template.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {template.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Section Selection (greyed out, auto-selected) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">Sections (auto-selected)</Label>
            <div className="space-y-2">
              {allSections.map((section) => (
                <div key={section.id} className="flex items-center space-x-2 opacity-50">
                  <Checkbox
                    id={`section-${section.id}`}
                    checked={selectedSections.includes(section.id)}
                    disabled
                    className="cursor-not-allowed"
                  />
                  <Label
                    htmlFor={`section-${section.id}`}
                    className="text-sm font-normal text-muted-foreground cursor-not-allowed leading-tight"
                  >
                    {section.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedTemplate}
          >
            Generate Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
