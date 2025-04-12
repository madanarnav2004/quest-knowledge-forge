
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

    // Trigger document processing with retry mechanism
    const maxRetries = 3;
    let processingError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Processing document attempt ${attempt + 1}/${maxRetries}`);
        const response = await supabase.functions.invoke('process-document', {
          body: { documentId: documentData.id }
        });
        
        if (response.error) {
          console.error(`Processing error on attempt ${attempt + 1}:`, response.error);
          processingError = response.error;
        } else {
          // Processing succeeded
          processingError = null;
          break;
        }
      } catch (error) {
        console.error(`Error on attempt ${attempt + 1}:`, error);
        processingError = error;
      }
      
      // If this wasn't the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    if (processingError) {
      console.error("Processing error after all retries:", processingError);
      toast.error("Document uploaded but processing failed. Please try again later.");
    } else {
      toast.success("Document uploaded and being processed");
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
    
    // Trigger document processing with retry mechanism
    const maxRetries = 3;
    let processingError = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`Reprocessing document attempt ${attempt + 1}/${maxRetries}`);
        const response = await supabase.functions.invoke('process-document', {
          body: { documentId }
        });
        
        if (response.error) {
          console.error(`Reprocessing error on attempt ${attempt + 1}:`, response.error);
          processingError = response.error;
        } else {
          // Processing succeeded
          processingError = null;
          break;
        }
      } catch (error) {
        console.error(`Error on attempt ${attempt + 1}:`, error);
        processingError = error;
      }
      
      // If this wasn't the last attempt, wait before retrying
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    if (processingError) {
      throw processingError;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Reprocessing error:", error);
    throw error;
  }
};
