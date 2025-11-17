import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const DisabilitySection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["disability"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Disability Needs</h2>
        <p className="text-muted-foreground">
          Support needs and goals related to any disabilities
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="disability-diagnosis">My diagnosis or condition</Label>
          <Input
            id="disability-diagnosis"
            value={data?.fields?.["disability-diagnosis"] || ""}
            onChange={(e) => updateField("disability", "disability-diagnosis", e.target.value)}
            placeholder="Any diagnosed conditions..."
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="disability-info">Information about my disability</Label>
          <Textarea
            id="disability-info"
            value={data?.fields?.["disability-info"] || ""}
            onChange={(e) => updateField("disability", "disability-info", e.target.value)}
            placeholder="Describe how your condition affects you..."
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="disability-communication">Communication needs</Label>
          <Textarea
            id="disability-communication"
            value={data?.fields?.["disability-communication"] || ""}
            onChange={(e) => updateField("disability", "disability-communication", e.target.value)}
            placeholder="Any special communication methods or supports needed..."
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="disability" />
      </div>
    </div>
  );
};
