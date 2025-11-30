import { useState, useRef } from "react";
import { Plus, Trash2, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWithPrompt } from "./FieldWithPrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  key: string;
  label: string;
  type?: "text" | "textarea";
}

interface Attachment {
  name: string;
  url: string;
  uploadedAt: string;
}

interface TableFieldProps {
  label: string;
  columns: Column[];
  value: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
  prompt?: string;
  attachments?: Attachment[];
  onAttachmentsChange?: (attachments: Attachment[]) => void;
  readOnly?: boolean;
}

export const TableField = ({ 
  label, 
  columns, 
  value, 
  onChange, 
  prompt,
  attachments = [],
  onAttachmentsChange,
  readOnly = false
}: TableFieldProps) => {
  const [rows, setRows] = useState<Record<string, string>[]>(value.length > 0 ? value : [{}]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddRow = () => {
    const newRows = [...rows, {}];
    setRows(newRows);
    onChange(newRows);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange(newRows);
  };

  const handleCellChange = (rowIndex: number, columnKey: string, cellValue: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnKey]: cellValue };
    setRows(newRows);
    onChange(newRows);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onAttachmentsChange) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to upload attachments");
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('table-attachments')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('table-attachments')
        .getPublicUrl(fileName);

      const newAttachment: Attachment = {
        name: file.name,
        url: publicUrl,
        uploadedAt: new Date().toISOString()
      };

      onAttachmentsChange([...attachments, newAttachment]);
      toast.success("Attachment uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload attachment");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    if (!onAttachmentsChange) return;
    const newAttachments = attachments.filter((_, i) => i !== index);
    onAttachmentsChange(newAttachments);
    toast.success("Attachment removed");
  };

  return (
    <FieldWithPrompt label={label} prompt={prompt}>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              {!readOnly && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.type === "textarea" ? (
                      <Textarea
                        value={row[col.key] || ""}
                        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                        className="min-h-[60px]"
                        disabled={readOnly}
                      />
                    ) : (
                      <Input
                        value={row[col.key] || ""}
                        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                        disabled={readOnly}
                      />
                    )}
                  </TableCell>
                ))}
                {!readOnly && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRow(rowIndex)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Attachments section */}
        {attachments.length > 0 && (
          <div className="p-2 border-t bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Attachments</p>
            <div className="flex flex-wrap gap-2">
              {attachments.map((attachment, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-1 bg-background border rounded-md px-2 py-1 text-sm"
                >
                  <FileText className="h-3 w-3 text-muted-foreground" />
                  <a 
                    href={attachment.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline max-w-[150px] truncate"
                  >
                    {attachment.name}
                  </a>
                  {!readOnly && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!readOnly && (
          <div className="p-2 border-t flex justify-between items-center gap-2">
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleUploadClick}
                disabled={uploading || !onAttachmentsChange}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : "Upload Attachment"}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleAddRow}>
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </div>
        )}
      </div>
    </FieldWithPrompt>
  );
};
