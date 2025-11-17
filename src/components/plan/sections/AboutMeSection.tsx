import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";

export const AboutMeSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["about-me"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">About Me</h2>
        <p className="text-muted-foreground">Tell us about yourself and your family</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="siblings">My siblings and other people living with me</Label>
          <Textarea
            id="siblings"
            value={data?.fields?.siblings || ""}
            onChange={(e) => updateField("about-me", "siblings", e.target.value)}
            placeholder="Tell us about your siblings and who you live with..."
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="likes">Things I like</Label>
          <Textarea
            id="likes"
            value={data?.fields?.likes || ""}
            onChange={(e) => updateField("about-me", "likes", e.target.value)}
            placeholder="What do you enjoy doing? What are your hobbies and interests?"
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="good-at">Things I'm good at</Label>
          <Textarea
            id="good-at"
            value={data?.fields?.["good-at"] || ""}
            onChange={(e) => updateField("about-me", "good-at", e.target.value)}
            placeholder="What are your strengths and talents?"
            className="min-h-[120px] mt-2"
          />
        </div>

        <div>
          <Label htmlFor="dreams">My dreams and aspirations</Label>
          <Textarea
            id="dreams"
            value={data?.fields?.dreams || ""}
            onChange={(e) => updateField("about-me", "dreams", e.target.value)}
            placeholder="What do you hope for your future?"
            className="min-h-[120px] mt-2"
          />
        </div>
      </div>
    </div>
  );
};
