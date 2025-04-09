
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileText, GitBranch, Globe, MessageSquare, Clipboard, Check, X, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const InputDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  
  const integrationSources = [
    { 
      name: 'GitHub Repositories',
      icon: <GitBranch className="h-5 w-5" />,
      status: 'connected',
      count: 12,
      progress: 100
    },
    { 
      name: 'Confluence Documentation',
      icon: <Globe className="h-5 w-5" />,
      status: 'connected',
      count: 156,
      progress: 100
    },
    { 
      name: 'Jira Tickets & Boards',
      icon: <Clipboard className="h-5 w-5" />,
      status: 'connecting',
      count: 0,
      progress: 45
    },
    { 
      name: 'Meeting Transcripts',
      icon: <MessageSquare className="h-5 w-5" />,
      status: 'not_connected',
      count: 0,
      progress: 0
    },
    { 
      name: 'Google Drive Documents',
      icon: <FileText className="h-5 w-5" />,
      status: 'error',
      count: 0,
      progress: 20
    },
  ];
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'connected':
        return <div className="h-7 w-7 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="h-4 w-4 text-green-600" />
        </div>;
      case 'connecting':
        return <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
        </div>;
      case 'error':
        return <div className="h-7 w-7 rounded-full bg-red-100 flex items-center justify-center">
          <X className="h-4 w-4 text-red-600" />
        </div>;
      default:
        return <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-slate-400"></div>
        </div>;
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'connected':
        return <span className="text-green-600 font-medium">Connected</span>;
      case 'connecting':
        return <span className="text-amber-600 font-medium">Connecting...</span>;
      case 'error':
        return <span className="text-red-600 font-medium">Connection Error</span>;
      default:
        return <span className="text-slate-600">Not Connected</span>;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">Knowledge Input Sources</h2>
          <p className="text-slate-600">Connect your existing tools and content repositories to extract knowledge automatically.</p>
        </div>
        
        <Tabs defaultValue="integrations" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6 border-b border-slate-200">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Manual Upload
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Processing Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="integrations" className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrationSources.map((source, index) => (
                <Card key={index} className="border border-slate-200">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-knowledge-accent/10 flex items-center justify-center">
                          {React.cloneElement(source.icon, { className: "h-5 w-5 text-knowledge-accent" })}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{source.name}</CardTitle>
                          <CardDescription>
                            {source.status === 'connected' 
                              ? `${source.count} resources indexed` 
                              : 'Not yet indexed'}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(source.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm">{getStatusText(source.status)}</div>
                      <div className="text-sm text-slate-500">{source.progress}%</div>
                    </div>
                    <Progress value={source.progress} className="h-2" />
                    <div className="mt-4">
                      {source.status === 'connected' ? (
                        <Button variant="outline" size="sm" className="w-full">
                          Configure
                        </Button>
                      ) : source.status === 'error' ? (
                        <Button variant="destructive" size="sm" className="w-full">
                          Retry Connection
                        </Button>
                      ) : source.status === 'connecting' ? (
                        <Button variant="outline" size="sm" className="w-full" disabled>
                          Connecting...
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="w-full bg-knowledge-accent hover:bg-knowledge-accent/90"
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Integration</CardTitle>
                <CardDescription>
                  Connect additional data sources to enhance your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                    <GitBranch className="h-6 w-6 text-slate-600" />
                    <span>GitLab</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                    <Globe className="h-6 w-6 text-slate-600" />
                    <span>SharePoint</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-6 flex flex-col gap-2">
                    <MessageSquare className="h-6 w-6 text-slate-600" />
                    <span>Slack</span>
                  </Button>
                </div>
                <Button variant="link" className="w-full">View all available integrations</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload" className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Document Upload</CardTitle>
                <CardDescription>
                  Upload documents directly to your knowledge base
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-10 text-center">
                  <div className="mx-auto flex flex-col items-center">
                    <Upload className="h-10 w-10 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium mb-1">Drag files here or click to upload</h3>
                    <p className="text-sm text-slate-500 mb-4">
                      Support for PDF, DOCX, TXT, MD, and more
                    </p>
                    <Button 
                      className="bg-knowledge-accent hover:bg-knowledge-accent/90"
                    >
                      Select Files
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-3">Recent Uploads</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-knowledge-accent" />
                        <span className="text-sm">Architecture-Overview.pdf</span>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Processed</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-knowledge-accent" />
                        <span className="text-sm">API-Documentation.docx</span>
                      </div>
                      <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">Processing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Processing Settings</CardTitle>
                <CardDescription>
                  Configure how documents and code are processed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Perplexity API Configuration</h3>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-slate-500 mb-1 block">API Key</label>
                      <Input type="password" placeholder="Enter your Perplexity API key" defaultValue="●●●●●●●●●●●●●●●●" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-slate-500 mb-1 block">Model</label>
                      <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                        <option>llama-3.1-sonar-small-128k-online</option>
                        <option>llama-3.1-sonar-large-128k-online</option>
                        <option>llama-3.1-sonar-huge-128k-online</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Document Processing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">Max Chunk Size</label>
                      <Input type="number" defaultValue="4000" />
                      <p className="text-xs text-slate-500 mt-1">Maximum characters per knowledge chunk</p>
                    </div>
                    <div>
                      <label className="text-sm text-slate-500 mb-1 block">Chunk Overlap</label>
                      <Input type="number" defaultValue="200" />
                      <p className="text-xs text-slate-500 mt-1">Character overlap between chunks</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Code Repository Processing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Include Code Comments</label>
                      <div className="flex items-center h-6">
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Parse Function Definitions</label>
                      <div className="flex items-center h-6">
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Analyze Dependencies</label>
                      <div className="flex items-center h-6">
                        <input type="checkbox" className="h-4 w-4" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-knowledge-accent hover:bg-knowledge-accent/90">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InputDashboard;
