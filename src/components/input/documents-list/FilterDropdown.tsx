
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter, FileText, FilePen, FileCode } from "lucide-react";

interface FilterDropdownProps {
  onFilterChange: (type: string | null) => void;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({ onFilterChange }) => {
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
        <DropdownMenuItem onClick={() => onFilterChange('pdf')}>
          <FileText className="h-4 w-4 text-red-500 mr-2" />
          PDF Documents
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('markdown')}>
          <FilePen className="h-4 w-4 text-blue-500 mr-2" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange('code')}>
          <FileCode className="h-4 w-4 text-purple-500 mr-2" />
          Code Files
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onFilterChange(null)}>
          Clear Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
