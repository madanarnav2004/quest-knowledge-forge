
import React from "react";
import { Document } from "./types";
import { FileText, FilePen, FileCode, File, BarChart, MessageSquare } from "lucide-react";

export const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'pdf':
      return React.createElement(FileText, { className: "h-5 w-5 text-red-500" });
    case 'markdown':
      return React.createElement(FilePen, { className: "h-5 w-5 text-blue-500" });
    case 'code':
      return React.createElement(FileCode, { className: "h-5 w-5 text-purple-500" });
    case 'excel':
      return React.createElement(BarChart, { className: "h-5 w-5 text-green-500" });
    case 'text':
      return React.createElement(File, { className: "h-5 w-5 text-gray-500" });
    case 'presentation':
      return React.createElement(FileText, { className: "h-5 w-5 text-amber-500" });
    case 'audio':
      return React.createElement(MessageSquare, { className: "h-5 w-5 text-indigo-500" });
    case 'video':
      return React.createElement(FileText, { className: "h-5 w-5 text-pink-500" });
    default:
      return React.createElement(File, { className: "h-5 w-5 text-gray-500" });
  }
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const formatFileSize = (sizeInKB?: number) => {
  if (!sizeInKB) return 'Unknown';
  
  if (sizeInKB < 1000) {
    return `${sizeInKB} KB`;
  } else {
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  }
};

export const filterDocuments = (
  documents: Document[], 
  searchQuery: string, 
  activeTab: string, 
  currentFilter: string | null
): Document[] => {
  let filtered = [...documents];
  
  if (searchQuery) {
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    );
  }
  
  if (activeTab === 'processing') {
    filtered = filtered.filter(doc => doc.status === 'processing');
  } else if (activeTab === 'completed') {
    filtered = filtered.filter(doc => doc.status === 'completed');
  } else if (activeTab === 'failed') {
    filtered = filtered.filter(doc => doc.status === 'failed');
  }
  
  if (currentFilter) {
    filtered = filtered.filter(doc => doc.document_type === currentFilter);
  }
  
  return filtered;
};

export const calculateAnalytics = (documents: Document[]) => {
  const byType: Record<string, number> = {};
  let totalSize = 0;
  
  documents.forEach(doc => {
    byType[doc.document_type] = (byType[doc.document_type] || 0) + 1;
    totalSize += doc.size || 0;
  });
  
  return {
    totalDocuments: documents.length,
    processingDocuments: documents.filter(doc => doc.status === 'processing').length,
    completedDocuments: documents.filter(doc => doc.status === 'completed').length,
    failedDocuments: documents.filter(doc => doc.status === 'failed').length,
    byType,
    totalSize,
  };
};
