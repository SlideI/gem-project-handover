import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const historyData = [
  {
    id: 1,
    section: "About Me",
    changedBy: "Jennifer Reilly",
    version: 3,
    changeType: "Updated",
    timestamp: "4/04/2025 3:23pm",
    description: "Updated personal details and preferences",
  },
  {
    id: 2,
    section: "Health",
    changedBy: "Jennifer Reilly",
    version: 3,
    changeType: "Added",
    timestamp: "4/04/2025 2:45pm",
    description: "Added new health assessment information",
  },
  {
    id: 3,
    section: "Education",
    changedBy: "Mark Thompson",
    version: 2,
    changeType: "Updated",
    timestamp: "28/03/2025 10:15am",
    description: "Updated school enrollment details",
  },
  {
    id: 4,
    section: "Connections",
    changedBy: "Jennifer Reilly",
    version: 2,
    changeType: "Updated",
    timestamp: "25/03/2025 4:30pm",
    description: "Added new family contact information",
  },
  {
    id: 5,
    section: "Identity & Cultural Needs",
    changedBy: "Sarah Mitchell",
    version: 1,
    changeType: "Created",
    timestamp: "15/03/2025 11:00am",
    description: "Initial section creation",
  },
  {
    id: 6,
    section: "My Plan Summary",
    changedBy: "Jennifer Reilly",
    version: 1,
    changeType: "Created",
    timestamp: "15/03/2025 9:30am",
    description: "Plan created and initial summary added",
  },
];

const getChangeTypeBadge = (changeType: string) => {
  switch (changeType) {
    case "Created":
      return <Badge className="bg-success text-white">Created</Badge>;
    case "Updated":
      return <Badge className="bg-primary text-primary-foreground">Updated</Badge>;
    case "Added":
      return <Badge className="bg-blue-500 text-white">Added</Badge>;
    default:
      return <Badge variant="secondary">{changeType}</Badge>;
  }
};

export const HistoryPanel = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Activity History</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Change Type</TableHead>
              <TableHead>Changed By</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historyData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.section}</TableCell>
                <TableCell>{getChangeTypeBadge(item.changeType)}</TableCell>
                <TableCell>{item.changedBy}</TableCell>
                <TableCell>v{item.version}</TableCell>
                <TableCell className="text-muted-foreground">{item.timestamp}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate" title={item.description}>
                  {item.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
