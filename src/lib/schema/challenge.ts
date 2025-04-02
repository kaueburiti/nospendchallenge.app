import { z } from 'zod';
import { useTranslation } from '@/hooks/useTranslation';

export const challengeSchema = z.object({
  name: z.string().min(1, 'challenge.errors.name_required'),
  description: z.string().min(1, 'challenge.errors.description_required'),
  startDate: z.date(),
  endDate: z.date(),
  type: z.enum(['spending', 'saving']),
  amount: z.number().min(0, 'challenge.errors.amount_required'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ChallengeSchemaType = z.infer<typeof challengeSchema>;
