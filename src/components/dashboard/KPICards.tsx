import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";
import { isPast, isFuture, isToday, parseISO } from "date-fns";

export const KPICards = () => {
  const { sections } = usePlan();

  const metrics = useMemo(() => {
    let upcomingCount = 0;
    let overdueCount = 0;
    let totalActions = 0;
    let completedActions = 0;

    Object.values(sections).forEach((section) => {
      section.actions.forEach((action) => {
        if (action.action) {
          totalActions++;
          
          if (action.completed) {
            completedActions++;
          } else if (action.deadline) {
            try {
              const deadline = parseISO(action.deadline);
              if ((isPast(deadline) || isToday(deadline)) && !action.completed) {
                overdueCount++;
              } else if (isFuture(deadline)) {
                upcomingCount++;
              }
            } catch (e) {
              console.error("Invalid date:", action.deadline);
            }
          }
        }
      });
    });

    const completionPercentage = totalActions > 0 
      ? Math.round((completedActions / totalActions) * 100) 
      : 0;

    return { upcomingCount, overdueCount, completionPercentage };
  }, [sections]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">{metrics.upcomingCount}</div>
          <div className="text-sm text-muted-foreground">Upcoming Actions</div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-destructive">{metrics.overdueCount}</div>
          <div className="text-sm text-muted-foreground">Overdue Actions</div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-success">{metrics.completionPercentage}%</div>
          <div className="text-sm text-muted-foreground">Plan Complete</div>
        </div>
      </Card>
    </div>
  );
};
