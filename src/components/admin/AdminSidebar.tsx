import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Boxes, 
  CreditCard, 
  Settings,
  X,
  ChevronLeft
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onMobileMenuToggle: () => void;
  mobileMenuOpen: boolean;
}

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Inventory', icon: Boxes, path: '/admin/inventory' },
  { label: 'Payments', icon: CreditCard, path: '/admin/payments' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isOpen, 
  onToggle,
  onMobileMenuToggle,
  mobileMenuOpen
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative top-0 left-0 h-full z-50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-slate-800 border-r border-slate-700 flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          {isOpen && (
            <h2 className="text-lg font-bold text-white truncate">Admin</h2>
          )}
          <button
            onClick={isOpen ? onToggle : onMobileMenuToggle}
            className="lg:block hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <ChevronLeft size={20} /> : <ChevronLeft size={20} className="rotate-180" />}
          </button>
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onMobileMenuToggle}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }
                `}
                title={!isOpen ? item.label : undefined}
              >
                <Icon size={20} className="flex-shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {item.label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info */}
        {isOpen && (
          <div className="border-t border-slate-700 p-4 text-xs text-slate-500">
            <p className="mb-2 font-medium text-slate-400">Admin Panel v1.0</p>
            <p>Real-time order management</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
