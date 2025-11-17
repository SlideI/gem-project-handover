import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";

export const EducationSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["education"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Education, Training or Employment Needs
        </h2>
        <p className="text-muted-foreground">
          Your current education, training, or employment situation and goals
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="edu-provider">School or training provider</Label>
          <Input
            id="edu-provider"
            value={data?.fields?.["edu-provider"] || ""}
            onChange={(e) => updateField("education", "edu-provider", e.target.value)}
            placeholder="Name of your school or training provider"
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="edu-year">Current year/level</Label>
          <Input
            id="edu-year"
            value={data?.fields?.["edu-year"] || ""}
            onChange={(e) => updateField("education", "edu-year", e.target.value)}
            placeholder="e.g., Year 10, Level 2, etc."
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="edu-support-people">Key support people</Label>
          <Textarea
            id="edu-support-people"
            value={data?.fields?.["edu-support-people"] || ""}
            onChange={(e) => updateField("education", "edu-support-people", e.target.value)}
            placeholder="Teachers, counselors, or other support people at your school/workplace..."
            className="min-h-[100px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="edu-goals">My education or career goals</Label>
          <Textarea
            id="edu-goals"
            value={data?.fields?.["edu-goals"] || ""}
            onChange={(e) => updateField("education", "edu-goals", e.target.value)}
            placeholder="What are your education or career aspirations?"
            className="min-h-[100px] mt-2"
          />
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="education" />
      </div>
    </div>
  );
};
