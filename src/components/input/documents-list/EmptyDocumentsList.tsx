
import React from "react";
import { File } from "lucide-react";

export const EmptyDocumentsList: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6 border text-center">
      <File className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium">No documents found</h3>
      <p className="text-sm text-gray-500 mt-2">
        Upload your first document to start building your knowledge base
      </p>
    </div>
  );
};
