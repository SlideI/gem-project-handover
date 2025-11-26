import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { validateField } from "@/lib/validation";

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validationSchema?: z.ZodSchema;
  onValidatedChange?: (value: string, error: string | null) => void;
}

export const ValidatedInput = React.forwardRef<HTMLInputElement, ValidatedInputProps>(
  ({ label, validationSchema, onValidatedChange, className, ...props }, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    const [touched, setTouched] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      if (validationSchema) {
        const validationError = validateField(e.target.value, validationSchema);
        setError(validationError);
        onValidatedChange?.(e.target.value, validationError);
      }
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (touched && validationSchema) {
        const validationError = validateField(e.target.value, validationSchema);
        setError(validationError);
        onValidatedChange?.(e.target.value, validationError);
      }
      props.onChange?.(e);
    };

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input
          ref={ref}
          className={cn(
            error && touched && "border-destructive focus-visible:ring-destructive",
            className
          )}
          autoComplete="off"
          {...props}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        {error && touched && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

ValidatedInput.displayName = "ValidatedInput";
