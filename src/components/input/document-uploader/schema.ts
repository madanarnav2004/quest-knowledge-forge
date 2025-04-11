
import { z } from "zod";

export const documentUploaderSchema = z.object({
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

export type DocumentUploaderFormValues = z.infer<typeof documentUploaderSchema>;
