
import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UseFormReturn } from "react-hook-form";
import { DocumentUploaderFormValues } from "./schema";

interface ProcessingOptionsProps {
  form: UseFormReturn<DocumentUploaderFormValues>;
}

export const ProcessingOptions = ({ form }: ProcessingOptionsProps) => {
  return (
    <>
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
    </>
  );
};
