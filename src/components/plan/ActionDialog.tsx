import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Action {
  action: string;
  responsible: string;
  deadline: string;
  support: string;
  completed: boolean;
  show_in_timeline?: boolean;
  needs_goals?: string;
  achievement_indicator?: string;
  review_status?: string;
}

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  onSave: (action: Action) => void;
  sectionId: string;
  needsGoalsLabel?: string;
  needsGoalsPrompt?: string;
}

export const ActionDialog = ({ 
  open, 
  onOpenChange, 
  action, 
  onSave, 
  sectionId,
  needsGoalsLabel = "My day to day needs and safety goals",
  needsGoalsPrompt = "Consider what a safe environment looks like for te tamaiti or rangatahi, recognising that oranga (wellbeing) is different for every whānau or family. Record the agreed goals that reflect this understanding. Consider whether te tamaiti or rangatahi is warm, dry, sleeping and eating well, and whether their specific dietary or health needs are being met. Record any identified needs to ensure these aspects of wellbeing are supported."
}: ActionDialogProps) => {
  const [formData, setFormData] = useState<Action>({
    action: "",
    responsible: "",
    deadline: "",
    support: "",
    completed: false,
    show_in_timeline: true,
    needs_goals: "",
    achievement_indicator: "",
    review_status: "",
  });

  useEffect(() => {
    if (action) {
      setFormData({
        ...action,
        needs_goals: action.needs_goals || "",
        achievement_indicator: action.achievement_indicator || "",
        review_status: action.review_status || "",
      });
    } else {
      setFormData({
        action: "",
        responsible: "",
        deadline: "",
        support: "",
        completed: false,
        show_in_timeline: true,
        needs_goals: "",
        achievement_indicator: "",
        review_status: "",
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
          <DialogTitle>My Goal Plan</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-needs-goals`}>{needsGoalsLabel}</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-primary cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>{needsGoalsPrompt}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id={`${sectionId}-needs-goals`}
              value={formData.needs_goals}
              onChange={(e) => setFormData({ ...formData, needs_goals: e.target.value })}
              placeholder="Describe the needs and goals"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-action`}>Action</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-primary cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Outline the actions and tasks required to achieve each identified goal or need. These actions should be clearly defined and follow the SMART criteria—Specific, Measurable, Achievable, Relevant, and Time-bound—to ensure they are practical and effective in supporting progress.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-responsible`}>Who is responsible</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-primary cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Include or specify who will support each action to help achieve the goals. This may include whānau, family, hapū, iwi, other professionals, social worker, case leader, care team, specialist services, transitions provider, caregiver support, and others who contribute to the goals. Consider whether any financial responsibilities are linked to the action, and who may help meet those.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`${sectionId}-responsible`}
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Enter responsible person"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-deadline`}>By when</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-primary cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Consider the specific timeframe within which each action or outcome should be achieved. Assign clear dates where possible to support accountability and progress tracking. If an action is ongoing, align its timeframe with the length of the AAMP review period to ensure it remains relevant and monitored.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id={`${sectionId}-deadline`}
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-achievement`}>How will I know I have achieved this</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-primary cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Think about how we'll recognise when a goal or action has been achieved—what specific changes or outcomes will show progress? If things aren't on track, what signs might help us notice early, and what extra support could help te tamaiti or rangatahi get back on track?</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id={`${sectionId}-achievement`}
              value={formData.achievement_indicator}
              onChange={(e) => setFormData({ ...formData, achievement_indicator: e.target.value })}
              placeholder="Describe how you will know when this is achieved"
              autoComplete="off"
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor={`${sectionId}-review-status`}>Review status</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="material-icons-outlined text-base text-foreground cursor-help">help_outline</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Use "Changed" when the original goal or action is no longer relevant, and a new direction, interest, or need has emerged. This may reflect a shift in priorities, circumstances, or preferences.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select
              value={formData.review_status}
              onValueChange={(value) => setFormData({ ...formData, review_status: value })}
            >
              <SelectTrigger id={`${sectionId}-review-status`}>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Achieved">Achieved</SelectItem>
                <SelectItem value="In progress">In progress</SelectItem>
                <SelectItem value="Changed">Changed</SelectItem>
              </SelectContent>
            </Select>
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
