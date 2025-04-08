import { i18n } from '@/i18n';
import { z } from 'zod';

export const profileSchema = z.object({
  first_name: z.string().min(2, i18n.t('profile.form.first_name.error')),
  last_name: z.string().min(2, i18n.t('profile.form.last_name.error')),
  email: z.string().email(i18n.t('profile.form.email.error')),
  avatar: z.string().optional(),
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;
