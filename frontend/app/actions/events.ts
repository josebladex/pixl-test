'use server';

import prisma from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { eventFormSchema } from '../admin/_components/data-table/row-actions/forms/schema';

// Action to create an event
export async function createEventAction(formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title'),
      description: formData.get('description'),
      date: new Date(formData.get('date') as string),
      price: Number(formData.get('price')),
      createdById: Number(formData.get('createdById')),
    };

    const validatedData = eventFormSchema.parse(rawData);

    const imageFile = formData.get('image') as File | null;
    let imagePath: string | undefined;

    if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 4 * 1024 * 1024) {
        throw new Error('The file is too large (maximum 5MB)');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('File type not allowed');
      }

      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(uploadDir, filename);

      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(filePath, buffer);
      imagePath = `/uploads/${filename}`;
    }

    const newEvent = await prisma.event.create({
      data: {
        ...validatedData,
        image: imagePath,
        createdById: rawData.createdById,
      },
    });

    const serializedEvent = {
      ...newEvent,
      price: newEvent.price.toNumber(),
    };

    revalidatePath('/admin'); // Revalidate the /admin page
    return serializedEvent;
  } catch (error) {
    console.error('Error creating event:', error);
    throw new Error(error instanceof Error ? error.message : 'Error creating the event');
  }
}

// Action to update an event by ID
export async function updateEventAction(eventId: number, data: {
  title?: string;
  description?: string;
  date?: string;
  price?: number;
  image?: string;
}) {
  try {
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        description: data.description,
        date: data.date ? new Date(data.date) : undefined,
        price: data.price,
        image: data.image,
      },
    });

    const serializedEvent = {
      ...updatedEvent,
      price: updatedEvent.price.toNumber(),
    };

    revalidatePath('/admin'); // Revalidate the /admin page
    return serializedEvent;
  } catch (error) {
    console.error('Error updating event:', error);
    throw new Error(error instanceof Error ? error.message : 'Error updating the event');
  }
}

// Action to delete an event by ID
export async function deleteEventAction(eventId: number) {
  try {
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });

    revalidatePath('/admin'); // Revalidate the /admin page
    return deletedEvent;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw new Error(error instanceof Error ? error.message : 'Error deleting the event');
  }
}

// Action to read all events
export async function readAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });

    const serializedEvents = events.map(event => ({
      ...event,
      price: event.price.toNumber(),
    }));

    return serializedEvents;
  } catch (error) {
    console.error('Error reading all events:', error);
    throw new Error(error instanceof Error ? error.message : 'Error fetching the events');
  }
}

// Action to read an event by ID
export async function readEventById(eventId: number) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const serializedEvent = {
      ...event,
      price: event.price.toNumber(),
    };

    return serializedEvent;
  } catch (error) {
    console.error('Error reading event by ID:', error);
    throw new Error(error instanceof Error ? error.message : 'Error fetching the event');
  }
}
