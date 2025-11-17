import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const HealthSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["health"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Health & Wellbeing Needs
        </h2>
        <p className="text-muted-foreground">
          Information about your physical, emotional, and behavioral health
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="health-doctor">My doctor</Label>
            <Input
              id="health-doctor"
              value={data?.fields?.["health-doctor"] || ""}
              onChange={(e) => updateField("health", "health-doctor", e.target.value)}
              placeholder="Doctor's name"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="health-nhi">NHI Number</Label>
            <Input
              id="health-nhi"
              value={data?.fields?.["health-nhi"] || ""}
              onChange={(e) => updateField("health", "health-nhi", e.target.value)}
              placeholder="Your NHI number"
              className="mt-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="health-last-visit">Last doctor visit</Label>
            <Input
              id="health-last-visit"
              type="date"
              value={data?.fields?.["health-last-visit"] || ""}
              onChange={(e) => updateField("health", "health-last-visit", e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="health-next-visit">Next scheduled visit</Label>
            <Input
              id="health-next-visit"
              type="date"
              value={data?.fields?.["health-next-visit"] || ""}
              onChange={(e) => updateField("health", "health-next-visit", e.target.value)}
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="health-medication">Current medications</Label>
          <Textarea
            id="health-medication"
            value={data?.fields?.["health-medication"] || ""}
            onChange={(e) => updateField("health", "health-medication", e.target.value)}
            placeholder="List any medications you're currently taking..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="health-immunisations">Immunization status</Label>
          <Textarea
            id="health-immunisations"
            value={data?.fields?.["health-immunisations"] || ""}
            onChange={(e) => updateField("health", "health-immunisations", e.target.value)}
            placeholder="Current immunization information..."
            className="min-h-[80px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="health" />
      </div>
    </div>
  );
};
