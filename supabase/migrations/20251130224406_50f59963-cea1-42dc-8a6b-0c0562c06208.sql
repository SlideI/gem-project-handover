-- Create storage bucket for table attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('table-attachments', 'table-attachments', true);

-- Create policies for table attachments bucket
CREATE POLICY "Users can view their own attachments"
ON storage.objects
FOR SELECT
USING (bucket_id = 'table-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own attachments"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'table-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own attachments"
ON storage.objects
FOR DELETE
USING (bucket_id = 'table-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);