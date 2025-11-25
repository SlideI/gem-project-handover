import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { SelectField } from "@/components/plan/SelectField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const YouthJusticeSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["youth-justice"];

  const policeOppositionOptions = [
    { value: "likely-abscond", label: "The child or young person is likely to abscond" },
    { value: "commit-further-offences", label: "The child or young person may commit further offences" },
    { value: "evidence-interference", label: "Necessary to prevent loss/destruction of evidence or witness interference" },
    { value: "not-opposed", label: "Not opposed" }
  ];

  const placementOptions = [
    { value: "residence", label: "Residence" },
    { value: "remand-home", label: "Remand Home" },
    { value: "custody", label: "Remanded in Custody" },
    { value: "bail-community", label: "Bailed to the Community" },
    { value: "no-agreement", label: "No Agreement (why?)" }
  ];

  const sentencingOptions = [
    { value: "238d", label: "Am I going to be sentenced to a s238(1)(d)?" },
    { value: "311-order", label: "Am I going to be sentenced to a 311 Order?" },
    { value: "173-175", label: "Has there been a request for YJ Residence under sections 173, 174 or 175?" },
    { value: "34a", label: "Am going to be sentenced 34A?" }
  ];

  const bailAlternatives = [
    { value: "supported-bail", label: "Supported bail" },
    { value: "electronic-bail", label: "Electronic bail" }
  ];

  const concerns = [
    "Violence (community or in care/custody)",
    "Active suicidal ideation and/or self harm",
    "Drug and alcohol intoxication",
    "Acute Mental Health Concerns",
    "Harmful Sexual Behaviour",
    "Harmful fire lighting",
    "Gang Involvement",
    "Risks to others",
    "Risk of Absconding",
    "Sexual Behaviour Concerns",
    "Offending alone"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Youth Justice</h2>
        <p className="text-muted-foreground">
          Information related to youth justice involvement and support
        </p>
      </div>

      <div className="space-y-4">
        <PrePopulatedField
          label="My active charges"
          value="No active charges"
        />

        <PrePopulatedField
          label="My previous youth justice charges and/or involvement (most serious offence to date first)"
          value="No previous charges"
        />

        <FieldWithPrompt
          label="What are the views of my significant people in relation to me being placed in residence, remand home, remain in police custody, or bailed to the community?"
          prompt="Outline whānau or family, community, Police and Oranga Tamariki views and their rationale"
        >
          <SelectField
            label=""
            value={data?.fields?.["placement-views"] || ""}
            onChange={(value) => updateField("youth-justice", "placement-views", value)}
            options={placementOptions}
            placeholder="Select placement option"
          />
          <Textarea
            value={data?.fields?.["placement-views-rationale"] || ""}
            onChange={(e) => updateField("youth-justice", "placement-views-rationale", e.target.value)}
            placeholder="Explain rationale..."
            className="min-h-[100px] mt-2"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="My views on staying in residence, remand home or community placement (bail home)? (including worries)"
          prompt="Consider whether the rangatahi understands why a custody option is being proposed. Clearly record their views, including any disagreement or refusal to go to a specific place."
        >
          <Textarea
            value={data?.fields?.["my-placement-views"] || ""}
            onChange={(e) => updateField("youth-justice", "my-placement-views", e.target.value)}
            placeholder="Your views and concerns..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="My whānau, hapū and iwi or family groups views on my offending (what supports do they think I need)"
          prompt="Explore how whānau strengths and relationships can be enhanced to better support rangatahi. Seek to understand whānau perspectives on the causes and impacts of rangatahi offending, and their ideas for positive change"
        >
          <Textarea
            value={data?.fields?.["whanau-views-offending"] || ""}
            onChange={(e) => updateField("youth-justice", "whanau-views-offending", e.target.value)}
            placeholder="Whānau views on offending..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="What supports am I engaging with (pre and post arrest)"
          prompt="Consider what supports rangatahi are engaging with before and/or after arrest. Are these supports meeting their needs, and are there any gaps that need to be addressed"
        >
          <Textarea
            value={data?.fields?.["supports-engaging"] || ""}
            onChange={(e) => updateField("youth-justice", "supports-engaging", e.target.value)}
            placeholder="Supports engaged with..."
            className="min-h-[100px]"
          />
        </FieldWithPrompt>

        <FieldWithPrompt
          label="Are there specific reasons police oppose my bail?"
          prompt="Record the reasons for opposition and how they relate to the circumstances of te tamaiti or rangatahi."
        >
          <SelectField
            label=""
            value={data?.fields?.["police-opposition"] || ""}
            onChange={(value) => updateField("youth-justice", "police-opposition", value)}
            options={policeOppositionOptions}
            placeholder="Select reason"
          />
        </FieldWithPrompt>

        <ConditionalField show={data?.fields?.["police-opposition"] === "not-opposed"}>
          <FieldWithPrompt label="In the last six months, have I escaped police custody, breached bail, warrants to arrest">
            <div className="space-y-2">
              <CheckboxField
                id="custody-breaches"
                label="Yes"
                checked={data?.fields?.["custody-breaches"] === "true"}
                onCheckedChange={(checked) => updateField("youth-justice", "custody-breaches", String(checked))}
              />
              <ConditionalField show={data?.fields?.["custody-breaches"] === "true"}>
                <Textarea
                  value={data?.fields?.["custody-breaches-details"] || ""}
                  onChange={(e) => updateField("youth-justice", "custody-breaches-details", e.target.value)}
                  placeholder="Please outline how many times and reason..."
                  className="min-h-[80px]"
                />
              </ConditionalField>
            </div>
          </FieldWithPrompt>

          <SelectField
            label="Select one of the following"
            value={data?.fields?.sentencing || ""}
            onChange={(value) => updateField("youth-justice", "sentencing", value)}
            options={sentencingOptions}
            placeholder="Select option"
          />

          <FieldWithPrompt
            label="Do I have any of the following worries or concerns"
            prompt="Consider the current behaviours of te rangatahi, record the nature of the behaviour and reflect on the context—was it a one-off incident, a response to extreme stress, or part of a regular pattern."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2">
                {concerns.map((concern) => (
                  <div key={concern} className="flex items-center space-x-2">
                    <Checkbox id={`concern-${concern}`} />
                    <Label htmlFor={`concern-${concern}`} className="font-normal cursor-pointer">{concern}</Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Checkbox id="concern-other" />
                  <Label htmlFor="concern-other" className="font-normal cursor-pointer">Others (specify)</Label>
                </div>
              </div>
              <Textarea
                value={data?.fields?.["concerns-details"] || ""}
                onChange={(e) => updateField("youth-justice", "concerns-details", e.target.value)}
                placeholder="Provide further commentary..."
                className="min-h-[100px]"
              />
            </div>
          </FieldWithPrompt>

          <FieldWithPrompt
            label="What options(s) are available to me as an alternative to being remanded in custody? Include supports for this recommendation."
            prompt="Consider how the rangatahi will be supported in the community."
          >
            <SelectField
              label=""
              value={data?.fields?.["custody-alternatives"] || ""}
              onChange={(value) => updateField("youth-justice", "custody-alternatives", value)}
              options={bailAlternatives}
              placeholder="Select alternative"
            />
            <Textarea
              value={data?.fields?.["custody-alternatives-supports"] || ""}
              onChange={(e) => updateField("youth-justice", "custody-alternatives-supports", e.target.value)}
              placeholder="Describe supports for this recommendation..."
              className="min-h-[100px] mt-2"
            />
          </FieldWithPrompt>
        </ConditionalField>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="youth-justice" />
      </div>
    </div>
  );
};