
import React from "react";
import { DocumentAnalytics } from "./types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Download, Loader2, CheckCircle } from "lucide-react";
import { getDocumentIcon, formatFileSize } from "./utils";

interface DocumentsAnalyticsProps {
  analytics: DocumentAnalytics;
}

export const DocumentsAnalytics: React.FC<DocumentsAnalyticsProps> = ({ analytics }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Document Analytics</CardTitle>
            <CardDescription>
              Overview of your knowledge base documents
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-500">Total Documents</p>
            <p className="text-2xl font-bold">{analytics.totalDocuments}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600">Processed</p>
            <p className="text-2xl font-bold">{analytics.completedDocuments}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <p className="text-sm text-amber-600">Processing</p>
            <p className="text-2xl font-bold">{analytics.processingDocuments}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg text-center">
            <p className="text-sm text-slate-600">Total Size</p>
            <p className="text-2xl font-bold">{formatFileSize(analytics.totalSize)}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Documents by Type</h3>
            <div className="space-y-3">
              {Object.entries(analytics.byType).map(([type, count]) => (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      {getDocumentIcon(type)}
                      <span className="ml-2 text-sm capitalize">{type}</span>
                    </div>
                    <span className="text-sm">{count} files</span>
                  </div>
                  <Progress 
                    value={(count / analytics.totalDocuments) * 100} 
                    className="h-1" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Processing Status</h3>
            <div className="h-36 p-4 rounded-lg bg-slate-50 flex items-center justify-center">
              <div className="text-sm text-center text-slate-500">
                {analytics.processingDocuments > 0 ? (
                  <>
                    <Loader2 className="h-10 w-10 text-primary mx-auto mb-2 animate-spin" />
                    <p>Processing {analytics.processingDocuments} documents</p>
                    <p className="text-xs mt-1">This may take a few minutes</p>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                    <p>All documents are processed</p>
                    <p className="text-xs mt-1">Your knowledge base is up to date</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
