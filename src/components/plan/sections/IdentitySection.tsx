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
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My whakapapa">
          <Textarea
            value={data?.fields?.whakapapa || ""}
            onChange={(e) => updateField("identity", "whakapapa", e.target.value)}
            placeholder="Your family lineage and heritage..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My religious or spiritual beliefs">
          <Textarea
            value={data?.fields?.religious || ""}
            onChange={(e) => updateField("identity", "religious", e.target.value)}
            placeholder="Your spiritual beliefs and practices..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="Important things to know about my culture and to support my cultural safety (ie ethnic origin, age, disability, gender, sexual orientation, gender identity, migrant or refugee experience)">
          <Textarea
            value={data?.fields?.["cultural-important"] || ""}
            onChange={(e) => updateField("identity", "cultural-important", e.target.value)}
            placeholder="Cultural practices and values that matter to you..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>

        <FieldWithPrompt label="My faith or cultural needs">
          <Textarea
            value={data?.fields?.["faith-needs"] || ""}
            onChange={(e) => updateField("identity", "faith-needs", e.target.value)}
            placeholder="Specific cultural or faith-based support you need..."
            autoComplete="off"
            className="min-h-[100px] resize-none"
          />
        </FieldWithPrompt>
      </div>

      <div className="pt-6">
        <ActionTable 
          sectionId="identity" 
          needsGoalsLabel="The needs and goals to support me with my Identity, spirituality, cultural needs and safety"
          needsGoalsPrompt="Place value on narratives as a part of their cultural identity. These stories will help to identify what tamariki or rangatahi and whānau or family experience, value, identify and connect with. Consider the principle of mana and work collaboratively with tamariki or rangatahi and whānau or family to ensure they have what they need to keep safe and keep their culture safe such as their whakapapa and whanaungatanga connections. Also consider any barriers that may exist for connection to their whakapapa and how this can affect their cultural safety."
        />
      </div>
    </div>
  );
};
