-- Add explicit foreign key constraint between checks and profiles
ALTER TABLE public.checks 
DROP CONSTRAINT IF EXISTS checks_user_id_fkey,
ADD CONSTRAINT checks_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE; 