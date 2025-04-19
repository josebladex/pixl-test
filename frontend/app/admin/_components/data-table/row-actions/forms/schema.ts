import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(3, 'The title must have at least 3 characters')
    .max(100, 'The title is too long'),
  description: z
    .string()
    .min(10, 'The description must have at least 10 characters')
    .max(2000, 'The description is too long'),
  date: z.date().min(new Date(), 'The date cannot be in the past'),
  price: z
    .number()
    .min(0, 'The price cannot be negative')
    .max(10000, 'The maximum allowed price is $10,000'),
  image: z.string().optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;
