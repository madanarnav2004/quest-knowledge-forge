
import { supabase } from "@/integrations/supabase/client";
import { DocumentUploaderFormValues } from "./schema";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

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
    const { data: documentData, error: insertError } = await supabase
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
        status: 'processing',
        size: file.size / 1024, // Convert to KB
      })
      .select('id')
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    // Trigger document processing
    try {
      const { error: processingError } = await supabase.functions.invoke('process-document', {
        body: { documentId: documentData.id }
      });
      
      if (processingError) {
        console.error("Processing error:", processingError);
        toast.error("Document uploaded but processing failed. Please try again later.");
      } else {
        toast.success("Document uploaded and being processed");
      }
    } catch (processingError) {
      console.error("Processing error:", processingError);
      toast.error("Document uploaded but processing failed. Please try again later.");
    }

    return { success: true, documentId: documentData.id };
  } catch (error) {
    clearInterval(interval);
    console.error("Upload error:", error);
    throw error;
  }
};

export const reprocessDocument = async (documentId: string) => {
  try {
    // Update document status
    const { error: updateError } = await supabase
      .from('documents')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);
      
    if (updateError) {
      throw updateError;
    }
    
    // Trigger document processing
    const { error: processingError } = await supabase.functions.invoke('process-document', {
      body: { documentId }
    });
    
    if (processingError) {
      throw processingError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Reprocessing error:", error);
    throw error;
  }
};
