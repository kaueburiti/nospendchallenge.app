import { i18n } from '@/i18n';
import { z } from 'zod';

// Helper to convert currency string to number
const currencyStringToNumber = (
  value: string | null | undefined,
): number | boolean => {
  if (!value) return false;
  // Remove currency symbols and non-numeric characters except decimal point
  const numStr = value.replace(/[^0-9.]/g, '');
  const num = parseFloat(numStr);

  return isNaN(num) ? false : num;
};

export const challengeSchema = z.object({
  title: z.string().min(4, i18n.t('challenge.form.title.error')),
  description: z.string().min(10, i18n.t('challenge.form.description.error')),
  startDate: z.date(),
  endDate: z.date(),
  cover: z.string().optional(),
  savingsGoal: z.string().nullable().optional(),
  // .transform(currencyStringToNumber)
  // .pipe(
  //   z
  //     .number()
  //     .positive(i18n.t('challenge.form.savings_goal.error'))
  //     .nullable()
  //     .optional(),
  // ),
});

export type ChallengeSchemaType = z.infer<typeof challengeSchema>;
