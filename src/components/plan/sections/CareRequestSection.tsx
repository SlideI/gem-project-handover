import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { DatePickerField } from "@/components/plan/DatePickerField";
import { SelectField } from "@/components/plan/SelectField";
import { TableField } from "@/components/plan/TableField";

export const CareRequestSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["care-request"];

  const careArrangementNeeded = data?.fields?.["care-arrangement-needed"] === "true";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Care Request</h2>
        <p className="text-muted-foreground">
          Care arrangement needs and preferences
        </p>
      </div>

      <div className="space-y-4">
        <FieldWithPrompt label="Is a care arrangement needed">
          <CheckboxField
            id="care-arrangement-needed"
            label="Yes, care arrangement is needed"
            checked={careArrangementNeeded}
            onCheckedChange={(checked) => updateField("care-request", "care-arrangement-needed", String(checked))}
          />
        </FieldWithPrompt>

        <ConditionalField show={careArrangementNeeded}>
          <div className="space-y-4">
            <PrePopulatedField
              label="CYRAS ID"
              value="CYRAS-2025-001234"
            />

            <PrePopulatedField
              label="Site referring"
              value="Auckland Central Site"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Care needed (select multiple):</label>
              <div className="space-y-2">
                <CheckboxField
                  id="care-immediate-safety"
                  label="Immediate safety & stabilisation (for crisis/emergency situations)"
                  checked={data?.fields?.["care-immediate-safety"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-immediate-safety", String(checked))}
                />
                <CheckboxField
                  id="care-respite"
                  label="Short-Term Relief/ Respite Care"
                  checked={data?.fields?.["care-respite"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-respite", String(checked))}
                />
                <CheckboxField
                  id="care-primary"
                  label="Primary Care (longer-term, relational care)"
                  checked={data?.fields?.["care-primary"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-primary", String(checked))}
                />
                <CheckboxField
                  id="care-transition"
                  label="Transition to Adulthood"
                  checked={data?.fields?.["care-transition"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-transition", String(checked))}
                />
                <CheckboxField
                  id="care-specialist"
                  label="Specialist Care – High Support Needs"
                  checked={data?.fields?.["care-specialist"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-specialist", String(checked))}
                />
                <CheckboxField
                  id="care-group-living"
                  label="Group Living / Shared Care Environment"
                  checked={data?.fields?.["care-group-living"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-group-living", String(checked))}
                />
                <CheckboxField
                  id="care-disability"
                  label="Disability Support Services"
                  checked={data?.fields?.["care-disability"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-disability", String(checked))}
                />
              </div>
              <FieldWithPrompt label="Describe need">
                <Textarea
                  value={data?.fields?.["care-need-description"] || ""}
                  onChange={(e) => updateField("care-request", "care-need-description", e.target.value)}
                  placeholder="Describe the care need..."
                  className="min-h-[100px]"
                />
              </FieldWithPrompt>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Care type requested (select multiple):</label>
              <div className="space-y-2">
                <CheckboxField
                  id="care-type-approved"
                  label="Approved caregivers"
                  checked={data?.fields?.["care-type-approved"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-type-approved", String(checked))}
                />
                <CheckboxField
                  id="care-type-family-whare"
                  label="Family and group whare"
                  checked={data?.fields?.["care-type-family-whare"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-type-family-whare", String(checked))}
                />
                <CheckboxField
                  id="care-type-staffed"
                  label="Staffed care"
                  checked={data?.fields?.["care-type-staffed"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "care-type-staffed", String(checked))}
                />
              </div>
              <FieldWithPrompt label="Other care type">
                <Input
                  value={data?.fields?.["care-type-other"] || ""}
                  onChange={(e) => updateField("care-request", "care-type-other", e.target.value)}
                  placeholder="Other care type..."
                />
              </FieldWithPrompt>
            </div>

            <SelectField
              label="Care with other tamariki?"
              value={data?.fields?.["care-with-others"] || ""}
              onChange={(value) => updateField("care-request", "care-with-others", value)}
              options={[
                { value: "yes", label: "Yes, can be placed with other Tamariki" },
                { value: "no", label: "No, cannot be placed with other Tamariki" },
                { value: "dependent", label: "Dependent on group impact assessment" },
                { value: "other", label: "Other" }
              ]}
            />

            <FieldWithPrompt label="Rationale">
              <Textarea
                value={data?.fields?.["care-with-others-rationale"] || ""}
                onChange={(e) => updateField("care-request", "care-with-others-rationale", e.target.value)}
                placeholder="Rationale for placement with other tamariki..."
                className="min-h-[80px]"
              />
            </FieldWithPrompt>

            <DatePickerField
              label="By when is care needed?"
              value={data?.fields?.["care-needed-by"] ? new Date(data.fields["care-needed-by"]) : undefined}
              onChange={(date) => updateField("care-request", "care-needed-by", date?.toISOString() || "")}
            />

            <FieldWithPrompt label="Priority locations/areas for care">
              <Textarea
                value={data?.fields?.["priority-locations"] || ""}
                onChange={(e) => updateField("care-request", "priority-locations", e.target.value)}
                placeholder="Priority locations..."
                className="min-h-[80px]"
              />
            </FieldWithPrompt>

            <div className="space-y-2">
              <label className="text-sm font-medium">Proposed length of stay (select multiple):</label>
              <div className="space-y-2">
                <CheckboxField
                  id="stay-emergency"
                  label="Emergency 24-72 hours"
                  checked={data?.fields?.["stay-emergency"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "stay-emergency", String(checked))}
                />
                <CheckboxField
                  id="stay-interim"
                  label="Interim 1-4 weeks"
                  checked={data?.fields?.["stay-interim"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "stay-interim", String(checked))}
                />
                <CheckboxField
                  id="stay-short-term"
                  label="Short-term under 3 month"
                  checked={data?.fields?.["stay-short-term"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "stay-short-term", String(checked))}
                />
                <CheckboxField
                  id="stay-6-months"
                  label="6-months or more"
                  checked={data?.fields?.["stay-6-months"] === "true"}
                  onCheckedChange={(checked) => updateField("care-request", "stay-6-months", String(checked))}
                />
              </div>
              <FieldWithPrompt label="Other length of stay">
                <Input
                  value={data?.fields?.["stay-other"] || ""}
                  onChange={(e) => updateField("care-request", "stay-other", e.target.value)}
                  placeholder="Other length of stay..."
                />
              </FieldWithPrompt>
            </div>

            <FieldWithPrompt label="Whanau care options explored?">
              <Textarea
                value={data?.fields?.["whanau-options"] || ""}
                onChange={(e) => updateField("care-request", "whanau-options", e.target.value)}
                placeholder="Whanau care options explored..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>

            <TableField
              label="Care history"
              columns={[
                { key: "arrangement", label: "Care arrangement" },
                { key: "length", label: "Length of time" },
                { key: "reason", label: "Reason for change", type: "textarea" }
              ]}
              value={typeof data?.fields?.["care-history"] === 'string' ? JSON.parse(data?.fields?.["care-history"] || '[]') : (data?.fields?.["care-history"] || [])}
              onChange={(value) => updateField("care-request", "care-history", JSON.stringify(value))}
            />

            <FieldWithPrompt label="Why is a care arrangement needed">
              <Textarea
                value={data?.fields?.["why-care-needed"] || ""}
                onChange={(e) => updateField("care-request", "why-care-needed", e.target.value)}
                placeholder="Why care arrangement is needed..."
                className="min-h-[120px]"
              />
            </FieldWithPrompt>

            <FieldWithPrompt
              label="Any further comments, safety or behavioural concerns or challenges that a potential caregiver needs to be aware of?"
              prompt="Consider any important information that the caregiver needs to know about in order to support everyone's safety. Are there safety concerns related to people associated with te tamaiti. Include any current supports of strategies that are in place to help to manage any safety or behavioural concerns."
            >
              <Textarea
                value={data?.fields?.["caregiver-concerns"] || ""}
                onChange={(e) => updateField("care-request", "caregiver-concerns", e.target.value)}
                placeholder="Safety or behavioural concerns..."
                className="min-h-[120px]"
              />
            </FieldWithPrompt>
          </div>
        </ConditionalField>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="care-request" />
      </div>
    </div>
  );
};
