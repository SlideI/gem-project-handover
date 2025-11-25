import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldWithPrompt } from "./FieldWithPrompt";
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

interface TableFieldProps {
  label: string;
  columns: Column[];
  value: Record<string, string>[];
  onChange: (value: Record<string, string>[]) => void;
  prompt?: string;
}

export const TableField = ({ label, columns, value, onChange, prompt }: TableFieldProps) => {
  const [rows, setRows] = useState<Record<string, string>[]>(value.length > 0 ? value : [{}]);

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

  return (
    <FieldWithPrompt label={label} prompt={prompt}>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>{col.label}</TableHead>
              ))}
              <TableHead className="w-[50px]"></TableHead>
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
                      />
                    ) : (
                      <Input
                        value={row[col.key] || ""}
                        onChange={(e) => handleCellChange(rowIndex, col.key, e.target.value)}
                      />
                    )}
                  </TableCell>
                ))}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" onClick={handleAddRow} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>
        </div>
      </div>
    </FieldWithPrompt>
  );
};
