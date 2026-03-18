import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "../SectionHeader";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { DatePickerField } from "@/components/plan/DatePickerField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { TableField } from "@/components/plan/TableField";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format, addWeeks, addMonths } from "date-fns";

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
      <SectionHeader title="Residence & Homes" subtitle="Information about where you live and your living situation" />

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

      {/* Frequency of Visits */}
      <Card className="p-6 mt-2">
        <h3 className="text-xl font-semibold mb-1">Frequency of visits to Samuel</h3>
        <p className="text-muted-foreground text-sm mb-4">Record how often you intend to visit this rāngatahi.</p>
        {(() => {
          const visitFrequency = data?.fields?.["visit-frequency"] || "";
          const visitReason = data?.fields?.["visit-reason"] || "";
          const lastVisitDate = new Date(2026, 1, 25);
          const baseline = lastVisitDate;

          const getNextVisitDate = () => {
            if (!visitFrequency) return "—";
            switch (visitFrequency) {
              case "weekly": return format(addWeeks(baseline, 1), "PPP");
              case "fortnightly": return format(addWeeks(baseline, 2), "PPP");
              case "4-weekly": return format(addWeeks(baseline, 4), "PPP");
              case "8-weekly": return format(addWeeks(baseline, 8), "PPP");
              case "3-monthly": return format(addMonths(baseline, 3), "PPP");
              case "6-monthly": return format(addMonths(baseline, 6), "PPP");
              default: return "—";
            }
          };

          const getVisitStatus = (): { label: string; variant: "default" | "destructive" | "secondary" | "outline" } => {
            if (!visitFrequency) return { label: "—", variant: "secondary" };
            const nextDate = visitFrequency === "weekly" ? addWeeks(baseline, 1)
              : visitFrequency === "fortnightly" ? addWeeks(baseline, 2)
              : visitFrequency === "4-weekly" ? addWeeks(baseline, 4)
              : visitFrequency === "8-weekly" ? addWeeks(baseline, 8)
              : visitFrequency === "3-monthly" ? addMonths(baseline, 3)
              : visitFrequency === "6-monthly" ? addMonths(baseline, 6)
              : null;
            if (!nextDate) return { label: "—", variant: "secondary" };
            const now = new Date();
            const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntil < 0) return { label: "Overdue", variant: "destructive" };
            if (daysUntil <= 3) return { label: "Due Soon", variant: "default" };
            return { label: "Not due yet", variant: "secondary" };
          };

          const status = getVisitStatus();

          return (
            <>
              <div>
                <Label className="mb-2 block text-sm font-medium">How often does my social worker intend on visiting me?</Label>
                <Select value={visitFrequency} onValueChange={(val) => updateField("residence", "visit-frequency", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Visit Frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="4-weekly">4 Weekly</SelectItem>
                    <SelectItem value="8-weekly">8 Weekly</SelectItem>
                    <SelectItem value="3-monthly">3-Monthly</SelectItem>
                    <SelectItem value="6-monthly">6-Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label className="mb-2 block text-sm font-medium">Why this often? <span className="text-destructive">*</span></Label>
                <Textarea
                  value={visitReason}
                  onChange={(e) => updateField("residence", "visit-reason", e.target.value)}
                  placeholder="Explain the reason for this frequency"
                  className="min-h-[80px]"
                  disabled={isReadOnly}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">Next visit is scheduled for</Label>
                  <Input value={getNextVisitDate()} disabled className="bg-muted cursor-not-allowed" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Last visit occurred on</Label>
                  <Input value={format(lastVisitDate, "PPP")} disabled className="bg-muted cursor-not-allowed" />
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Visit status</Label>
                  <div className="mt-1">
                    <Badge variant={status.variant} className={
                      status.label === "Overdue" ? "bg-destructive text-destructive-foreground" :
                      status.label === "Due Soon" ? "bg-warning text-warning-foreground" :
                      status.label === "Completed" ? "bg-success text-white" :
                      status.label === "Not due yet" ? "bg-blue-500 text-white" :
                      ""
                    }>
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </Card>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="residence" />
      </div>
    </div>
  );
};
