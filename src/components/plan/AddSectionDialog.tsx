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
import { ALL_SECTIONS } from "./SectionSelectionDialog";

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEnabledSections: string[];
  onConfirm: (newSections: string[]) => void;
  isLoading?: boolean;
}

export const AddSectionDialog = ({
  open,
  onOpenChange,
  currentEnabledSections,
  onConfirm,
  isLoading = false,
}: AddSectionDialogProps) => {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Get sections that are not currently enabled
  const availableSections = ALL_SECTIONS.filter(
    s => !currentEnabledSections.includes(s.id) && !s.required
  );

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectAll = () => {
    setSelectedSections(availableSections.map(s => s.id));
  };

  const handleConfirm = () => {
    onConfirm([...currentEnabledSections, ...selectedSections]);
    setSelectedSections([]);
  };

  const handleClose = () => {
    setSelectedSections([]);
    onOpenChange(false);
  };

  if (availableSections.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add Sections</DialogTitle>
            <DialogDescription>
              All available sections are already included in your plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Sections</DialogTitle>
          <DialogDescription>
            Select additional sections to add to your plan.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Select All
            </Button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {availableSections.map(section => (
              <div key={section.id} className="flex items-center space-x-3">
                <Checkbox
                  id={`add-${section.id}`}
                  checked={selectedSections.includes(section.id)}
                  onCheckedChange={() => toggleSection(section.id)}
                />
                <Label htmlFor={`add-${section.id}`} className="flex-1 cursor-pointer">
                  {section.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm} 
            disabled={isLoading || selectedSections.length === 0}
          >
            {isLoading ? "Adding..." : `Add ${selectedSections.length} Section${selectedSections.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
