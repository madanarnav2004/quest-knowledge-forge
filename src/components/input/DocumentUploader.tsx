
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link, File, UploadCloud } from "lucide-react";
import { documentUploaderSchema, DocumentUploaderFormValues } from "./document-uploader/schema";
import { FileUploadField } from "./document-uploader/FileUploadField";
import { DocumentTypeSelector } from "./document-uploader/DocumentTypeSelector";
import { ProcessingOptions } from "./document-uploader/ProcessingOptions";
import { UploadProgress } from "./document-uploader/UploadProgress";
import { uploadDocument } from "./document-uploader/UploadService";

const DocumentUploader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState(false);
  
  const form = useForm<DocumentUploaderFormValues>({
    resolver: zodResolver(documentUploaderSchema),
    defaultValues: {
      title: "",
      description: "",
      documentType: "pdf",
      enableOCR: false,
      enableSummarization: true,
      tags: "",
    },
  });

  const onSubmit = async (data: DocumentUploaderFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to upload documents",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      await uploadDocument(data, user, setUploadProgress);
      
      toast({
        title: "Document uploaded",
        description: "Your document has been uploaded successfully",
      });

      // Reset the form
      form.reset();
      setUploadProgress(0);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "An error occurred during upload",
        variant: "destructive",
      });
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleUploadMethod = () => {
    setUrlInput(!urlInput);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-slate-500">Add files to your knowledge base</div>
        <Button variant="outline" size="sm" onClick={toggleUploadMethod}>
          {urlInput ? (
            <>
              <File className="h-4 w-4 mr-2" />
              Upload File
            </>
          ) : (
            <>
              <Link className="h-4 w-4 mr-2" />
              Add URL
            </>
          )}
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Document Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter document title" {...field} />
                </FormControl>
                <FormDescription>
                  Provide a descriptive title for your document
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter a brief description of this document..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <DocumentTypeSelector field={field} />
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tags, comma separated" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add tags to help organize your knowledge base
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          
          <ProcessingOptions form={form} />
          
          {urlInput ? (
            <FormItem>
              <FormLabel>Document URL</FormLabel>
              <Input type="url" placeholder="https://example.com/document.pdf" />
              <FormDescription>
                Enter the URL of the document you want to add
              </FormDescription>
            </FormItem>
          ) : (
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FileUploadField field={field} />
              )}
            />
          )}
          
          <UploadProgress isUploading={isUploading} uploadProgress={uploadProgress} />
          
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></div>
                <span>Uploading...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <UploadCloud className="mr-2 h-5 w-5" />
                <span>Upload Document</span>
              </div>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default DocumentUploader;
