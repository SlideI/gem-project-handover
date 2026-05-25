import { useMemo } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface Charge {
  crn: string;
  offence: string;
  offenceDate: string; // ISO yyyy-mm-dd
  response: string;
}

// Placeholder offence codes (until CYRAS integration)
export const OFFENCE_OPTIONS: { value: string; label: string }[] = [
  { value: "1581", label: "1581 - Common assault" },
  { value: "1641", label: "1641 - Assault with intent to injure" },
  { value: "2155", label: "2155 - Aggravated robbery" },
  { value: "2659", label: "2659 - Burglary (dwelling)" },
  { value: "2715", label: "2715 - Unlawful taking of motor vehicle" },
  { value: "3121", label: "3121 - Theft (under $500)" },
  { value: "3142", label: "3142 - Shoplifting" },
  { value: "4411", label: "4411 - Wilful damage" },
  { value: "5212", label: "5212 - Possession of cannabis" },
  { value: "5314", label: "5314 - Possession of methamphetamine" },
  { value: "6121", label: "6121 - Disorderly behaviour" },
  { value: "7155", label: "7155 - Breach of bail conditions" },
  { value: "7821", label: "7821 - Driving while disqualified" },
  { value: "8331", label: "8331 - Resisting police" },
];

const RESPONSE_OPTIONS = [
  "Denied",
  "Not Denied",
  "No Plea",
  "Proven before Court",
  "Withdrawn",
];

interface ChargesTableProps {
  value: string; // JSON-serialized Charge[]
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const ChargesTable = ({ value, onChange, readOnly = false }: ChargesTableProps) => {
  const rows: Charge[] = useMemo(() => {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [value]);

  const commit = (next: Charge[]) => onChange(JSON.stringify(next));

  const updateCell = (idx: number, key: keyof Charge, v: string) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: v } : r));
    commit(next);
  };

  const addRow = () =>
    commit([...rows, { crn: "", offence: "", offenceDate: "", response: "" }]);

  const removeRow = (idx: number) => commit(rows.filter((_, i) => i !== idx));

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CRN/ITC</TableHead>
            <TableHead>Offence</TableHead>
            <TableHead>Offence date</TableHead>
            <TableHead>Response</TableHead>
            {!readOnly && <TableHead className="w-[50px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={readOnly ? 4 : 5} className="text-sm text-muted-foreground italic">
                No charges recorded.
              </TableCell>
            </TableRow>
          )}
          {rows.map((row, idx) => {
            const date = row.offenceDate ? new Date(row.offenceDate) : undefined;
            return (
              <TableRow key={idx}>
                <TableCell>
                  <Input
                    value={row.crn}
                    onChange={(e) => updateCell(idx, "crn", e.target.value)}
                    placeholder="CRN/ITC"
                    disabled={readOnly}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={row.offence}
                    onValueChange={(v) => updateCell(idx, "offence", v)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select offence" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {OFFENCE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        disabled={readOnly}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) =>
                          updateCell(idx, "offenceDate", d ? format(d, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Select
                    value={row.response}
                    onValueChange={(v) => updateCell(idx, "response", v)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select response" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSE_OPTIONS.map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {!readOnly && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(idx)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!readOnly && (
        <div className="p-2 border-t flex justify-end">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add charge
          </Button>
        </div>
      )}
    </div>
  );
};
