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
  updateSection: (sectionId: string, data: Partial<SectionData>) => Promise<void>;
  updateField: (sectionId: string, fieldId: string, value: string) => Promise<void>;
  saveProgress: () => void;
  planId: string | null;
  planData: {
    id: string;
    title: string;
    status: string;
    version_number: number;
    profile_picture_url: string | null;
    background_picture_url: string | null;
  } | null;
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
  const [sectionDbIds, setSectionDbIds] = useState<Record<string, string>>({});
  const [planId, setPlanId] = useState<string | null>(null);
  const [planData, setPlanData] = useState<{
    id: string;
    title: string;
    status: string;
    version_number: number;
    profile_picture_url: string | null;
    background_picture_url: string | null;
  } | null>(null);
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
          .order("created_at", { ascending: false })
          .limit(10);

        if (fetchError) throw fetchError;

        // Find the first active plan, or use the most recent one
        const plan = existingPlans?.find(p => p.status === 'active') || existingPlans?.[0];

        if (plan) {
          setPlanId(plan.id);
          setPlanData({
            id: plan.id,
            title: plan.title,
            status: plan.status || 'active',
            version_number: plan.version_number || 1,
            profile_picture_url: plan.profile_picture_url,
            background_picture_url: plan.background_picture_url,
          });
          setProfilePicture(plan.profile_picture_url);
          setBackgroundPicture(plan.background_picture_url);

          // Load plan sections from database
          const { data: planSections } = await supabase
            .from("plan_sections")
            .select("*")
            .eq("plan_id", plan.id);

          // Load actions from database
          const { data: actionsData } = await supabase
            .from("actions")
            .select("*, section_id")
            .in("section_id", planSections?.map(s => s.id) || []);

          if (planSections) {
            // Store the mapping of section_key to database section ID
            const dbIdMap: Record<string, string> = {};
            planSections.forEach(section => {
              dbIdMap[section.section_key] = section.id;
            });
            setSectionDbIds(dbIdMap);

            setSections(prev => {
              const updated = { ...prev };
              
              // Create a map of section_id to actions
              const actionsBySection: Record<string, Action[]> = {};
              if (actionsData) {
                actionsData.forEach(action => {
                  if (!actionsBySection[action.section_id]) {
                    actionsBySection[action.section_id] = [];
                  }
                  actionsBySection[action.section_id].push({
                    action: action.action,
                    responsible: action.responsible,
                    deadline: action.deadline || "",
                    support: action.support,
                    completed: action.completed,
                  });
                });
              }
              
              planSections.forEach(section => {
                if (updated[section.section_key]) {
                  const sectionActions = actionsBySection[section.id] || [];
                  updated[section.section_key] = {
                    ...updated[section.section_key],
                    fields: (section.fields as Record<string, string>) || {},
                    actions: sectionActions.length > 0 ? sectionActions : updated[section.section_key].actions,
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
          setPlanData({
            id: newPlan.id,
            title: newPlan.title,
            status: newPlan.status || 'active',
            version_number: newPlan.version_number || 1,
            profile_picture_url: newPlan.profile_picture_url,
            background_picture_url: newPlan.background_picture_url,
          });
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

  const updateSection = async (sectionId: string, data: Partial<SectionData>) => {
    // Update local state immediately
    setSections(prev => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], ...data },
    }));

    // If actions are being updated, save to database
    if (data.actions && planId) {
      setIsSaving(true);
      try {
        // Get or create the section in the database
        let sectionDbId = sectionDbIds[sectionId];
        
        if (!sectionDbId) {
          const { data: existingSection } = await supabase
            .from("plan_sections")
            .select("id")
            .eq("plan_id", planId)
            .eq("section_key", sectionId)
            .maybeSingle();

          if (existingSection) {
            sectionDbId = existingSection.id;
          } else {
            const { data: newSection } = await supabase
              .from("plan_sections")
              .insert({
                plan_id: planId,
                section_key: sectionId,
                category: sections[sectionId].category,
                fields: {},
              })
              .select("id")
              .single();
            
            if (newSection) {
              sectionDbId = newSection.id;
              setSectionDbIds(prev => ({ ...prev, [sectionId]: sectionDbId }));
            }
          }
        }

        if (sectionDbId) {
          // Delete all existing actions for this section
          await supabase
            .from("actions")
            .delete()
            .eq("section_id", sectionDbId);

          // Insert new actions (only non-empty ones)
          const actionsToInsert = data.actions
            .filter(action => action.action && action.action.trim() !== "")
            .map(action => ({
              section_id: sectionDbId,
              action: action.action,
              responsible: action.responsible || "",
              deadline: action.deadline || null,
              support: action.support || "",
              completed: action.completed || false,
            }));

          if (actionsToInsert.length > 0) {
            await supabase
              .from("actions")
              .insert(actionsToInsert);
          }
        }
      } catch (error) {
        console.error("Error saving actions:", error);
      } finally {
        setIsSaving(false);
      }
    }
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
      planData,
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
