import { z } from 'zod';

export const wishlistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export const wishlistItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  cost: z
    .number({
      required_error: 'Cost is required',
      invalid_type_error: 'Cost must be a number',
    })
    .positive('Cost must be a positive number'),
  photo: z.string().url('Invalid photo URL').optional(),
});

export type WishlistFormValues = z.infer<typeof wishlistSchema>;
export type WishlistItemFormValues = z.infer<typeof wishlistItemSchema>;
