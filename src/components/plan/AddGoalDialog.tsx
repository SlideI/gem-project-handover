import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePlan } from "@/contexts/PlanContext";
import { toast } from "sonner";

interface AddGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  sectionId: string;
  needs_goals: string;
  action: string;
  responsible: string;
  deadline: string;
  achievement_indicator: string;
  review_status: string;
}

const emptyForm: FormState = {
  sectionId: "",
  needs_goals: "",
  action: "",
  responsible: "",
  deadline: "",
  achievement_indicator: "",
  review_status: "",
};

// Sections that don't take goal-plan actions
const EXCLUDED_SECTIONS = new Set(["about-me", "summary"]);

export const AddGoalDialog = ({ open, onOpenChange }: AddGoalDialogProps) => {
  const { sections, enabledSections, updateSection, isReadOnly } = usePlan();
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (open) setForm(emptyForm);
  }, [open]);

  const availableSections = Object.entries(sections)
    .filter(([id]) => !EXCLUDED_SECTIONS.has(id))
    .filter(([id]) => !enabledSections || enabledSections.includes(id))
    .map(([id, s]) => ({ id, label: s.category }));

  const handleSave = async () => {
    if (!form.sectionId) {
      toast.error("Please select a section");
      return;
    }
    if (!form.action.trim()) {
      toast.error("Please enter an action");
      return;
    }

    const section = sections[form.sectionId];
    const newAction = {
      action: form.action,
      responsible: form.responsible,
      deadline: form.deadline,
      support: "",
      completed: false,
      show_in_timeline: true,
      needs_goals: form.needs_goals,
      achievement_indicator: form.achievement_indicator,
      review_status: form.review_status,
    };

    await updateSection(form.sectionId, {
      actions: [...(section.actions || []), newAction],
    });
    toast.success(`Goal added to ${section.category}`);
    onOpenChange(false);
  };

  if (isReadOnly) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Goal Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="goal-section">Section</Label>
            <Select
              value={form.sectionId}
              onValueChange={(v) => setForm({ ...form, sectionId: v })}
            >
              <SelectTrigger id="goal-section">
                <SelectValue placeholder="Select the section this goal belongs to" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {availableSections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-needs">Needs &amp; Goals</Label>
            <Textarea
              id="goal-needs"
              value={form.needs_goals}
              onChange={(e) => setForm({ ...form, needs_goals: e.target.value })}
              placeholder="Describe the needs and goals"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-action">Action</Label>
            <Textarea
              id="goal-action"
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
              placeholder="Describe the action needed"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-responsible">Who is responsible</Label>
            <Input
              id="goal-responsible"
              value={form.responsible}
              onChange={(e) => setForm({ ...form, responsible: e.target.value })}
              placeholder="Enter responsible person"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-deadline">By when</Label>
            <Input
              id="goal-deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-achievement">How will I know I have achieved this</Label>
            <Textarea
              id="goal-achievement"
              value={form.achievement_indicator}
              onChange={(e) => setForm({ ...form, achievement_indicator: e.target.value })}
              placeholder="Describe how you will know when this is achieved"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal-review">Review status</Label>
            <Select
              value={form.review_status}
              onValueChange={(v) => setForm({ ...form, review_status: v })}
            >
              <SelectTrigger id="goal-review">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                <SelectItem value="Achieved">Achieved</SelectItem>
                <SelectItem value="In progress">In progress</SelectItem>
                <SelectItem value="Changed">Changed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Add Goal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
