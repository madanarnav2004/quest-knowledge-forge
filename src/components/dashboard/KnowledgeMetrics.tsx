
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { BookOpen, Brain, Database, FileText, GitBranch, MessageSquare } from 'lucide-react';

const KnowledgeMetrics: React.FC = () => {
  // Sample data for charts
  const knowledgeGrowthData = [
    { name: 'Jan', documents: 250, code: 180, meetings: 120 },
    { name: 'Feb', documents: 300, code: 200, meetings: 150 },
    { name: 'Mar', documents: 400, code: 280, meetings: 170 },
    { name: 'Apr', documents: 500, code: 350, meetings: 220 },
    { name: 'May', documents: 620, code: 410, meetings: 260 },
    { name: 'Jun', documents: 750, code: 490, meetings: 310 },
  ];

  const queryData = [
    { name: 'Architecture', queries: 124 },
    { name: 'APIs', queries: 85 },
    { name: 'Security', queries: 42 },
    { name: 'Database', queries: 70 },
    { name: 'Frontend', queries: 65 },
    { name: 'DevOps', queries: 30 },
  ];

  const stats = [
    { 
      title: 'Knowledge Artifacts', 
      value: '1,248', 
      description: 'Total documents processed',
      icon: <FileText className="h-5 w-5 text-knowledge-primary" />,
      change: '+12% from last month'
    },
    { 
      title: 'Code Repositories', 
      value: '36', 
      description: 'GitHub repositories connected',
      icon: <GitBranch className="h-5 w-5 text-knowledge-primary" />,
      change: '+2 new repos'
    },
    { 
      title: 'Knowledge Base', 
      value: '842', 
      description: 'Indexed knowledge entries',
      icon: <Database className="h-5 w-5 text-knowledge-primary" />,
      change: 'Growing steadily'
    },
    { 
      title: 'Queries Answered', 
      value: '2,156', 
      description: 'Questions processed this month',
      icon: <MessageSquare className="h-5 w-5 text-knowledge-primary" />,
      change: '+28% user engagement'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              <p className="text-xs text-knowledge-accent mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-knowledge-accent" />
              Knowledge Growth
            </CardTitle>
            <CardDescription>
              Cumulative knowledge artifacts over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={knowledgeGrowthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="documents" 
                    stackId="1"
                    stroke="#0D9488" 
                    fill="#0D9488" 
                    fillOpacity={0.6} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="code" 
                    stackId="1"
                    stroke="#0F172A" 
                    fill="#0F172A" 
                    fillOpacity={0.6} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="meetings" 
                    stackId="1"
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-knowledge-accent" />
              Query Distribution
            </CardTitle>
            <CardDescription>
              Most frequent knowledge areas queried
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={queryData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="queries" 
                    fill="#0D9488" 
                    fillOpacity={0.8} 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeMetrics;
