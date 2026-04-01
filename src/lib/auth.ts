import { supabase } from './supabase';

export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up a new user with email and password
 */
export const signUp = async (credentials: SignUpCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Sign up failed',
    };
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (credentials: SignInCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Sign in failed',
    };
  }
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Sign out failed',
    };
  }
};

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export const signInWithOAuth = async (provider: 'google' | 'github') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : `Sign in with ${provider} failed`,
    };
  }
};

/**
 * Request password reset
 */
export const resetPassword = async (email: string) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Password reset request failed',
    };
  }
};

/**
 * Update password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Password update failed',
    };
  }
};

/**
 * Get current user's admin status
 */
export const checkAdminStatus = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { isAdmin: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return { isAdmin: data?.is_admin || false, error: null };
  } catch (error) {
    return {
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Failed to check admin status',
    };
  }
};

/**
 * Get current authenticated user with admin details
 */
export const getCurrentUserWithAdmin = async () => {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { user: null, profile: null, isAdmin: false, error: 'Not authenticated' };
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return { 
      user, 
      profile, 
      isAdmin: profile?.is_admin || false, 
      error: null 
    };
  } catch (error) {
    return {
      user: null,
      profile: null,
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
    };
  }
};
