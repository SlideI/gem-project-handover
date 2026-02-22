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
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isToday, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

interface SummaryTableProps {
  condensed?: boolean;
}

export const SummaryTable = ({ condensed = false }: SummaryTableProps) => {
  const { sections } = usePlan();

  const allActions = useMemo(() => {
    const actions: Array<{
      sectionId: string;
      category: string;
      needs_goals: string;
      action: string;
      responsible: string;
      deadline: string;
      achievement_indicator: string;
      review_status: string;
      completed: boolean;
      actionIndex: number;
    }> = [];

    Object.entries(sections).forEach(([sectionId, section]) => {
      section.actions.forEach((action, index) => {
        if (action.action) {
          actions.push({
            sectionId,
            category: section.category,
            needs_goals: action.needs_goals || "",
            action: action.action,
            responsible: action.responsible || "",
            deadline: action.deadline || "",
            achievement_indicator: action.achievement_indicator || "",
            review_status: action.review_status || "",
            completed: action.completed || false,
            actionIndex: index,
          });
        }
      });
    });

    // Sort so achieved items appear at the bottom
    return actions.sort((a, b) => {
      const aAchieved = a.review_status?.toLowerCase() === 'achieved';
      const bAchieved = b.review_status?.toLowerCase() === 'achieved';
      if (aAchieved && !bAchieved) return 1;
      if (!aAchieved && bAchieved) return -1;
      return 0;
    });
  }, [sections]);

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
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Overdue</Badge>;
      }
      if (isToday(deadlineDate)) {
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">Due Today</Badge>;
      }
      return <Badge variant="outline" className="bg-muted">Upcoming</Badge>;
    } catch {
      return <Badge variant="outline">Invalid Date</Badge>;
    }
  };

  const condensedCell = "max-h-[2.5rem] overflow-hidden text-ellipsis";

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Needs & Goals</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Who's responsible</TableHead>
            <TableHead className="w-[90px]">By when</TableHead>
            <TableHead>How will I know</TableHead>
            <TableHead className="w-[90px]">Review status</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allActions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                No actions added yet
              </TableCell>
            </TableRow>
          ) : (
            allActions.map((action, index) => {
              const isAchieved = action.review_status?.toLowerCase() === 'achieved';
              return (
              <TableRow key={`${action.sectionId}-${index}`} data-achieved={isAchieved ? "true" : "false"} className={cn(condensed && "h-[2.5rem]")}>
                <TableCell className={cn("font-medium", condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.category}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.needs_goals || <span className="text-muted-foreground italic">...</span>}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.action}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.responsible || <span className="text-muted-foreground italic">...</span>}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}>
                  <div className={cn(condensed && condensedCell)}>{action.deadline ? format(parseISO(action.deadline), "dd/MM/yyyy") : <span className="text-muted-foreground italic">...</span>}</div>
                </TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.achievement_indicator || <span className="text-muted-foreground italic">...</span>}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{action.review_status || <span className="text-muted-foreground italic">...</span>}</div></TableCell>
                <TableCell className={cn(condensed && "py-1")}><div className={cn(condensed && condensedCell)}>{isAchieved ? null : getStatusBadge(action.deadline, action.completed)}</div></TableCell>
              </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
