import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { DatePickerField } from "@/components/plan/DatePickerField";

export const TransitionSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["transition"];

  const isEligible = data?.fields?.["eligible-for-transition"] === "true";

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
        <FieldWithPrompt
          label="I am eligible for Transition Support Services"
          prompt="Link - https://practice.orangatamariki.govt.nz/assets/Our-work/Care/transition-to-adulthood-eligibility-tree.pdf"
        >
          <CheckboxField
            id="eligible-for-transition"
            label="Yes, I am eligible"
            checked={isEligible}
            onCheckedChange={(checked) => updateField("transition", "eligible-for-transition", String(checked))}
          />
        </FieldWithPrompt>

        <ConditionalField show={isEligible}>
          <div className="space-y-4">
            <div className="space-y-2">
              <CheckboxField
                id="aware-of-entitlements"
                label="I am aware of my entitlements under transitions"
                checked={data?.fields?.["aware-of-entitlements"] === "true"}
                onCheckedChange={(checked) => updateField("transition", "aware-of-entitlements", String(checked))}
              />
              <CheckboxField
                id="letter-provided"
                label="Letter provided to rangatahi"
                checked={data?.fields?.["letter-provided"] === "true"}
                onCheckedChange={(checked) => updateField("transition", "letter-provided", String(checked))}
              />
            </div>

            <div className="space-y-2">
              <DatePickerField
                label="My life skills assessment: Date"
                value={data?.fields?.["life-skills-date"] ? new Date(data.fields["life-skills-date"]) : undefined}
                onChange={(date) => updateField("transition", "life-skills-date", date?.toISOString() || "")}
                showsOnTimeline
              />
            </div>

            <DatePickerField
              label="My transition planning hui:"
              value={data?.fields?.["transition-hui-date"] ? new Date(data.fields["transition-hui-date"]) : undefined}
              onChange={(date) => updateField("transition", "transition-hui-date", date?.toISOString() || "")}
              prompt="eg Life skills assessment, Transition plan. Do not upload copies of bank details"
              showsOnTimeline
            />

            <div className="space-y-2">
              <FieldWithPrompt label="My transition worker is">
                <div className="space-y-2">
                  <Input
                    value={data?.fields?.["transition-worker-status"] || ""}
                    onChange={(e) => updateField("transition", "transition-worker-status", e.target.value)}
                    placeholder="Status: not yet actioned, consented, referred..."
                  />
                  <Input
                    value={data?.fields?.["transition-provider"] || ""}
                    onChange={(e) => updateField("transition", "transition-provider", e.target.value)}
                    placeholder="Transition Provider..."
                  />
                  <Input
                    value={data?.fields?.["transition-worker-name"] || ""}
                    onChange={(e) => updateField("transition", "transition-worker-name", e.target.value)}
                    placeholder="Transition Worker name..."
                  />
                </div>
              </FieldWithPrompt>
            </div>

            <FieldWithPrompt label="My planned living arrangement after care">
              <Textarea
                value={data?.fields?.["living-arrangement"] || ""}
                onChange={(e) => updateField("transition", "living-arrangement", e.target.value)}
                placeholder="Planned living arrangement..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>

            <FieldWithPrompt label="My planned financial support (income) after care">
              <Textarea
                value={data?.fields?.["financial-support"] || ""}
                onChange={(e) => updateField("transition", "financial-support", e.target.value)}
                placeholder="Planned financial support..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>

            <FieldWithPrompt
              label="My planned support network after care"
              prompt="Consider who will be part of te tamaiti or rangatahi's support network after care. This may include whānau, caregivers, friends, professionals, community groups, cultural supports, or services. Identify the role each person or service will play, how they will stay connected, and what supports will be in place to help te tamaiti or rangatahi thrive."
            >
              <Textarea
                value={data?.fields?.["support-network"] || ""}
                onChange={(e) => updateField("transition", "support-network", e.target.value)}
                placeholder="Support network..."
                className="min-h-[120px]"
              />
            </FieldWithPrompt>

            <div className="space-y-2">
              <label className="text-sm font-medium">Official documentation:</label>
              <div className="space-y-2">
                <CheckboxField
                  id="bank-account"
                  label="Bank account"
                  checked={data?.fields?.["doc-bank-account"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-bank-account", String(checked))}
                />
                <CheckboxField
                  id="photo-id"
                  label="Photo ID"
                  checked={data?.fields?.["doc-photo-id"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-photo-id", String(checked))}
                />
                <CheckboxField
                  id="ird-number"
                  label="IRD number"
                  checked={data?.fields?.["doc-ird-number"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-ird-number", String(checked))}
                />
                <CheckboxField
                  id="birth-certificate"
                  label="Birth certificate"
                  checked={data?.fields?.["doc-birth-certificate"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-birth-certificate", String(checked))}
                />
                <CheckboxField
                  id="realme-account"
                  label="RealMe account"
                  checked={data?.fields?.["doc-realme-account"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-realme-account", String(checked))}
                />
                <CheckboxField
                  id="electoral-roll"
                  label="Electoral roll"
                  checked={data?.fields?.["doc-electoral-roll"] === "true"}
                  onCheckedChange={(checked) => updateField("transition", "doc-electoral-roll", String(checked))}
                />
              </div>
            </div>
          </div>
        </ConditionalField>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="transition" />
      </div>
    </div>
  );
};
