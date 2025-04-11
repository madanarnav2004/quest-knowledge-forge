import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Database, 
  Shield, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Search,
  Check,
  Users 
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const handleSaveProfile = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
          <div className="flex">
            <div className="w-64 mr-6">
              <TabsList className="flex flex-col items-start w-full h-auto bg-transparent p-0 space-y-1">
                <TabsTrigger 
                  value="profile" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  API Access
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="data" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </TabsTrigger>
                <TabsTrigger 
                  value="team" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger 
                  value="privacy" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Terms
                </TabsTrigger>
                <TabsTrigger 
                  value="help" 
                  className="w-full justify-start px-3 py-2 h-auto text-left"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Help & Support
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account profile information and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center">
                          <User className="h-10 w-10 text-slate-500" />
                        </div>
                        <div>
                          <Button size="sm">Change avatar</Button>
                          <p className="text-xs text-slate-500 mt-1">
                            JPG, GIF or PNG. 1MB max.
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user?.user_metadata?.full_name || 'John Doe'} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user?.email || 'johndoe@example.com'} disabled />
                          <p className="text-xs text-slate-500">
                            Your email is your unique identifier and cannot be changed
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input id="organization" defaultValue={user?.user_metadata?.organization || 'ZeroKT Inc.'} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobTitle">Job Title</Label>
                          <Input id="jobTitle" defaultValue="Knowledge Lead" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Write a short bio..." className="min-h-[100px]" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Expertise</Label>
                        <div className="flex flex-wrap gap-2">
                          <Badge>Knowledge Management</Badge>
                          <Badge className="bg-slate-200 hover:bg-slate-300 text-slate-800 hover:text-slate-900">AI</Badge>
                          <Badge>Documentation</Badge>
                          <Badge>Training</Badge>
                          <Button size="sm" variant="outline" className="h-6 rounded-full">
                            + Add more
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Preferences</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">
                              Enable dark mode for the interface
                            </p>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive email notifications
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-base">Language</Label>
                            <p className="text-sm text-muted-foreground">
                              Set your preferred language
                            </p>
                          </div>
                          <Select defaultValue="en">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t px-6 py-4">
                    <Button variant="outline">Cancel</Button>
                    <Button onClick={handleSaveProfile} disabled={loading}>
                      {loading ? 'Saving...' : 'Save changes'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Password</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <Button>Update Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-factor authentication is disabled</p>
                          <p className="text-sm text-slate-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Sessions</h3>
                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-md border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Current Session</p>
                              <p className="text-sm text-slate-500">
                                Last active: Just now
                              </p>
                            </div>
                            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                              Active Now
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-md border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Chrome on Windows</p>
                              <p className="text-sm text-slate-500">
                                Last active: 2 days ago
                              </p>
                            </div>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage your API keys for accessing ZeroKT programmatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        You have 2 active API keys out of 5 allowed
                      </p>
                      <Button size="sm">
                        + Create New Key
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Production API Key</p>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Active
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              Created: April 10, 2025
                            </p>
                            <div className="mt-2 bg-white p-2 rounded border flex items-center justify-between">
                              <code className="text-xs">••••••••••••••••••••••••1234</code>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">Testing API Key</p>
                              <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                Limited
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                              Created: March 15, 2025
                            </p>
                            <div className="mt-2 bg-slate-50 p-2 rounded border flex items-center justify-between">
                              <code className="text-xs">••••••••••••••••••••••••5678</code>
                              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                              </Button>
                            </div>
                          </div>
                          <div>
                            <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                              Revoke
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm">API Usage</h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Queries this month</span>
                          <span className="font-medium">1,234 / 10,000</span>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Document processing</span>
                          <span className="font-medium">4.6 GB / 10 GB</span>
                        </div>
                        <Progress value={46} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-slate-50 p-4 border">
                      <h3 className="font-medium mb-2">Documentation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                          <FileText className="h-4 w-4 mr-2" />
                          API Reference Guide
                        </a>
                        <a href="#" className="flex items-center text-sm text-blue-600 hover:underline">
                          <BookOpen className="h-4 w-4 mr-2" />
                          Quick Start Tutorial
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                      <CardTitle>Team Management</CardTitle>
                      <CardDescription>
                        Manage team members and their access permissions
                      </CardDescription>
                    </div>
                    <Button size="sm">Invite Team Member</Button>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search team members..." 
                        className="h-9 w-full md:w-[300px]" 
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                              <span className="text-white font-medium">JD</span>
                            </div>
                            <div>
                              <p className="font-medium">{user?.user_metadata?.full_name || 'John Doe'}</p>
                              <p className="text-sm text-slate-500">{user?.email || 'johndoe@example.com'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-primary text-primary-foreground">Owner</Badge>
                            <Select defaultValue="owner">
                              <SelectTrigger className="w-32">
                                <SelectValue placeholder="Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="owner">Owner</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="member">Member</SelectItem>
                                <SelectItem value="viewer">Viewer</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="text-xs flex items-center space-x-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Admin Access</span>
                          </div>
                          <div className="text-xs flex items-center space-x-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Invite Members</span>
                          </div>
                          <div className="text-xs flex items-center space-x-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>Billing Access</span>
                          </div>
                          <div className="text-xs flex items-center space-x-1">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>API Management</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="text-slate-600 font-medium">JC</span>
                            </div>
                            <div>
                              <p className="font-medium">Jane Cooper</p>
                              <p className="text-sm text-slate-500">jane.cooper@example.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                              Admin
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                              <span className="text-slate-600 font-medium">AR</span>
                            </div>
                            <div>
                              <p className="font-medium">Alex Rodriguez</p>
                              <p className="text-sm text-slate-500">alex.rodriguez@example.com</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-200">
                              Member
                            </Badge>
                            <Button size="sm" variant="ghost">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="rounded-md bg-slate-50 p-4 border">
                      <h3 className="font-medium text-sm mb-4">Usage by Team Member</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">{user?.user_metadata?.full_name || 'John Doe'}</span>
                            <span className="text-xs font-medium">62%</span>
                          </div>
                          <Progress value={62} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Jane Cooper</span>
                            <span className="text-xs font-medium">28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Alex Rodriguez</span>
                            <span className="text-xs font-medium">10%</span>
                          </div>
                          <Progress value={10} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="text-sm flex items-center">
                      <Badge variant="outline" className="mr-2 bg-slate-50 text-slate-700 border-slate-200">
                        Current Plan: Pro Team
                      </Badge>
                      <span className="text-slate-500">5 of 10 seats used</span>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Other tabs content would go here */}
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
