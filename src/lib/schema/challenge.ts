import { z } from 'zod';

export const challengeSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.date(),
  endDate: z.date(),
  cover: z.string().optional(),
});

export type ChallengeSchemaType = z.infer<typeof challengeSchema>;
