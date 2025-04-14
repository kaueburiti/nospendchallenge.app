import { i18n } from '@/i18n';
import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, i18n.t('validation.email.required')).email(),
  password: z.string().min(6, i18n.t('validation.password_min_length')),
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
