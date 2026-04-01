import React, { useState, useEffect } from 'react';
import { Lock, Mail, User, Save, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { updatePassword } from '../../lib/auth';

export const Settings: React.FC = () => {
  const [adminData, setAdminData] = useState({
    full_name: '',
    email: '',
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();

          if (profile) {
            setAdminData({
              full_name: profile.full_name || '',
              email: profile.email || user.email || '',
            });
          } else {
            setAdminData({
              full_name: '',
              email: user.email || '',
            });
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching admin data:', error);
        setMessage({ type: 'error', text: 'Failed to load profile data' });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_profiles')
        .update({ full_name: adminData.full_name })
        .eq('id', user.id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      console.error('[v0] Error updating profile:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) throw new Error(error);

      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Password updated successfully' });
    } catch (error) {
      console.error('[v0] Error updating password:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update password',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-slate-400">Manage your admin account and preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg flex gap-3 ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30'
              : 'bg-red-500/10 border border-red-500/30'
          }`}>
            <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`} />
            <p className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Profile Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <User size={24} />
            Profile Settings
          </h2>

          {loading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-700/50 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={adminData.full_name}
                  onChange={(e) => setAdminData({ ...adminData, full_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email (Read-only)
                </label>
                <input
                  type="email"
                  value={adminData.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-700/30 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
              >
                <Save size={18} />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}
        </div>

        {/* Password Settings */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock size={24} />
            Change Password
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button
              onClick={handleUpdatePassword}
              disabled={saving || !newPassword || !confirmPassword}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
            >
              <Lock size={18} />
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">System Info</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Admin Panel Version</span>
              <span className="text-white font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Database</span>
              <span className="text-white font-medium">Supabase</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Updated</span>
              <span className="text-white font-medium">{new Date().toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;
