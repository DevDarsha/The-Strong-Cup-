import React from 'react';
import { CreditCard } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const Payments: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Verification</h1>
          <p className="text-slate-400">Verify and manage pending payments</p>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Management</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Review and verify pending payments. Check UPI transaction IDs, mark payments as verified or failed, and manage payment disputes.
          </p>
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg inline-block">
            <p className="text-sm text-slate-300">Coming Soon</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Payments;
