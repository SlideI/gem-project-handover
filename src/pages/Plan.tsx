import { useState, useEffect, useRef } from "react";
import { PlanSidebar } from "@/components/plan/PlanSidebar";
import { PlanContent } from "@/components/plan/PlanContent";
import { PlanProvider } from "@/contexts/PlanContext";

const Plan = () => {
  const [currentSection, setCurrentSection] = useState("about-me");
  const mainRef = useRef<HTMLElement>(null);

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

  // Smooth scroll animation when section changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  }, [currentSection]);

  return (
    <PlanProvider>
      <div className="flex min-h-screen bg-background">
        <PlanSidebar 
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
        <main ref={mainRef} className="flex-1 ml-64 overflow-y-auto scroll-smooth">
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
