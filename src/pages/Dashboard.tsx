import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, RotateCcw, Minimize2, Maximize2, LogOut } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addWeeks, addMonths, format, differenceInDays, isPast, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { LiquidProgressBar } from "@/components/dashboard/LiquidProgressBar";
import { SummaryTable } from "@/components/dashboard/SummaryTable";
import { PlanTimeline } from "@/components/dashboard/PlanTimeline";
import { DocumentsPanel } from "@/components/dashboard/DocumentsPanel";
import { ContactsPanel } from "@/components/dashboard/ContactsPanel";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { PlanProvider } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";
import { SectionSelectionDialog } from "@/components/plan/SectionSelectionDialog";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [hasAnyPlan, setHasAnyPlan] = useState(false);
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [visitFrequency, setVisitFrequency] = useState<string>("");
  const [lastVisitDate, setLastVisitDate] = useState<Date | undefined>(undefined);
  const [condensedView, setCondensedView] = useState(false);
  const [visitReason, setVisitReason] = useState("");
  // Use timestamp to force PlanProvider refresh on every mount
  const [refreshKey, setRefreshKey] = useState(() => Date.now());

  const legalStatusStartDate = new Date(2026, 1, 20); // Feb 20, 2026

  const getNextVisitDate = (): string => {
    if (!visitFrequency) return "—";
    switch (visitFrequency) {
      case "weekly": return format(addWeeks(legalStatusStartDate, 1), "PPP");
      case "fortnightly": return format(addWeeks(legalStatusStartDate, 2), "PPP");
      case "monthly": return format(addMonths(legalStatusStartDate, 1), "PPP");
      case "6-monthly": return format(addMonths(legalStatusStartDate, 6), "PPP");
      case "never": return "No visit scheduled";
      default: return "—";
    }
  };

  const getVisitStatus = (): { label: string; variant: "default" | "destructive" | "secondary" | "outline" } => {
    if (!visitFrequency || visitFrequency === "never") return { label: "—", variant: "secondary" };
    
    const nextDate = visitFrequency === "weekly" ? addWeeks(legalStatusStartDate, 1)
      : visitFrequency === "fortnightly" ? addWeeks(legalStatusStartDate, 2)
      : visitFrequency === "monthly" ? addMonths(legalStatusStartDate, 1)
      : visitFrequency === "6-monthly" ? addMonths(legalStatusStartDate, 6)
      : null;
    
    if (!nextDate) return { label: "—", variant: "secondary" };

    const today = new Date();
    const daysUntil = differenceInDays(nextDate, today);

    if (isPast(nextDate) && !isToday(nextDate)) {
      return { label: "Overdue", variant: "destructive" };
    }
    if (daysUntil <= 3 && daysUntil >= 0) {
      return { label: "Due Soon", variant: "default" };
    }
    if (lastVisitDate) {
      return { label: "Completed", variant: "secondary" };
    }
    return { label: "Not due yet", variant: "default" };
  };

  useEffect(() => {
    const checkPlans = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: activePlan } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .maybeSingle();

      const { data: allPlans } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.user.id)
        .limit(1);

      setHasActivePlan(!!activePlan);
      setHasAnyPlan(!!(allPlans && allPlans.length > 0));
    };

    checkPlans();
  }, []);

  const handleCreatePlanWithSections = async (selectedSections: string[]) => {
    setIsCreatingPlan(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data: newPlan, error } = await supabase
        .from('plans')
        .insert({
          user_id: user.user.id,
          title: 'My Plan',
          enabled_sections: selectedSections,
        })
        .select()
        .single();

      if (error) throw error;

      setShowSectionDialog(false);
      navigate(`/plan?id=${newPlan.id}`);
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  const handleResetPlan = async () => {
    setIsResetting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Find the active plan
      const { data: activePlan } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (activePlan) {
        // Delete actions linked to this plan's sections
        const { data: sections } = await supabase
          .from('plan_sections')
          .select('id')
          .eq('plan_id', activePlan.id);

        if (sections && sections.length > 0) {
          const sectionIds = sections.map(s => s.id);
          await supabase.from('actions').delete().in('section_id', sectionIds);
        }

        // Delete plan sections
        await supabase.from('plan_sections').delete().eq('plan_id', activePlan.id);

        // Delete the plan itself
        await supabase.from('plans').delete().eq('id', activePlan.id);
      }

      setHasActivePlan(false);
      setHasAnyPlan(false);
      setShowResetDialog(false);
      setRefreshKey(Date.now());
    } catch (error) {
      console.error("Error resetting plan:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <PlanProvider key={refreshKey}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowContactDetails(!showContactDetails)}
                  title="Primary contact details"
                >
                  <Phone className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Samuel Genson's AAMP
                  </h1>
                  <div className="flex gap-4 mt-2 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Age</span>
                      <span className="font-medium">8 years old</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium text-success">Active</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Last Modified By</span>
                      <span className="font-medium">Jennifer Reilly, 4/04/2025 3:23pm</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/auth");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
                {hasActivePlan ? (
                  <>
                    <Button 
                      variant="outline"
                      onClick={() => setShowResetDialog(true)}
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button 
                      onClick={() => navigate("/plan")}
                      className="bg-success hover:bg-success/90 text-white"
                    >
                      Update Plan
                    </Button>
                  </>
                ) : !hasAnyPlan && (
                  <Button 
                    onClick={() => setShowSectionDialog(true)}
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    Create Plan
                  </Button>
                )}
              </div>
            </div>
            {showContactDetails && (
              <div className="mt-4 p-4 bg-accent rounded-lg">
                <h3 className="font-semibold mb-2">Primary Contact Details</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Name:</span> Jennifer Reilly</p>
                  <p><span className="font-medium">Phone:</span> (09) 555-0123</p>
                  <p><span className="font-medium">Email:</span> j.reilly@ot.govt.nz</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Plan Timeline */}
        <PlanTimeline nextVisitDate={visitFrequency && visitFrequency !== "never" ? getNextVisitDate() : undefined} />

        {/* Frequency of Visits */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-1">Frequency of visits to Samuel</h2>
          <p className="text-muted-foreground text-sm mb-4">Record how often you intend to visit this rāngatahi.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">How often I intend to visit this rāngatahi</Label>
              <Select value={visitFrequency} onValueChange={setVisitFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visit frequency" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="fortnightly">Fortnightly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="6-monthly">6 monthly</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium">Associated legal status start date</Label>
              <Input value={format(legalStatusStartDate, "PPP")} disabled className="bg-muted cursor-not-allowed" />
            </div>
          </div>
          <div className="mt-4">
            <Label className="mb-2 block text-sm font-medium">Why this often?</Label>
            <Textarea
              value={visitReason}
              onChange={(e) => setVisitReason(e.target.value)}
              placeholder="Explain the reason for this visit frequency..."
              className="min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="mb-2 block text-sm font-medium">Next visit is scheduled for</Label>
              <Input value={getNextVisitDate()} disabled className="bg-muted cursor-not-allowed" />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium">Last visit occurred on</Label>
              <Input value={lastVisitDate ? format(lastVisitDate, "PPP") : "—"} disabled className="bg-muted cursor-not-allowed" />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium">Visit status</Label>
              {(() => {
                const status = getVisitStatus();
                return (
                  <div className="mt-1">
                    <Badge variant={status.variant} className={
                      status.label === "Overdue" ? "bg-destructive text-destructive-foreground" :
                      status.label === "Due Soon" ? "bg-warning text-warning-foreground" :
                      status.label === "Completed" ? "bg-success text-white" :
                      status.label === "Not due yet" ? "bg-blue-500 text-white" :
                      ""
                    }>
                      {status.label}
                    </Badge>
                  </div>
                );
              })()}
            </div>
          </div>
        </Card>

        {/* Summary Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Plan Summary</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCondensedView(!condensedView)}
              className="gap-1.5"
            >
              {condensedView ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              {condensedView ? "Expand View" : "Condense View"}
            </Button>
          </div>
          <SummaryTable condensed={condensedView} />
        </Card>

        {/* Plan Progress - moved to bottom per client feedback */}
        <LiquidProgressBar />

        {/* Tabs Section */}
        <Card className="p-6">
          <Tabs defaultValue="documents">
            <TabsList>
              <TabsTrigger value="documents">All About Me Plans</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="documents" className="mt-4">
              <DocumentsPanel />
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              <ContactsPanel />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <HistoryPanel />
            </TabsContent>
          </Tabs>
        </Card>
        </div>
      </div>

      <SectionSelectionDialog
        open={showSectionDialog}
        onOpenChange={setShowSectionDialog}
        onConfirm={handleCreatePlanWithSections}
        isLoading={isCreatingPlan}
      />

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Plan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset this plan? This will permanently delete all plan data including sections and actions. You will need to start over from scratch by creating a new plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetPlan}
              disabled={isResetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isResetting ? "Resetting..." : "Yes, Reset Plan"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PlanProvider>
  );
};

export default Dashboard;
