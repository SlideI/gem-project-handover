import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { pdf } from "@react-pdf/renderer";
import { PlanPdfDocument } from "./PlanPdfDocument";
import { usePlan } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface PdfGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PdfGenerationDialog = ({ open, onOpenChange }: PdfGenerationDialogProps) => {
  const { sections: planSections, planData, planId, enabledSections, updateField } = usePlan();
  
  // Filter sections based on enabled sections (null means all enabled)
  const availableSections = enabledSections
    ? allSections.filter(s => enabledSections.includes(s.id))
    : allSections;

  const [selectedSections, setSelectedSections] = useState<string[]>(
    availableSections.map(s => s.id)
  );
  const [addEmptyRows, setAddEmptyRows] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Update selected sections when available sections change
  useEffect(() => {
    setSelectedSections(availableSections.map(s => s.id));
  }, [enabledSections]);

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleAll = () => {
    if (selectedSections.length === availableSections.length) {
      setSelectedSections([]);
    } else {
      setSelectedSections(availableSections.map(s => s.id));
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
          addEmptyRows={addEmptyRows}
        />
      ).toBlob();

      const fileName = `${planData?.title || "plan"}_${new Date().toISOString().split('T')[0]}.pdf`;

      // Download the PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);

      // Upload to storage so it appears in the Files tab
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user.user && planId) {
          const storagePath = `${user.user.id}/${Date.now()}-${fileName}`;
          const { error: uploadError } = await supabase.storage
            .from("table-attachments")
            .upload(storagePath, blob, { contentType: "application/pdf" });

          if (!uploadError) {
            const { data: publicUrlData } = supabase.storage
              .from("table-attachments")
              .getPublicUrl(storagePath);

            // Save reference in the about-me section's pdf-attachments field
            const existingField = planSections["about-me"]?.fields?.["pdf-attachments"] || "[]";
            let existing: Array<{ name: string; url: string; uploadedAt: string }> = [];
            try { existing = JSON.parse(existingField); } catch { existing = []; }
            existing.push({
              name: fileName,
              url: publicUrlData.publicUrl,
              uploadedAt: new Date().toISOString(),
            });
            await updateField("about-me", "pdf-attachments", JSON.stringify(existing));
          }
        }
      } catch (storageError) {
        console.error("Error saving PDF to files:", storageError);
        // Don't fail the whole operation if storage upload fails
      }

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate PDF</DialogTitle>
          <DialogDescription>
            Select sections to include in your print-friendly PDF.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Sections</Label>
            <Button variant="ghost" size="sm" onClick={toggleAll} className="h-8 text-xs">
              {selectedSections.length === availableSections.length ? "Deselect All" : "Select All"}
            </Button>
          </div>

          <div className="space-y-2">
            {availableSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2">
                <Checkbox
                  id={section.id}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <Label
                  htmlFor={section.id}
                  className="text-sm font-normal cursor-pointer flex-1 leading-tight"
                >
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md border border-dashed">
          <Checkbox
            id="add-empty-rows"
            checked={addEmptyRows}
            onCheckedChange={(checked) => setAddEmptyRows(checked === true)}
          />
          <Label
            htmlFor="add-empty-rows"
            className="text-sm font-medium cursor-pointer flex-1 leading-tight"
          >
            Add Empty Table Rows
            <span className="block text-xs font-normal text-muted-foreground mt-0.5">
              Includes 3 additional blank rows per table for handwritten responses
            </span>
          </Label>
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
