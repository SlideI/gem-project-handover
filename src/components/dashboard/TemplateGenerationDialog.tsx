import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


const templateTypes = [
  { id: "multi-agency", label: "Multi-agency Team Meeting" },
  { id: "roit", label: "ROIT" },
  { id: "care-request", label: "Care Request" },
  { id: "youth-justice-admission", label: "Youth Justice Admission Form" },
];

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

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedTemplate(null);
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
