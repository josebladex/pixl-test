'use client';

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
import { useTransition } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers/auth-provider';
import { format } from 'date-fns';
import { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { eventFormSchema, EventFormValues } from '../schema';
import { createEventAction } from '@/app/actions/events';
import { Textarea } from '@/components/ui/textarea';

export function CreateEventForm({ close }: { close: (open: boolean) => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
      price: 0,
      image: '',
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(values: EventFormValues) {
    if (!user || user.role !== 'ADMIN') {
      toast.error('Not authorized');
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('date', values.date.toISOString());
    formData.append('price', values.price.toString());
    formData.append('createdById', user.id.toString());

    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    startTransition(async () => {
      try {
        const newEvent = await createEventAction(formData);

        toast.success('Event created successfully', {
          action: {
            label: 'View',
            onClick: () => router.push(`/events/${newEvent.id}`),
          },
        });

        form.reset();
        if (fileInputRef.current) fileInputRef.current.value = '';
        router.refresh();

        close(false);
      } catch (error) {
        toast.error('Error creating the event', {
          description: error instanceof Error ? error.message : 'Please try again',
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Title <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="E.g., Tech Conference" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Description <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detailed description of the event..."
                  {...field}
                  disabled={isPending}
                  className="min-h-[90px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Date and Time <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="w-full"
                  value={
                    field.value instanceof Date && !isNaN(field.value.getTime())
                      ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                      : ''
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price (USD) <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...field}
                  disabled={isPending}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="image">
            Event Image <span className="text-muted-foreground">(Optional)</span>
          </Label>
          <Input
            id="image"
            type="file"
            ref={fileInputRef}
            accept="image/png, image/jpeg, image/webp"
            disabled={isPending}
          />
          <p className="text-sm text-muted-foreground">
            Supported formats: PNG, JPEG, WEBP (Max 4MB)
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isPending || !(user?.role === 'ADMIN')}>
          {isPending ? 'Creating event...' : 'Create Event'}
        </Button>
      </form>
    </Form>
  );
}
