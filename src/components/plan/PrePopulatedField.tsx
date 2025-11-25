import { Input } from "@/components/ui/input";
import { FieldWithPrompt } from "./FieldWithPrompt";

interface PrePopulatedFieldProps {
  label: string;
  value: string;
  prompt?: string;
}

export const PrePopulatedField = ({ label, value, prompt }: PrePopulatedFieldProps) => {
  return (
    <FieldWithPrompt label={label} prompt={prompt}>
      <Input value={value} disabled className="bg-muted cursor-not-allowed" />
    </FieldWithPrompt>
  );
};
