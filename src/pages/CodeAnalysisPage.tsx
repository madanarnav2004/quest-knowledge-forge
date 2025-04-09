
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GitBranch, Code, FileCode, GitPullRequest, GitCompare, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const CodeAnalysisPage = () => {
  // Sample repositories data
  const repositories = [
    { 
      name: 'quest-knowledge-api', 
      language: 'TypeScript',
      lastAnalyzed: '2 hours ago',
      status: 'analyzed',
      coverage: 87,
      issues: 3
    },
    { 
      name: 'knowledge-indexer', 
      language: 'Python',
      lastAnalyzed: '1 day ago',
      status: 'analyzed',
      coverage: 92,
      issues: 1
    },
    { 
      name: 'frontend-client', 
      language: 'TypeScript',
      lastAnalyzed: '3 days ago',
      status: 'analyzed',
      coverage: 78,
      issues: 7
    },
    { 
      name: 'data-processor', 
      language: 'Go',
      lastAnalyzed: 'Never',
      status: 'pending',
      coverage: 0,
      issues: 0
    },
  ];

  // Sample code quality issues
  const codeIssues = [
    {
      repository: 'quest-knowledge-api',
      file: 'src/services/auth.ts',
      line: 132,
      severity: 'high',
      description: 'Unhandled promise rejection could lead to memory leaks',
      type: 'performance'
    },
    {
      repository: 'quest-knowledge-api',
      file: 'src/utils/database.ts',
      line: 87,
      severity: 'medium',
      description: 'Query missing parameterization, potential SQL injection risk',
      type: 'security'
    },
    {
      repository: 'frontend-client',
      file: 'src/components/UserProfile.tsx',
      line: 45,
      severity: 'medium',
      description: 'Unnecessary re-renders due to missing dependency array in useEffect',
      type: 'performance'
    },
    {
      repository: 'knowledge-indexer',
      file: 'indexer/process.py',
      line: 213,
      severity: 'low',
      description: 'Unused import statement',
      type: 'code-cleanliness'
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Code Analysis</h1>
          <Button>
            <GitBranch className="mr-2 h-4 w-4" />
            Connect Repository
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Code Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-knowledge-accent" />
                Repository Overview
              </CardTitle>
              <CardDescription>Code health metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Repositories</p>
                  <p className="text-2xl font-bold">{repositories.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Languages</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Issues</p>
                  <p className="text-2xl font-bold text-amber-600">11</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-500">Avg. Coverage</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Issues */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Code Issues
              </CardTitle>
              <CardDescription>Key issues that need attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {codeIssues.slice(0, 3).map((issue, index) => (
                  <div key={index} className="flex border border-slate-200 rounded-md p-3">
                    <div className="mr-4">
                      <div className={`w-2 h-full rounded-full ${
                        issue.severity === 'high' ? 'bg-red-500' : 
                        issue.severity === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-100">
                          {issue.repository}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-100">
                          {issue.file}:{issue.line}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm">{issue.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`
                          ${issue.type === 'security' ? 'bg-red-100 text-red-800' : 
                            issue.type === 'performance' ? 'bg-purple-100 text-purple-800' : 
                            'bg-slate-100 text-slate-800'}
                        `}>
                          {issue.type}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          Severity: {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Button variant="ghost" size="sm">
                        <FileCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View All Issues
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Repository List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-knowledge-accent" />
              Connected Repositories
            </CardTitle>
            <CardDescription>
              Repositories connected for code analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-12 bg-slate-50 p-3 text-sm font-medium">
                <div className="col-span-4">Repository</div>
                <div className="col-span-2">Language</div>
                <div className="col-span-2">Last Analyzed</div>
                <div className="col-span-2">Coverage</div>
                <div className="col-span-1">Issues</div>
                <div className="col-span-1">Actions</div>
              </div>
              {repositories.map((repo, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-12 p-3 text-sm border-t items-center"
                >
                  <div className="col-span-4 flex items-center">
                    <GitBranch className="h-4 w-4 mr-2 text-slate-600" />
                    {repo.name}
                    {repo.status === 'pending' && (
                      <Badge className="ml-2 bg-amber-100 text-amber-800">
                        Pending
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-2">{repo.language}</div>
                  <div className="col-span-2 text-slate-600">{repo.lastAnalyzed}</div>
                  <div className="col-span-2">
                    {repo.status === 'pending' ? (
                      <span className="text-slate-400">Not available</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Progress value={repo.coverage} className="h-2 w-24" />
                        <span className={`text-xs ${
                          repo.coverage > 85 ? 'text-green-600' : 
                          repo.coverage > 70 ? 'text-amber-600' : 'text-red-600' 
                        }`}>
                          {repo.coverage}%
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="col-span-1">
                    {repo.status === 'pending' ? (
                      <span className="text-slate-400">-</span>
                    ) : (
                      <Badge className={`${
                        repo.issues > 5 ? 'bg-red-100 text-red-800' : 
                        repo.issues > 0 ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {repo.issues}
                      </Badge>
                    )}
                  </div>
                  <div className="col-span-1 flex gap-1">
                    {repo.status === 'pending' ? (
                      <Button size="icon" variant="ghost">
                        <GitPullRequest className="h-4 w-4" />
                      </Button>
                    ) : (
                      <>
                        <Button size="icon" variant="ghost">
                          <GitCompare className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Code className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CodeAnalysisPage;
