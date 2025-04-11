
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BarChart, Book, Code, File, FileText, MessageSquare } from "lucide-react";

interface DocumentTypeSelectorProps {
  field: {
    value: string;
    onChange: (value: string) => void;
  };
}

export const DocumentTypeSelector = ({ field }: DocumentTypeSelectorProps) => {
  return (
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
  );
};
