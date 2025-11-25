import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FieldWithPrompt } from "./FieldWithPrompt";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  prompt?: string;
}

export const SelectField = ({ label, value, onChange, options, placeholder, prompt }: SelectFieldProps) => {
  return (
    <FieldWithPrompt label={label} prompt={prompt}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWithPrompt>
  );
};
