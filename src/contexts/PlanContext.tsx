import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";

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
  planId: string | null;
  profilePicture: string | null;
  backgroundPicture: string | null;
  updatePlanImages: (profileUrl: string | null, backgroundUrl: string | null) => void;
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
  const [planId, setPlanId] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [backgroundPicture, setBackgroundPicture] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Fetch or create plan for authenticated user
  useEffect(() => {
    if (!session?.user) return;

    const fetchOrCreatePlan = async () => {
      try {
        const { data: existingPlans, error: fetchError } = await supabase
          .from("plans")
          .select("*")
          .eq("user_id", session.user.id)
          .limit(1);

        if (fetchError) throw fetchError;

        if (existingPlans && existingPlans.length > 0) {
          const plan = existingPlans[0];
          setPlanId(plan.id);
          setProfilePicture(plan.profile_picture_url);
          setBackgroundPicture(plan.background_picture_url);
        } else {
          const { data: newPlan, error: createError } = await supabase
            .from("plans")
            .insert({ user_id: session.user.id, title: "My Plan" })
            .select()
            .single();

          if (createError) throw createError;

          setPlanId(newPlan.id);
        }
      } catch (error) {
        console.error("Error with plan:", error);
      }
    };

    fetchOrCreatePlan();
  }, [session]);

  const updatePlanImages = (profileUrl: string | null, backgroundUrl: string | null) => {
    setProfilePicture(profileUrl);
    setBackgroundPicture(backgroundUrl);
  };

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
    <PlanContext.Provider value={{ 
      sections, 
      updateSection, 
      updateField, 
      saveProgress,
      planId,
      profilePicture,
      backgroundPicture,
      updatePlanImages
    }}>
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
