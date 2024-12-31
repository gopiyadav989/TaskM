import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { setOpenSidebar } from '../redux/slices/authSlice';
import {
  Home,
  CheckCircle,
  Clock,
  ListTodo,
  Users,
  Trash2,
  Settings,
  Layout
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', icon: Home, href: 'dashboard' },
  { label: 'Tasks', icon: Layout, href: 'tasks' },
  { label: 'Completed', icon: CheckCircle, href: 'completed/completed' },
  { label: 'In Progress', icon: Clock, href: 'in-progress/in progress' },
  { label: 'To Do', icon: ListTodo, href: 'todo/todo' },
  { label: 'Team', icon: Users, href: 'team' },
  { label: 'Trash', icon: Trash2, href: 'trashed' },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1];

  const filteredLinks = user?.isAdmin ? sidebarLinks : sidebarLinks.slice(0, 5);

  return (
    <div className="flex h-full flex-col border-r bg-background">
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-1">
            <Layout className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-semibold">Taskify</h1>
        </div>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === link.href;
            
            return (
              <Button
                key={link.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
                onClick={() => dispatch(setOpenSidebar(false))}
              >
                <Link to={link.href}>
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
      <div className="p-4">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </div>
    </div>
  );
}