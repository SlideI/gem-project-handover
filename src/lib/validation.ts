import { z } from "zod";

// Common validation schemas for plan fields
export const emailSchema = z.string().email("Please enter a valid email address").or(z.literal(""));

export const phoneSchema = z.string()
  .regex(/^[\d\s\-\+\(\)]*$/, "Please enter a valid phone number")
  .or(z.literal(""));

export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
  .or(z.literal(""));

export const textRequiredSchema = z.string()
  .min(1, "This field is required")
  .trim();

export const textOptionalSchema = z.string().trim();

export const nhiSchema = z.string()
  .regex(/^[A-Z]{3}\d{4}$/, "NHI must be 3 letters followed by 4 numbers (e.g., ABC1234)")
  .or(z.literal(""));

// Validation function that returns error message or null
export const validateField = (value: string, schema: z.ZodSchema): string | null => {
  try {
    schema.parse(value);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid input";
    }
    return "Invalid input";
  }
};
