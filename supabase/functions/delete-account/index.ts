// @ts-nocheck
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  // Create the Supabase client
  const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  )

  // Create the Supabase admin client
  const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
  )

  // Get the session or user object
  const authHeader = req.headers.get('Authorization')!
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: getUserError } = await supabaseClient.auth.getUser(token)

  if (getUserError) {
    return new Response(JSON.stringify({ error: 'Failed to get user' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    })
  }

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    })
  }

  // Delete the user
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

  if (deleteError) {
    return new Response(JSON.stringify({ error: 'Failed to delete user' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }

  return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})