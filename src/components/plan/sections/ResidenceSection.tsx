import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const ResidenceSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["residence"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Residence & Homes</h2>
        <p className="text-muted-foreground">
          Information about where you live and your living situation
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="current-residence">Current residence</Label>
          <Input
            id="current-residence"
            value={data?.fields?.["current-residence"] || ""}
            onChange={(e) => updateField("residence", "current-residence", e.target.value)}
            placeholder="Where are you currently living?"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="residence-type">Type of placement</Label>
          <Input
            id="residence-type"
            value={data?.fields?.["residence-type"] || ""}
            onChange={(e) => updateField("residence", "residence-type", e.target.value)}
            placeholder="e.g., Family home, foster care, residential, etc."
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="residence-satisfaction">How I feel about where I live</Label>
          <Textarea
            id="residence-satisfaction"
            value={data?.fields?.["residence-satisfaction"] || ""}
            onChange={(e) => updateField("residence", "residence-satisfaction", e.target.value)}
            placeholder="Share your feelings about your current living situation..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="residence-future">Future housing goals</Label>
          <Textarea
            id="residence-future"
            value={data?.fields?.["residence-future"] || ""}
            onChange={(e) => updateField("residence", "residence-future", e.target.value)}
            placeholder="Where would you like to live in the future?"
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="residence" />
      </div>
    </div>
  );
};
