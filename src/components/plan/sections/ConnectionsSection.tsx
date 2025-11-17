import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const ConnectionsSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["connections"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">My Connections</h2>
        <p className="text-muted-foreground">
          Tell us about the important people in your life
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="friends">My friends and important people</Label>
          <Textarea
            id="friends"
            value={data?.fields?.friends || ""}
            onChange={(e) => updateField("connections", "friends", e.target.value)}
            placeholder="Who are the people that matter to you?"
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="no-contact-people">People I don't want contact with</Label>
          <Textarea
            id="no-contact-people"
            value={data?.fields?.["no-contact-people"] || ""}
            onChange={(e) => updateField("connections", "no-contact-people", e.target.value)}
            placeholder="Any people you prefer to avoid contact with..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="whanau-wishes">My whānau's wishes for me</Label>
          <Textarea
            id="whanau-wishes"
            value={data?.fields?.["whanau-wishes"] || ""}
            onChange={(e) => updateField("connections", "whanau-wishes", e.target.value)}
            placeholder="What does your family hope for you?"
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="connections" />
      </div>
    </div>
  );
};
