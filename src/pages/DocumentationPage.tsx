
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Book, Code, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const DocumentationPage = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Documentation</h1>
          <div className="relative w-64">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Search documentation..." />
          </div>
        </div>

        <Tabs defaultValue="guides">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Getting Started */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle>Getting Started</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn how to set up and configure the ZeroKT platform for your team.
                  </p>
                  <Button variant="link" className="px-0 h-auto" size="sm">
                    Read Guide <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Knowledge Base Setup */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <Book className="h-5 w-5 text-purple-600" />
                    </div>
                    <CardTitle>Knowledge Base Setup</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure and optimize your knowledge base for best results.
                  </p>
                  <Button variant="link" className="px-0 h-auto" size="sm">
                    Read Guide <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Integration Guide */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Code className="h-5 w-5 text-green-600" />
                    </div>
                    <CardTitle>Integration Guide</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Integrate ZeroKT with your existing tools and workflows.
                  </p>
                  <Button variant="link" className="px-0 h-auto" size="sm">
                    Read Guide <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* More documentation sections would go here */}
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Reference</CardTitle>
                <CardDescription>
                  Complete reference documentation for the ZeroKT API
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>API documentation content would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>
                  Sample code and examples for common use cases
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Example code and tutorials would go here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DocumentationPage;
