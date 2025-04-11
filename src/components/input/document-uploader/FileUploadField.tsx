
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, UploadCloud } from "lucide-react";

interface FileUploadFieldProps {
  field: {
    value: FileList | null;
    onChange: (value: FileList | null) => void;
  };
}

export const FileUploadField = ({ field }: FileUploadFieldProps) => {
  return (
    <FormItem>
      <FormLabel>Upload File</FormLabel>
      <FormControl>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2">
          {field.value && field.value.length > 0 ? (
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-500" />
              <span>{field.value[0].name}</span>
              <span className="text-sm text-gray-500">
                ({Math.round(field.value[0].size / 1024)} KB)
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
              field.onChange(e.target.files);
            }}
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
  );
};
