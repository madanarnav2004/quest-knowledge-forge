
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Search, Brain, Network, BarChart3, FileText, GitBranch, MessageCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const KnowledgeBasePage = () => {
  // Sample knowledge sources
  const knowledgeSources = [
    { 
      name: 'Documentation', 
      count: 143, 
      percentage: 35,
      status: 'active'
    },
    { 
      name: 'Code Repositories', 
      count: 27, 
      percentage: 25,
      status: 'active'
    },
    { 
      name: 'Meeting Transcripts', 
      count: 65, 
      percentage: 20,
      status: 'active'
    },
    { 
      name: 'Slack Archives', 
      count: 1240, 
      percentage: 15,
      status: 'pending'
    },
    { 
      name: 'Support Tickets', 
      count: 532, 
      percentage: 5,
      status: 'active'
    },
  ];
  
  // Sample knowledge metrics
  const knowledgeMetrics = {
    totalDocuments: 2007,
    vectorsCreated: '4.3M',
    questionsAnswered: 1432,
    tokensProcessed: '28.6M',
    accuracyScore: 92,
    processingTime: '1.2s'
  };
  
  // Sample knowledge gaps
  const knowledgeGaps = [
    { topic: 'Mobile Authentication Flow', category: 'Security', frequency: 28 },
    { topic: 'Database Backup Process', category: 'DevOps', frequency: 19 },
    { topic: 'Webhook Integration Steps', category: 'API', frequency: 15 },
    { topic: 'CI/CD Pipeline Configuration', category: 'DevOps', frequency: 12 },
  ];
  
  // Sample recent questions
  const recentQuestions = [
    { 
      query: 'How do I implement OAuth authentication?',
      timestamp: '2 hours ago',
      category: 'Security',
      answerQuality: 'high'
    },
    { 
      query: 'What\'s the process for database migration?',
      timestamp: '5 hours ago',
      category: 'Database',
      answerQuality: 'medium'
    },
    { 
      query: 'How do I set up a new webhook endpoint?',
      timestamp: '1 day ago',
      category: 'API',
      answerQuality: 'high'
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Knowledge Base</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Search className="mr-2 h-4 w-4" />
              Query Knowledge
            </Button>
            <Button>
              <Database className="mr-2 h-4 w-4" />
              Add Source
            </Button>
          </div>
        </div>
        
        {/* Knowledge Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Database className="h-8 w-8 text-knowledge-accent mb-2" />
                <p className="text-sm text-slate-500">Documents</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.totalDocuments}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Brain className="h-8 w-8 text-knowledge-accent mb-2" />
                <p className="text-sm text-slate-500">Vectors</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.vectorsCreated}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <MessageCircle className="h-8 w-8 text-knowledge-accent mb-2" />
                <p className="text-sm text-slate-500">Questions</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.questionsAnswered}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Network className="h-8 w-8 text-knowledge-accent mb-2" />
                <p className="text-sm text-slate-500">Tokens</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.tokensProcessed}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
                <p className="text-sm text-slate-500">Accuracy</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.accuracyScore}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Brain className="h-8 w-8 text-purple-500 mb-2" />
                <p className="text-sm text-slate-500">Avg. Response</p>
                <p className="text-2xl font-bold">{knowledgeMetrics.processingTime}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Knowledge Sources */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-knowledge-accent" />
                Knowledge Sources
              </CardTitle>
              <CardDescription>
                Active data sources in your knowledge base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {knowledgeSources.map((source, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{source.name}</span>
                        {source.status === 'pending' && (
                          <Badge variant="outline" className="text-amber-600 bg-amber-50">
                            Processing
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">{source.count} items</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={source.percentage} className="h-2 flex-1" />
                      <span className="text-sm text-slate-500 w-10">{source.percentage}%</span>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Manage Sources
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Knowledge Gaps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-knowledge-accent" />
                Knowledge Gaps
              </CardTitle>
              <CardDescription>
                Topics missing sufficient coverage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {knowledgeGaps.map((gap, index) => (
                  <div 
                    key={index} 
                    className="p-3 rounded-md bg-slate-50 border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{gap.topic}</h4>
                      <Badge variant="outline" className="bg-slate-100">
                        {gap.frequency} requests
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Category: {gap.category}</p>
                    <Button 
                      variant="link" 
                      className="text-xs h-auto p-0 mt-2"
                    >
                      Add Documentation
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View All Gaps
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-knowledge-accent" />
              Recent Queries
            </CardTitle>
            <CardDescription>
              Questions recently asked of your knowledge base
            </CardDescription>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-3 max-w-md">
                <TabsTrigger value="all">All Queries</TabsTrigger>
                <TabsTrigger value="highQuality">High Quality</TabsTrigger>
                <TabsTrigger value="lowQuality">Low Quality</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQuestions.map((question, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <Search className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-medium">{question.query}</p>
                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        <Badge 
                          className={`
                            ${question.answerQuality === 'high' ? 'bg-green-100 text-green-800' : 
                              question.answerQuality === 'medium' ? 'bg-amber-100 text-amber-800' : 
                              'bg-red-100 text-red-800'}
                          `}
                        >
                          {question.answerQuality === 'high' ? 'High Quality' : 
                           question.answerQuality === 'medium' ? 'Medium Quality' : 'Low Quality'}
                        </Badge>
                        <span className="text-xs text-slate-500">{question.timestamp}</span>
                      </div>
                    </div>
                    <div className="flex mt-2">
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <div className="flex gap-1 ml-auto">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Brain className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                Load More Queries
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default KnowledgeBasePage;
