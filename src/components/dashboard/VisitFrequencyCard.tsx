import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePlan } from "@/contexts/PlanContext";
import { format, addWeeks, addMonths, differenceInDays, isPast, isToday } from "date-fns";

/**
 * Read-only card displaying visit frequency data from the Residence section.
 * 
 * CYRAS Integration Note:
 * - "Last visit occurred on" is derived from the Action Date of the most recent
 *   "Visit to Child" casenote. If no such casenote exists, the "Associated legal
 *   status start date" is used instead.
 */
export const VisitFrequencyCard = () => {
  const { sections } = usePlan();
  const residenceData = sections["residence"];

  const visitFrequency = residenceData?.fields?.["visit-frequency"] || "";
  const visitReason = residenceData?.fields?.["visit-reason"] || "";
  // Demo: simulates "Last visit occurred on" from most recent "Visit to Child" casenote Action Date
  const lastVisitDate = new Date(2026, 1, 25);
  const baseline = lastVisitDate;

  const getNextVisitDate = (): string => {
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
    const daysUntil = differenceInDays(nextDate, new Date());
    if (isPast(nextDate) && !isToday(nextDate)) return { label: "Overdue", variant: "destructive" };
    if (daysUntil <= 3 && daysUntil >= 0) return { label: "Due Soon", variant: "default" };
    if (lastVisitDate) return { label: "Completed", variant: "secondary" };
    return { label: "Not due yet", variant: "default" };
  };

  const frequencyLabels: Record<string, string> = {
    weekly: "Weekly",
    fortnightly: "Fortnightly",
    "4-weekly": "4 Weekly",
    "8-weekly": "8 Weekly",
    "3-monthly": "3-Monthly",
    "6-monthly": "6-Monthly",
  };

  const status = getVisitStatus();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-1">Frequency of visits to Samuel</h2>
      <p className="text-muted-foreground text-sm mb-4">
        This information is maintained in the Residence &amp; Homes section of the plan.
      </p>
      <div>
        <Label className="mb-2 block text-sm font-medium">How often I intend to visit this rāngatahi</Label>
        <Input
          value={visitFrequency ? frequencyLabels[visitFrequency] || visitFrequency : "Not set"}
          disabled
          className="bg-muted cursor-not-allowed"
        />
      </div>
      {visitReason && (
        <div className="mt-4">
          <Label className="mb-2 block text-sm font-medium">Why this often?</Label>
          <Input value={visitReason} disabled className="bg-muted cursor-not-allowed" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <Label className="mb-2 block text-sm font-medium">Next visit is scheduled for</Label>
          <Input value={getNextVisitDate()} disabled className="bg-muted cursor-not-allowed" />
        </div>
        <div>
          <Label className="mb-2 block text-sm font-medium">Last visit occurred on</Label>
          <Input value={lastVisitDate ? format(lastVisitDate, "PPP") : "—"} disabled className="bg-muted cursor-not-allowed" />
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
    </Card>
  );

  // Expose for PlanTimeline usage
};

export const useVisitNextDate = () => {
  const { sections } = usePlan();
  const residenceData = sections["residence"];
  const visitFrequency = residenceData?.fields?.["visit-frequency"] || "";
  const legalStatusStartDate = new Date(2026, 1, 20);
  const lastVisitDate = new Date(2026, 1, 25);
  const baseline = lastVisitDate || legalStatusStartDate;

  if (!visitFrequency || visitFrequency === "never") return undefined;

  switch (visitFrequency) {
    case "weekly": return format(addWeeks(baseline, 1), "PPP");
    case "fortnightly": return format(addWeeks(baseline, 2), "PPP");
    case "monthly": return format(addMonths(baseline, 1), "PPP");
    case "6-monthly": return format(addMonths(baseline, 6), "PPP");
    default: return undefined;
  }
};
