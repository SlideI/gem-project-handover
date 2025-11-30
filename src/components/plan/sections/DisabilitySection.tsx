import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { TableField } from "@/components/plan/TableField";

export const DisabilitySection = () => {
  const { sections, updateField, isReadOnly } = usePlan();
  const data = sections["disability"];

  const parseAttachments = (fieldId: string) => {
    try {
      const val = data?.fields?.[fieldId];
      if (!val) return [];
      return typeof val === 'string' ? JSON.parse(val) : val;
    } catch {
      return [];
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Disability Needs</h2>
        <p className="text-muted-foreground">
          Support needs and goals related to any disabilities
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <CheckboxField
            id="no-disability-needs"
            label="No needs identified"
            checked={data?.fields?.["no-disability-needs"] === "true"}
            onCheckedChange={(checked) => updateField("disability", "no-disability-needs", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-disability-needs"] !== "true"}>
            <div className="space-y-4">
              <TableField
                label="I have a disability"
                columns={[
                  { key: "disability", label: "Disability" },
                  { key: "status", label: "Status (diagnosed/suspected/requires assessment/assessment in progress)" },
                  { key: "description", label: "Description", type: "textarea" }
                ]}
                value={typeof data?.fields?.disability === 'string' ? JSON.parse(data?.fields?.disability || '[]') : (data?.fields?.disability || [])}
                onChange={(value) => updateField("disability", "disability", JSON.stringify(value))}
                attachments={parseAttachments("disability-attachments")}
                onAttachmentsChange={(attachments) => updateField("disability", "disability-attachments", JSON.stringify(attachments))}
                readOnly={isReadOnly}
              />

              <TableField
                label="Disability services and supports currently involved"
                columns={[
                  { key: "services", label: "Disability services", type: "textarea" },
                  { key: "supports", label: "Supports currently involved", type: "textarea" }
                ]}
                value={typeof data?.fields?.["disability-services"] === 'string' ? JSON.parse(data?.fields?.["disability-services"] || '[]') : (data?.fields?.["disability-services"] || [])}
                onChange={(value) => updateField("disability", "disability-services", JSON.stringify(value))}
                prompt="Record who is currently involved in supporting te tamaiti or rangatahi, and describe their role. Include any scheduled appointments, and consider whether additional appointments or assessments may be needed. Make sure these are included in the plan, with clear actions and timeframes."
                attachments={parseAttachments("disability-services-attachments")}
                onAttachmentsChange={(attachments) => updateField("disability", "disability-services-attachments", JSON.stringify(attachments))}
                readOnly={isReadOnly}
              />
            </div>
          </ConditionalField>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="disability" />
      </div>
    </div>
  );
};
