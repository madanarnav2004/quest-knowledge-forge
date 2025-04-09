
import React from 'react';
import Layout from '@/components/Layout';
import ChatInterface from '@/components/qa/ChatInterface';
import { Card } from '@/components/ui/card';

const QAPage = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <Card className="flex flex-col h-[calc(100vh-180px)]">
          <ChatInterface />
        </Card>
      </div>
    </Layout>
  );
};

export default QAPage;
