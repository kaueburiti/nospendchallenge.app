// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2';

Deno.serve(async (req: Request) => {
  // Create the Supabase client
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  // Create the Supabase admin client with service role key
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key instead of anon key
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  console.log('SUPABASE_URL', Deno.env.get('SUPABASE_URL'));

  // Get the session or user object
  const authHeader = req.headers.get('Authorization')!;
  const token = authHeader.replace('Bearer ', '');
  const {
    data: { user },
    error: getUserError,
  } = await supabaseClient.auth.getUser(token);

  if (getUserError) {
    return new Response(JSON.stringify({ error: 'Failed to get user' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  }

  console.log('Deleting user data', user.id);

  // First, delete all challenges owned by the user
  const { error: deleteChallengesError } = await supabaseAdmin
    .from('challenges')
    .delete()
    .eq('owner_id', user.id);

  if (deleteChallengesError) {
    console.log('Error deleting challenges:', deleteChallengesError);
    // Continue with user deletion even if challenge deletion fails
  }

  // Delete any challenge participations
  const { error: deleteParticipationsError } = await supabaseAdmin
    .from('challenge_participants')
    .delete()
    .eq('user_id', user.id);

  if (deleteParticipationsError) {
    console.log('Error deleting participations:', deleteParticipationsError);
    // Continue with user deletion even if participation deletion fails
  }

  // Delete any challenge invitations
  const { error: deleteInvitationsError } = await supabaseAdmin
    .from('challenge_invitations')
    .delete()
    .eq('inviter_id', user.id);

  if (deleteInvitationsError) {
    console.log('Error deleting invitations:', deleteInvitationsError);
    // Continue with user deletion even if invitation deletion fails
  }

  // Delete any checks
  const { error: deleteChecksError } = await supabaseAdmin
    .from('checks')
    .delete()
    .eq('user_id', user.id);

  if (deleteChecksError) {
    console.log('Error deleting checks:', deleteChecksError);
    // Continue with user deletion even if checks deletion fails
  }

  // Delete any activities
  const { error: deleteActivitiesError } = await supabaseAdmin
    .from('activities')
    .delete()
    .eq('user_id', user.id);

  if (deleteActivitiesError) {
    console.log('Error deleting activities:', deleteActivitiesError);
    // Continue with user deletion even if activities deletion fails
  }

  console.log('Deleting user', user.id);
  // Delete the user
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
    user.id,
  );

  console.log('deleteError', deleteError);

  if (deleteError) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  console.log('User deleted successfully');

  return new Response(
    JSON.stringify({ message: 'User deleted successfully' }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    },
  );
});
