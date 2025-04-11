
import React from "react";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface DocumentStatusIconProps {
  status: string;
}

export const DocumentStatusIcon: React.FC<DocumentStatusIconProps> = ({ status }) => {
  switch (status) {
    case 'processing':
      return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
    case 'failed':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    default:
      return <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />;
  }
};
