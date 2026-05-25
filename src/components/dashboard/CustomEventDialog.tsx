import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface CustomEvent {
  id: string;
  title: string;
  date: string; // ISO
  color: string; // hsl token name
  recurring: boolean;
  frequency?: "weekly" | "fortnightly" | "monthly" | "yearly";
  endDate?: string; // ISO
}

const STORAGE_KEY = "timeline_custom_events";

export const COLOR_OPTIONS = [
  { name: "Blue", value: "blue", bg: "bg-blue-100 border-blue-300 dark:bg-blue-950/40 dark:border-blue-800", dot: "bg-blue-500 border-blue-600", text: "text-blue-700 dark:text-blue-300" },
  { name: "Green", value: "green", bg: "bg-green-100 border-green-300 dark:bg-green-950/40 dark:border-green-800", dot: "bg-green-500 border-green-600", text: "text-green-700 dark:text-green-300" },
  { name: "Amber", value: "amber", bg: "bg-amber-100 border-amber-300 dark:bg-amber-950/40 dark:border-amber-800", dot: "bg-amber-500 border-amber-600", text: "text-amber-700 dark:text-amber-300" },
  { name: "Pink", value: "pink", bg: "bg-pink-100 border-pink-300 dark:bg-pink-950/40 dark:border-pink-800", dot: "bg-pink-500 border-pink-600", text: "text-pink-700 dark:text-pink-300" },
  { name: "Purple", value: "purple", bg: "bg-purple-100 border-purple-300 dark:bg-purple-950/40 dark:border-purple-800", dot: "bg-purple-500 border-purple-600", text: "text-purple-700 dark:text-purple-300" },
  { name: "Teal", value: "teal", bg: "bg-teal-100 border-teal-300 dark:bg-teal-950/40 dark:border-teal-800", dot: "bg-teal-500 border-teal-600", text: "text-teal-700 dark:text-teal-300" },
];

export const getColorStyles = (value: string) =>
  COLOR_OPTIONS.find((c) => c.value === value) ?? COLOR_OPTIONS[0];

export const loadCustomEvents = (): CustomEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCustomEvents = (events: CustomEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("custom-events-updated"));
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export const CustomEventDialog = ({ open, onOpenChange }: Props) => {
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [color, setColor] = useState("blue");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState<CustomEvent["frequency"]>("weekly");
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    if (open) setEvents(loadCustomEvents());
  }, [open]);

  const reset = () => {
    setTitle(""); setDate(undefined); setColor("blue");
    setRecurring(false); setFrequency("weekly"); setEndDate(undefined);
  };

  const handleAdd = () => {
    if (!title.trim() || !date) return;
    const newEvent: CustomEvent = {
      id: crypto.randomUUID(),
      title: title.trim(),
      date: date.toISOString(),
      color,
      recurring,
      ...(recurring ? { frequency, endDate: endDate?.toISOString() } : {}),
    };
    const updated = [...events, newEvent];
    setEvents(updated);
    saveCustomEvents(updated);
    reset();
  };

  const handleDelete = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveCustomEvents(updated);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Timeline Events</DialogTitle>
          <DialogDescription>Add custom events to your Plan Timeline. Recurring events will repeat at the chosen frequency up to the end date.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 border-b pb-6">
          <div className="space-y-2">
            <Label htmlFor="event-title">Event title</Label>
            <Input id="event-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Family visit" autoComplete="off" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Background colour</Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={cn("h-8 w-8 rounded-full border-2 transition-transform", c.dot, color === c.value ? "ring-2 ring-offset-2 ring-foreground scale-110" : "")}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="recurring-switch" className="cursor-pointer">Recurring event</Label>
              <p className="text-xs text-muted-foreground">Repeat this event on a schedule</p>
            </div>
            <Switch id="recurring-switch" checked={recurring} onCheckedChange={setRecurring} />
          </div>

          {recurring && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={(v) => setFrequency(v as CustomEvent["frequency"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>End date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          <Button onClick={handleAdd} disabled={!title.trim() || !date || (recurring && !endDate)} className="w-full">
            <Plus className="h-4 w-4 mr-1" /> Add event
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Your custom events ({events.length})</h4>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No custom events yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.map((ev) => {
                const c = getColorStyles(ev.color);
                return (
                  <div key={ev.id} className={cn("flex items-center justify-between rounded-md border p-3", c.bg)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn("h-3 w-3 rounded-full shrink-0", c.dot)} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{ev.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(ev.date), "dd/MM/yyyy")}
                          {ev.recurring && ` · ${ev.frequency}${ev.endDate ? ` until ${format(new Date(ev.endDate), "dd/MM/yyyy")}` : ""}`}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(ev.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
