// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// @ts-nocheck
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { WelcomeEmail } from './_templates/welcome.tsx';
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const supabaseUrl = Deno.env.get('EXPO_PUBLIC_SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get(
  'EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY',
)!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async req => {
  try {
    const { email, verificationUrl } = await req.json();

    if (!email || !verificationUrl) {
      return new Response(
        JSON.stringify({
          error: 'Email, and verificationUrl are required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }
    // Render the email template
    const emailHtml = await renderAsync(WelcomeEmail({ verificationUrl }));

    const { data, error } = await resend.emails.send({
      from: 'NoSpendChallenge <debora@nospendchallenge.app>',
      to: email,
      subject: 'Welcome to #NoSpendChallenge!',
      html: emailHtml,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Welcome email sent successfully',
      }),
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to send welcome email',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/welcome' \
    --header 'Content-Type: application/json' \
    --data '{"email": "kauepbd@gmail.com","username":"John Doe","verificationUrl":"https://example.com/verify"}'

*/
