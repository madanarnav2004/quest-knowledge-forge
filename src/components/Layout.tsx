
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Database, 
  FileText, 
  GitBranch, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Upload,
  LogOut,
  User
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Input Integration', path: '/input', icon: <Upload className="h-5 w-5" /> },
    { name: 'Knowledge Base', path: '/knowledge', icon: <Database className="h-5 w-5" /> },
    { name: 'Q&A Interface', path: '/qa', icon: <MessageSquare className="h-5 w-5" /> },
    { name: 'Documentation', path: '/docs', icon: <FileText className="h-5 w-5" /> },
    { name: 'Code Analysis', path: '/code', icon: <GitBranch className="h-5 w-5" /> },
    { name: 'Learning Paths', path: '/learning', icon: <BookOpen className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  // Only show navigation sidebar if not on landing page
  const showNav = location.pathname !== '/';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  
  // Extract user display name from metadata or email
  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName;
    
    // If no full name, use the first part of the email
    return user.email ? user.email.split('@')[0] : 'User';
  };
  
  // Get user initials for the avatar
  const getUserInitials = () => {
    const displayName = getUserDisplayName();
    if (displayName === 'Guest' || displayName === 'User') return displayName.substring(0, 1);
    
    const nameParts = displayName.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return displayName.substring(0, 2).toUpperCase();
  };
  
  // Determine if user is admin - can be expanded based on your user roles system
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  return (
    <div className="flex h-screen bg-slate-50">
      {showNav && (
        <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-10">
          <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
            <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
              <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                <div className="bg-knowledge-accent rounded p-1">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white cursor-pointer">
                  Quest KF
                </span>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.name}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={`w-full justify-start ${isActive ? 'bg-sidebar-accent text-white' : 'text-sidebar-foreground'}`}
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-sidebar-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-3 cursor-pointer">
                    <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
                      <span className="text-white font-medium">{getUserInitials()}</span>
                    </div>
                    <div className="text-sm">
                      <p className="text-white font-medium">{getUserDisplayName()}</p>
                      <p className="text-sidebar-foreground opacity-70">
                        {isAdmin ? 'Admin' : 'Member'}
                      </p>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </aside>
      )}
      
      <main className={`flex-1 ${showNav ? 'md:ml-64' : ''} min-h-screen flex flex-col`}>
        {showNav && (
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center">
              <div className="md:hidden mr-4">
                <Button variant="ghost" size="icon">
                  <LayoutDashboard className="h-5 w-5" />
                </Button>
              </div>
              <h1 className="text-xl font-medium">
                {navItems.find(item => item.path === location.pathname)?.name || 'Quest Knowledge Forge'}
              </h1>
            </div>
            
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{getUserInitials()}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{getUserDisplayName()}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/settings')}>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        )}
        
        <div className="flex-1">{children}</div>
        
        <footer className="border-t border-slate-200 py-4 px-6 text-center text-sm text-slate-500">
          © 2025 Quest Knowledge Forge. All rights reserved.
        </footer>
      </main>
    </div>
  );
};

export default Layout;
