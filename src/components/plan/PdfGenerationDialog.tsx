import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { pdf } from "@react-pdf/renderer";
import { PlanPdfDocument } from "./PlanPdfDocument";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

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

interface PdfGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PdfGenerationDialog = ({ open, onOpenChange }: PdfGenerationDialogProps) => {
  const [selectedSections, setSelectedSections] = useState<string[]>(
    sections.map(s => s.id)
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const { sections: planSections, planData } = usePlan();

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAll = () => {
    if (selectedSections.length === sections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(sections.map(s => s.id));
    }
  };

  const handleGeneratePdf = async () => {
    if (selectedSections.length === 0) {
      toast.error("Please select at least one section");
      return;
    }

    setIsGenerating(true);
    try {
      const blob = await pdf(
        <PlanPdfDocument 
          sections={planSections}
          selectedSections={selectedSections}
          planTitle={planData?.title || "My Plan"}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${planData?.title || "plan"}_${new Date().toISOString().split('T')[0]}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDF generated successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Generate PDF</DialogTitle>
          <DialogDescription>
            Select the sections you want to include in your PDF. The PDF will be formatted for printing with spaces to fill in by hand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b">
            <Label className="text-sm font-semibold">Sections to Include</Label>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {selectedSections.length === sections.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="flex items-center space-x-3">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <Label
                  htmlFor={section.id}
                  className="text-sm font-normal cursor-pointer flex-1"
                >
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGeneratePdf} disabled={isGenerating || selectedSections.length === 0}>
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
