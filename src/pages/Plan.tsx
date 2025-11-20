import { useState, useEffect } from "react";
import { PlanSidebar } from "@/components/plan/PlanSidebar";
import { PlanContent } from "@/components/plan/PlanContent";
import { PlanProvider } from "@/contexts/PlanContext";

const Plan = () => {
  const [currentSection, setCurrentSection] = useState("about-me");

  // Handle hash navigation from timeline links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        setCurrentSection(hash);
      }
    };

    // Set initial section from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <PlanProvider>
      <div className="flex min-h-screen bg-background">
        <PlanSidebar 
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
        <main className="flex-1 ml-64">
          <PlanContent 
            currentSection={currentSection} 
            onSectionChange={setCurrentSection}
          />
        </main>
      </div>
    </PlanProvider>
  );
};

export default Plan;
