import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlan } from "@/contexts/PlanContext";
import { ActionDialog } from "./ActionDialog";

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

interface ActionTableProps {
  sectionId: string;
  subHeading?: string;
  actionsKey?: string;
  needsGoalsLabel?: string;
  needsGoalsPrompt?: string;
}

export const ActionTable = ({ 
  sectionId, 
  subHeading,
  actionsKey,
  needsGoalsLabel = "My day to day needs and safety goals",
  needsGoalsPrompt = "Consider what a safe environment looks like for te tamaiti or rangatahi, recognising that oranga (wellbeing) is different for every whānau or family. Record the agreed goals that reflect this understanding. Consider whether te tamaiti or rangatahi is warm, dry, sleeping and eating well, and whether their specific dietary or health needs are being met. Record any identified needs to ensure these aspects of wellbeing are supported."
}: ActionTableProps) => {
  const { sections, updateSection, updateField, isReadOnly } = usePlan();
  const section = sections[sectionId];
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!section) return null;

  // Use custom actionsKey if provided, otherwise use default section actions
  const getActions = (): Action[] => {
    if (actionsKey) {
      const fieldValue = section.fields?.[actionsKey];
      if (!fieldValue) return [];
      try {
        return typeof fieldValue === 'string' ? JSON.parse(fieldValue) : fieldValue;
      } catch {
        return [];
      }
    }
    return section.actions || [];
  };

  const actions = getActions();

  const handleRowClick = (index: number) => {
    if (isReadOnly) return;
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };

  const handleAddAction = () => {
    if (isReadOnly) return;
    const newAction: Action = {
      action: "",
      responsible: "",
      deadline: "",
      support: "",
      completed: false,
      show_in_timeline: true,
      needs_goals: "",
      achievement_indicator: "",
      review_status: "",
    };
    const updatedActions = [...actions, newAction];
    if (actionsKey) {
      updateField(sectionId, actionsKey, JSON.stringify(updatedActions));
    } else {
      updateSection(sectionId, { actions: updatedActions });
    }
    setSelectedIndex(updatedActions.length - 1);
    setIsDialogOpen(true);
  };

  const handleSaveAction = (updatedAction: Action) => {
    if (selectedIndex === -1) return;

    const updatedActions = [...actions];
    updatedActions[selectedIndex] = updatedAction;
    if (actionsKey) {
      updateField(sectionId, actionsKey, JSON.stringify(updatedActions));
    } else {
      updateSection(sectionId, { actions: updatedActions });
    }
    setSelectedIndex(-1);
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (isReadOnly) return;
    const updatedActions = [...actions];
    updatedActions[index] = {
      ...updatedActions[index],
      completed: checked,
    };
    if (actionsKey) {
      updateField(sectionId, actionsKey, JSON.stringify(updatedActions));
    } else {
      updateSection(sectionId, { actions: updatedActions });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "...";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-NZ");
  };

  // Sort actions: incomplete first, then completed
  const sortedActions = [...actions].sort((a, b) => 
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  const currentAction = selectedIndex >= 0 ? actions[selectedIndex] : null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My Goal Plan - {section.category}</h2>
      {subHeading && (
        <h3 className="text-lg font-medium text-muted-foreground">{subHeading}</h3>
      )}
      <p className="text-sm text-muted-foreground">
        {isReadOnly 
          ? "This is a versioned plan. You can view the content but cannot make changes."
          : "Click on the table below to enter or change any information."
        }
      </p>
      
      <ActionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        action={currentAction}
        onSave={handleSaveAction}
        sectionId={sectionId}
        needsGoalsLabel={needsGoalsLabel}
        needsGoalsPrompt={needsGoalsPrompt}
      />

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Category</TableHead>
              <TableHead>Needs & Goals</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Who is responsible</TableHead>
              <TableHead className="w-[90px]">By when</TableHead>
              <TableHead>How will I know</TableHead>
              <TableHead className="w-[90px]">Review status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedActions.map((action, sortedIndex) => {
              const originalIndex = actions.indexOf(action);
              const isFirstRow = sortedIndex === 0;
              
              return (
                <TableRow
                  key={originalIndex}
                  onClick={() => handleRowClick(originalIndex)}
                  className={`${!isReadOnly ? 'cursor-pointer' : ''} ${action.completed ? 'opacity-60' : ''}`}
                >
                  {isFirstRow && (
                    <TableCell rowSpan={sortedActions.length} className="align-top font-medium bg-muted/30">
                      {section.category}
                    </TableCell>
                  )}
                  <TableCell>
                    {action.needs_goals || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                  <TableCell className="font-medium">
                    {action.action || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                  <TableCell>
                    {action.responsible || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                  <TableCell>
                    {action.deadline ? (
                      <span>{formatDate(action.deadline)}</span>
                    ) : (
                      <span className="text-muted-foreground italic">...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {action.achievement_indicator || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                  <TableCell>
                    {action.review_status || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {!isReadOnly && (
        <div>
          <Button onClick={handleAddAction} className="gap-2">
            <span className="material-icons-outlined text-base">add</span>
            Add Action
          </Button>
        </div>
      )}
    </div>
  );
};
