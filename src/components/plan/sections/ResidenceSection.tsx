import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { DatePickerField } from "@/components/plan/DatePickerField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { TableField } from "@/components/plan/TableField";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const ResidenceSection = () => {
  const { sections, updateField, isReadOnly } = usePlan();
  const data = sections["residence"];

  const advisedRights = [
    "Grievance / complaints process",
    "How to seek advocacy support",
    "My rights to contact including (mail, visits, phone calls)"
  ];

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
        <h2 className="text-3xl font-bold text-foreground mb-2">Residence & Homes</h2>
        <p className="text-muted-foreground">
          Information about where you live and your living situation
        </p>
      </div>

      <div className="space-y-4">
        <PrePopulatedField
          label="I arrived on"
          value="15 March 2024"
        />

        <DatePickerField
          label="My early leaving date / expected leaving date"
          value={data?.fields?.["expected-leaving-date"] ? new Date(data.fields["expected-leaving-date"]) : undefined}
          onChange={(date) => updateField("residence", "expected-leaving-date", date?.toISOString() || "")}
          showsOnTimeline
        />

        <FieldWithPrompt label="I have been advised of:">
          <div className="space-y-2">
            {advisedRights.map((right) => (
              <div key={right} className="flex items-center space-x-2">
                <Checkbox id={`right-${right}`} />
                <Label htmlFor={`right-${right}`} className="font-normal cursor-pointer">{right}</Label>
              </div>
            ))}
          </div>
        </FieldWithPrompt>

        <TableField
          label="Have I behaved or acted in a way that has been unsafe to myself and/or others"
          columns={[
            { key: "behaviour", label: "What was the behaviour?", type: "textarea" },
            { key: "helped", label: "What helped?", type: "textarea" }
          ]}
          value={typeof data?.fields?.["unsafe-behaviour"] === 'string' ? JSON.parse(data?.fields?.["unsafe-behaviour"] || '[]') : (data?.fields?.["unsafe-behaviour"] || [])}
          onChange={(value) => updateField("residence", "unsafe-behaviour", JSON.stringify(value))}
          attachments={parseAttachments("unsafe-behaviour-attachments")}
          onAttachmentsChange={(attachments) => updateField("residence", "unsafe-behaviour-attachments", JSON.stringify(attachments))}
          readOnly={isReadOnly}
        />

        <FieldWithPrompt
          label="What are my preferences and comfort levels regarding my living arrangements, including whether I am okay sharing a room with another young person?"
          prompt="Consider how this young person's gender identity or sexual identity may influence their care needs. What supports, affirmations, or considerations are required to ensure their care arrangements are safe, respectful, and aligned with their identity?"
        >
          <Textarea
            value={data?.fields?.["living-preferences"] || ""}
            onChange={(e) => updateField("residence", "living-preferences", e.target.value)}
            placeholder="Describe your living arrangement preferences..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="residence" />
      </div>
    </div>
  );
};
