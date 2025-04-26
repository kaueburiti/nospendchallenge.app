-- Add saved_amount column to checks table
ALTER TABLE public.checks ADD COLUMN saved_amount NUMERIC(10, 2) DEFAULT 0;

-- Create a function to calculate total savings for a challenge
CREATE OR REPLACE FUNCTION get_challenge_total_savings(challenge_id_param INTEGER)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
  total_savings NUMERIC;
BEGIN
  SELECT COALESCE(SUM(saved_amount), 0)
  INTO total_savings
  FROM checks
  WHERE challenge_id = challenge_id_param;
  
  RETURN total_savings;
END;
$$; 