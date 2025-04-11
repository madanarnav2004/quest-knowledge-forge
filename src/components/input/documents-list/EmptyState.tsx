
import React from "react";
import { File } from "lucide-react";

interface EmptyStateProps {
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchQuery }) => {
  return (
    <TableRow>
      <TableCell colSpan={6} className="text-center py-8">
        <div className="flex flex-col items-center">
          <File className="h-8 w-8 text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No documents found</p>
          {searchQuery && (
            <p className="text-xs text-slate-400 mt-1">
              Try a different search term or clear filters
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

import { TableCell, TableRow } from "@/components/ui/table";
