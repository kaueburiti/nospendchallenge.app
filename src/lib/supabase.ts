import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { type Database } from './db/database.types';
import { Env } from './env';
import config from '../../config';

const SUPABASE_SERVICE_KEY = Env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient<Database>(
 config.supabaseUrl,
  SUPABASE_SERVICE_KEY,
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
