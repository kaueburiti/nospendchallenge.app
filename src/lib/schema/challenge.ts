import { i18n } from '@/i18n';
import { z } from 'zod';

export const challengeSchema = z.object({
  title: z.string().min(4, i18n.t('challenge.form.title.error')),
  description: z.string().min(10, i18n.t('challenge.form.description.error')),
  startDate: z.date(),
  endDate: z.date(),
  cover: z.string().optional(),
});

export type ChallengeSchemaType = z.infer<typeof challengeSchema>;
