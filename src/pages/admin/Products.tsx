import React from 'react';
import { Plus, Search } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';

export const Products: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
            <p className="text-slate-400">Manage your product inventory</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Coming Soon */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
            <Plus className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Product Management</h2>
          <p className="text-slate-400 max-w-md mx-auto">
            Add, edit, and manage your products. This section will allow you to upload product images, set prices, manage stock levels, and organize products with tags.
          </p>
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg inline-block">
            <p className="text-sm text-slate-300">Coming Soon</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
