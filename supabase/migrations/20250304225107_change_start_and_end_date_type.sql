-- Change start_date and end_date columns from date to timestamptz
ALTER TABLE public.challenges 
  ALTER COLUMN start_date TYPE timestamptz USING start_date::timestamptz,
  ALTER COLUMN end_date TYPE timestamptz USING end_date::timestamptz;