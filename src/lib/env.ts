export const Env = {
    SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.EXPO_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_SERIVCE_KEY ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    REVENUE_CAT_API_KEY_APPLE: process.env.REVENUE_CAT_API_KEY_APPLE ?? process.env.EXPO_PUBLIC_REVENUE_CAT_API_KEY_APPLE,
    SENTRY_DSN: process.env.SENTRY_DSN ?? process.env.EXPO_PUBLIC_SENTRY_DSN,
    POSTHOG_API_KEY: process.env.POSTHOG_API_KEY ?? process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
};