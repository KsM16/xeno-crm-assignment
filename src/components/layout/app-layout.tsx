'use client';

import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { LayoutDashboard, Users, Mail, BarChart2, LogOut, Settings, UserCircle, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";


const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/segments', label: 'Segments', icon: Users },
  { href: '/campaigns', label: 'Campaigns', icon: Mail },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];

function UserProfileNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://placehold.co/100x100.png?text=${initials}`} alt={user.name || 'User'} data-ai-hint="user avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserCircle className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


function MainSidebar() {
  const { user, logout } = useAuth();
  const { state: sidebarState } = useSidebar();

  if (!user) return null;
  
  const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CP';


  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4 flex items-center gap-2">
         <Avatar className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center">
            <AvatarFallback className="font-headline text-lg bg-transparent">{initials}</AvatarFallback>
          </Avatar>
        {sidebarState === 'expanded' && (
          <Link href="/" className="font-headline text-2xl font-semibold text-sidebar-foreground">
            ClientPulse
          </Link>
        )}
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton tooltip={{ children: item.label, side: 'right', className:"bg-sidebar-accent text-sidebar-accent-foreground" }}>
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {sidebarState === 'expanded' ? (
           <div className="flex items-center gap-2">
             <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}`} alt={user.name || 'User'} data-ai-hint="user avatar"/>
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">{user.name || 'User'}</span>
                <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="ml-auto text-sidebar-foreground hover:text-sidebar-accent-foreground">
                <LogOut size={18} />
              </Button>
           </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="w-full justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}`} alt={user.name || 'User'} data-ai-hint="user avatar"/>
                  <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
                </Avatar>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="center" className="bg-popover text-popover-foreground">
              <DropdownMenuLabel>{user.name || 'User'}</DropdownMenuLabel>
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal -mt-2">{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}


function MobileNav() {
  const { user, logout } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CP';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <Avatar className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center">
            <AvatarFallback className="font-headline text-lg bg-transparent">{initials}</AvatarFallback>
          </Avatar>
          <Link href="/" className="font-headline text-2xl font-semibold text-sidebar-foreground">
            ClientPulse
          </Link>
        </SidebarHeader>
        <nav className="flex-1 grid gap-2 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-sidebar-border p-4">
           {user && (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={`https://placehold.co/40x40.png?text=${user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}`} alt={user.name || 'User'} data-ai-hint="user avatar"/>
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={logout} className="ml-auto text-sidebar-foreground hover:text-sidebar-accent-foreground">
                <LogOut size={18} />
              </Button>
            </div>
           )}
        </div>
      </SheetContent>
    </Sheet>
  );
}


export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth(); // Auth context handles redirection
  const isMobile = useIsMobile();


  if (loading || !user) {
    // AuthProvider shows a global spinner or handles redirection
    // This return is a fallback or can be removed if AuthProvider handles it fully
    return null; 
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="flex min-h-screen w-full">
        {!isMobile && <MainSidebar />}
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center gap-4 border-b bg-card px-6 sticky top-0 z-30 md:px-8">
            {isMobile && <MobileNav />}
            {!isMobile && <SidebarTrigger />}
            <div className="flex-1">
              {/* Potentially breadcrumbs or page title here */}
            </div>
            <UserProfileNav />
          </header>
          <SidebarInset className="bg-background">
             <main className="flex-1 p-4 md:p-8 overflow-auto">
               {children}
             </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
