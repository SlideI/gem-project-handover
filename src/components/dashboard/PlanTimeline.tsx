import { useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isFuture, isToday, parseISO } from "date-fns";
import { Link } from "react-router-dom";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const timelineActions = useMemo(() => {
    const actions: TimelineAction[] = [];
    
    Object.entries(sections).forEach(([sectionId, section]) => {
      section.actions.forEach((action) => {
        if (action.deadline && action.action && action.show_in_timeline !== false) {
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

  // Scroll to center "Today" on mount
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const todayElement = todayRef.current;
      const containerWidth = container.offsetWidth;
      const todayLeft = todayElement.offsetLeft;
      const todayWidth = todayElement.offsetWidth;
      
      // Center the today element
      const scrollPosition = todayLeft - (containerWidth / 2) + (todayWidth / 2);
      container.scrollLeft = Math.max(0, scrollPosition);
    }
  }, [timelineActions]);

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
      <ScrollArea className="w-full" type="always">
        <div ref={scrollRef} className="relative pb-6">
          {/* Main timeline line */}
          <div className="absolute top-[60px] left-0 h-0.5 bg-border" style={{ width: `${timelineActions.length * 220}px` }} />
          
          <div className="flex gap-4 min-w-max items-start pt-12 pb-2 px-4">
            {timelineActions.map((action, index) => (
              <div 
                key={index} 
                ref={index === todayIndex ? todayRef : null}
                className="relative flex flex-col items-center"
                style={{ width: '200px' }}
              >
                {/* Today label with blue connecting line */}
                {index === todayIndex && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                      Today
                    </div>
                    <div className="w-0.5 h-6 bg-primary" />
                  </div>
                )}

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
                </div>

                {/* Event card */}
                <div className="mt-4 border border-border rounded-lg p-3 bg-card shadow-sm w-[180px] hover:shadow-md transition-shadow cursor-pointer">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to={`/plan#${action.sectionId}`}
                          className="text-sm font-medium hover:text-primary transition-colors block mb-2"
                        >
                          {truncateText(action.title)}
                        </Link>
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
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};
