import { HelpCircle, Users, ShieldAlert, HomeIcon, Scale, type LucideIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

interface FieldWithPromptProps {
  label: string;
  prompt?: string;
  children: React.ReactNode;
  htmlFor?: string;
}

const TEMPLATES: { id: string; label: string; Icon: LucideIcon; colorClass: string }[] = [
  { id: "multi-agency", label: "Multi-agency Team Meeting", Icon: Users, colorClass: "text-sky-600" },
  { id: "roit", label: "ROIT", Icon: ShieldAlert, colorClass: "text-amber-600" },
  { id: "care-request", label: "Care Request", Icon: HomeIcon, colorClass: "text-emerald-600" },
  { id: "youth-justice-admission", label: "Youth Justice Admission Form", Icon: Scale, colorClass: "text-violet-600" },
];

// Deterministic pseudo-random assignment seeded by the field label so the same
// question always shows the same set of template icons across renders.
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

const getTemplatesForLabel = (label: string) => {
  const h = hash(label);
  // 1 or 2 icons per field
  const count = (h % 2) + 1;
  const start = h % TEMPLATES.length;
  const picks: typeof TEMPLATES = [];
  for (let i = 0; i < count; i++) {
    picks.push(TEMPLATES[(start + i * 2 + 1) % TEMPLATES.length]);
  }
  return picks;
};

export const FieldWithPrompt = ({ label, prompt, children, htmlFor }: FieldWithPromptProps) => {
  const templates = getTemplatesForLabel(label);
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {prompt && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-primary cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p className="text-sm">{prompt}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <TooltipProvider>
          <div className="flex items-center gap-1">
            {templates.map(({ id, label: tLabel, Icon, colorClass }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <Icon className={`h-3.5 w-3.5 ${colorClass} cursor-help opacity-80`} />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Included in: {tLabel}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
      {children}
    </div>
  );
};
