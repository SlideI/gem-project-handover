import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const YouthJusticeSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["youth-justice"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Youth Justice</h2>
        <p className="text-muted-foreground">
          Information related to youth justice involvement and support
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="yj-involvement">Current involvement</Label>
          <Textarea
            id="yj-involvement"
            value={data?.fields?.["yj-involvement"] || ""}
            onChange={(e) => updateField("youth-justice", "yj-involvement", e.target.value)}
            placeholder="Describe any current youth justice involvement..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="yj-worker">Youth justice worker</Label>
          <Input
            id="yj-worker"
            value={data?.fields?.["yj-worker"] || ""}
            onChange={(e) => updateField("youth-justice", "yj-worker", e.target.value)}
            placeholder="Name of your youth justice worker"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="yj-conditions">Conditions or requirements</Label>
          <Textarea
            id="yj-conditions"
            value={data?.fields?.["yj-conditions"] || ""}
            onChange={(e) => updateField("youth-justice", "yj-conditions", e.target.value)}
            placeholder="Any court orders, conditions, or requirements..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="yj-goals">Goals and aspirations</Label>
          <Textarea
            id="yj-goals"
            value={data?.fields?.["yj-goals"] || ""}
            onChange={(e) => updateField("youth-justice", "yj-goals", e.target.value)}
            placeholder="What positive changes would you like to make?"
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="youth-justice" />
      </div>
    </div>
  );
};
