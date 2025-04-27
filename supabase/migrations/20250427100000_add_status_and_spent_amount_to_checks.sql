-- Add status column with default value 'success'
ALTER TABLE checks ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure'));

-- Add spent_amount column with default value 0
ALTER TABLE checks ADD COLUMN IF NOT EXISTS spent_amount NUMERIC(10, 2) NOT NULL DEFAULT 0;

-- Add index on status column
CREATE INDEX IF NOT EXISTS checks_status_idx ON checks (status);

-- Comment on columns
COMMENT ON COLUMN checks.status IS 'Status of the check, either success (maintained impulse control) or failure (gave in to impulse)';
COMMENT ON COLUMN checks.spent_amount IS 'Amount spent if user failed to maintain impulse control';

-- Create function to calculate total spent amount for a challenge
CREATE OR REPLACE FUNCTION get_challenge_total_spent(challenge_id_param integer)
RETURNS numeric AS $$
DECLARE
  total_spent numeric;
BEGIN
  SELECT COALESCE(SUM(spent_amount), 0)
  INTO total_spent
  FROM checks
  WHERE challenge_id = challenge_id_param;
  
  RETURN total_spent;
END;
$$ LANGUAGE plpgsql; 