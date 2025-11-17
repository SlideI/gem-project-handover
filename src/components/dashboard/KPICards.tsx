import { Card } from "@/components/ui/card";

export const KPICards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-primary">0</div>
          <div className="text-sm text-muted-foreground">Upcoming Actions</div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-destructive">0</div>
          <div className="text-sm text-muted-foreground">Overdue Actions</div>
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-success">0%</div>
          <div className="text-sm text-muted-foreground">Plan Complete</div>
        </div>
      </Card>
    </div>
  );
};
