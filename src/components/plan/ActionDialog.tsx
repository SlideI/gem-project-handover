import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Action {
  action: string;
  responsible: string;
  deadline: string;
  support: string;
  completed: boolean;
}

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  onSave: (action: Action) => void;
  sectionId: string;
}

export const ActionDialog = ({ open, onOpenChange, action, onSave, sectionId }: ActionDialogProps) => {
  const [formData, setFormData] = useState<Action>({
    action: "",
    responsible: "",
    deadline: "",
    support: "",
    completed: false,
  });

  useEffect(() => {
    if (action) {
      setFormData(action);
    } else {
      setFormData({
        action: "",
        responsible: "",
        deadline: "",
        support: "",
        completed: false,
      });
    }
  }, [action, open]);

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>The needs and goals to support me...</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor={`${sectionId}-action`}>Action</Label>
            <Textarea
              id={`${sectionId}-action`}
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              placeholder="Describe the action needed"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sectionId}-responsible`}>Who is responsible</Label>
            <Input
              id={`${sectionId}-responsible`}
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Enter responsible person"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sectionId}-deadline`}>By when</Label>
            <Input
              id={`${sectionId}-deadline`}
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sectionId}-support`}>Additional support/services</Label>
            <Input
              id={`${sectionId}-support`}
              value={formData.support}
              onChange={(e) => setFormData({ ...formData, support: e.target.value })}
              placeholder="Enter additional support needed"
              autoComplete="off"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
