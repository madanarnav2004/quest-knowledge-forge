
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, FileText, FilePen, FileCode } from "lucide-react";

interface FilterDropdownProps {
  currentFilter: string | null;
  setCurrentFilter: (type: string | null) => void;
  documentTypes: string[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  currentFilter, 
  setCurrentFilter, 
  documentTypes 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Filter className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setCurrentFilter('pdf')}>
          <FileText className="h-4 w-4 text-red-500 mr-2" />
          PDF Documents
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentFilter('markdown')}>
          <FilePen className="h-4 w-4 text-blue-500 mr-2" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentFilter('code')}>
          <FileCode className="h-4 w-4 text-purple-500 mr-2" />
          Code Files
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrentFilter(null)}>
          Clear Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
