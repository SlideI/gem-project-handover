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
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Pre-populated field keys per section that come from CYRAS (not user-entered)
const PREPOPULATED_FIELD_KEYS: Record<string, string[]> = {
  "about-me": ["dob"],
  residence: ["placement-start-date", "caregiver-name", "key-worker-name", "caregiver-phone"],
  "youth-justice": ["next-court-date"],
  health: [],
  education: ["school-provider", "year-level"],
  disability: [],
  transition: [],
};

interface SectionDataForCheck {
  actions: Array<{ action: string }>;
  fields: Record<string, string>;
}

/**
 * Check if a section has user-entered data (excluding CYRAS pre-populated fields and attachment fields).
 */
function sectionHasUserData(sectionId: string, sectionData: SectionDataForCheck | undefined): boolean {
  if (!sectionData) return false;

  const prePopKeys = PREPOPULATED_FIELD_KEYS[sectionId] || [];

  // Check fields for any non-empty user-entered values
  const hasFieldData = Object.entries(sectionData.fields).some(([key, value]) => {
    // Skip pre-populated CYRAS fields
    if (prePopKeys.includes(key)) return false;
    // Skip attachment fields (stored as JSON arrays)
    if (key.endsWith("-attachments")) return false;
    // Check for non-empty value
    if (!value || String(value).trim() === "" || value === "false" || value === "[]") return false;
    return true;
  });

  if (hasFieldData) return true;

  // Check actions for any with user-entered content
  const hasActionData = sectionData.actions.some(
    a => a.action && a.action.trim() !== ""
  );

  return hasActionData;
}

interface AddSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentEnabledSections: string[];
  onConfirm: (newSections: string[]) => void;
  isLoading?: boolean;
  sectionsData?: Record<string, SectionDataForCheck>;
}

export const AddSectionDialog = ({
  open,
  onOpenChange,
  currentEnabledSections,
  onConfirm,
  isLoading = false,
  sectionsData,
}: AddSectionDialogProps) => {
  const [sectionsToAdd, setSectionsToAdd] = useState<string[]>([]);
  const [sectionsToRemove, setSectionsToRemove] = useState<string[]>([]);

  // Optional sections currently enabled (can potentially be removed)
  const removableSections = ALL_SECTIONS.filter(
    s => !s.required && currentEnabledSections.includes(s.id)
  );

  // Optional sections not currently enabled (can be added)
  const availableSections = ALL_SECTIONS.filter(
    s => !currentEnabledSections.includes(s.id) && !s.required
  );

  const toggleAdd = (sectionId: string) => {
    setSectionsToAdd(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleRemove = (sectionId: string) => {
    setSectionsToRemove(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const selectAllAvailable = () => {
    setSectionsToAdd(availableSections.map(s => s.id));
  };

  const handleConfirm = () => {
    const updated = [
      ...currentEnabledSections.filter(id => !sectionsToRemove.includes(id)),
      ...sectionsToAdd,
    ];
    onConfirm(updated);
    setSectionsToAdd([]);
    setSectionsToRemove([]);
  };

  const handleClose = () => {
    setSectionsToAdd([]);
    setSectionsToRemove([]);
    onOpenChange(false);
  };

  const hasChanges = sectionsToAdd.length > 0 || sectionsToRemove.length > 0;

  // If nothing to add or remove
  if (availableSections.length === 0 && removableSections.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Manage Sections</DialogTitle>
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
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Manage Sections</DialogTitle>
          <DialogDescription>
            Add or remove optional sections from your plan. Sections with user-entered data cannot be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Removable sections */}
          {removableSections.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3">
                Currently included (optional)
              </h4>
              <div className="space-y-3">
                {removableSections.map(section => {
                  const hasData = sectionHasUserData(section.id, sectionsData?.[section.id]);
                  const isMarkedForRemoval = sectionsToRemove.includes(section.id);

                  return (
                    <div key={section.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={`remove-${section.id}`}
                        checked={!isMarkedForRemoval}
                        onCheckedChange={() => {
                          if (!hasData) toggleRemove(section.id);
                        }}
                        disabled={hasData}
                      />
                      <Label
                        htmlFor={`remove-${section.id}`}
                        className={`flex-1 cursor-pointer ${
                          hasData ? "text-muted-foreground" : ""
                        } ${isMarkedForRemoval ? "line-through text-muted-foreground" : ""}`}
                      >
                        {section.label}
                      </Label>
                      {hasData && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Cannot remove — this section contains user-entered data</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available sections to add */}
          {availableSections.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Available to add
                </h4>
                {availableSections.length > 1 && (
                  <Button variant="outline" size="sm" onClick={selectAllAvailable}>
                    Select All
                  </Button>
                )}
              </div>
              <div className="space-y-3">
                {availableSections.map(section => (
                  <div key={section.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={`add-${section.id}`}
                      checked={sectionsToAdd.includes(section.id)}
                      onCheckedChange={() => toggleAdd(section.id)}
                    />
                    <Label htmlFor={`add-${section.id}`} className="flex-1 cursor-pointer">
                      {section.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !hasChanges}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
