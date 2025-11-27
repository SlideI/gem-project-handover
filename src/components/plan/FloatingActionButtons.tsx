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
];

export const FloatingActionButtons = ({ selectedTheme, onThemeChange }: FloatingActionButtonsProps) => {
  const navigate = useNavigate();
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[0];

  return (
    <>
      <PdfGenerationDialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen} />
      <div className="fixed top-4 right-4 z-50 bg-primary px-3 py-2 rounded-lg shadow-2xl border border-black flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              title={`Current theme: ${currentTheme.name}`}
            >
              <Palette className="h-4 w-4" />
            </Button>
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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPdfDialogOpen(true)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
          title="Generate PDF"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-primary-foreground hover:bg-primary-foreground/20"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
