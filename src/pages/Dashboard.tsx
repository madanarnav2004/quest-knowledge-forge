
import React from 'react';
import Layout from '@/components/Layout';
import KnowledgeMetrics from '@/components/dashboard/KnowledgeMetrics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  MessageSquare, 
  BrainCircuit, 
  AlertTriangle,  // Changed from Alert to AlertTriangle
  BarChart, 
  LayoutDashboard, 
  GitBranch, 
  Database
} from 'lucide-react';

const Dashboard = () => {
  // Activity feed data
  const activityFeed = [
    { 
      id: 1, 
      type: 'document', 
      title: 'API Documentation', 
      description: 'New documentation processed', 
      time: '2 hours ago',
      icon: <FileText className="h-4 w-4 text-blue-500" />
    },
    { 
      id: 2, 
      type: 'query', 
      title: 'Authentication Flow', 
      description: 'Frequently asked query', 
      time: '4 hours ago',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />
    },
    { 
      id: 3, 
      type: 'gap', 
      title: 'Deployment Process', 
      description: 'Knowledge gap identified', 
      time: '1 day ago',
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" /> // Changed from Alert to AlertTriangle
    },
    { 
      id: 4, 
      type: 'code', 
      title: 'auth-service', 
      description: 'Repository indexed', 
      time: '2 days ago',
      icon: <GitBranch className="h-4 w-4 text-purple-500" />
    },
  ];

  // Knowledge gaps
  const knowledgeGaps = [
    { title: 'Mobile Authentication Flow', category: 'Security', priority: 'High' },
    { title: 'Deployment to Staging', category: 'DevOps', priority: 'Medium' },
    { title: 'Database Backup Procedures', category: 'Operations', priority: 'High' },
  ];

  // Quick actions
  const quickActions = [
    { title: 'Add GitHub Repository', icon: <GitBranch className="h-5 w-5" /> },
    { title: 'Upload Documentation', icon: <FileText className="h-5 w-5" /> },
    { title: 'Connect Meeting Source', icon: <MessageSquare className="h-5 w-5" /> },
    { title: 'View Knowledge Graph', icon: <Database className="h-5 w-5" /> },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <KnowledgeMetrics />
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-knowledge-accent" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common tasks to build your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      className="h-auto py-6 flex flex-col gap-2 border-dashed"
                    >
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        {React.cloneElement(action.icon, { className: "h-5 w-5 text-knowledge-primary" })}
                      </div>
                      <span className="text-sm font-medium">{action.title}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-knowledge-accent" />
                  Knowledge Gaps
                </CardTitle>
                <CardDescription>
                  Areas that need documentation
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
                        <h4 className="font-medium text-sm">{gap.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          gap.priority === 'High' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {gap.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Category: {gap.category}</p>
                      <Button 
                        variant="link" 
                        className="text-xs h-auto p-0 mt-2"
                      >
                        Create Documentation
                      </Button>
                    </div>
                  ))}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                  >
                    View All Knowledge Gaps
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-knowledge-accent" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest knowledge base updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center">
                        {activity.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{activity.title}</h4>
                        <p className="text-xs text-slate-500">{activity.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="link" 
                    className="text-sm px-0"
                  >
                    View All Activity
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
