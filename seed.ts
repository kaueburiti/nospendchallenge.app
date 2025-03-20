/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from '@snaplet/seed';
import { Client } from 'pg';
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';
const main = async () => {
  const seed = await createSeedClient();

  // Create a direct connection to the database for raw SQL queries
  const pgClient = new Client(
    process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1:54322/postgres',
  );
  await pgClient.connect();

  // Create a Supabase client for auth operations
  const supabaseUrl = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Truncate all tables in the database except analytics
  try {
    // Reset public schema tables
    await pgClient.query(`
      DO $$ 
      DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename) || ' CASCADE;';
          END LOOP;
      END $$;
    `);

    // Reset auth tables (except for specific system tables)
    await pgClient.query(`
      TRUNCATE auth.users CASCADE;
    `);
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    // Close the pg client after using it
    await pgClient.end();
  }

  // Create 10 users with profiles
  const users = [];
  for (let i = 1; i <= 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName,
      lastName,
      allowSpecialCharacters: false,
    });

    // Create auth.users entry
    const user = await supabase.auth.admin.createUser({
      email,
      password: 'Pass123!', // You might want to use a more secure password
      email_confirm: true,
      user_metadata: {
        full_name: `${firstName} ${lastName}`,
      },
    });

    if (user.error) {
      console.error(`Error creating user ${i}:`, user.error);
      continue;
    }

    users.push({
      id: user.data.user.id,
      email,
      firstName,
      lastName,
    });

    // Create profile entry (this should be handled by the trigger, but let's ensure it)
    await supabase.from('profiles').upsert({
      id: user.data.user.id,
      first_name: firstName,
      last_name: lastName,
      display_name: `${firstName} ${lastName}`,
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`, // Generate avatar
    });
  }

  // For each user, create 1 challenge
  for (const user of users) {
    const challenge = await supabase
      .from('challenges')
      .insert({
        owner_id: user.id,
        title: `#${faker.lorem.word()}`,
        description: faker.lorem.paragraph(),
        start_date: faker.date.recent(),
        end_date: faker.date.future(),
        cover: faker.image.urlLoremFlickr({ category: 'nature' }),
      })
      .select()
      .single();

    console.log('Challenge created:', challenge.data?.title);
  }

  // For each challenge, create 5 participants
  const challenges = await supabase.from('challenges').select('*');
  for (const challenge of challenges.data!) {
    for (let i = 0; i < 5; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      await supabase.from('challenge_participants').insert({
        challenge_id: challenge.id,
        user_id: randomUser.id,
      });

      console.log('Participant created:', randomUser.email);
    }
  }

  console.log('Database seeded successfully!');
  console.log('Created users:', users.map(u => u.email).join(', '));

  process.exit();
};

main().catch(error => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
