import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { PlanSidebar } from "@/components/plan/PlanSidebar";
import { PlanContent } from "@/components/plan/PlanContent";
import { PlanProvider, usePlan } from "@/contexts/PlanContext";
import { FloatingActionButtons } from "@/components/plan/FloatingActionButtons";

// Inner component that can use usePlan
const PlanInner = () => {
  const [currentSection, setCurrentSection] = useState("about-me");
  const [selectedTheme, setSelectedTheme] = useState("default");
  const mainRef = useRef<HTMLElement>(null);
  const { enabledSections } = usePlan();

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', selectedTheme);
  }, [selectedTheme]);

  // Handle hash navigation from timeline links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1);
      if (hash) {
        // Only navigate to hash if section is enabled
        if (!enabledSections || enabledSections.includes(hash)) {
          setCurrentSection(hash);
        }
      }
    };

    // Set initial section from hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [enabledSections]);

  // Ensure current section is valid when enabled sections change
  useEffect(() => {
    if (enabledSections && !enabledSections.includes(currentSection)) {
      // Navigate to first enabled section
      setCurrentSection(enabledSections[0] || "about-me");
    }
  }, [enabledSections, currentSection]);

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
    <div className="flex min-h-screen bg-background">
      <FloatingActionButtons 
        selectedTheme={selectedTheme}
        onThemeChange={setSelectedTheme}
      />
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
  );
};

const Plan = () => {
  const [searchParams] = useSearchParams();
  const requestedPlanId = searchParams.get("id");

  return (
    <PlanProvider requestedPlanId={requestedPlanId}>
      <PlanInner />
    </PlanProvider>
  );
};

export default Plan;
