import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isToday, parseISO } from "date-fns";

export const SummaryTable = () => {
  const { sections, updateSection } = usePlan();

  const allActions = useMemo(() => {
    const actions: Array<{
      sectionId: string;
      category: string;
      action: string;
      responsible: string;
      deadline: string;
      support: string;
      completed: boolean;
      actionIndex: number;
    }> = [];

    Object.entries(sections).forEach(([sectionId, section]) => {
      section.actions.forEach((action, index) => {
        if (action.action) {
          actions.push({
            sectionId,
            category: section.category,
            ...action,
            actionIndex: index,
          });
        }
      });
    });

    return actions;
  }, [sections]);

  const handleToggleComplete = (sectionId: string, actionIndex: number) => {
    const section = sections[sectionId];
    const updatedActions = [...section.actions];
    updatedActions[actionIndex] = {
      ...updatedActions[actionIndex],
      completed: !updatedActions[actionIndex].completed,
    };
    updateSection(sectionId, { actions: updatedActions });
  };

  const getStatusBadge = (deadline: string, completed: boolean) => {
    if (completed) {
      return <Badge variant="outline" className="bg-success/10 text-success border-success">Complete</Badge>;
    }
    
    if (!deadline) {
      return <Badge variant="outline">Not Scheduled</Badge>;
    }

    try {
      const deadlineDate = parseISO(deadline);
      if (isPast(deadlineDate) && !isToday(deadlineDate)) {
        return <Badge variant="destructive">Overdue</Badge>;
      }
      if (isToday(deadlineDate)) {
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Due Today</Badge>;
      }
      return <Badge variant="outline" className="bg-muted">Upcoming</Badge>;
    } catch {
      return <Badge variant="outline">Invalid Date</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">Done</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Responsible</TableHead>
            <TableHead>By When</TableHead>
            <TableHead>Support</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allActions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                No actions added yet
              </TableCell>
            </TableRow>
          ) : (
            allActions.map((action, index) => (
              <TableRow key={`${action.sectionId}-${index}`}>
                <TableCell>
                  <Checkbox
                    checked={action.completed}
                    onCheckedChange={() => handleToggleComplete(action.sectionId, action.actionIndex)}
                  />
                </TableCell>
                <TableCell className="font-medium">{action.category}</TableCell>
                <TableCell>{action.action}</TableCell>
                <TableCell>{action.responsible || "-"}</TableCell>
                <TableCell>
                  {action.deadline ? format(parseISO(action.deadline), "dd/MM/yyyy") : "-"}
                </TableCell>
                <TableCell>{action.support || "-"}</TableCell>
                <TableCell>{getStatusBadge(action.deadline, action.completed)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
