
import React from "react";
import { Input } from "@/components/ui/input";
import { Eye } from "lucide-react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-64">
      <Input 
        placeholder="Search documents..." 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-8"
      />
      <Eye className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
};
