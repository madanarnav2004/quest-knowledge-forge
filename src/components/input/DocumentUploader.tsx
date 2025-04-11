
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, FileText, File, Code, BarChart, Check, Link, Book, MessageSquare } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  documentType: z.enum(["pdf", "markdown", "text", "code", "excel", "presentation", "audio", "video"], {
    required_error: "Please select a document type",
  }),
  enableOCR: z.boolean().default(false),
  enableSummarization: z.boolean().default(true),
  file: z.instanceof(FileList).refine((files) => files.length > 0, {
    message: "Please select a file",
  }),
  tags: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const DocumentUploader = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [urlInput, setUrlInput] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      documentType: "pdf",
      enableOCR: false,
      enableSummarization: true,
      tags: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
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
      const file = data.file[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Simulate progress updates
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 10;
          if (progress >= 90) {
            clearInterval(interval);
            progress = 90;
          }
          setUploadProgress(Math.min(progress, 90));
        }, 300);
        
        return interval;
      };
      
      const progressInterval = simulateProgress();

      // Upload file to Supabase storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      clearInterval(progressInterval);
      setUploadProgress(100);

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
                <FormMessage />
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-red-500" />
                          PDF Document
                        </div>
                      </SelectItem>
                      <SelectItem value="markdown">
                        <div className="flex items-center">
                          <Book className="h-4 w-4 mr-2 text-blue-500" />
                          Markdown
                        </div>
                      </SelectItem>
                      <SelectItem value="text">
                        <div className="flex items-center">
                          <File className="h-4 w-4 mr-2 text-gray-500" />
                          Plain Text
                        </div>
                      </SelectItem>
                      <SelectItem value="code">
                        <div className="flex items-center">
                          <Code className="h-4 w-4 mr-2 text-purple-500" />
                          Code File
                        </div>
                      </SelectItem>
                      <SelectItem value="excel">
                        <div className="flex items-center">
                          <BarChart className="h-4 w-4 mr-2 text-green-500" />
                          Spreadsheet
                        </div>
                      </SelectItem>
                      <SelectItem value="presentation">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-amber-500" />
                          Presentation
                        </div>
                      </SelectItem>
                      <SelectItem value="audio">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 text-indigo-500" />
                          Audio
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-pink-500" />
                          Video
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the type of document you're uploading
                  </FormDescription>
                  <FormMessage />
                </FormItem>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Processing Options</h3>
            
            <FormField
              control={form.control}
              name="enableOCR"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Enable OCR</FormLabel>
                    <FormDescription>
                      Extract text from images and scanned PDFs
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enableSummarization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-3 space-y-0 rounded-md border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Enable Summarization</FormLabel>
                    <FormDescription>
                      Automatically generate a summary of the document
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
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
              render={({ field: { onChange, value, ...rest } }) => (
                <FormItem>
                  <FormLabel>Upload File</FormLabel>
                  <FormControl>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      {value && value.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <FileText className="h-6 w-6 text-blue-500" />
                          <span>{value[0].name}</span>
                          <span className="text-sm text-gray-500">
                            ({Math.round(value[0].size / 1024)} KB)
                          </span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="h-10 w-10 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Drag and drop your file here or click to browse
                          </p>
                          <p className="text-xs text-gray-400">
                            Supports PDF, DOCX, TXT, MD, CSV, and more (up to 20MB)
                          </p>
                        </>
                      )}
                      <Input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={(e) => {
                          onChange(e.target.files);
                        }}
                        {...rest}
                      />
                      <label htmlFor="file-upload">
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          Select File
                        </Button>
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} />
              <p className="text-xs text-gray-500">
                {uploadProgress < 100 ? 'Transferring file...' : 'Processing document...'}
              </p>
            </div>
          )}
          
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
