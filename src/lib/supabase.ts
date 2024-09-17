import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { type Database } from './db/database.types';
import { Env } from './env';

const SUPABASE_URL = Env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = Env.SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);

/**
 * Parses the Supabase URL, replacing the hash with a question mark
 * @param url
 */
export const parseSupabaseUrl = (url: string) => {
  let parsedUrl = url;
  if (url.includes('#')) {
    parsedUrl = url.replace('#', '?');
  }
  return parsedUrl;
};
