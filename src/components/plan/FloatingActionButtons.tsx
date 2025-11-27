import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, FileText, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PdfGenerationDialog } from "./PdfGenerationDialog";
import { ThemeSelector } from "./ThemeSelector";

interface FloatingActionButtonsProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export const FloatingActionButtons = ({ selectedTheme, onThemeChange }: FloatingActionButtonsProps) => {
  const navigate = useNavigate();
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);

  return (
    <>
      <PdfGenerationDialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen} />
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeSelector selectedTheme={selectedTheme} onThemeChange={onThemeChange} />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPdfDialogOpen(true)}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
          title="Generate PDF"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
          className="bg-background/80 backdrop-blur-sm hover:bg-background"
          title="Home"
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};
