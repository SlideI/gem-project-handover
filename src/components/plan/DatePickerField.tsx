import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldWithPrompt } from "./FieldWithPrompt";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DatePickerFieldProps {
  label: string;
  value?: Date;
  onChange: (date?: Date) => void;
  prompt?: string;
  showsOnTimeline?: boolean;
}

export const DatePickerField = ({ label, value, onChange, prompt, showsOnTimeline }: DatePickerFieldProps) => {
  return (
    <FieldWithPrompt label={label} prompt={prompt}>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {showsOnTimeline && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full border border-border/50">
                  <Clock className="h-3 w-3" />
                  <span>Timeline</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>This date appears on your Plan Timeline</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </FieldWithPrompt>
  );
};
