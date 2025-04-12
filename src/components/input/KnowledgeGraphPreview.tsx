
import React, { useState } from 'react';
import KnowledgeGraphVisualization from './knowledge-graph/KnowledgeGraphVisualization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Network, RefreshCw, Loader2 } from 'lucide-react';

const KnowledgeGraphPreview = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [key, setKey] = useState(0); // Used to force a refresh of the visualization

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Force re-render of the visualization component
    setKey(prevKey => prevKey + 1);
    // Reset refreshing state after a short delay
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center">
            <Network className="mr-2 h-5 w-5" />
            Knowledge Graph Preview
          </CardTitle>
          <CardDescription>
            Visual representation of your document knowledge base
          </CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <KnowledgeGraphVisualization key={key} />
      </CardContent>
    </Card>
  );
};

export default KnowledgeGraphPreview;
