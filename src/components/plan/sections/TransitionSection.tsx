import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const TransitionSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["transition"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Transition to Adulthood
        </h2>
        <p className="text-muted-foreground">
          Planning for your future as you move towards independence
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="transition-goals">My goals for independence</Label>
          <Textarea
            id="transition-goals"
            value={data?.fields?.["transition-goals"] || ""}
            onChange={(e) => updateField("transition", "transition-goals", e.target.value)}
            placeholder="What independence skills would you like to develop?"
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="transition-support">Support I'll need</Label>
          <Textarea
            id="transition-support"
            value={data?.fields?.["transition-support"] || ""}
            onChange={(e) => updateField("transition", "transition-support", e.target.value)}
            placeholder="What help will you need as you transition to adulthood?"
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="transition-concerns">My concerns or worries</Label>
          <Textarea
            id="transition-concerns"
            value={data?.fields?.["transition-concerns"] || ""}
            onChange={(e) => updateField("transition", "transition-concerns", e.target.value)}
            placeholder="Any concerns about becoming independent?"
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="transition" />
      </div>
    </div>
  );
};
