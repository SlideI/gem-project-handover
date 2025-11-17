import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Action {
  action: string;
  responsible: string;
  deadline: string;
  support: string;
  completed: boolean;
}

interface SectionData {
  category: string;
  actions: Action[];
  fields: Record<string, string>;
}

interface PlanContextType {
  sections: Record<string, SectionData>;
  updateSection: (sectionId: string, data: Partial<SectionData>) => void;
  updateField: (sectionId: string, fieldId: string, value: string) => void;
  saveProgress: () => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

const defaultAction: Action = {
  action: "",
  responsible: "",
  deadline: "",
  support: "",
  completed: false,
};

const initialSections: Record<string, SectionData> = {
  "about-me": {
    category: "About Me",
    actions: [],
    fields: {},
  },
  identity: {
    category: "Identity, Spirituality, and Cultural Needs",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  connections: {
    category: "My Connections",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  health: {
    category: "Health & Wellbeing Needs",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  disability: {
    category: "Disability Needs",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  education: {
    category: "Education, Training or Employment Needs",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  transition: {
    category: "Transition to Adulthood",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  "youth-justice": {
    category: "Youth Justice",
    actions: [{ ...defaultAction }],
    fields: {},
  },
  residence: {
    category: "Residence & Homes",
    actions: [{ ...defaultAction }],
    fields: {},
  },
};

export const PlanProvider = ({ children }: { children: ReactNode }) => {
  const [sections, setSections] = useState<Record<string, SectionData>>(initialSections);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("aampPlanData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSections(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Failed to parse saved data:", e);
      }
    }
  }, []);

  const saveProgress = () => {
    localStorage.setItem("aampPlanData", JSON.stringify(sections));
  };

  const updateSection = (sectionId: string, data: Partial<SectionData>) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...data },
    }));
  };

  const updateField = (sectionId: string, fieldId: string, value: string) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        fields: {
          ...prev[sectionId].fields,
          [fieldId]: value,
        },
      },
    }));
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveProgress, 30000);
    return () => clearInterval(interval);
  }, [sections]);

  return (
    <PlanContext.Provider value={{ sections, updateSection, updateField, saveProgress }}>
      {children}
    </PlanContext.Provider>
  );
};

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("usePlan must be used within PlanProvider");
  }
  return context;
};
