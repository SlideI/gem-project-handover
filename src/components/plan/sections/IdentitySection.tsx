import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const IdentitySection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["identity"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Identity, Spirituality, and Cultural Needs
        </h2>
        <p className="text-muted-foreground">
          Share about your identity, culture, and spiritual beliefs
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="from">Where I'm from</Label>
          <Input
            id="from"
            value={data?.fields?.from || ""}
            onChange={(e) => updateField("identity", "from", e.target.value)}
            placeholder="Your place of origin or heritage"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="whakapapa">My whakapapa</Label>
          <Textarea
            id="whakapapa"
            value={data?.fields?.whakapapa || ""}
            onChange={(e) => updateField("identity", "whakapapa", e.target.value)}
            placeholder="Tell us about your genealogy and ancestry..."
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="religious">My religious or spiritual beliefs</Label>
          <Textarea
            id="religious"
            value={data?.fields?.religious || ""}
            onChange={(e) => updateField("identity", "religious", e.target.value)}
            placeholder="Share about your faith or spiritual practices..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="cultural-important">What's culturally important to me</Label>
          <Textarea
            id="cultural-important"
            value={data?.fields?.["cultural-important"] || ""}
            onChange={(e) => updateField("identity", "cultural-important", e.target.value)}
            placeholder="Cultural practices, traditions, or values that matter to you..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="faith-needs">My faith or cultural needs</Label>
          <Textarea
            id="faith-needs"
            value={data?.fields?.["faith-needs"] || ""}
            onChange={(e) => updateField("identity", "faith-needs", e.target.value)}
            placeholder="Any specific cultural or faith-based support you need..."
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="identity" />
      </div>
    </div>
  );
};
