
import React from "react";
import { Document } from "./types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Eye, Download, Pencil, Brain, Trash2, Clock, FileIcon } from "lucide-react";
import { getDocumentIcon, formatDate, formatFileSize } from "./utils";
import { DocumentStatusIcon } from "./DocumentStatusIcon";
import { toast } from "sonner";
import { reprocessDocument } from "../document-uploader/UploadService";

interface DocumentsTableProps {
  documents: Document[];
  onReprocess: (id: string) => void;
  onDeleteRequest: (id: string) => void;
  onRefresh: () => void;
}

export const DocumentsTable: React.FC<DocumentsTableProps> = ({ 
  documents, 
  onReprocess,
  onDeleteRequest,
  onRefresh
}) => {
  const handleReprocess = async (id: string) => {
    try {
      toast.loading("Reprocessing document...");
      await reprocessDocument(id);
      toast.dismiss();
      toast.success("Document reprocessing started");
      onRefresh();
      onReprocess(id);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to reprocess document");
      console.error("Reprocess error:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(doc.document_type)}
                    <div>
                      <div>{doc.title}</div>
                      {doc.tags && doc.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doc.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs py-0 h-5">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs py-0 h-5">
                              +{doc.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {doc.document_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DocumentStatusIcon status={doc.status} />
                    <span className="capitalize">
                      {doc.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{formatFileSize(doc.size)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(doc.created_at)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="flex items-center" 
                        onClick={() => handleReprocess(doc.id)}
                        disabled={doc.status === 'processing'}
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        Reprocess
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="flex items-center text-red-600"
                        onClick={() => onDeleteRequest(doc.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center">
                  <FileIcon className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">No documents found</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
