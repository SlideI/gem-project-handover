import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { usePlan } from "@/contexts/PlanContext";

interface ActionTableProps {
  sectionId: string;
}

export const ActionTable = ({ sectionId }: ActionTableProps) => {
  const { sections, updateSection } = usePlan();
  const section = sections[sectionId];

  if (!section) return null;

  const addAction = () => {
    const newActions = [
      ...section.actions,
      {
        action: "",
        responsible: "",
        deadline: "",
        support: "",
        completed: false,
      },
    ];
    updateSection(sectionId, { actions: newActions });
  };

  const updateAction = (index: number, field: string, value: string | boolean) => {
    const newActions = [...section.actions];
    newActions[index] = { ...newActions[index], [field]: value };
    updateSection(sectionId, { actions: newActions });
  };

  const deleteAction = (index: number) => {
    const newActions = section.actions.filter((_, i) => i !== index);
    updateSection(sectionId, { actions: newActions });
  };

  return (
    <div className="space-y-4">
      {section.actions.map((action, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={action.completed}
                onCheckedChange={(checked) =>
                  updateAction(index, "completed", checked as boolean)
                }
              />
              <span className="text-sm font-medium">Action {index + 1}</span>
            </div>
            {section.actions.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAction(index)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">What needs to happen?</label>
              <Textarea
                value={action.action}
                onChange={(e) => updateAction(index, "action", e.target.value)}
                placeholder="Describe the action..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Who's responsible?</label>
                <Input
                  value={action.responsible}
                  onChange={(e) => updateAction(index, "responsible", e.target.value)}
                  placeholder="Person responsible"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deadline</label>
                <Input
                  type="date"
                  value={action.deadline}
                  onChange={(e) => updateAction(index, "deadline", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Support needed</label>
              <Textarea
                value={action.support}
                onChange={(e) => updateAction(index, "support", e.target.value)}
                placeholder="What support is needed to complete this action?"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addAction}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Action
      </Button>
    </div>
  );
};
