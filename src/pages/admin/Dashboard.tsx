import React from 'react';
import { TrendingUp, ShoppingCart, DollarSign, Clock } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { KPICard } from '../../components/admin/KPICard';
import { useOrderStats } from '../../hooks/useOrderStats';
import { useAdminOrders } from '../../hooks/useAdminOrders';

export const AdminDashboard: React.FC = () => {
  const { totalOrders, todaysOrders, totalRevenue, pendingOrders, loading: statsLoading } = useOrderStats();
  const { orders, loading: ordersLoading } = useAdminOrders({ pageSize: 5 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome to your admin dashboard. Real-time overview of your business.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingCart}
            color="blue"
            loading={statsLoading}
          />
          <KPICard
            title="Today's Orders"
            value={todaysOrders}
            icon={TrendingUp}
            color="green"
            loading={statsLoading}
          />
          <KPICard
            title="Total Revenue"
            value={formatCurrency(totalRevenue)}
            icon={DollarSign}
            color="purple"
            loading={statsLoading}
          />
          <KPICard
            title="Pending Orders"
            value={pendingOrders}
            icon={Clock}
            color="orange"
            loading={statsLoading}
          />
        </div>

        {/* Recent Orders Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <p className="text-sm text-slate-400 mt-1">Latest 5 orders from your customers</p>
          </div>

          {ordersLoading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-700/50 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-400">No orders yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/30">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-blue-400">
                        {order.order_number.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === 'pending'
                            ? 'bg-red-500/20 text-red-300'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : order.status === 'shipped'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-green-500/20 text-green-300'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-4 border-t border-slate-700 bg-slate-700/20">
            <a
              href="/admin/orders"
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View all orders →
            </a>
          </div>
        </div>

        {/* Stats info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Last Updated</p>
            <p className="text-lg font-semibold text-white">{new Date().toLocaleTimeString('en-IN')}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Page Status</p>
            <p className="text-lg font-semibold text-green-400">Live & Updating</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Connection</p>
            <p className="text-lg font-semibold text-green-400">Connected</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
