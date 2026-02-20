import { usePlan } from "@/contexts/PlanContext";
import { SelectField } from "../SelectField";

const visitFrequencyOptions = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
  { value: "6-monthly", label: "6 monthly" },
  { value: "never", label: "Never" },
];

export const VisitFrequencySection = () => {
  const { sections, updateField, isReadOnly } = usePlan();
  const section = sections["visit-frequency"];

  // Child's first name - pre-populated from external source
  const childFirstName = "Samuel";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Frequency of visits to {childFirstName}
        </h2>
        <p className="text-muted-foreground mt-1">
          Record how often you intend to visit this rāngatahi.
        </p>
      </div>

      <SelectField
        label="How often I intend to visit this rāngatahi"
        value={section?.fields?.["visit-frequency"] || ""}
        onChange={(value) => {
          if (!isReadOnly) {
            updateField("visit-frequency", "visit-frequency", value);
          }
        }}
        options={visitFrequencyOptions}
        placeholder="Select visit frequency"
      />
    </div>
  );
};
