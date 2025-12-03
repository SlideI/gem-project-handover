import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { usePlan } from "@/contexts/PlanContext";

export const LiquidProgressBar = () => {
  const { sections } = usePlan();

  const completionPercentage = useMemo(() => {
    let totalActions = 0;
    let completedActions = 0;

    Object.values(sections).forEach((section) => {
      section.actions.forEach((action) => {
        if (action.action) {
          totalActions++;
          if (action.completed) {
            completedActions++;
          }
        }
      });
    });

    return totalActions > 0 
      ? Math.round((completedActions / totalActions) * 100) 
      : 0;
  }, [sections]);

  return (
    <Card className="p-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Plan Progress</h2>
          <span className="text-2xl font-bold text-primary">{completionPercentage}%</span>
        </div>
        
        <div className="relative h-10 w-full overflow-hidden rounded-full bg-secondary/50 border border-border">
          {/* Liquid fill */}
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 via-primary to-primary/80 transition-all duration-700 ease-out"
            style={{ width: `${completionPercentage}%` }}
          >
            {/* Wave animation layers */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="liquid-wave liquid-wave-1" />
              <div className="liquid-wave liquid-wave-2" />
              <div className="liquid-wave liquid-wave-3" />
            </div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>
      </div>
    </Card>
  );
};
