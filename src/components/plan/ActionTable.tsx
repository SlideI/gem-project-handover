import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlan } from "@/contexts/PlanContext";
import { ActionDialog } from "./ActionDialog";

interface ActionTableProps {
  sectionId: string;
}

export const ActionTable = ({ sectionId }: ActionTableProps) => {
  const { sections, updateSection, isReadOnly } = usePlan();
  const section = sections[sectionId];
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!section) return null;

  const actions = section.actions || [];

  const handleRowClick = (index: number) => {
    if (isReadOnly) return;
    setSelectedIndex(index);
    setIsDialogOpen(true);
  };

  const handleAddAction = () => {
    if (isReadOnly) return;
    const newAction = {
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
    updateSection(sectionId, { actions: updatedActions });
    setSelectedIndex(updatedActions.length - 1);
    setIsDialogOpen(true);
  };

  const handleSaveAction = (updatedAction: any) => {
    if (selectedIndex === -1) return;

    const updatedActions = [...actions];
    updatedActions[selectedIndex] = updatedAction;
    updateSection(sectionId, { actions: updatedActions });
    setSelectedIndex(-1);
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
    if (isReadOnly) return;
    const updatedActions = [...actions];
    updatedActions[index] = {
      ...updatedActions[index],
      completed: checked,
    };
    updateSection(sectionId, { actions: updatedActions });
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
      />

      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="min-w-[160px]">Needs & Goals</TableHead>
              <TableHead className="min-w-[160px]">Action</TableHead>
              <TableHead className="min-w-[120px]">Who is responsible</TableHead>
              <TableHead className="min-w-[100px]">By when</TableHead>
              <TableHead className="min-w-[160px]">How will I know</TableHead>
              <TableHead className="min-w-[100px]">Review status</TableHead>
              <TableHead className="w-[100px]">Complete</TableHead>
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={action.completed}
                        onCheckedChange={(checked) => handleCheckboxChange(originalIndex, checked as boolean)}
                        disabled={isReadOnly}
                      />
                    </div>
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
