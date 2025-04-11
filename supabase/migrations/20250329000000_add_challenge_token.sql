-- Create a function to generate unique tokens
CREATE OR REPLACE FUNCTION generate_challenge_token() RETURNS text AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i integer := 0;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Add token column to challenges table
ALTER TABLE challenges ADD COLUMN token text UNIQUE;

-- Create a trigger to automatically generate tokens for new challenges
CREATE OR REPLACE FUNCTION set_challenge_token()
RETURNS TRIGGER AS $$
BEGIN
  -- Generate a unique token
  NEW.token := generate_challenge_token();
  
  -- Ensure the token is unique
  WHILE EXISTS (SELECT 1 FROM challenges WHERE token = NEW.token) LOOP
    NEW.token := generate_challenge_token();
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER set_challenge_token_trigger
BEFORE INSERT ON challenges
FOR EACH ROW
EXECUTE FUNCTION set_challenge_token();

-- Create RLS policy for public read access to challenges
CREATE POLICY "Enable read access for all users" ON challenges
FOR SELECT
USING (true);

-- Create a function to get challenge by token
CREATE OR REPLACE FUNCTION get_challenge_by_token(token_param text)
RETURNS SETOF challenges AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM challenges
  WHERE token = token_param;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_challenge_by_token TO authenticated;

-- Create a function to join challenge by token
CREATE OR REPLACE FUNCTION join_challenge_by_token(token_param text, user_id uuid)
RETURNS void AS $$
DECLARE
  challenge_id uuid;
BEGIN
  -- Get the challenge ID
  SELECT id INTO challenge_id
  FROM challenges
  WHERE token = token_param;
  
  IF challenge_id IS NULL THEN
    RAISE EXCEPTION 'Challenge not found';
  END IF;
  
  -- Insert the participant
  INSERT INTO challenge_participants (challenge_id, profile_id)
  VALUES (challenge_id, user_id);
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION join_challenge_by_token TO authenticated; 