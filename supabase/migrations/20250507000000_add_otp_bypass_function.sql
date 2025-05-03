-- Create function to bypass OTP for specific email
CREATE OR REPLACE FUNCTION public.preset_OTP()
RETURNS TRIGGER
AS $$
BEGIN
    IF (NEW.email = ANY(array['bypass@nospendchallenge.app'])) THEN
        NEW.recovery_token := encode(sha224(concat(NEW.email,'123456')::bytea), 'hex');
        NEW.recovery_sent_at := NOW() - INTERVAL '2 minutes';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to execute the function
CREATE OR REPLACE TRIGGER preset_OTP 
    BEFORE INSERT OR UPDATE ON auth.users 
    FOR EACH ROW 
    EXECUTE PROCEDURE public.preset_OTP();

-- Add comment to explain the purpose
COMMENT ON FUNCTION public.preset_OTP() IS 'Bypasses OTP for specific email addresses for testing purposes'; 