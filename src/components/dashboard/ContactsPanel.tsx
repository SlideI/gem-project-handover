import { useState, useEffect } from "react";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  name: string;
  url: string;
  uploadedAt: string;
  type: string;
  size: string;
  planTitle: string;
  sectionName: string;
}

const SECTION_NAMES: Record<string, string> = {
  "about-me": "About Me",
  "identity": "Identity & Cultural Needs",
  "connections": "Connections",
  "health": "Health",
  "disability": "Disability",
  "education": "Education",
  "transition": "Transition",
  "youth-justice": "Youth Justice",
  "residence": "Residence",
  "planning-with": "Planning With",
  "care-request": "Care Request",
  "summary": "Summary",
};

const getFileType = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const typeMap: Record<string, string> = {
    pdf: 'PDF',
    doc: 'Word',
    docx: 'Word',
    xls: 'Excel',
    xlsx: 'Excel',
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    txt: 'Text',
    csv: 'CSV',
  };
  return typeMap[ext] || ext.toUpperCase() || 'Unknown';
};

const formatFileSize = (url: string): string => {
  // We don't have actual file size stored, so we'll show a placeholder
  return '—';
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

export const ContactsPanel = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) return;

        // Get all plans for the user
        const { data: plans } = await supabase
          .from('plans')
          .select('id, title')
          .eq('user_id', user.user.id);

        if (!plans || plans.length === 0) {
          setLoading(false);
          return;
        }

        // Get all plan sections for all plans
        const { data: sections } = await supabase
          .from('plan_sections')
          .select('*')
          .in('plan_id', plans.map(p => p.id));

        if (!sections) {
          setLoading(false);
          return;
        }

        const allFiles: UploadedFile[] = [];

        sections.forEach(section => {
          const fields = section.fields as Record<string, unknown>;
          const plan = plans.find(p => p.id === section.plan_id);
          const planTitle = plan?.title || 'Unknown Plan';
          const sectionName = SECTION_NAMES[section.section_key] || section.section_key;

          // Look for attachment fields (they end with '-attachments')
          Object.entries(fields).forEach(([key, value]) => {
            if (key.endsWith('-attachments') && typeof value === 'string') {
              try {
                const attachments = JSON.parse(value);
                if (Array.isArray(attachments)) {
                  attachments.forEach((attachment: { name: string; url: string; uploadedAt: string }) => {
                    allFiles.push({
                      name: attachment.name,
                      url: attachment.url,
                      uploadedAt: attachment.uploadedAt,
                      type: getFileType(attachment.name),
                      size: formatFileSize(attachment.url),
                      planTitle,
                      sectionName,
                    });
                  });
                }
              } catch {
                // Invalid JSON, skip
              }
            }
          });
        });

        // Sort by upload date, newest first
        allFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        setFiles(allFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllFiles();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Uploaded Files</h3>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Plan Uploaded To</TableHead>
              <TableHead>Date Uploaded</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Loading files...
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No files uploaded yet
                </TableCell>
              </TableRow>
            ) : (
              files.map((file, index) => (
                <TableRow key={`${file.url}-${index}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="max-w-[200px] truncate" title={file.name}>
                        {file.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{file.type}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{file.planTitle}</span>
                      <span className="text-xs text-muted-foreground">{file.sectionName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
