-- seed.sql

-- Disable triggers to avoid updating timestamps
-- Note: The exact syntax for disabling triggers may vary depending on your setup

-- Start a transaction
BEGIN;

-- Insert data into the data table
INSERT INTO data (src, name, href, featured, description)
VALUES
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/nativeexpress-thumbnail.png?t=2024-11-24T15%3A52%3A54.043Z',
     'Native Express', 'https://www.native.express/', true, 'The ultimate mobile native app boilerplate.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/v0-thumbnail.jpeg?t=2024-08-16T14%3A00%3A41.048Z',
     'v0', 'https://v0.dev/', false, 'Generate, refine, and ship applications with AI.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/listingcat-thumbnail.png',
     'ListingCat', 'https://listingcat.com/', true, 'The List of Directories for Startups and Indie Hackers'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/syncreads-thumbnail.png?t=2024-08-16T12%3A38%3A54.392Z',
     'Syncreads', 'https://www.syncreads.com/', true,
     'Sync favorite content for distraction-free reading, save time and replace multiple apps with SyncReads.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/blogboost-thumbnail.jpeg?t=2024-08-16T13%3A13%3A26.592Z',
     'Blogboost', '#', true, 'AI formatting your text making it easy to read.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/macaw-thumbnail.png?t=2024-08-16T14%3A03%3A23.611Z',
     'Macaw', 'https://www.macawhq.com/', true, 'Generate AI content that humans love to read'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/notion-thumbnail.jpg?t=2024-08-16T12%3A13%3A58.827Z',
     'Notion', 'https://www.notion.so/', true, 'Notion is a workspace for wiki, docs & projects.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/discord-thumbnail.png?t=2024-08-16T12%3A28%3A25.312Z',
     'Discord', 'https://discord.gg/', true,
     'Discord is great for playing games and chilling with friends, or even building a worldwide community.'),
    ('https://qpdwualqgmqaxfgoapyc.supabase.co/storage/v1/object/public/appboilerplate/product-images/uncoverlab-thumbnail.png?t=2024-08-16T14%3A24%3A41.314Z',
     'uncoverLAB', 'https://uncoverlab.co/', true,
     'A growing library of Figma website templates and apps user journeys with wireframes');

-- Link data to categories
WITH data_categories_map AS (
    SELECT * FROM (VALUES
                       ('App Boilerplate', ARRAY['Development']),
                       ('v0', ARRAY['Development', 'Artificial Intelligence']),
                       ('ListingCat', ARRAY['SEO']),
                       ('Syncreads', ARRAY['Others']),
                       ('Blogboost', ARRAY['Others']),
                       ('Macaw', ARRAY['Artificial Intelligence', 'SEO']),
                       ('Notion', ARRAY['Productivity']),
                       ('Discord', ARRAY['Communication']),
                       ('uncoverLAB', ARRAY['Design'])
                  ) AS t(name, categories)
)
INSERT INTO data_categories (data_id, category_id)
SELECT d.id, c.id
FROM data d
         JOIN data_categories_map dcm ON d.name = dcm.name
         JOIN unnest(dcm.categories) cat(name) ON true
         JOIN categories c ON c.name::text = cat.name;

-- Commit the transaction
COMMIT;

-- Re-enable triggers if necessary
-- Note: The exact syntax for re-enabling triggers may vary depending on your setup