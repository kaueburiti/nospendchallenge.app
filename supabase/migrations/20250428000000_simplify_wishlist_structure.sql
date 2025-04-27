-- First, let's modify wishlist_items table to add user_id column
ALTER TABLE public.wishlist_items 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update user_id in wishlist_items based on the parent wishlist
UPDATE public.wishlist_items
SET user_id = w.user_id
FROM public.wishlists w
WHERE wishlist_items.wishlist_id = w.id;

-- Make user_id NOT NULL after it's populated
ALTER TABLE public.wishlist_items
ALTER COLUMN user_id SET NOT NULL;

-- Drop the old policies for wishlist_items
DROP POLICY IF EXISTS "Users can view their own wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can insert their own wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can update their own wishlist items" ON public.wishlist_items;
DROP POLICY IF EXISTS "Users can delete their own wishlist items" ON public.wishlist_items;

-- Create new policies for wishlist_items based directly on user_id
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlist_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlist items" 
ON public.wishlist_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlist items" 
ON public.wishlist_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlist_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Find and drop any constraints referencing the wishlist_id
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT conname, conrelid::regclass AS table_name
             FROM pg_constraint
             WHERE confrelid = 'public.wishlists'::regclass
    LOOP
        EXECUTE 'ALTER TABLE ' || r.table_name || ' DROP CONSTRAINT ' || r.conname;
    END LOOP;
END $$;

-- Drop foreign key constraint on wishlist_id
ALTER TABLE public.wishlist_items
DROP CONSTRAINT IF EXISTS wishlist_items_wishlist_id_fkey;

-- Now drop the wishlist_id column
ALTER TABLE public.wishlist_items
DROP COLUMN wishlist_id;

-- Drop the wishlists table (this should be done after all references are updated)
DROP TABLE public.wishlists; 