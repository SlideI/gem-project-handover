import { useState } from "react";
import { PlanSidebar } from "@/components/plan/PlanSidebar";
import { PlanContent } from "@/components/plan/PlanContent";
import { PlanProvider } from "@/contexts/PlanContext";

const Plan = () => {
  const [currentSection, setCurrentSection] = useState("about-me");

  return (
    <PlanProvider>
      <div className="flex min-h-screen bg-background">
        <PlanSidebar 
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
        <main className="flex-1 ml-64">
          <PlanContent currentSection={currentSection} />
        </main>
      </div>
    </PlanProvider>
  );
};

export default Plan;
