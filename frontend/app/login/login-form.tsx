'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { LoginFormValues, loginSchema } from './schema';
import { toast } from 'sonner';
import { useAuth } from '@/providers/auth-provider';
import { getCurrentUser } from './user-server';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      const result = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: values.email, password: values.password }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await result.json();
      
      if (data.message === 'Login successfully') {
        toast.success('Welcome!', {
          description: 'You have successfully logged in',
        });
        const user = await getCurrentUser();
        setUser(user);
        if (user && user.role === 'ADMIN') {
          router.push(`/admin/${user.id}`);
        } else if (user && user.role === 'USER') {
          router.push('/events');
        }
      } else {
        toast.error('Authentication error', {
          description: data.message,
        });
      }
    } catch {
      toast.error('Unexpected error', {
        description: 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="admin@example.com"
                  {...field}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Log in'}
        </Button>
      </form>
    </Form>
  );
}
