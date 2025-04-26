-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost DECIMAL(10, 2) NOT NULL,
  photo TEXT,
  wishlist_id BIGINT NOT NULL REFERENCES public.wishlists(id) ON DELETE CASCADE
);

-- Create update_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for wishlists table
CREATE TRIGGER update_wishlists_updated_at
BEFORE UPDATE ON public.wishlists
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add trigger for wishlist_items table
CREATE TRIGGER update_wishlist_items_updated_at
BEFORE UPDATE ON public.wishlist_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for wishlists table
CREATE POLICY "Users can view their own wishlists" 
ON public.wishlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wishlists" 
ON public.wishlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wishlists" 
ON public.wishlists 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wishlists" 
ON public.wishlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for wishlist_items table
CREATE POLICY "Users can view their own wishlist items" 
ON public.wishlist_items 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.wishlists 
  WHERE wishlists.id = wishlist_items.wishlist_id 
  AND wishlists.user_id = auth.uid()
));

CREATE POLICY "Users can insert their own wishlist items" 
ON public.wishlist_items 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.wishlists 
  WHERE wishlists.id = wishlist_items.wishlist_id 
  AND wishlists.user_id = auth.uid()
));

CREATE POLICY "Users can update their own wishlist items" 
ON public.wishlist_items 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.wishlists 
  WHERE wishlists.id = wishlist_items.wishlist_id 
  AND wishlists.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own wishlist items" 
ON public.wishlist_items 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.wishlists 
  WHERE wishlists.id = wishlist_items.wishlist_id 
  AND wishlists.user_id = auth.uid()
)); 