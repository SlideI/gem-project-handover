import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileText, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PdfGenerationDialog } from "./PdfGenerationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FloatingActionButtonsProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: "default", name: "Default" },
  { id: "arctic-blue", name: "Arctic Blue" },
  { id: "forest-green", name: "Forest Green" },
  { id: "sunset-orange", name: "Sunset Orange" },
  { id: "lavender-dream", name: "Lavender Dream" },
  { id: "ocean-teal", name: "Ocean Teal" },
  { id: "crazy-colours", name: "Crazy Colours" },
  { id: "random-mixup", name: "Random Mix-up" },
  { id: "sunset-glow", name: "Sunset Glow" },
  { id: "berry-fusion", name: "Berry Fusion" },
  { id: "midnight-aurora", name: "Midnight Aurora" },
  { id: "maori-kaupapa", name: "Māori Kaupapa" },
];

export const FloatingActionButtons = ({ selectedTheme, onThemeChange }: FloatingActionButtonsProps) => {
  const navigate = useNavigate();
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];

  return (
    <>
      <PdfGenerationDialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen} />
      <div className="fixed top-4 right-4 z-50 bg-primary px-3 py-3 rounded-xl shadow-2xl border border-black flex flex-col items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex flex-col items-center gap-1 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg p-2 transition-colors"
              title={`Current theme: ${currentTheme.name}`}
            >
              <Palette className="h-6 w-6" />
              <span className="text-[10px] font-medium leading-tight">Theme</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="z-[100] bg-background" align="end">
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.id}
                onClick={() => onThemeChange(theme.id)}
                className={selectedTheme === theme.id ? "bg-accent font-medium" : ""}
              >
                {theme.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={() => setPdfDialogOpen(true)}
          className="flex flex-col items-center gap-1 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg p-2 transition-colors"
          title="Generate PDF"
        >
          <FileText className="h-6 w-6" />
          <span className="text-[10px] font-medium leading-tight">PDF</span>
        </button>
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center gap-1 text-primary-foreground hover:bg-primary-foreground/20 rounded-lg p-2 transition-colors"
          title="Home"
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium leading-tight">Home</span>
        </button>
      </div>
    </>
  );
};
