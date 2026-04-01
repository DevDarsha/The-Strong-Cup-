import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to manage authentication state
 * Handles session persistence and auto-refresh
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(data.session);
        setUser(data.session?.user ?? null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to get session'));
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, session, loading, error };
};
