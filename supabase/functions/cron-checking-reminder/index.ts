// @ts-nocheck
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

console.log('Starting OneSignal notification service');

Deno.serve(async req => {
  try {
    const response = await fetch('https://api.onesignal.com/notifications', {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        authorization: Deno.env.get('ONE_SIGNAL_API_KEY'),
      },
      body: JSON.stringify({
        app_id: Deno.env.get('ONE_SIGNAL_APP_ID'),
        target_channel: 'push',
        name: 'Checking Reminder',
        headings: {
          en: "It's time checking ✅",
        },
        contents: {
          en: "Don't forget to share your accomplishments and challenges with your friends!",
        },
        included_segments: ['Test Users'],
        ios_attachments: {
          onesignal_logo:
            'https://avatars.githubusercontent.com/u/11823027?s=200&v=4',
        },
        big_picture:
          'https://avatars.githubusercontent.com/u/11823027?s=200&v=4',
      }),
    });

    const result = await response.json();
    console.log('OneSignal notification sent:', result);

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/cron-checking-reminder' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

*/
