import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const Inventory: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-slate-400">Track and manage product stock levels</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Inventory System</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Monitor stock levels across all products. Get alerts for low stock items, track inventory movements, and manage reorder points.
          </p>
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg inline-block">
            <p className="text-sm text-slate-300">Coming Soon</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Inventory;
