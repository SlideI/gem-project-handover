import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePlan } from "@/contexts/PlanContext";

interface ActionTableProps {
  sectionId: string;
}

export const ActionTable = ({ sectionId }: ActionTableProps) => {
  const { sections, updateSection } = usePlan();
  const section = sections[sectionId];
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  if (!section) return null;

  const actions = section.actions || [];

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    setIsEditPanelOpen(true);
  };

  const handleAddAction = () => {
    const newAction = {
      action: "",
      responsible: "",
      deadline: "",
      support: "",
      completed: false,
    };
    const updatedActions = [...actions, newAction];
    updateSection(sectionId, { actions: updatedActions });
    setSelectedIndex(updatedActions.length - 1);
    setIsEditPanelOpen(true);
  };

  const handleUpdate = () => {
    if (selectedIndex === -1) return;
    
    const actionInput = document.getElementById(`${sectionId}-action`) as HTMLTextAreaElement;
    const responsibleInput = document.getElementById(`${sectionId}-responsible`) as HTMLInputElement;
    const deadlineInput = document.getElementById(`${sectionId}-deadline`) as HTMLInputElement;
    const supportInput = document.getElementById(`${sectionId}-support`) as HTMLInputElement;

    const updatedActions = [...actions];
    updatedActions[selectedIndex] = {
      ...updatedActions[selectedIndex],
      action: actionInput.value,
      responsible: responsibleInput.value,
      deadline: deadlineInput.value,
      support: supportInput.value,
    };

    updateSection(sectionId, { actions: updatedActions });
    setIsEditPanelOpen(false);
    setSelectedIndex(-1);
  };

  const handleClose = () => {
    setIsEditPanelOpen(false);
    setSelectedIndex(-1);
  };

  const handleCheckboxChange = (index: number, checked: boolean) => {
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
      <h2 className="text-2xl font-semibold">My Plan - {section.category}</h2>
      <p className="text-sm text-muted-foreground">Click on the table below to enter or change any information.</p>
      
      {isEditPanelOpen && currentAction && (
        <div className="border rounded-lg p-6 bg-accent/10 space-y-4">
          <h3 className="font-semibold">The needs and goals to support me...</h3>
          
          <div>
            <Label htmlFor={`${sectionId}-action`}>Action</Label>
            <Textarea
              id={`${sectionId}-action`}
              defaultValue={currentAction.action}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`${sectionId}-responsible`}>Who is responsible</Label>
            <Input
              id={`${sectionId}-responsible`}
              defaultValue={currentAction.responsible}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor={`${sectionId}-deadline`}>By when</Label>
              <Input
                type="date"
                id={`${sectionId}-deadline`}
                defaultValue={currentAction.deadline}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`${sectionId}-support`}>Additional support/services</Label>
              <Input
                id={`${sectionId}-support`}
                defaultValue={currentAction.support}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleUpdate}>Update</Button>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Category</TableHead>
              <TableHead className="min-w-[250px]">Action</TableHead>
              <TableHead>Who is responsible</TableHead>
              <TableHead>By when</TableHead>
              <TableHead>Additional support/services</TableHead>
              <TableHead className="w-[120px]">Action Complete</TableHead>
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
                  className={`cursor-pointer ${action.completed ? 'opacity-60' : ''}`}
                >
                  {isFirstRow && (
                    <TableCell rowSpan={sortedActions.length} className="align-top font-medium bg-muted/30">
                      {section.category}
                    </TableCell>
                  )}
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
                    {action.support || <span className="text-muted-foreground italic">...</span>}
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={action.completed}
                        onCheckedChange={(checked) => handleCheckboxChange(originalIndex, checked as boolean)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div>
        <Button onClick={handleAddAction}>＋ Add Action</Button>
      </div>
    </div>
  );
};
