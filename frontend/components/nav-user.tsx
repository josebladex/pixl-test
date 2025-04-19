'use client';
import { useAuth } from '@/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { ChevronsUpDown, LogOut, Calendar, Compass } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Button } from './ui/button';

export function NavUser() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        setUser(null);
      } else {
        toast.error('Error logging out');
      }
    } catch (error) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    } finally {
      router.push('/');
    }
  };

  const handleEventManager = () => {
    if (user?.id) {
      router.push(`/admin/${user.id}`);
    }
  };

  const handleEventExplorer = () => {
    router.push('/events');
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-indigo-400 rounded-lg h-12 cursor-pointer">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="https://i.pravatar.cc/300" alt={user.email} />
            </Avatar>
            <div className="flex flex-col text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.role}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto h-4 w-4" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 rounded-lg" side="bottom" align="end" sideOffset={4}>
        {user.role === 'ADMIN' && (
          <DropdownMenuItem onClick={handleEventManager} className="cursor-pointer">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Event Manager</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleEventExplorer} className="cursor-pointer">
          <Compass className="mr-2 h-4 w-4" />
          <span>Event Explorer</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
