
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Clock, GraduationCap, BarChart, Award, ArrowRight, User, Users, Briefcase } from 'lucide-react';

const LearningPathsPage = () => {
  // Sample learning paths data
  const learningPaths = [
    {
      id: 1,
      title: 'Getting Started with Knowledge Bases',
      description: 'Learn the fundamentals of building and organizing knowledge bases',
      progress: 75,
      level: 'Beginner',
      estimatedTime: '4 hours',
      modules: 6,
      category: 'Fundamentals',
      author: 'ZeroKT Team',
      enrolled: 543
    },
    {
      id: 2,
      title: 'Advanced Knowledge Engineering',
      description: 'Deep dive into vector embeddings and semantic search',
      progress: 30,
      level: 'Advanced',
      estimatedTime: '8 hours',
      modules: 12,
      category: 'Technical',
      author: 'AI Research Team',
      enrolled: 312
    },
    {
      id: 3,
      title: 'Integrating Knowledge Bases with Workflows',
      description: 'Connect your knowledge base to your team's existing tools',
      progress: 0,
      level: 'Intermediate',
      estimatedTime: '6 hours',
      modules: 8,
      category: 'Integration',
      author: 'DevOps Team',
      enrolled: 421
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Learning Paths</h1>
          <Button>
            <GraduationCap className="mr-2 h-4 w-4" />
            New Certification
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Learning Stats */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2/7</div>
              <p className="text-xs text-muted-foreground">Courses completed</p>
              <Progress value={28} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Time Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5h</div>
              <p className="text-xs text-muted-foreground">Total learning time</p>
              <Progress value={60} className="h-2 mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Earned this quarter</p>
              <Progress value={20} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Paths</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="recommended">Recommended</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BarChart className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Award className="mr-2 h-4 w-4" />
                Certifications
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.map(path => (
                <Card key={path.id} className="overflow-hidden">
                  <div className={`h-1 ${path.level === 'Beginner' ? 'bg-green-500' : path.level === 'Intermediate' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`
                        ${path.level === 'Beginner' ? 'border-green-500 text-green-700 bg-green-50' : 
                        path.level === 'Intermediate' ? 'border-yellow-500 text-yellow-700 bg-yellow-50' : 
                        'border-red-500 text-red-700 bg-red-50'}
                      `}>
                        {path.level}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50">
                        {path.category}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{path.estimatedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{path.modules} modules</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{path.author}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-slate-400" />
                        <span>{path.enrolled} enrolled</span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-slate-50 px-6">
                    <Button className="w-full">
                      {path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="enrolled" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Courses</CardTitle>
                <CardDescription>Courses you are currently taking</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your enrolled courses will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Courses</CardTitle>
                <CardDescription>Courses you have finished</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Your completed courses will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="recommended" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommended Courses</CardTitle>
                <CardDescription>Courses suggested based on your role and interests</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Personalized course recommendations will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default LearningPathsPage;
