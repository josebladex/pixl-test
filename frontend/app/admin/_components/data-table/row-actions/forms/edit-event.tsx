'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { eventFormSchema, EventFormValues } from "./schema";
import { updateEventAction } from "@/app/actions/events";
import { Textarea } from "@/components/ui/textarea";
import format from "date-fns/format";
import Image from "next/image";

export function EditEventForm({
  row,
  close,
}: {
  row: { original: EventFormValues & { id: number; image?:string } };
  close: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string | null>(row.original.image ?? null);
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: row.original.title,
      description: row.original.description,
      date: new Date(row.original.date),
      price: row.original.price,
      image: "",
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function onSubmit(values: EventFormValues) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("date", values.date.toISOString());
    formData.append("price", values.price.toString());

    const imageFile = fileInputRef.current?.files?.[0];
    if (imageFile) {
      formData.append("image", imageFile);
    }

    startTransition(async () => {
      try {
        const updatedEvent = await updateEventAction(row.original.id, {
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          date: formData.get("date") as string,
          price: parseFloat(formData.get("price") as string),
          image: (formData.get("image") as string | null) ?? undefined,
        });

        toast.success("Event updated successfully", {
          action: {
            label: "View",
            onClick: () => router.push(`/events/${updatedEvent.id}`),
          },
        });

        form.reset();
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.refresh();

        // Close the form
        close(false);
      } catch (error) {
        toast.error("Error updating the event", {
          description: error instanceof Error ? error.message : "Please try again",
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
                <Input
                  placeholder="E.g., Tech Conference"
                  {...field}
                  disabled={isPending}
                />
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
                  className="min-h-[50px]"
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
                Event Date and Time <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  className="w-full"
                  value={
                    field.value instanceof Date && !isNaN(field.value.getTime())
                      ? format(field.value, "yyyy-MM-dd'T'HH:mm")
                      : ""
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Event Image <span className="text-muted-foreground">(Optional)</span>
              </FormLabel>
              {previewImage && (
                <div className="mb-2">
                  <Image
                    src={previewImage}
                    alt="Event Preview"
                    width={128}
                    height={128}
                    className="object-cover rounded"
                  />
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  ref={fileInputRef}
                  className="focus:bg-accent focus:text-accent-foreground hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPreviewImage(URL.createObjectURL(file));
                    }
                    field.onChange(e.target.files);
                  }}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isPending}
        >
          {isPending ? "Updating event..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}