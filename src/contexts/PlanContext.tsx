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
  updateField: (sectionId: string, fieldId: string, value: string) => Promise<void>;
  saveProgress: () => void;
  planId: string | null;
  profilePicture: string | null;
  backgroundPicture: string | null;
  updatePlanImages: (profileUrl: string | null, backgroundUrl: string | null) => void;
  isLoading: boolean;
  isSaving: boolean;
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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

          // Load plan sections from database
          const { data: planSections } = await supabase
            .from("plan_sections")
            .select("*")
            .eq("plan_id", plan.id);

          if (planSections) {
            setSections(prev => {
              const updated = { ...prev };
              planSections.forEach(section => {
                if (updated[section.section_key]) {
                  updated[section.section_key] = {
                    ...updated[section.section_key],
                    fields: (section.fields as Record<string, string>) || {},
                  };
                }
              });
              return updated;
            });
          }
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
    // Data is now saved automatically to database in updateField
    // This function is kept for backward compatibility
  };

  const updateSection = (sectionId: string, data: Partial<SectionData>) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...data },
    }));
  };

  const updateField = async (sectionId: string, fieldId: string, value: string) => {
    // Update local state immediately
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

    // Save to database
    if (!planId) return;

    setIsSaving(true);
    try {
      const { data: existingSection } = await supabase
        .from("plan_sections")
        .select("*")
        .eq("plan_id", planId)
        .eq("section_key", sectionId)
        .maybeSingle();

      const newFields = {
        ...(existingSection?.fields as Record<string, string> || {}),
        [fieldId]: value,
      };

      if (existingSection) {
        await supabase
          .from("plan_sections")
          .update({ fields: newFields })
          .eq("id", existingSection.id);
      } else {
        await supabase
          .from("plan_sections")
          .insert({
            plan_id: planId,
            section_key: sectionId,
            category: sections[sectionId].category,
            fields: newFields,
          });
      }
    } catch (error) {
      console.error("Error saving field:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save removed - now saves immediately to database

  return (
    <PlanContext.Provider value={{ 
      sections, 
      updateSection, 
      updateField, 
      saveProgress,
      planId,
      profilePicture,
      backgroundPicture,
      updatePlanImages,
      isLoading,
      isSaving,
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
