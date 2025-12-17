import { Textarea } from "@/components/ui/textarea";
import { usePlan } from "@/contexts/PlanContext";
import { ActionTable } from "@/components/plan/ActionTable";
import { PrePopulatedField } from "@/components/plan/PrePopulatedField";
import { DatePickerField } from "@/components/plan/DatePickerField";
import { CheckboxField } from "@/components/plan/CheckboxField";
import { ConditionalField } from "@/components/plan/ConditionalField";
import { FieldWithPrompt } from "@/components/plan/FieldWithPrompt";
import { TableField } from "@/components/plan/TableField";
import { SelectField } from "@/components/plan/SelectField";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const HealthSection = () => {
  const { sections, updateField } = usePlan();
  const data = sections["health"];

  const allergyCategories = [
    { category: "Food Allergies", options: ["Cow's milk", "Eggs", "Peanuts", "Tree nuts", "Soy", "Wheat/Gluten", "Fish", "Shellfish", "Sesame seeds"] },
    { category: "Environmental Allergies", options: ["Pollen", "House dust mites", "Mould spores", "Animal dander", "Chemical sensitivities"] },
    { category: "Seasonal Allergies", options: ["Spring pollen", "Summer grasses", "Autumn mould/fungal spores"] },
    { category: "Other Allergies", options: ["Insect stings", "Latex", "Medications"] }
  ];

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
        <PrePopulatedField
          label="My doctor or primary care provider is"
          value="Dr. Sarah Thompson"
        />

        <DatePickerField
          label="My last medical visit"
          value={data?.fields?.["last-medical-visit"] ? new Date(data.fields["last-medical-visit"]) : undefined}
          onChange={(date) => updateField("health", "last-medical-visit", date?.toISOString() || "")}
          showsOnTimeline
        />

        <PrePopulatedField
          label="My NHI number"
          value="ABC1234"
        />

        <TableField
          label="My current treatment or medication is"
          columns={[
            { key: "treatment", label: "My current treatments", type: "textarea" },
            { key: "medication", label: "My current medication", type: "textarea" }
          ]}
          value={typeof data?.fields?.["treatment-medication"] === 'string' ? JSON.parse(data?.fields?.["treatment-medication"] || '[]') : (data?.fields?.["treatment-medication"] || [])}
          onChange={(value) => updateField("health", "treatment-medication", JSON.stringify(value))}
          prompt="Are they currently taking their medication? If not why? What is important to know about the treatment and medication and are there any future changes that we need to be aware of."
        />

        <FieldWithPrompt label="My dentist is">
          <Textarea
            value={data?.fields?.dentist || ""}
            onChange={(e) => updateField("health", "dentist", e.target.value)}
            placeholder="Dentist's name..."
            autoComplete="off"
            className="min-h-[60px] resize-none"
          />
        </FieldWithPrompt>

        <DatePickerField
          label="My last dentist visit"
          value={data?.fields?.["last-dentist-visit"] ? new Date(data.fields["last-dentist-visit"]) : undefined}
          onChange={(date) => updateField("health", "last-dentist-visit", date?.toISOString() || "")}
          showsOnTimeline
        />

        <div className="space-y-2">
          <CheckboxField
            id="no-oral-health-needs"
            label="No oral health needs identified"
            checked={data?.fields?.["no-oral-health-needs"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-oral-health-needs", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-oral-health-needs"] !== "true"}>
            <FieldWithPrompt
              label="My oral health needs"
              prompt="Consider daily care needs such as help with brushing, flossing, or using toothpaste. Be mindful of any sensory or physical challenges that may affect oral hygiene, and explore routines or reminders that support regular care. Education and encouragement around oral hygiene are also important. Ensure access to dental check-ups or specialist treatment is considered, and record any treatment needs or supports required to maintain oral health."
            >
              <Textarea
                value={data?.fields?.["oral-health-needs"] || ""}
                onChange={(e) => updateField("health", "oral-health-needs", e.target.value)}
                placeholder="Describe oral health needs..."
                autoComplete="off"
                className="min-h-[100px] resize-none"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <div className="space-y-2">
          <CheckboxField
            id="no-vision-needs"
            label="No vision needs identified"
            checked={data?.fields?.["no-vision-needs"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-vision-needs", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-vision-needs"] !== "true"}>
            <FieldWithPrompt
              label="My vision needs"
              prompt="Consider whether te tamaiti or rangatahi may have vision needs, such as requiring an eye test, glasses, contact lenses, or other forms of support. This could include challenges with seeing clearly, reading, or participating in activities. If any needs are identified, ensure they are recorded in the plan below"
            >
              <Textarea
                value={data?.fields?.["vision-needs"] || ""}
                onChange={(e) => updateField("health", "vision-needs", e.target.value)}
                placeholder="Describe vision needs..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <div className="space-y-2">
          <CheckboxField
            id="no-hearing-needs"
            label="No hearing needs identified"
            checked={data?.fields?.["no-hearing-needs"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-hearing-needs", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-hearing-needs"] !== "true"}>
            <FieldWithPrompt
              label="My hearing needs"
              prompt="Consider whether te tamaiti or rangatahi may have hearing needs. This could include requiring a hearing test, hearing aids, or other forms of support. If hearing needs are identified, ensure they are recorded in the plan below."
            >
              <Textarea
                value={data?.fields?.["hearing-needs"] || ""}
                onChange={(e) => updateField("health", "hearing-needs", e.target.value)}
                placeholder="Describe hearing needs..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <div className="space-y-2">
          <CheckboxField
            id="no-other-health-services"
            label="No other health services identified"
            checked={data?.fields?.["no-other-health-services"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-other-health-services", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-other-health-services"] !== "true"}>
            <FieldWithPrompt
              label="Other important people or health services who I connect with for my health"
              prompt="Consider significant whanau or family members as well as professionals e.g Psychologist, Therapist, Counsellor, Physiotherapist, Orthodontist, Optometrist, Audiologist, etc"
            >
              <Textarea
                value={data?.fields?.["other-health-services"] || ""}
                onChange={(e) => updateField("health", "other-health-services", e.target.value)}
                placeholder="List health services and professionals..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <FieldWithPrompt
          label="My Immunisations"
          prompt="Record current immunisations and check what immunisations may be due next aligning with National Immunisation Schedule. Include any upcoming appointments or actions needed to support access to vaccinations in the 'My Goal Plan'."
        >
          <div className="space-y-2">
            <Textarea
              value={data?.fields?.immunisations || ""}
              onChange={(e) => updateField("health", "immunisations", e.target.value)}
              placeholder="Current immunisation status..."
              className="min-h-[80px]"
            />
            <CheckboxField
              id="no-consent-immunisations"
              label="No consent for immunisations"
              checked={data?.fields?.["no-consent-immunisations"] === "true"}
              onCheckedChange={(checked) => updateField("health", "no-consent-immunisations", String(checked))}
            />
          </div>
        </FieldWithPrompt>

        <div className="space-y-2">
          <CheckboxField
            id="no-allergies"
            label="No allergies identified"
            checked={data?.fields?.["no-allergies"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-allergies", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-allergies"] !== "true"}>
            <FieldWithPrompt
              label="My allergies and treatment needed"
              prompt="Is there a clear plan in place for responding to allergies and allergic reactions? Consider whether te tamaiti or rangatahi has known allergies, and ensure there is a documented response plan—such as the location and use of an EpiPen or other medication. Include any relevant information about triggers and symptoms."
            >
              <div className="space-y-4">
                {allergyCategories.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <Label className="font-semibold">{category.category}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {category.options.map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox id={`allergy-${option}`} />
                          <Label htmlFor={`allergy-${option}`} className="font-normal cursor-pointer">{option}</Label>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <Checkbox id={`allergy-${category.category}-other`} />
                        <Label htmlFor={`allergy-${category.category}-other`} className="font-normal cursor-pointer">Other (specify)</Label>
                      </div>
                    </div>
                  </div>
                ))}
                <Textarea
                  value={data?.fields?.["allergy-treatment"] || ""}
                  onChange={(e) => updateField("health", "allergy-treatment", e.target.value)}
                  placeholder="Describe treatment plans for allergies..."
                  className="min-h-[100px]"
                />
              </div>
            </FieldWithPrompt>
          </ConditionalField>
        </div>

        <FieldWithPrompt
          label="My physical health and developmental needs"
          prompt="Consider the physical health and developmental needs of te tamaiti or rangatahi. This may include growth, mobility, coordination, sleep, personal care, nutrition, toileting, puberty, and any diagnosed conditions or developmental delays. Consider whether any assessments are needed to identify or better understand these needs."
        >
          <Textarea
            value={data?.fields?.["physical-developmental-needs"] || ""}
            onChange={(e) => updateField("health", "physical-developmental-needs", e.target.value)}
            placeholder="Describe physical health and developmental needs..."
            className="min-h-[120px]"
          />
        </FieldWithPrompt>

        <TableField
          label="My mental health needs and any supports or interventions currently involved"
          columns={[
            { key: "needs", label: "My mental health needs", type: "textarea" },
            { key: "supports", label: "Support or interventions involved", type: "textarea" }
          ]}
          value={typeof data?.fields?.["mental-health"] === 'string' ? JSON.parse(data?.fields?.["mental-health"] || '[]') : (data?.fields?.["mental-health"] || [])}
          onChange={(value) => updateField("health", "mental-health", JSON.stringify(value))}
          prompt="Consider the mental health needs of te tamaiti or rangatahi. This may include emotional wellbeing, anxiety, mood, trauma, or other mental health concerns. Record any current supports or interventions in place, such as counselling, therapy, medication, or cultural supports. Consider whether further assessment is needed to understand their needs"
        />

        <div className="space-y-2">
          <CheckboxField
            id="no-substance-use"
            label="No substance use identified"
            checked={data?.fields?.["no-substance-use"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-substance-use", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-substance-use"] !== "true"}>
            <FieldWithPrompt
              label="My alcohol or substances (including vaping, cigarettes, other substances) use"
              prompt="Record any known use, including frequency and quantity if appropriate. Explore whether this use is impacting their wellbeing, relationships, or goals. Is there evidence that their everyday functions are being impaired. If concerns are identified, consider what supports, interventions, or assessments may be needed, and include any actions or timeframes in the plan."
            >
              <Textarea
                value={data?.fields?.["substance-use"] || ""}
                onChange={(e) => updateField("health", "substance-use", e.target.value)}
                placeholder="Describe substance use..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>

            <ConditionalField show={!!data?.fields?.["substance-use"]}>
              <FieldWithPrompt label="Any services and supports currently helping with my substance use">
                <Textarea
                  value={data?.fields?.["substance-support"] || ""}
                  onChange={(e) => updateField("health", "substance-support", e.target.value)}
                  placeholder="Services and supports..."
                  className="min-h-[80px]"
                />
              </FieldWithPrompt>
            </ConditionalField>
          </ConditionalField>
        </div>

        <div className="space-y-2">
          <CheckboxField
            id="no-other-health-needs"
            label="No other health needs identified"
            checked={data?.fields?.["no-other-health-needs"] === "true"}
            onCheckedChange={(checked) => updateField("health", "no-other-health-needs", String(checked))}
          />
          <ConditionalField show={data?.fields?.["no-other-health-needs"] !== "true"}>
            <FieldWithPrompt
              label="Other health needs that affect my life are"
              prompt="Consider sexual and/or reproductive health needs"
            >
              <Textarea
                value={data?.fields?.["other-health-needs"] || ""}
                onChange={(e) => updateField("health", "other-health-needs", e.target.value)}
                placeholder="Describe other health needs..."
                className="min-h-[100px]"
              />
            </FieldWithPrompt>
          </ConditionalField>
        </div>
      </div>

      <div className="pt-6">
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <ActionTable sectionId="health" />
      </div>
    </div>
  );
};