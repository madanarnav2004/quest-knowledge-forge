
import React from 'react';
import KnowledgeGraphVisualization from './knowledge-graph/KnowledgeGraphVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network } from 'lucide-react';

const KnowledgeGraphPreview = () => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Network className="mr-2 h-5 w-5" />
          Knowledge Graph Preview
        </CardTitle>
        <CardDescription>
          Visual representation of your document knowledge base
        </CardDescription>
      </CardHeader>
      <CardContent>
        <KnowledgeGraphVisualization />
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraphPreview;
