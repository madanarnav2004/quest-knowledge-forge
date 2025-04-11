
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploaderFormValues } from "./schema";
import { User } from "@supabase/supabase-js";

export const uploadDocument = async (
  data: DocumentUploaderFormValues, 
  user: User,
  onProgressUpdate: (progress: number) => void
) => {
  const file = data.file[0];
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${user.id}/${fileName}`;
  
  // Simulate progress updates
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 90) {
      clearInterval(interval);
      progress = 90;
    }
    onProgressUpdate(Math.min(progress, 90));
  }, 300);
  
  try {
    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    clearInterval(interval);
    onProgressUpdate(100);

    if (uploadError) throw uploadError;

    // Prepare tags array if provided
    let tagsArray = [];
    if (data.tags) {
      tagsArray = data.tags.split(',').map(tag => tag.trim());
    }

    // Create document record in database
    const { error: insertError } = await supabase
      .from('documents')
      .insert({
        title: data.title,
        document_type: data.documentType,
        file_path: filePath,
        user_id: user.id,
        description: data.description || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        ocr_enabled: data.enableOCR,
        summarization_enabled: data.enableSummarization,
        status: 'processing'
      });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    return { success: true };
  } catch (error) {
    clearInterval(interval);
    throw error;
  }
};
