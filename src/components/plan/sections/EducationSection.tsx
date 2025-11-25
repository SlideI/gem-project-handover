import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";

export const EducationSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["education"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Education, Training or Employment Needs
        </h2>
        <p className="text-muted-foreground">
          Your current education, training, or employment situation and goals
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <PrePopulatedField
            label="My school, kura, early childhood, kōhanga or tertiary education provider is"
            value="Auckland Secondary College"
          />
          <CheckboxField
            id="not-enrolled"
            label="Not enrolled"
            checked={data?.fields?.["not-enrolled"] === "true"}
            onCheckedChange={(checked) => updateField("education", "not-enrolled", String(checked))}
          />
          <ConditionalField show={data?.fields?.["not-enrolled"] === "true"}>
            <FieldWithPrompt label="Rationale for not being enrolled">
              <Textarea
                value={data?.fields?.["not-enrolled-rationale"] || ""}
                onChange={(e) => updateField("education", "not-enrolled-rationale", e.target.value)}
                placeholder="Explain why not enrolled..."
                className="min-h-[80px]"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <ConditionalField show={data?.fields?.["not-enrolled"] !== "true"}>
          <FieldWithPrompt label="I am in year/class">
            <Textarea
              value={data?.fields?.["year-class"] || ""}
              onChange={(e) => updateField("education", "year-class", e.target.value)}
              placeholder="e.g., Year 10, Level 2..."
              className="min-h-[60px]"
            />
          </FieldWithPrompt>

          <FieldWithPrompt
            label="My kaiako, teacher, principal, teacher's aid or other people who support me at school are"
            prompt="Consider who te tamaiti or rangatahi feels they can talk to at school when they need help, support, or someone to listen."
          >
            <Textarea
              value={data?.fields?.["school-support-people"] || ""}
              onChange={(e) => updateField("education", "school-support-people", e.target.value)}
              placeholder="List support people at school..."
              className="min-h-[100px]"
            />
          </FieldWithPrompt>

          <FieldWithPrompt
            label="How am I doing at school and anything and support I may require to engage and attend?"
            prompt="Consider the educational progress of te tamaiti or rangatahi, including how they are engaging with learning and participating in school or other learning environments. Identify any specific learning needs, strengths, or challenges, and explore what supports or adjustments may help them thrive academically and socially."
          >
            <Textarea
              value={data?.fields?.["school-progress"] || ""}
              onChange={(e) => updateField("education", "school-progress", e.target.value)}
              placeholder="Describe school progress and support needs..."
              className="min-h-[120px]"
            />
          </FieldWithPrompt>
        </ConditionalField>

        <FieldWithPrompt label="My employment or apprenticeship is, the hours I work and the contact details are:">
          <Textarea
            value={data?.fields?.employment || ""}
            onChange={(e) => updateField("education", "employment", e.target.value)}
            placeholder="Employment details (for those 14 years and over)..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="education" />
      </div>
    </div>
  );
};