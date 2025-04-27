import { i18n } from '@/i18n';
import { z } from 'zod';

// Helper to convert currency string to number
const currencyStringToNumber = (
  value: string | null | undefined,
): number | null => {
  if (!value) return null;
  // Remove currency symbols and non-numeric characters except decimal point
  const numStr = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);
  return isNaN(num) ? null : num;
};

export const challengeSchema = z.object({
  title: z.string().min(4, i18n.t('challenge.form.title.error')),
  description: z.string().min(10, i18n.t('challenge.form.description.error')),
  startDate: z.date(),
  endDate: z.date(),
  cover: z.string().optional(),
  savingsGoal: z
    .string()
    .nullable()
    .optional()
    .transform(currencyStringToNumber)
    .pipe(
      z
        .number()
        .positive(i18n.t('challenge.form.savings_goal.error'))
        .nullable()
        .optional(),
    ),
});

export type ChallengeSchemaType = z.infer<typeof challengeSchema>;

// This is to help TypeScript with the savingsGoal field in form data
export interface ChallengeFormData extends ChallengeSchemaType {
  savingsGoal?: string | number | null;
}
