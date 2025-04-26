import { i18n } from '@/i18n';
import { z } from 'zod';

export const otpEmailSchema = z.object({
  email: z.string().min(1, i18n.t('validation.email.required')).email(),
});

export const otpVerificationSchema = z.object({
  token: z.string().min(6, i18n.t('validation.otp.required')),
});

export type OtpEmailSchemaType = z.infer<typeof otpEmailSchema>;
export type OtpVerificationSchemaType = z.infer<typeof otpVerificationSchema>;
