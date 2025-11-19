import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { validateField } from "@/lib/validation";

interface ValidatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  validationSchema?: z.ZodSchema;
  onValidatedChange?: (value: string, error: string | null) => void;
}

export const ValidatedTextarea = React.forwardRef<HTMLTextAreaElement, ValidatedTextareaProps>(
  ({ label, validationSchema, onValidatedChange, className, ...props }, ref) => {
    const [error, setError] = React.useState<string | null>(null);
    const [touched, setTouched] = React.useState(false);

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setTouched(true);
      if (validationSchema) {
        const validationError = validateField(e.target.value, validationSchema);
        setError(validationError);
        onValidatedChange?.(e.target.value, validationError);
      }
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        <Textarea
          ref={ref}
          className={cn(
            error && touched && "border-destructive focus-visible:ring-destructive",
            className
          )}
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

ValidatedTextarea.displayName = "ValidatedTextarea";
