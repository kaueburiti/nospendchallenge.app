import { z } from 'zod';

export const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Please enter at least 8 characters.')
      .max(64, 'Please enter fewer than 64 characters.')
      .regex(/^(?=.*[a-z])/, 'Your password must have at least one lowercase letter.')
      .regex(/^(?=.*[A-Z])/, 'Your password must have at least one uppercase letter.')
      .regex(/^(?=.*[0-9])/, 'Your password must have at least one number.')
      .regex(/^(?=.*[!@#$%^&*])/, 'Your password must have at least one special character.'),
    confirmPassword: z.string().min(8, 'Please enter at least 8 characters.'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Your passwords do not match.',
    path: ['confirmPassword'],
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;