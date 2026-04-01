/**
 * Authentication Example Component
 * This demonstrates how to use Supabase authentication in your application
 * 
 * This is a reference example - adapt it to your specific needs
 */

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { signIn, signUp, signOut, signInWithOAuth, resetPassword } from '../lib/auth';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthExample() {
  const { user, loading, error: authError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (loading) {
    return <div className="p-4 text-center">Loading authentication...</div>;
  }

  if (user) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h2 className="font-semibold text-green-900 mb-2">Signed In</h2>
          <p className="text-sm text-green-800">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            const { error } = await signOut();
            if (error) {
              setError(error);
            }
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded"
        >
          Sign Out
        </button>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await signIn({ email, password });
      if (error) {
        setError(error);
      } else if (data) {
        setSuccessMessage('Signed in successfully!');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { data, error } = await signUp({ email, password });
      if (error) {
        setError(error);
      } else if (data) {
        setSuccessMessage('Account created! Please check your email to verify your account.');
        setEmail('');
        setPassword('');
        setMode('signin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error);
      } else {
        setSuccessMessage('Password reset email sent. Check your inbox!');
        setEmail('');
        setMode('signin');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signInWithOAuth(provider);
      if (error) {
        setError(error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Sign in with ${provider} failed`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Authentication</h1>

      {authError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{authError.message}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <form
        onSubmit={
          mode === 'signin'
            ? handleSignIn
            : mode === 'signup'
              ? handleSignUp
              : handleResetPassword
        }
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            placeholder="your@email.com"
          />
        </div>

        {mode !== 'reset' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded transition"
        >
          {isLoading
            ? 'Loading...'
            : mode === 'signin'
              ? 'Sign In'
              : mode === 'signup'
                ? 'Sign Up'
                : 'Send Reset Email'}
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {mode !== 'signin' && (
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
              setSuccessMessage(null);
            }}
            className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Sign In
          </button>
        )}

        {mode === 'signin' && (
          <>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create Account
            </button>
            <button
              onClick={() => {
                setMode('reset');
                setError(null);
              }}
              className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Forgot Password?
            </button>
          </>
        )}
      </div>

      {mode === 'signin' && (
        <div className="mt-6">
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 transition"
            >
              Continue with Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 transition"
            >
              Continue with GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
