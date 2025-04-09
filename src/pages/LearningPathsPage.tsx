
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Check, ChevronRight, Clock, GraduationCap, PlayCircle, User, Users, Award, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LearningPathsPage = () => {
  // Sample featured learning paths
  const featuredPaths = [
    {
      id: 1,
      title: 'Knowledge Base Essentials',
      description: 'A comprehensive introduction to setting up your knowledge base',
      modules: 8,
      duration: '4 hours',
      enrolled: 354,
      progress: 0,
      level: 'Beginner',
      instructor: 'David Chen'
    },
    {
      id: 2,
      title: 'Advanced API Integration',
      description: 'Learn how to connect and leverage external APIs with your knowledge base',
      modules: 12,
      duration: '6 hours',
      enrolled: 187,
      progress: 25,
      level: 'Intermediate',
      instructor: 'Maria Garcia'
    },
    {
      id: 3,
      title: 'Security Best Practices',
      description: 'Ensure your knowledge base implementation follows security best practices',
      modules: 6,
      duration: '3 hours',
      enrolled: 231,
      progress: 75,
      level: 'All Levels',
      instructor: 'James Wilson'
    }
  ];

  // Sample in-progress learning paths
  const inProgressPaths = [
    {
      id: 4,
      title: 'Custom AI Assistant Development',
      description: 'Build specialized AI assistants on top of your knowledge base',
      modules: 10,
      duration: '5 hours',
      completed: 4,
      progress: 40,
      level: 'Advanced',
      lastAccessed: '2 days ago',
      instructor: 'Priya Sharma'
    },
    {
      id: 5,
      title: 'Performance Optimization',
      description: 'Optimize your knowledge base for faster responses and better results',
      modules: 8,
      duration: '3.5 hours',
      completed: 6,
      progress: 75,
      level: 'Intermediate',
      lastAccessed: '5 days ago',
      instructor: 'Michael Johnson'
    }
  ];

  // Sample popular modules
  const popularModules = [
    {
      title: 'Indexing Techniques',
      duration: '25 min',
      views: 1245,
      rating: 4.8
    },
    {
      title: 'Query Optimization',
      duration: '30 min',
      views: 982,
      rating: 4.7
    },
    {
      title: 'Authentication Strategies',
      duration: '45 min',
      views: 876,
      rating: 4.9
    }
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Learning Paths</h1>
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse All Courses
          </Button>
        </div>
        
        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-primary/90 to-primary text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Your Learning</h3>
                  <p className="text-white/80 text-sm">You're making great progress!</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">58%</span>
                </div>
                <Progress value={58} className="h-2 bg-white/20" indicatorClassName="bg-white" />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-white/90" />
                  <span className="text-sm">2 Courses</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/90" />
                  <span className="text-sm">10 Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-white/90" />
                  <span className="text-sm">3 Badges</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {inProgressPaths.map((path, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{path.title}</CardTitle>
                  <Badge variant="outline" className="bg-slate-100 text-xs">
                    {path.level}
                  </Badge>
                </div>
                <CardDescription className="text-xs line-clamp-2">
                  {path.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{path.completed} of {path.modules} modules</span>
                    <span>{path.progress}% complete</span>
                  </div>
                  <Progress value={path.progress} className="h-1.5" />
                </div>
                <div className="flex mt-2 items-center text-xs text-slate-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Last accessed {path.lastAccessed}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button size="sm" className="w-full">
                  Continue Learning
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {/* Featured Paths */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Featured Learning Paths</h2>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPaths.map((path) => (
              <Card key={path.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between">
                    <div className="bg-primary/10 rounded-md p-2 h-10 w-10 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <Badge variant="outline" className="bg-slate-100">
                      {path.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{path.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {path.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{path.instructor}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{path.modules} modules</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-slate-500" />
                      <span>{path.enrolled} enrolled</span>
                    </div>
                  </div>
                  
                  {path.progress > 0 && (
                    <div className="mt-4 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Your progress</span>
                        <span>{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-1.5" />
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button 
                    className="w-full" 
                    variant={path.progress > 0 ? "default" : "outline"}
                  >
                    {path.progress > 0 ? "Continue" : "Start Learning"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Popular Modules */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-knowledge-accent" />
                Popular Learning Modules
              </CardTitle>
              <CardDescription>
                Most viewed individual learning units
              </CardDescription>
              <Tabs defaultValue="featured" className="w-full">
                <TabsList className="grid grid-cols-3 max-w-md">
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="new">New</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularModules.map((module, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-4 p-3 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    <div className="h-12 w-12 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{module.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {module.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {module.views} views
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-amber-500" />
                          {module.rating}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="flex-shrink-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  View All Modules
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Learning Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-knowledge-accent" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Track your learning progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center p-4 border border-dashed border-slate-200 rounded-lg">
                  <div className="mx-auto h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <Award className="h-8 w-8 text-amber-600" />
                  </div>
                  <h3 className="font-medium">Knowledge Explorer</h3>
                  <p className="text-sm text-slate-500 mt-1">Completed 2 learning paths</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Courses Completed</span>
                      <span className="font-medium">2 of 5</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Hours Learned</span>
                      <span className="font-medium">8.5 of 20</span>
                    </div>
                    <Progress value={42.5} className="h-2" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Badges Earned</span>
                      <span className="font-medium">3 of 12</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  View Learning Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LearningPathsPage;
