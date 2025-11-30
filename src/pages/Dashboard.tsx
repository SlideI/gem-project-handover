import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { KPICards } from "@/components/dashboard/KPICards";
import { SummaryTable } from "@/components/dashboard/SummaryTable";
import { PlanTimeline } from "@/components/dashboard/PlanTimeline";
import { DocumentsPanel } from "@/components/dashboard/DocumentsPanel";
import { ContactsPanel } from "@/components/dashboard/ContactsPanel";
import { HistoryPanel } from "@/components/dashboard/HistoryPanel";
import { PlanProvider } from "@/contexts/PlanContext";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  useEffect(() => {
    const checkActivePlan = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data } = await supabase
        .from('plans')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('status', 'active')
        .maybeSingle();

      setHasActivePlan(!!data);
    };

    checkActivePlan();
  }, []);

  return (
    <PlanProvider>
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
                    Samuel Genson's Plan
                  </h1>
                  <div className="flex gap-4 mt-2 text-sm">
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
              {hasActivePlan && (
                <Button 
                  onClick={() => navigate("/plan")}
                  className="bg-success hover:bg-success/90 text-white"
                >
                  Update Existing Plan
                </Button>
              )}
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

        {/* KPI Cards */}
        <KPICards />

        {/* Plan Timeline */}
        <PlanTimeline />

        {/* Summary Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Plan Summary</h2>
          <SummaryTable />
        </Card>

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
    </PlanProvider>
  );
};

export default Dashboard;
