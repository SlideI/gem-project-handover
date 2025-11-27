import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette } from "lucide-react";

export interface Theme {
  id: string;
  name: string;
  description: string;
}

export const themes: Theme[] = [
  { id: "default", name: "Oranga Tamariki", description: "Default brand theme" },
  { id: "arctic-blue", name: "Arctic Blue", description: "Cool and calming blue tones" },
  { id: "forest-green", name: "Forest Green", description: "Natural green palette" },
  { id: "sunset-orange", name: "Sunset Orange", description: "Warm orange and amber hues" },
  { id: "lavender-dream", name: "Lavender Dream", description: "Soft purple and lavender" },
  { id: "ocean-teal", name: "Ocean Teal", description: "Deep teal and aqua shades" },
  { id: "crazy-colours", name: "Crazy Colours", description: "Vibrant rainbow mix" },
  { id: "random-mixup", name: "Random Mix-up", description: "Unexpected color combinations" },
];

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemeSelector = ({ selectedTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="flex items-center gap-3 mb-6 p-4 bg-card rounded-lg border">
      <Palette className="h-5 w-5 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">Theme:</span>
      <Select value={selectedTheme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              <div className="flex flex-col">
                <span className="font-medium">{theme.name}</span>
                <span className="text-xs text-muted-foreground">{theme.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
