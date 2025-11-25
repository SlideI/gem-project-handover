import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";

export const IdentitySection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["identity"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Identity, Spirituality, and Cultural Needs
        </h2>
        <p className="text-muted-foreground">
          Your cultural identity and spiritual beliefs
        </p>
      </div>

      <div className="space-y-4">
        <FieldWithPrompt label="Where I'm from">
          <Textarea
            value={data?.fields?.from || ""}
            onChange={(e) => updateField("identity", "from", e.target.value)}
            placeholder="Your place of origin..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My whakapapa">
          <Textarea
            value={data?.fields?.whakapapa || ""}
            onChange={(e) => updateField("identity", "whakapapa", e.target.value)}
            placeholder="Your family lineage and heritage..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My religious or spiritual beliefs">
          <Textarea
            value={data?.fields?.religious || ""}
            onChange={(e) => updateField("identity", "religious", e.target.value)}
            placeholder="Your spiritual beliefs and practices..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="What's culturally important to me">
          <Textarea
            value={data?.fields?.["cultural-important"] || ""}
            onChange={(e) => updateField("identity", "cultural-important", e.target.value)}
            placeholder="Cultural practices and values that matter to you..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My faith or cultural needs">
          <Textarea
            value={data?.fields?.["faith-needs"] || ""}
            onChange={(e) => updateField("identity", "faith-needs", e.target.value)}
            placeholder="Specific cultural or faith-based support you need..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="identity" />
      </div>
    </div>
  );
};
