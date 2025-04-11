
export type Document = {
  id: string;
  title: string;
  document_type: string;
  status: string;
  created_at: string;
  file_path: string;
  description?: string;
  tags?: string[];
  ocr_enabled?: boolean;
  summarization_enabled?: boolean;
  size?: number;
  word_count?: number;
  vector_embedded?: boolean;
};

export type DocumentAnalytics = {
  totalDocuments: number;
  processingDocuments: number;
  completedDocuments: number;
  failedDocuments: number;
  byType: Record<string, number>;
  totalSize: number;
};
