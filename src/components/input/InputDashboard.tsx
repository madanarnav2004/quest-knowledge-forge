
import React, { useState } from 'react';
import DocumentUploader from './DocumentUploader';
import DocumentsList from './DocumentsList';
import GitHubConnector from './GitHubConnector';
import KnowledgeGraphPreview from './KnowledgeGraphPreview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Database, GitBranch, Network } from 'lucide-react';

const InputDashboard = () => {
  const [activeTab, setActiveTab] = useState('documents');
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Knowledge Sources</h1>
      
      <Tabs defaultValue="documents" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-[500px]">
          <TabsTrigger value="documents" className="flex items-center">
            <Database className="mr-2 h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="github" className="flex items-center">
            <GitBranch className="mr-2 h-4 w-4" />
            GitHub
          </TabsTrigger>
          <TabsTrigger value="knowledge-graph" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            Knowledge Graph
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="github" className="space-y-6">
          <GitHubConnector />
        </TabsContent>
        
        <TabsContent value="knowledge-graph" className="space-y-6">
          <KnowledgeGraphPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InputDashboard;
