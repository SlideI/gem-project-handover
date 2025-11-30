import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Plan {
  id: string;
  title: string;
  status: string;
  version_number: number;
  updated_at: string;
  created_at: string;
  profile_picture_url: string | null;
  background_picture_url: string | null;
}

export const DocumentsPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showNewPlanDialog, setShowNewPlanDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all plans for the user
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('user_id', user.user.id)
          .order('version_number', { ascending: false });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const activePlan = plans.find(p => p.status === 'active');
  const latestVersionedPlan = plans.find(p => p.status === 'versioned');

  const handleCreateNewVersion = async () => {
    if (!activePlan?.id) return;
    
    setIsCreating(true);
    try {
      // 1. Update current plan status to 'versioned'
      const { error: updateError } = await supabase
        .from('plans')
        .update({ status: 'versioned' })
        .eq('id', activePlan.id);

      if (updateError) throw updateError;

      // 2. Create new plan version
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      const { data: newPlan, error: createError } = await supabase
        .from('plans')
        .insert({
          user_id: user.user.id,
          title: activePlan.title,
          profile_picture_url: activePlan.profile_picture_url,
          background_picture_url: activePlan.background_picture_url,
          status: 'active',
          version_number: (activePlan.version_number || 1) + 1,
          parent_plan_id: activePlan.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // 3. Copy all plan_sections from old plan to new plan
      const { data: sections, error: sectionsError } = await supabase
        .from('plan_sections')
        .select('*')
        .eq('plan_id', activePlan.id);

      if (sectionsError) throw sectionsError;

      if (sections && sections.length > 0) {
        const newSections = sections.map(section => ({
          plan_id: newPlan.id,
          section_key: section.section_key,
          category: section.category,
          fields: section.fields,
        }));

        const { data: insertedSections, error: insertError } = await supabase
          .from('plan_sections')
          .insert(newSections)
          .select();

        if (insertError) throw insertError;

        // 4. Copy all actions from old sections to new sections
        const oldSectionIds = sections.map(s => s.id);
        const { data: actions, error: actionsError } = await supabase
          .from('actions')
          .select('*')
          .in('section_id', oldSectionIds);

        if (actionsError) throw actionsError;

        if (actions && actions.length > 0 && insertedSections) {
          // Create mapping of old section keys to new section IDs
          const sectionMapping = sections.reduce((acc, oldSection, idx) => {
            acc[oldSection.id] = insertedSections[idx].id;
            return acc;
          }, {} as Record<string, string>);

          const newActions = actions.map(action => ({
            section_id: sectionMapping[action.section_id],
            action: action.action,
            support: action.support,
            responsible: action.responsible,
            deadline: action.deadline,
            completed: action.completed,
          }));

          const { error: actionsInsertError } = await supabase
            .from('actions')
            .insert(newActions);

          if (actionsInsertError) throw actionsInsertError;
        }
      }

      toast({
        title: "New version created",
        description: "Previous version has been locked. All data copied to new version.",
      });

      setShowNewPlanDialog(false);
      window.location.reload(); // Reload to show new version
    } catch (error) {
      console.error("Error creating new version:", error);
      toast({
        title: "Error",
        description: "Failed to create new plan version. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleNewPlanClick = async () => {
    if (activePlan?.id) {
      // Active plan exists - show confirmation modal
      setShowNewPlanDialog(true);
    } else if (latestVersionedPlan) {
      // No active plan but versioned exists - create new plan and copy from versioned
      await handleCreateFromVersioned();
    } else {
      // No plan exists - navigate directly to create plan
      navigate("/plan");
    }
  };

  const handleCreateFromVersioned = async () => {
    if (!latestVersionedPlan) return;
    
    setIsCreating(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("User not authenticated");

      // Create new active plan
      const { data: newPlan, error: createError } = await supabase
        .from('plans')
        .insert({
          user_id: user.user.id,
          title: latestVersionedPlan.title,
          profile_picture_url: latestVersionedPlan.profile_picture_url,
          background_picture_url: latestVersionedPlan.background_picture_url,
          status: 'active',
          version_number: (latestVersionedPlan.version_number || 1) + 1,
          parent_plan_id: latestVersionedPlan.id,
        })
        .select()
        .single();

      if (createError) throw createError;

      // Copy all plan_sections from versioned plan to new plan
      const { data: sections, error: sectionsError } = await supabase
        .from('plan_sections')
        .select('*')
        .eq('plan_id', latestVersionedPlan.id);

      if (sectionsError) throw sectionsError;

      if (sections && sections.length > 0) {
        const newSections = sections.map(section => ({
          plan_id: newPlan.id,
          section_key: section.section_key,
          category: section.category,
          fields: section.fields,
        }));

        const { data: insertedSections, error: insertError } = await supabase
          .from('plan_sections')
          .insert(newSections)
          .select();

        if (insertError) throw insertError;

        // Copy all actions from old sections to new sections
        const oldSectionIds = sections.map(s => s.id);
        const { data: actions, error: actionsError } = await supabase
          .from('actions')
          .select('*')
          .in('section_id', oldSectionIds);

        if (actionsError) throw actionsError;

        if (actions && actions.length > 0 && insertedSections) {
          const sectionMapping = sections.reduce((acc, oldSection, idx) => {
            acc[oldSection.id] = insertedSections[idx].id;
            return acc;
          }, {} as Record<string, string>);

          const newActions = actions.map(action => ({
            section_id: sectionMapping[action.section_id],
            action: action.action,
            support: action.support,
            responsible: action.responsible,
            deadline: action.deadline,
            completed: action.completed,
          }));

          const { error: actionsInsertError } = await supabase
            .from('actions')
            .insert(newActions);

          if (actionsInsertError) throw actionsInsertError;
        }
      }

      toast({
        title: "New plan created",
        description: "Data copied from previous version.",
      });

      navigate("/plan");
    } catch (error) {
      console.error("Error creating plan from versioned:", error);
      toast({
        title: "Error",
        description: "Failed to create new plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleViewPlan = (planId: string) => {
    navigate(`/plan?id=${planId}`);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd/MM/yyyy");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All About Me Plans</h3>
        <Button 
          onClick={handleNewPlanClick}
          size="sm"
          className="bg-success hover:bg-success/90 text-white"
        >
          + New Plan
        </Button>
      </div>

      <AlertDialog open={showNewPlanDialog} onOpenChange={setShowNewPlanDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Plan</AlertDialogTitle>
            <AlertDialogDescription>
              You have selected to create a new plan when there is an active plan already in progress. 
              Creating a new plan will archive a snapshot of the existing plan, copying the data entered 
              so far into the new plan. Are you sure you wish to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCreating}>No</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCreateNewVersion}
              disabled={isCreating}
              className="bg-success hover:bg-success/90"
            >
              {isCreating ? "Creating..." : "Yes"}
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
              <TableHead>Last Updated</TableHead>
              <TableHead>Version Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading plans...
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No plans yet. Click "+ New Plan" to create one.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    {plan.title || "All About Me Plan"}
                    {plan.version_number > 1 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (v{plan.version_number})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'versioned' 
                        ? 'bg-muted text-muted-foreground' 
                        : 'bg-success/10 text-success'
                    }`}>
                      {plan.status === 'versioned' ? 'Versioned' : 'Active'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(plan.updated_at)}</TableCell>
                  <TableCell>
                    {plan.status === 'versioned' ? formatDate(plan.updated_at) : "-"}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewPlan(plan.id)}
                      size="sm"
                      variant={plan.status === 'versioned' ? 'outline' : 'default'}
                    >
                      {plan.status === 'versioned' ? 'View' : 'Continue'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
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
