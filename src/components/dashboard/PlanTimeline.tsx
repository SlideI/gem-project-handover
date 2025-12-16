import { useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isFuture, isToday, parseISO, setYear, getMonth, getDate } from "date-fns";
import { Link } from "react-router-dom";

interface TimelineEvent {
  title: string;
  date: Date;
  category: string;
  sectionId: string;
  isPastDue: boolean;
  isUpcoming: boolean;
  isToday: boolean;
}

// Define which fields should appear on the timeline
const TIMELINE_FIELDS = [
  // About Me section - DOB handled specially as birthday
  { sectionKey: "about-me", fieldKey: "dob", label: "My Birthday", category: "About Me", isBirthday: true },
  
  // Planning With section
  { sectionKey: "planning-with", fieldKey: "plan-discussed-date", label: "Plan discussed with social worker", category: "Planning With" },
  { sectionKey: "planning-with", fieldKey: "review-date", label: "My plan will be reviewed on", category: "Planning With" },
  { sectionKey: "planning-with", fieldKey: "rights-booklet-date", label: "My voice, my rights booklet was provided", category: "Planning With" },
  { sectionKey: "planning-with", fieldKey: "next-visit", label: "My next social worker visit", category: "Planning With" },
  
  // Health section
  { sectionKey: "health", fieldKey: "last-medical-visit", label: "My last medical visit", category: "Health" },
  { sectionKey: "health", fieldKey: "last-dentist-visit", label: "My last dentist visit", category: "Health" },
  
  // Youth Justice section
  { sectionKey: "youth-justice", fieldKey: "next-court-date", label: "My next court date or family group conference", category: "Youth Justice" },
  
  // Transition section
  { sectionKey: "transition", fieldKey: "life-skills-date", label: "My life skills assessment", category: "Transition" },
  { sectionKey: "transition", fieldKey: "transition-hui-date", label: "My transition planning hui", category: "Transition" },
  
  // Residence section
  { sectionKey: "residence", fieldKey: "arrived-on", label: "I arrived on", category: "Residence" },
  { sectionKey: "residence", fieldKey: "expected-leaving-date", label: "My early leaving date / expected leaving date", category: "Residence" },
];

// Get the next occurrence of a birthday (this year or next year)
const getNextBirthday = (birthDate: Date): Date => {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Create this year's birthday
  let nextBirthday = new Date(currentYear, getMonth(birthDate), getDate(birthDate));
  
  // If this year's birthday has passed, use next year's
  if (isPast(nextBirthday) && !isToday(nextBirthday)) {
    nextBirthday = new Date(currentYear + 1, getMonth(birthDate), getDate(birthDate));
  }
  
  return nextBirthday;
};

export const PlanTimeline = () => {
  const { sections } = usePlan();
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    
    TIMELINE_FIELDS.forEach((field) => {
      const section = sections[field.sectionKey];
      if (!section) return;
      
      const fieldValue = section.fields?.[field.fieldKey];
      if (!fieldValue) return;
      
      try {
        // Try to parse as ISO date first, then as other formats
        let date: Date;
        if (fieldValue.includes("T") || fieldValue.match(/^\d{4}-\d{2}-\d{2}/)) {
          date = parseISO(fieldValue);
        } else {
          // Try parsing other date formats (e.g., "12 July 2009")
          date = new Date(fieldValue);
        }
        
        if (isNaN(date.getTime())) return;
        
        // For birthdays, show the next occurrence (this year or next)
        if ((field as any).isBirthday) {
          date = getNextBirthday(date);
        }
        
        events.push({
          title: field.label,
          date,
          category: field.category,
          sectionId: field.sectionKey,
          isPastDue: isPast(date) && !isToday(date),
          isUpcoming: isFuture(date),
          isToday: isToday(date),
        });
      } catch (e) {
        console.error("Invalid date:", fieldValue);
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sections]);

  const todayIndex = timelineEvents.findIndex((event) => event.isToday || event.isUpcoming);

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
  }, [timelineEvents]);

  if (timelineEvents.length === 0) {
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
          <div className="absolute top-[60px] left-0 h-0.5 bg-border" style={{ width: `${timelineEvents.length * 220}px` }} />
          
          <div className="flex gap-4 min-w-max items-start pt-12 pb-2 px-4">
            {timelineEvents.map((event, index) => (
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
                      event.isToday
                        ? "bg-primary border-primary"
                        : event.isPastDue
                        ? "bg-muted border-muted-foreground"
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
                          to={`/plan#${event.sectionId}`}
                          className="text-sm font-medium hover:text-primary transition-colors block mb-2"
                        >
                          {truncateText(event.title)}
                        </Link>
                      </TooltipTrigger>
                      {event.title.length > 45 && (
                        <TooltipContent>
                          <p className="max-w-xs">{event.title}</p>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(event.date, "dd/MM/yyyy")}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {event.category}
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
