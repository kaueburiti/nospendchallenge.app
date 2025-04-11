-- Drop the existing function
DROP FUNCTION IF EXISTS join_challenge_by_token(text, uuid);

-- Create the improved function
CREATE OR REPLACE FUNCTION join_challenge_by_token(token_param text, user_id uuid)
RETURNS void AS $$
DECLARE
  challenge_record challenges;
BEGIN
  -- Get the challenge
  SELECT * INTO challenge_record
  FROM challenges
  WHERE token = token_param;
  
  IF challenge_record IS NULL THEN
    RAISE EXCEPTION 'Challenge not found';
  END IF;
  
  -- Check if user is already a participant
  IF EXISTS (
    SELECT 1 FROM challenge_participants 
    WHERE challenge_id = challenge_record.id AND user_id = user_id
  ) THEN
    RETURN;
  END IF;
  
  -- Insert the participant
  INSERT INTO challenge_participants (challenge_id, user_id)
  VALUES (challenge_record.id, user_id);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_challenge_by_token TO authenticated; 