
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { GitBranch, GitFork, GitHub, GitMerge, GitPullRequest, Lock, Star, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const githubFormSchema = z.object({
  repositoryUrl: z.string().url({ message: "Please enter a valid GitHub repository URL" }),
  accessToken: z.string().min(1, { message: "Personal access token is required" }),
  includeIssues: z.boolean().default(true),
  includePullRequests: z.boolean().default(true),
  includeWiki: z.boolean().default(false),
  includeREADME: z.boolean().default(true),
  privateRepository: z.boolean().default(false),
});

type GitHubFormValues = z.infer<typeof githubFormSchema>;

const GitHubConnector = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [connectedRepos, setConnectedRepos] = useState<any[]>([]);
  
  const form = useForm<GitHubFormValues>({
    resolver: zodResolver(githubFormSchema),
    defaultValues: {
      repositoryUrl: '',
      accessToken: '',
      includeIssues: true,
      includePullRequests: true,
      includeWiki: false,
      includeREADME: true,
      privateRepository: false,
    },
  });

  const onSubmit = async (data: GitHubFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to connect repositories",
        variant: "destructive",
      });
      return;
    }

    setConnecting(true);
    try {
      // Extract repo info from URL
      const repoUrl = new URL(data.repositoryUrl);
      const pathParts = repoUrl.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length < 2 || repoUrl.hostname !== 'github.com') {
        throw new Error('Invalid GitHub repository URL');
      }
      
      const owner = pathParts[0];
      const repo = pathParts[1];
      
      // Simulate API call to connect to GitHub
      // In a real implementation, we would use the GitHub API
      setTimeout(() => {
        const newRepo = {
          id: Date.now().toString(),
          owner,
          repo,
          url: data.repositoryUrl,
          includeIssues: data.includeIssues,
          includePullRequests: data.includePullRequests,
          includeWiki: data.includeWiki,
          includeREADME: data.includeREADME,
          private: data.privateRepository,
          stars: Math.floor(Math.random() * 1000),
          forks: Math.floor(Math.random() * 100),
          status: 'indexing',
          lastSynced: new Date().toISOString(),
        };
        
        setConnectedRepos(prev => [newRepo, ...prev]);
        
        toast({
          title: "Repository connected",
          description: `Successfully connected ${owner}/${repo}`,
        });
        
        form.reset();
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "An error occurred while connecting to GitHub",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GitHub className="mr-2 h-5 w-5" />
              Connect GitHub Repository
            </CardTitle>
            <CardDescription>
              Add source code repositories to your knowledge base
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="repositoryUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repository URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username/repository" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the full URL of the GitHub repository
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="accessToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Personal Access Token</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="ghp_xxxxxxxxxxxx" {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a GitHub token with repo access
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="privateRepository"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Private Repository</FormLabel>
                        <FormDescription>
                          This repository requires authentication
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <Separator />
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Data to Include</h3>
                  
                  <FormField
                    control={form.control}
                    name="includeREADME"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>README and Documentation</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeIssues"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Issues</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includePullRequests"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Pull Requests</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="includeWiki"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Wiki Pages</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                
                <Button type="submit" disabled={connecting} className="w-full">
                  {connecting ? 'Connecting...' : 'Connect Repository'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>
              Manage your GitHub repositories integrated with the knowledge base
            </CardDescription>
            <Tabs defaultValue="active" className="w-full">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {connectedRepos.length === 0 ? (
              <div className="text-center py-8">
                <GitHub className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium">No repositories connected</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Connect your first GitHub repository to enhance your knowledge base
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {connectedRepos.map((repo) => (
                  <div key={repo.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center mb-2">
                          <GitHub className="h-5 w-5 mr-2 text-slate-600" />
                          <a 
                            href={repo.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                          >
                            {repo.owner}/{repo.repo}
                          </a>
                          {repo.private && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            <span>{repo.stars}</span>
                          </div>
                          <div className="flex items-center">
                            <GitFork className="h-4 w-4 mr-1" />
                            <span>{repo.forks}</span>
                          </div>
                          <div>
                            Last synced: {new Date(repo.lastSynced).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Badge className={
                          repo.status === 'active' ? 'bg-green-100 text-green-800' : 
                          repo.status === 'indexing' ? 'bg-amber-100 text-amber-800' : 
                          'bg-slate-100 text-slate-800'
                        }>
                          {repo.status === 'active' ? 'Active' : 
                           repo.status === 'indexing' ? 'Indexing' : 
                           'Error'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${repo.includeREADME ? 'bg-green-500' : 'bg-slate-300'} mr-2`}></div>
                        <span>Documentation</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${repo.includeIssues ? 'bg-green-500' : 'bg-slate-300'} mr-2`}></div>
                        <span>Issues</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${repo.includePullRequests ? 'bg-green-500' : 'bg-slate-300'} mr-2`}></div>
                        <span>Pull Requests</span>
                      </div>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full ${repo.includeWiki ? 'bg-green-500' : 'bg-slate-300'} mr-2`}></div>
                        <span>Wiki</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">Sync Now</Button>
                      <Button variant="outline" size="sm" className="text-red-500">Disconnect</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GitHubConnector;
