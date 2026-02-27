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

      {/* Frequency of Visits */}
      <Card className="p-6 mt-2">
        <h3 className="text-xl font-semibold mb-1">Frequency of visits to Samuel</h3>
        <p className="text-muted-foreground text-sm mb-4">Record how often you intend to visit this rāngatahi.</p>
        {(() => {
          const visitFrequency = data?.fields?.["visit-frequency"] || "";
          const visitReason = data?.fields?.["visit-reason"] || "";
          const legalStatusStartDate = new Date(2026, 1, 20);
          const lastVisitDate = new Date(2026, 1, 25);

          const getBaselineDate = () => lastVisitDate || legalStatusStartDate;

          const getNextVisitDate = () => {
            if (!visitFrequency) return "—";
            const baseline = getBaselineDate();
            switch (visitFrequency) {
              case "weekly": return format(addWeeks(baseline, 1), "PPP");
              case "fortnightly": return format(addWeeks(baseline, 2), "PPP");
              case "monthly": return format(addMonths(baseline, 1), "PPP");
              case "6-monthly": return format(addMonths(baseline, 6), "PPP");
              case "never": return "No visit scheduled";
              default: return "—";
            }
          };

          const getVisitStatus = (): { label: string; variant: "default" | "destructive" | "secondary" | "outline" } => {
            if (!visitFrequency || visitFrequency === "never") return { label: "—", variant: "secondary" };
            const baseline = getBaselineDate();
            const nextDate = visitFrequency === "weekly" ? addWeeks(baseline, 1)
              : visitFrequency === "fortnightly" ? addWeeks(baseline, 2)
              : visitFrequency === "monthly" ? addMonths(baseline, 1)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block text-sm font-medium">How often I intend to visit this rāngatahi</Label>
                  <Select value={visitFrequency} onValueChange={(val) => updateField("residence", "visit-frequency", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit frequency" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="6-monthly">6 monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-2 block text-sm font-medium">Associated legal status start date</Label>
                  <Input value={format(legalStatusStartDate, "PPP")} disabled className="bg-muted cursor-not-allowed" />
                </div>
              </div>
              <div className="mt-4">
                <Label className="mb-2 block text-sm font-medium">Why this often?</Label>
                <Textarea
                  value={visitReason}
                  onChange={(e) => updateField("residence", "visit-reason", e.target.value)}
                  placeholder="Explain the reason for this visit frequency..."
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
