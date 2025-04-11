
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Github, GitBranch, GitFork, Search, FolderGit, Settings, GitPullRequest } from "lucide-react";

const GitHubConnector = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [repos, setRepos] = useState<string[]>([]);
  
  const handleConnect = () => {
    // Mock connect to GitHub
    setIsConnected(true);
    setRepos(['knowledge-base', 'documentation', 'codebase-analysis', 'project-docs', 'learning-resources']);
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">GitHub Integration</h1>
      
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect to GitHub</CardTitle>
            <CardDescription>
              Import repositories to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/50">
              <div className="text-center space-y-3">
                <Github size={40} className="mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">Connect your GitHub account</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Link your GitHub account to import repositories, issues, PRs, and documentation to your knowledge base.
                </p>
              </div>
            </div>
            
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="access-type">Access Type</Label>
                  <Select defaultValue="public">
                    <SelectTrigger id="access-type">
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public Repositories</SelectItem>
                      <SelectItem value="private">Public & Private Repositories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="sync-frequency">
                      <SelectValue placeholder="Select sync frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="include-issues" />
                <Label htmlFor="include-issues">Include Issues & Pull Requests</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="include-wikis" defaultChecked />
                <Label htmlFor="include-wikis">Include Wiki Pages & Documentation</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Learn More</Button>
            <Button onClick={handleConnect}>
              <Github className="mr-2 h-4 w-4" />
              Connect GitHub
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>GitHub Connection</CardTitle>
                  <CardDescription>
                    Connected as @username
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="h-8">
                  <Settings className="h-3.5 w-3.5 mr-1.5" />
                  Manage Connection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">{repos.length}</div>
                  <div className="text-xs text-muted-foreground">Repositories</div>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">14</div>
                  <div className="text-xs text-muted-foreground">Recent Commits</div>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg">
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-xs text-muted-foreground">Open PRs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="repositories">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="repositories">
                <FolderGit className="h-4 w-4 mr-2" />
                Repositories
              </TabsTrigger>
              <TabsTrigger value="pull-requests">
                <GitPullRequest className="h-4 w-4 mr-2" />
                Pull Requests
              </TabsTrigger>
              <TabsTrigger value="branches">
                <GitBranch className="h-4 w-4 mr-2" />
                Branches
              </TabsTrigger>
              <TabsTrigger value="forks">
                <GitFork className="h-4 w-4 mr-2" />
                Forks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="repositories" className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search repositories..." className="pl-8" />
                </div>
                <Button>
                  <GitBranch className="mr-1 h-4 w-4" />
                  Import Repository
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {repos.map((repo, index) => (
                      <div key={index} className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-4">
                          <FolderGit className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">{repo}</div>
                            <div className="text-sm text-muted-foreground">Last updated 2 days ago</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Import</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pull-requests">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <GitPullRequest className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Pull Requests Imported</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Import Pull Requests from your repositories to enhance your knowledge base with discussions and code changes.
                    </p>
                    <Button>
                      Import Pull Requests
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="branches">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Branches Imported</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Import branches to track different versions of your codebase in the knowledge system.
                    </p>
                    <Button>
                      Import Branches
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="forks">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <GitFork className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Forks Imported</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                      Import forks to keep track of variations of your repositories.
                    </p>
                    <Button>
                      Import Forks
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default GitHubConnector;
