import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create the Supabase client safely. If credentials are missing, we return a Mock Proxy client
// to prevent runtime crashes at module evaluation/import time, allowing local fallbacks to work.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get(target, prop) {
        if (prop === 'channel') {
          return () => ({
            on: () => ({
              subscribe: () => ({})
            })
          });
        }
        if (prop === 'removeChannel') {
          return () => {};
        }
        // For any query or RPC invocation, return a function that returns standard promise resolving to empty/error states
        return () => ({
          from: () => ({
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
                limit: () => Promise.resolve({ data: [], error: new Error("Supabase is not configured.") }),
                order: () => Promise.resolve({ data: [], error: new Error("Supabase is not configured.") }),
              }),
              order: () => Promise.resolve({ data: [], error: new Error("Supabase is not configured.") }),
            }),
            insert: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") }),
            update: () => ({
              eq: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") })
            }),
            delete: () => ({
              eq: () => Promise.resolve({ data: null, error: new Error("Supabase is not configured.") })
            })
          })
        });
      }
    });

