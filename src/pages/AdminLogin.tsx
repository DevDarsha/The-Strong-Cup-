import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { signIn, checkAdminStatus } from '../lib/auth';
import { supabase } from '../lib/supabase';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in as admin
  useEffect(() => {
    const checkExistingSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { isAdmin } = await checkAdminStatus();
        if (isAdmin) {
          navigate('/admin/dashboard');
        }
      }
    };

    checkExistingSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('[v0] Starting admin login with email:', email);

      // Validate inputs
      if (!email || !password) {
        setError('Please enter both email and password.');
        setIsLoading(false);
        return;
      }

      // Sign in with email and password
      const { data, error: signInError } = await signIn({ email, password });

      console.log('[v0] Sign in response:', { signInError, hasData: !!data });

      if (signInError) {
        // Handle specific error messages
        if (signInError.includes('Failed to fetch')) {
          setError('Network error. Please check: 1) Your internet connection 2) Supabase is configured in .env.local 3) Supabase project is active');
        } else if (signInError.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check credentials and ensure admin user exists in Supabase.');
        } else if (signInError.includes('User not found')) {
          setError('Admin user not found. Please create the admin account in Supabase Authentication.');
        } else {
          setError(signInError);
        }
        setIsLoading(false);
        return;
      }

      if (!data) {
        setError('Sign in failed. Please ensure the admin user exists in Supabase.');
        setIsLoading(false);
        return;
      }

      console.log('[v0] Checking admin status...');

      // Check if user is admin
      const { isAdmin, error: adminError } = await checkAdminStatus();

      console.log('[v0] Admin status check:', { isAdmin, adminError });

      if (adminError) {
        setError(`Failed to verify admin status: ${adminError}. Make sure user_profiles table exists and user is marked as admin.`);
        setIsLoading(false);
        return;
      }

      if (!isAdmin) {
        // Sign out non-admin user
        await supabase.auth.signOut();
        setError('Access denied. This account does not have admin privileges. Please contact your system administrator.');
        setIsLoading(false);
        return;
      }

      console.log('[v0] Admin login successful, redirecting...');
      // Admin login successful
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('[v0] Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('Failed to fetch')) {
        setError('Network error: Unable to connect to Supabase. Please verify your connection and .env.local configuration.');
      } else {
        setError(`An error occurred: ${errorMessage}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-xl mb-4">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-slate-400">Sign in to manage your business</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-7 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-500">
            This admin portal is for authorized personnel only.
          </p>

          {/* Setup Help */}
          <div className="mt-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-300 mb-2 font-medium">Troubleshooting "Failed to fetch"?</p>
            <ul className="text-xs text-blue-200/70 space-y-1 list-disc list-inside">
              <li>Check .env.local has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY</li>
              <li>Verify Supabase project is active (not paused)</li>
              <li>Confirm admin user exists in Supabase Authentication</li>
              <li>See ADMIN_USER_SETUP.md for detailed instructions</li>
            </ul>
          </div>
        </div>

        {/* Security notice */}
        <div className="mt-6 text-center text-xs text-slate-500">
          Secure connection • Admin verified
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
