
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  User, 
  Shield, 
  Database, 
  Bell, 
  CreditCard, 
  Users, 
  Key, 
  Globe, 
  PlugZap 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';

const SettingsPage = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Settings</h1>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent p-0">
                <TabsTrigger 
                  value="account" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </TabsTrigger>
                <TabsTrigger 
                  value="security" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger 
                  value="data" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Data Management
                </TabsTrigger>
                <TabsTrigger 
                  value="notifications" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger 
                  value="billing" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="team" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <Key className="h-4 w-4 mr-2" />
                  API Keys
                </TabsTrigger>
                <TabsTrigger 
                  value="integrations" 
                  className="justify-start h-10 px-4 data-[state=active]:bg-slate-100"
                >
                  <PlugZap className="h-4 w-4 mr-2" />
                  Integrations
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 space-y-6">
              <TabsContent value="account" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.user_metadata?.full_name || 'John Doe'} />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" defaultValue={user?.email || 'john@example.com'} disabled />
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="organization">Organization</Label>
                        <Input id="organization" defaultValue={user?.user_metadata?.organization || 'Acme Inc'} />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue={user?.user_metadata?.role || 'Admin'} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input id="timezone" defaultValue="UTC-8 (Pacific Time)" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage how your profile appears
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-sm text-slate-500">Allow others to see your profile</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Show Activity Status</Label>
                        <p className="text-sm text-slate-500">Display when you're active</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Display Email</Label>
                        <p className="text-sm text-slate-500">Allow team members to see your email</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6 mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>
                      Add an extra layer of security to your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable 2FA</Label>
                        <p className="text-sm text-slate-500">Secure your account with two-factor authentication</p>
                      </div>
                      <Switch />
                    </div>
                    <Button variant="outline">Set Up 2FA</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Login Sessions</CardTitle>
                    <CardDescription>
                      Manage your active sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="font-medium">Chrome on MacOS</p>
                              <p className="text-sm text-slate-500">Current session</p>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-slate-500" />
                            <div>
                              <p className="font-medium">Mobile App on iPhone</p>
                              <p className="text-sm text-slate-500">Last active: 2 days ago</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Log Out</Button>
                        </div>
                      </div>
                      
                      <Button variant="outline">Log Out All Other Sessions</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Manage your data and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Retention</Label>
                        <p className="text-sm text-slate-500">Store conversation history for 90 days</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Usage Analytics</Label>
                        <p className="text-sm text-slate-500">Allow us to collect anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Data Export & Deletion</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline">
                          <Database className="mr-2 h-4 w-4" />
                          Export All Data
                        </Button>
                        <Button variant="destructive">
                          <Database className="mr-2 h-4 w-4" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailSummary">Weekly summary</Label>
                          <Switch id="emailSummary" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailSystem">System updates</Label>
                          <Switch id="emailSystem" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailSecurity">Security alerts</Label>
                          <Switch id="emailSecurity" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="emailMarketing">Marketing emails</Label>
                          <Switch id="emailMarketing" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">In-App Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inAppMentions">Mentions</Label>
                          <Switch id="inAppMentions" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inAppComments">Comments</Label>
                          <Switch id="inAppComments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inAppUpdates">Document updates</Label>
                          <Switch id="inAppUpdates" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="inAppAnalytics">Analytics reports</Label>
                          <Switch id="inAppAnalytics" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>
                      Manage your subscription and billing information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">Professional Plan</h3>
                          <p className="text-sm text-slate-500">$49/month billed annually</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Current Plan</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Unlimited documents</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>10 team members</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>1M API calls/month</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>Priority support</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button>Upgrade Plan</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Payment Method</h3>
                      <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 bg-slate-800 rounded"></div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-slate-500">Expires 12/2025</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Billing Address</h3>
                      <div className="flex justify-between p-4 border border-slate-200 rounded-lg">
                        <div>
                          <p>Acme Inc</p>
                          <p className="text-sm text-slate-500">123 Main St, San Francisco, CA 94103, USA</p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Billing History</h3>
                      <div className="rounded-md border">
                        <div className="grid grid-cols-4 bg-slate-50 p-3 text-sm font-medium">
                          <div>Date</div>
                          <div>Amount</div>
                          <div>Status</div>
                          <div className="text-right">Invoice</div>
                        </div>
                        <div className="grid grid-cols-4 p-3 text-sm border-t">
                          <div>Apr 01, 2025</div>
                          <div>$49.00</div>
                          <div><Badge className="bg-green-100 text-green-800">Paid</Badge></div>
                          <div className="text-right"><Button variant="link" className="h-auto p-0">Download</Button></div>
                        </div>
                        <div className="grid grid-cols-4 p-3 text-sm border-t">
                          <div>Mar 01, 2025</div>
                          <div>$49.00</div>
                          <div><Badge className="bg-green-100 text-green-800">Paid</Badge></div>
                          <div className="text-right"><Button variant="link" className="h-auto p-0">Download</Button></div>
                        </div>
                        <div className="grid grid-cols-4 p-3 text-sm border-t">
                          <div>Feb 01, 2025</div>
                          <div>$49.00</div>
                          <div><Badge className="bg-green-100 text-green-800">Paid</Badge></div>
                          <div className="text-right"><Button variant="link" className="h-auto p-0">Download</Button></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Members</CardTitle>
                    <CardDescription>
                      Manage your team and permissions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input placeholder="Search members..." className="pl-9" />
                      </div>
                      <Button>
                        <Users className="mr-2 h-4 w-4" />
                        Invite Member
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 bg-slate-50 p-3 text-sm font-medium">
                        <div className="col-span-5">User</div>
                        <div className="col-span-3">Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-12 p-3 text-sm border-t items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{user?.user_metadata?.full_name || 'John Doe'}</p>
                            <p className="text-slate-500">{user?.email || 'john@example.com'}</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Badge className="bg-purple-100 text-purple-800">
                            Admin
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="col-span-2 text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 p-3 text-sm border-t items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-slate-500">sarah@example.com</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Badge className="bg-blue-100 text-blue-800">
                            Editor
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="col-span-2 text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 p-3 text-sm border-t items-center">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">Michael Lee</p>
                            <p className="text-slate-500">michael@example.com</p>
                          </div>
                        </div>
                        <div className="col-span-3">
                          <Badge className="bg-slate-100 text-slate-800">
                            Viewer
                          </Badge>
                        </div>
                        <div className="col-span-2">
                          <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
                        </div>
                        <div className="col-span-2 text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Team Settings</CardTitle>
                    <CardDescription>
                      Configure team-wide settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Enable Public Sharing</Label>
                        <p className="text-sm text-slate-500">Allow team members to share knowledge externally</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Team Document Templates</Label>
                        <p className="text-sm text-slate-500">Create and manage document templates</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Team Members Auto-Approve</Label>
                        <p className="text-sm text-slate-500">Automatically approve new team members</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>API Keys</CardTitle>
                    <CardDescription>
                      Manage your API keys for integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Your API Keys</h3>
                        <p className="text-sm text-slate-500">Use these tokens to access the Knowledge Forge API</p>
                      </div>
                      <Button>
                        <Key className="mr-2 h-4 w-4" />
                        Create New Key
                      </Button>
                    </div>
                    
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 bg-slate-50 p-3 text-sm font-medium">
                        <div className="col-span-5">Name</div>
                        <div className="col-span-4">Created</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-12 p-3 text-sm border-t items-center">
                        <div className="col-span-5">
                          <p className="font-medium">Production API Key</p>
                          <p className="text-xs text-slate-500 mt-1">••••••••••••••••••••1234</p>
                        </div>
                        <div className="col-span-4 text-slate-500">
                          Mar 15, 2025
                        </div>
                        <div className="col-span-1">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="col-span-2 text-right flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">Copy</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Revoke</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-12 p-3 text-sm border-t items-center">
                        <div className="col-span-5">
                          <p className="font-medium">Development API Key</p>
                          <p className="text-xs text-slate-500 mt-1">••••••••••••••••••••5678</p>
                        </div>
                        <div className="col-span-4 text-slate-500">
                          Feb 28, 2025
                        </div>
                        <div className="col-span-1">
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="col-span-2 text-right flex gap-1 justify-end">
                          <Button variant="ghost" size="sm">Copy</Button>
                          <Button variant="ghost" size="sm" className="text-red-600">Revoke</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>API Usage</CardTitle>
                    <CardDescription>
                      Monitor your API usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>API Calls (Current Month)</span>
                          <span className="font-medium">432,156 / 1,000,000</span>
                        </div>
                        <Progress value={43.2} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Rate Limit (per minute)</span>
                          <span className="font-medium">60 / 120</span>
                        </div>
                        <Progress value={50} className="h-2" />
                      </div>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      View Detailed Usage
                    </Button>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>API Documentation</CardTitle>
                    <CardDescription>
                      Resources to help you integrate with our API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="h-auto py-4 flex-col items-center gap-2">
                        <FileText className="h-8 w-8 text-slate-500" />
                        <span>API Reference</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col items-center gap-2">
                        <BookOpen className="h-8 w-8 text-slate-500" />
                        <span>Documentation</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col items-center gap-2">
                        <Users className="h-8 w-8 text-slate-500" />
                        <span>Support</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Connected Services</CardTitle>
                    <CardDescription>
                      Manage your connected services and integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#2563EB"/>
                            <path d="M16.5 8H15.5C14.67 8 14 8.67 14 9.5V14.5C14 15.33 14.67 16 15.5 16H16.5C17.33 16 18 15.33 18 14.5V9.5C18 8.67 17.33 8 16.5 8Z" fill="white"/>
                            <path d="M8.5 8H7.5C6.67 8 6 8.67 6 9.5V14.5C6 15.33 6.67 16 7.5 16H8.5C9.33 16 10 15.33 10 14.5V9.5C10 8.67 9.33 8 8.5 8Z" fill="white"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Slack</p>
                          <p className="text-sm text-slate-500">Connected to Knowledge Forge workspace</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2Z" fill="#24292e"/>
                            <path d="M12 7C9.239 7 7 9.239 7 12C7 14.5 8.5 16.5 10.5 17C10.75 17.05 11 16.85 11 16.5V15C9.5 15.5 9 14.5 9 14C8.95 13.8 8.85 13.65 8.7 13.5C8.5 13.4 8.5 13.4 8.6 13.4C9 13.4 9.45 14 9.5 14C10 14.75 10.85 14.5 11 14.3C11.05 14 11.2 13.775 11.4 13.65C10.1 13.5 9 13 9 11.5C9 10.85 9.3 10.25 9.75 9.8C9.7 9.7 9.5 9.2 9.75 8.5C9.75 8.5 10.4 8.4 11.25 9C11.5 8.95 11.75 8.9 12 8.9C12.25 8.9 12.5 8.95 12.75 9C13.6 8.35 14.25 8.5 14.25 8.5C14.5 9.15 14.35 9.7 14.25 9.8C14.7 10.25 15 10.85 15 11.5C15 13 13.9 13.5 12.6 13.65C12.85 13.85 13 14.2 13 14.7V16.5C13 16.85 13.25 17.05 13.5 17C15.5 16.5 17 14.5 17 12C17 9.239 14.761 7 12 7Z" fill="white"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">GitHub</p>
                          <p className="text-sm text-slate-500">Connected to 3 repositories</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="12" fill="#673AB7"/>
                            <path d="M16.4 15.2C16.8 15.6 17.5 15.6 17.9 15.2L18.7 14.4C19.1 14 19.1 13.3 18.7 12.9L15.5 9.7L16.3 8.9C16.5 8.7 16.5 8.4 16.3 8.2C16.1 8 15.8 8 15.6 8.2L9.6 14.2C9.4 14.4 9.4 14.7 9.6 14.9C9.8 15.1 10.1 15.1 10.3 14.9L11.1 14.1L14.3 17.3C14.7 17.7 15.4 17.7 15.8 17.3L16.6 16.5C17 16.1 17 15.4 16.6 15L16.4 15.2Z" fill="white"/>
                            <path d="M11.7 13.5L8.5 10.3C8.1 9.9 8.1 9.2 8.5 8.8L9.3 8C9.7 7.6 10.4 7.6 10.8 8L11 7.8C10.6 7.4 9.9 7.4 9.5 7.8L8.7 8.6C8.3 9 8.3 9.7 8.7 10.1L11.9 13.3L11.1 14.1C10.9 14.3 10.9 14.6 11.1 14.8C11.3 15 11.6 15 11.8 14.8L17.8 8.8C18 8.6 18 8.3 17.8 8.1C17.6 7.9 17.3 7.9 17.1 8.1L16.3 8.9L13.1 5.7C12.7 5.3 12 5.3 11.6 5.7L10.8 6.5C10.4 6.9 10.4 7.6 10.8 8L11 7.8C10.6 8.2 10.6 8.9 11 9.3L14.2 12.5L13.4 13.3C13.2 13.5 13.2 13.8 13.4 14C13.6 14.2 13.9 14.2 14.1 14L14.9 13.2L14.1 12.4L14.9 11.6C15.1 11.4 15.1 11.1 14.9 10.9C14.7 10.7 14.4 10.7 14.2 10.9L13.4 11.7L12.6 10.9L13.4 10.1C13.6 9.9 13.6 9.6 13.4 9.4C13.2 9.2 12.9 9.2 12.7 9.4L11.9 10.2L11.1 9.4L11.9 8.6C12.1 8.4 12.1 8.1 11.9 7.9C11.7 7.7 11.4 7.7 11.2 7.9L10.4 8.7L9.6 7.9L10.4 7.1C10.6 6.9 10.6 6.6 10.4 6.4C10.2 6.2 9.9 6.2 9.7 6.4L8.1 8L7.3 7.2C6.9 6.8 6.2 6.8 5.8 7.2L5 8C4.6 8.4 4.6 9.1 5 9.5L8.2 12.7L7.4 13.5C7.2 13.7 7.2 14 7.4 14.2C7.6 14.4 7.9 14.4 8.1 14.2L11.7 10.6C11.9 10.4 11.9 10.1 11.7 9.9C11.5 9.7 11.2 9.7 11 9.9L8.1 12.8L5.7 10.4C5.3 10 5.3 9.3 5.7 8.9L6.5 8.1C6.9 7.7 7.6 7.7 8 8.1L8.8 8.9L10.4 7.3C10.6 7.1 10.6 6.8 10.4 6.6C10.2 6.4 9.9 6.4 9.7 6.6L8.9 7.4L8.1 6.6L8.9 5.8C9.1 5.6 9.1 5.3 8.9 5.1C8.7 4.9 8.4 4.9 8.2 5.1L6.6 6.7L5.8 5.9C5.4 5.5 4.7 5.5 4.3 5.9L3.5 6.7C3.1 7.1 3.1 7.8 3.5 8.2L6.7 11.4L5.9 12.2C5.7 12.4 5.7 12.7 5.9 12.9C6.1 13.1 6.4 13.1 6.6 12.9L12.6 6.9C12.8 6.7 12.8 6.4 12.6 6.2C12.4 6 12.1 6 11.9 6.2L11.1 7L7.9 3.8C7.5 3.4 6.8 3.4 6.4 3.8L5.6 4.6C5.2 5 5.2 5.7 5.6 6.1L5.8 5.9C5.4 6.3 5.4 7 5.8 7.4L9 10.6L8.2 11.4C8 11.6 8 11.9 8.2 12.1C8.4 12.3 8.7 12.3 8.9 12.1L9.7 11.3L10.5 12.1L9.7 12.9C9.5 13.1 9.5 13.4 9.7 13.6C9.9 13.8 10.2 13.8 10.4 13.6L11.2 12.8L12 13.6L11.2 14.4C11 14.6 11 14.9 11.2 15.1C11.4 15.3 11.7 15.3 11.9 15.1L12.7 14.3L13.5 15.1L12.7 15.9C12.5 16.1 12.5 16.4 12.7 16.6C12.9 16.8 13.2 16.8 13.4 16.6L15 15L15.8 15.8C16.2 16.2 16.9 16.2 17.3 15.8L18.1 15C18.5 14.6 18.5 13.9 18.1 13.5L14.9 10.3L15.7 9.5C15.9 9.3 15.9 9 15.7 8.8C15.5 8.6 15.2 8.6 15 8.8L11.4 12.4C11.2 12.6 11.2 12.9 11.4 13.1C11.6 13.3 11.9 13.3 12.1 13.1L15 10.2L17.4 12.6C17.8 13 17.8 13.7 17.4 14.1L16.6 14.9C16.2 15.3 15.5 15.3 15.1 14.9L14.3 14.1L12.7 15.7C12.5 15.9 12.5 16.2 12.7 16.4C12.9 16.6 13.2 16.6 13.4 16.4L14.2 15.6L15 16.4L14.2 17.2C14 17.4 14 17.7 14.2 17.9C14.4 18.1 14.7 18.1 14.9 17.9L16.5 16.3L17.3 17.1C17.7 17.5 18.4 17.5 18.8 17.1L19.6 16.3C20 15.9 20 15.2 19.6 14.8L16.4 11.6L17.2 10.8C17.4 10.6 17.4 10.3 17.2 10.1C17 9.9 16.7 9.9 16.5 10.1L10.5 16.1C10.3 16.3 10.3 16.6 10.5 16.8C10.7 17 11 17 11.2 16.8L12 16L15.2 19.2C15.6 19.6 16.3 19.6 16.7 19.2L17.5 18.4C17.9 18 17.9 17.3 17.5 16.9L17.3 17.1C17.7 16.7 17.7 16 17.3 15.6L14.1 12.4L14.9 11.6C15.1 11.4 15.1 11.1 14.9 10.9C14.7 10.7 14.4 10.7 14.2 10.9L13.4 11.7L12.6 10.9L13.4 10.1C13.6 9.9 13.6 9.6 13.4 9.4C13.2 9.2 12.9 9.2 12.7 9.4L11.9 10.2L11.1 9.4L11.9 8.6C12.1 8.4 12.1 8.1 11.9 7.9C11.7 7.7 11.4 7.7 11.2 7.9L10.4 8.7L9.6 7.9L10.4 7.1C10.6 6.9 10.6 6.6 10.4 6.4C10.2 6.2 9.9 6.2 9.7 6.4L8.1 8L7.3 7.2C6.9 6.8 6.2 6.8 5.8 7.2L5 8C4.6 8.4 4.6 9.1 5 9.5L8.2 12.7L7.4 13.5C7.2 13.7 7.2 14 7.4 14.2C7.6 14.4 7.9 14.4 8.1 14.2L11.7 10.6C11.9 10.4 11.9 10.1 11.7 9.9C11.5 9.7 11.2 9.7 11 9.9L8.1 12.8L5.7 10.4C5.3 10 5.3 9.3 5.7 8.9L6.5 8.1C6.9 7.7 7.6 7.7 8 8.1L8.8 8.9L10.4 7.3" fill="white"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Notion</p>
                          <p className="text-sm text-slate-500">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-200 rounded flex items-center justify-center">
                          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="#0072c6"/>
                            <path d="M16.5 8H7.5C6.67 8 6 8.67 6 9.5V14.5C6 15.33 6.67 16 7.5 16H16.5C17.33 16 18 15.33 18 14.5V9.5C18 8.67 17.33 8 16.5 8Z" fill="white"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Microsoft Teams</p>
                          <p className="text-sm text-slate-500">Not connected</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
