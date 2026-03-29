import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          setSupabaseError('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }

        // Check if user is admin
        const { data, error } = await supabase
          .from('user_profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('[v0] Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
        }
      } catch (error) {
        console.error('[v0] Exception checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();

    // Listen for auth changes only if Supabase is configured
    if (!isSupabaseConfigured()) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          setIsAdmin(false);
        } else {
          // Recheck admin status on auth change
          try {
            const { data, error } = await supabase
              .from('user_profiles')
              .select('is_admin')
              .eq('id', session.user.id)
              .single();

            if (error) {
              setIsAdmin(false);
            } else {
              setIsAdmin(data?.is_admin || false);
            }
          } catch (error) {
            console.error('[v0] Error in auth state change:', error);
            setIsAdmin(false);
          }
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-200">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (supabaseError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="text-center max-w-md px-4">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <p className="text-red-100 font-medium mb-2">Configuration Error</p>
            <p className="text-red-200 text-sm">{supabaseError}</p>
            <p className="text-red-300 text-xs mt-4">Check your .env file or environment variables.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
