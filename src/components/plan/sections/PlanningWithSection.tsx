import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { DatePickerField } from "@/components/plan/DatePickerField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { SelectField } from "@/components/plan/SelectField";
import { TableField } from "@/components/plan/TableField";

export const PlanningWithSection = () => {
  const { sections, updateField, isReadOnly } = usePlan();
  const data = sections["planning-with"];

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
        <h2 className="text-3xl font-bold text-foreground mb-2">Planning With</h2>
        <p className="text-muted-foreground">
          Plan reviews, sharing, and social worker visits
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <CheckboxField
            id="plan-discussed"
            label="I have been given a copy of my plan and discussed this with my social worker or case leader"
            checked={data?.fields?.["plan-discussed"] === "true"}
            onCheckedChange={(checked) => updateField("planning-with", "plan-discussed", String(checked))}
          />
          <DatePickerField
            label="Date discussed"
            value={data?.fields?.["plan-discussed-date"] ? new Date(data.fields["plan-discussed-date"]) : undefined}
            onChange={(date) => updateField("planning-with", "plan-discussed-date", date?.toISOString() || "")}
            showsOnTimeline
          />
        </div>

        <DatePickerField
          label="My plan will be reviewed on:"
          value={data?.fields?.["review-date"] ? new Date(data.fields["review-date"]) : undefined}
          onChange={(date) => updateField("planning-with", "review-date", date?.toISOString() || "")}
          showsOnTimeline
        />

        <FieldWithPrompt
          label="My whānau or family or other important members of my hapū, iwi or family group who have helped develop my plan"
          prompt="List all people who have been actively involved in developing and agreeing to this plan. These individuals should continue to be involved when the plan is reviewed, updated, or if a new plan is created. Ensure that all relevant voices have been included in the planning process. Consider whether we have involved: Whānau or family, including people in their hapū, iwi, or wider family group, Current caregivers, Future caregivers (if known), People expected to have a role in supporting the plan, Others who have important relationships or roles with te tamaiti or rangatahi"
        >
          <Textarea
            value={data?.fields?.["plan-contributors"] || ""}
            onChange={(e) => updateField("planning-with", "plan-contributors", e.target.value)}
            placeholder="People involved in developing this plan..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>

        <TableField
          label="My plan was shared with the following people"
          columns={[
            { key: "person", label: "Person" },
            { key: "date", label: "Date shared" }
          ]}
          value={typeof data?.fields?.["plan-shared"] === 'string' ? JSON.parse(data?.fields?.["plan-shared"] || '[]') : (data?.fields?.["plan-shared"] || [])}
          onChange={(value) => updateField("planning-with", "plan-shared", JSON.stringify(value))}
          prompt="Ensure you have consulted with te tamaiti or rangatahi before sharing this plan. While there may be legal or professional obligations to share information, it is essential that they understand who will receive the plan, what parts will be shared, and why. Their views must be heard, respected, and recorded. If they do not agree with sharing, the rationale for proceeding must be clearly documented."
          attachments={parseAttachments("plan-shared-attachments")}
          onAttachmentsChange={(attachments) => updateField("planning-with", "plan-shared-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <div className="space-y-2">
          <FieldWithPrompt label="My plan was shared with my caregiver:">
            <Textarea
              value={data?.fields?.["caregiver-shared"] || ""}
              onChange={(e) => updateField("planning-with", "caregiver-shared", e.target.value)}
              placeholder="Caregiver details..."
              className="min-h-[60px]"
            />
          </FieldWithPrompt>
          <DatePickerField
            label="Date shared with caregiver"
            value={data?.fields?.["caregiver-shared-date"] ? new Date(data.fields["caregiver-shared-date"]) : undefined}
            onChange={(date) => updateField("planning-with", "caregiver-shared-date", date?.toISOString() || "")}
          />
        </div>

        <div className="space-y-2">
          <CheckboxField
            id="rights-booklet-provided"
            label="My voice, my rights booklet was provided"
            checked={data?.fields?.["rights-booklet-provided"] === "true"}
            onCheckedChange={(checked) => updateField("planning-with", "rights-booklet-provided", String(checked))}
          />
          <DatePickerField
            label="Date provided"
            value={data?.fields?.["rights-booklet-date"] ? new Date(data.fields["rights-booklet-date"]) : undefined}
            onChange={(date) => updateField("planning-with", "rights-booklet-date", date?.toISOString() || "")}
            showsOnTimeline
          />
        </div>

        <TableField
          label="If I have concerns who can I talk to"
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "mobile", label: "Mobile" },
            { key: "office", label: "Office" }
          ]}
          value={typeof data?.fields?.["concern-contacts"] === 'string' ? JSON.parse(data?.fields?.["concern-contacts"] || '[]') : (data?.fields?.["concern-contacts"] || [{
            name: "Case Management Service",
            email: "",
            mobile: "0508 FAMILY",
            office: "Free call support"
          }])}
          onChange={(value) => updateField("planning-with", "concern-contacts", JSON.stringify(value))}
          attachments={parseAttachments("concern-contacts-attachments")}
          onAttachmentsChange={(attachments) => updateField("planning-with", "concern-contacts-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">My Social worker will visit me</h3>
          <SelectField
            label="How often?"
            value={data?.fields?.["visit-frequency"] || ""}
            onChange={(value) => updateField("planning-with", "visit-frequency", value)}
            options={[
              { value: "daily", label: "Daily" },
              { value: "twice-weekly", label: "Twice a week" },
              { value: "weekly", label: "Weekly" },
              { value: "fortnightly", label: "Fortnightly" },
              { value: "3-weekly", label: "Every 3 weeks" },
              { value: "monthly", label: "Monthly" },
              { value: "6-weeks", label: "Every 6 weeks" },
              { value: "7-weeks", label: "Every 7 weeks" },
              { value: "bi-monthly", label: "Bi-monthly" },
              { value: "other", label: "Other" }
            ]}
          />

          <FieldWithPrompt label="Why this often?">
            <Textarea
              value={data?.fields?.["visit-reason"] || ""}
              onChange={(e) => updateField("planning-with", "visit-reason", e.target.value)}
              placeholder="Reason for visit frequency..."
              className="min-h-[80px]"
            />
          </FieldWithPrompt>

          <DatePickerField
            label="My next visit?"
            value={data?.fields?.["next-visit"] ? new Date(data.fields["next-visit"]) : undefined}
            onChange={(date) => updateField("planning-with", "next-visit", date?.toISOString() || "")}
            showsOnTimeline
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="planning-with" />
      </div>
    </div>
  );
};
