
import React from 'react';
import DocumentUploader from './DocumentUploader';
import DocumentsList from './DocumentsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const InputDashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Document Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Uploader */}
        <div className="lg:col-span-1">
          <DocumentUploader />
        </div>
        
        {/* Documents List */}
        <div className="lg:col-span-2">
          <DocumentsList />
        </div>
      </div>
    </div>
  );
};

export default InputDashboard;
