import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const DocumentsPanel = () => {
  const navigate = useNavigate();
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);

  const handleCreateNewVersion = () => {
    // TODO: Implement the logic to lock current version and create new one
    console.log("Creating new plan version and locking current version");
    setShowNewPlanDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Documents</h3>
        <Button 
          onClick={() => setShowNewPlanDialog(true)}
          size="sm"
          className="bg-success hover:bg-success/90 text-white"
        >
          + New Plan
        </Button>
      </div>

      <AlertDialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Plan Version?</AlertDialogTitle>
            <AlertDialogDescription>
              Creating a new plan version will automatically lock the current version, 
              making it a snapshot of all data entered until now. This ensures your 
              existing plan data is preserved. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCreateNewVersion}
              className="bg-success hover:bg-success/90"
            >
              Create New Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">All About Me Plan</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  Draft
                </span>
              </TableCell>
              <TableCell>0%</TableCell>
              <TableCell>
                <Button
                  onClick={() => navigate("/plan")}
                  size="sm"
                >
                  View/Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Plan Timeline</h3>
        <div className="border rounded-lg p-8 text-center text-muted-foreground">
          No timeline events yet
        </div>
      </div>
    </div>
  );
};
