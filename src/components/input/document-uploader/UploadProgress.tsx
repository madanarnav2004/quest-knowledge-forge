
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
}

export const UploadProgress = ({ isUploading, uploadProgress }: UploadProgressProps) => {
  if (!isUploading || uploadProgress <= 0) return null;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Uploading...</span>
        <span>{Math.round(uploadProgress)}%</span>
      </div>
      <Progress value={uploadProgress} />
      <p className="text-xs text-gray-500">
        {uploadProgress < 100 ? 'Transferring file...' : 'Processing document...'}
      </p>
    </div>
  );
};
