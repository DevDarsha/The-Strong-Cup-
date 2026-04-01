import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, LogOut, User, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { signOut } from '../../lib/auth';

interface AdminTopBarProps {
  onMenuToggle: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({ onMenuToggle }) => {
  const [adminName, setAdminName] = useState<string>('Admin');
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('full_name, email')
            .eq('id', user.id)
            .single();

          if (profile?.full_name) {
            setAdminName(profile.full_name);
          } else {
            setAdminName(user.email?.split('@')[0] || 'Admin');
          }
        }
      } catch (error) {
        console.error('[v0] Error fetching admin info:', error);
      }
    };

    fetchAdminInfo();

    // Subscribe to new orders for notifications
    const subscription = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => {
          setNotificationCount((prev) => prev + 1);
          // Auto-clear notification after 5 seconds
          setTimeout(() => setNotificationCount(0), 5000);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <header className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 md:px-8">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-slate-400 hover:text-white transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-semibold text-white hidden md:block">Dashboard</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            className="relative p-2 text-slate-400 hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
          {notificationCount > 0 && (
            <div className="absolute right-0 mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {notificationCount} new order{notificationCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Admin profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors text-white"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium hidden md:block">{adminName}</span>
            <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-700 rounded-lg shadow-lg border border-slate-600 overflow-hidden z-10">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/admin/settings');
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-600 transition-colors text-slate-200 text-sm"
              >
                <User size={16} />
                Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600/20 transition-colors text-red-400 text-sm border-t border-slate-600"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;
