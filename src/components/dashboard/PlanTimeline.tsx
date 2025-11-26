import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isFuture, isToday, parseISO } from "date-fns";

interface TimelineAction {
  title: string;
  date: Date;
  category: string;
  sectionId: string;
  isPastDue: boolean;
  isUpcoming: boolean;
  isToday: boolean;
}

export const PlanTimeline = () => {
  const { sections } = usePlan();

  const timelineActions = useMemo(() => {
    const actions: TimelineAction[] = [];
    
    Object.entries(sections).forEach(([sectionId, section]) => {
      section.actions.forEach((action) => {
        if (action.deadline && action.action) {
          try {
            const date = parseISO(action.deadline);
            actions.push({
              title: action.action,
              date,
              category: section.category,
              sectionId,
              isPastDue: isPast(date) && !isToday(date),
              isUpcoming: isFuture(date),
              isToday: isToday(date),
            });
          } catch (e) {
            console.error("Invalid date:", action.deadline);
          }
        }
      });
    });

    return actions.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sections]);

  const todayIndex = timelineActions.findIndex((action) => action.isToday || action.isUpcoming);

  if (timelineActions.length === 0) {
    return null;
  }

  const truncateText = (text: string, maxLength: number = 45) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Plan Timeline</h3>
      <ScrollArea className="w-full">
        <div className="relative pb-4">
          <div className="flex gap-6 min-w-max items-start pt-8">
            {timelineActions.map((action, index) => (
              <div key={index} className="relative flex flex-col items-center min-w-[200px]">
                {/* Timeline point */}
                <div className="relative z-10">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      action.isToday
                        ? "bg-primary border-primary"
                        : action.isPastDue
                        ? "bg-destructive border-destructive"
                        : "bg-background border-border"
                    } shadow-sm`}
                  />
                  {index === todayIndex && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                        Today
                      </div>
                    </div>
                  )}
                </div>

                {/* Connecting line */}
                {index < timelineActions.length - 1 && (
                  <div className="absolute top-2 left-1/2 w-full h-0.5 bg-border z-0" />
                )}

                {/* Action details */}
                <div className="mt-4 border border-border rounded-lg p-3 bg-card shadow-sm min-w-[180px] max-w-[200px]">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`/plan#${action.sectionId}`}
                          className="text-sm font-medium hover:text-primary transition-colors block mb-2"
                        >
                          {truncateText(action.title)}
                        </a>
                      </TooltipTrigger>
                      {action.title.length > 45 && (
                        <TooltipContent>
                          <p className="max-w-xs">{action.title}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(action.date, "dd/MM/yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};
