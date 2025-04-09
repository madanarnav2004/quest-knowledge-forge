
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Search, BookOpen, FolderOpen, User, Tags, Star, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const DocumentationPage = () => {
  // Sample documentation categories
  const categories = [
    { name: 'API Reference', count: 32 },
    { name: 'Guides', count: 18 },
    { name: 'Tutorials', count: 12 },
    { name: 'Best Practices', count: 8 },
    { name: 'Architecture', count: 5 },
  ];
  
  // Sample documentation entries
  const docs = [
    {
      id: 1,
      title: 'API Authentication',
      description: 'Learn how to authenticate with the Knowledge Forge API using JWT tokens',
      category: 'API Reference',
      author: 'Sarah Chen',
      lastUpdated: '2 days ago',
      tags: ['api', 'security', 'jwt'],
      views: 342,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Knowledge Base Integration',
      description: 'Step-by-step guide to integrate external knowledge sources',
      category: 'Guides',
      author: 'Michael Johnson',
      lastUpdated: '1 week ago',
      tags: ['integration', 'setup'],
      views: 187,
      rating: 4.5
    },
    {
      id: 3,
      title: 'User Authentication Flow',
      description: 'Overview of the authentication process and user session management',
      category: 'Architecture',
      author: 'David Kim',
      lastUpdated: '3 days ago',
      tags: ['auth', 'security', 'sessions'],
      views: 256,
      rating: 4.7
    },
    {
      id: 4,
      title: 'Data Indexing Strategies',
      description: 'Optimizing your knowledge base for faster retrieval and better results',
      category: 'Best Practices',
      author: 'Priya Sharma',
      lastUpdated: '5 days ago',
      tags: ['performance', 'indexing', 'optimization'],
      views: 198,
      rating: 4.6
    },
    {
      id: 5,
      title: 'Building Your First Bot',
      description: 'Tutorial for creating a custom knowledge assistant',
      category: 'Tutorials',
      author: 'John Doe',
      lastUpdated: '2 weeks ago',
      tags: ['tutorial', 'bots', 'getting-started'],
      views: 421,
      rating: 4.9
    },
  ];

  // Sample recent updates
  const recentUpdates = [
    { doc: 'API Rate Limits', date: '3 hours ago', type: 'updated' },
    { doc: 'Webhook Integration', date: '1 day ago', type: 'new' },
    { doc: 'GraphQL Schema', date: '2 days ago', type: 'updated' },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Documentation</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" />
              Browse All
            </Button>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>
        
        {/* Search bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search documentation..." 
                className="pl-9 py-6 text-base"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="bg-slate-100">API</Badge>
              <Badge variant="outline" className="bg-slate-100">Authentication</Badge>
              <Badge variant="outline" className="bg-slate-100">Getting Started</Badge>
              <Badge variant="outline" className="bg-slate-100">Integration</Badge>
              <Badge variant="outline" className="bg-slate-100">+</Badge>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-knowledge-accent" />
                Categories
              </CardTitle>
              <CardDescription>Browse by document type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-3">
                View All Categories
              </Button>
            </CardContent>
          </Card>
          
          {/* Documentation Browser */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-knowledge-accent" />
                Documentation
              </CardTitle>
              <CardDescription>
                Browse all documentation
              </CardDescription>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="popular">Popular</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {docs.map((doc) => (
                  <div 
                    key={doc.id} 
                    className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-lg text-knowledge-primary">{doc.title}</h3>
                      <Badge variant="outline">{doc.category}</Badge>
                    </div>
                    <p className="text-slate-600 mt-1">{doc.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {doc.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {doc.lastUpdated}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-500" />
                        {doc.rating}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {doc.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-slate-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  Load More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-knowledge-accent" />
              Recent Updates
            </CardTitle>
            <CardDescription>Latest documentation changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((update, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-knowledge-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{update.doc}</span>
                      <Badge variant={update.type === 'new' ? 'default' : 'secondary'} className="text-xs">
                        {update.type === 'new' ? 'New' : 'Updated'}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{update.date}</p>
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

export default DocumentationPage;
