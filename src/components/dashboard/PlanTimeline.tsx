import { useMemo, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlan } from "@/contexts/PlanContext";
import { format, isPast, isFuture, isToday, parse, getMonth, getDate } from "date-fns";
import { Link } from "react-router-dom";
import { Cake, FileText } from "lucide-react";

interface TimelineEvent {
  title: string;
  date: Date;
  category: string;
  sectionId: string;
  isPastDue: boolean;
  isUpcoming: boolean;
  isToday: boolean;
  isBirthday?: boolean;
  isPlanCreation?: boolean;
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

// Parse various date formats
const parseDate = (dateStr: string): Date | null => {
  if (!dateStr) return null;
  
  // Try ISO format first
  if (dateStr.includes("T") || dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  }
  
  // Try "22 December 2009" format
  try {
    const d = parse(dateStr, "d MMMM yyyy", new Date());
    if (!isNaN(d.getTime())) return d;
  } catch {}
  
  // Try "December 22, 2009" format
  try {
    const d = parse(dateStr, "MMMM d, yyyy", new Date());
    if (!isNaN(d.getTime())) return d;
  } catch {}
  
  // Fallback to native parsing
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
};

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
  const { sections, planCreatedAt } = usePlan();
  const scrollRef = useRef<HTMLDivElement>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    
    // Add plan creation date as the start of the timeline
    if (planCreatedAt) {
      const creationDate = parseDate(planCreatedAt);
      if (creationDate) {
        events.push({
          title: "All About Me Plan Created",
          date: creationDate,
          category: "Plan",
          sectionId: "about-me",
          isPastDue: isPast(creationDate) && !isToday(creationDate),
          isUpcoming: isFuture(creationDate),
          isToday: isToday(creationDate),
          isPlanCreation: true,
        });
      }
    }
    
    TIMELINE_FIELDS.forEach((field) => {
      const section = sections[field.sectionKey];
      if (!section) return;
      
      const fieldValue = section.fields?.[field.fieldKey];
      if (!fieldValue) return;
      
      const date = parseDate(fieldValue);
      if (!date) return;
      
      // For birthdays, show the next occurrence (this year or next)
      const eventDate = field.isBirthday ? getNextBirthday(date) : date;
      
      events.push({
        title: field.label,
        date: eventDate,
        category: field.category,
        sectionId: field.sectionKey,
        isPastDue: isPast(eventDate) && !isToday(eventDate),
        isUpcoming: isFuture(eventDate),
        isToday: isToday(eventDate),
        isBirthday: field.isBirthday || false,
      });
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [sections, planCreatedAt]);

  // Find where "today" falls in the timeline
  const today = new Date();
  const todayPosition = useMemo(() => {
    if (timelineEvents.length === 0) return -1;
    
    // Find the index where today would fit
    for (let i = 0; i < timelineEvents.length; i++) {
      if (timelineEvents[i].date >= today) {
        return i;
      }
    }
    return timelineEvents.length; // Today is after all events
  }, [timelineEvents]);

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

  // Create items array with today marker inserted
  const renderItems: Array<{ type: 'event' | 'today'; event?: TimelineEvent; index?: number }> = [];
  timelineEvents.forEach((event, index) => {
    // Insert today marker before this event if today falls here
    if (index === todayPosition) {
      renderItems.push({ type: 'today' });
    }
    renderItems.push({ type: 'event', event, index });
  });
  // If today is after all events
  if (todayPosition === timelineEvents.length) {
    renderItems.push({ type: 'today' });
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Plan Timeline</h3>
      <ScrollArea className="w-full" type="always">
        <div ref={scrollRef} className="relative pb-6">
          {/* Main timeline line */}
          <div className="absolute top-[60px] left-0 h-0.5 bg-border" style={{ width: `${renderItems.length * 220}px` }} />
          
          <div className="flex gap-4 min-w-max items-start pt-12 pb-2 px-4">
            {renderItems.map((item, idx) => {
              if (item.type === 'today') {
                return (
                  <div 
                    key="today-marker"
                    ref={todayRef}
                    className="relative flex flex-col items-center"
                    style={{ width: '80px' }}
                  >
                    {/* Today label */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap shadow-md">
                        Today
                      </div>
                    </div>
                    
                    {/* Vertical green line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 bg-green-500 h-[200px] z-20" />
                    
                    {/* Today point on timeline */}
                    <div className="relative z-30">
                      <div className="w-5 h-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
                    </div>
                  </div>
                );
              }
              
              const event = item.event!;
              return (
                <div 
                  key={item.index} 
                  className="relative flex flex-col items-center"
                  style={{ width: '200px' }}
                >
                  {/* Timeline point */}
                  <div className="relative z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        event.isPlanCreation
                          ? "bg-blue-500 border-blue-600"
                          : event.isPastDue
                          ? "bg-muted border-muted-foreground"
                          : "bg-background border-border"
                      } shadow-sm`}
                    />
                  </div>

                  {/* Event card */}
                  <div className={`mt-4 border rounded-lg p-3 shadow-sm w-[180px] hover:shadow-md transition-shadow cursor-pointer text-center ${
                    event.isBirthday 
                      ? "bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 dark:from-pink-950/30 dark:to-purple-950/30 dark:border-pink-800" 
                      : event.isPlanCreation
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 dark:from-blue-950/30 dark:to-indigo-950/30 dark:border-blue-800"
                      : "bg-card border-border"
                  }`}>
                    {event.isBirthday && (
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <Cake className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-medium text-pink-600 dark:text-pink-400">Birthday!</span>
                      </div>
                    )}
                    {event.isPlanCreation && (
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Plan Started</span>
                      </div>
                    )}
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
                    <p className="text-xs text-muted-foreground">
                      {event.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};