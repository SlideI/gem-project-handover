import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, Circle } from "lucide-react";

export const SummarySection = () => {
  const { sections } = usePlan();

  const allActions = Object.entries(sections)
    .filter(([key]) => key !== "about-me")
    .flatMap(([key, section]) =>
      section.actions.map(action => ({
        ...action,
        category: section.category,
      }))
    )
    .filter(action => action.action && action.action.trim() !== "");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">My Plan Summary</h2>
        <p className="text-muted-foreground">
          A complete overview of all actions across your plan
        </p>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-3xl font-bold text-primary">{allActions.length}</div>
            <div className="text-sm text-muted-foreground">Total Actions</div>
          </div>
          <div className="text-center p-4 bg-success/10 rounded-lg">
            <div className="text-3xl font-bold text-success">
              {allActions.filter(a => a.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-4 bg-warning/10 rounded-lg">
            <div className="text-3xl font-bold text-warning">
              {allActions.filter(a => !a.completed).length}
            </div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </div>

        {allActions.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Responsible</TableHead>
                  <TableHead>Deadline</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allActions.map((action, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {action.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{action.category}</TableCell>
                    <TableCell>{action.action}</TableCell>
                    <TableCell>{action.responsible}</TableCell>
                    <TableCell>{action.deadline}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No actions have been added to your plan yet
          </div>
        )}
      </Card>
    </div>
  );
};
