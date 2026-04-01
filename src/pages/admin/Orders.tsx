import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { OrderStatusBadge } from '../../components/admin/OrderStatusBadge';
import { useAdminOrders } from '../../hooks/useAdminOrders';

export const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const {
    orders,
    loading,
    page,
    totalPages,
    totalCount,
    pageSize,
    nextPage,
    prevPage,
    goToPage,
  } = useAdminOrders({ pageSize: 20 });

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      goToPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, goToPage]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const startIndex = page * pageSize + 1;
  const endIndex = Math.min((page + 1) * pageSize, totalCount);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Orders Management</h1>
          <p className="text-slate-400">Manage and track all customer orders in real-time</p>
        </div>

        {/* Search bar */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by Order ID or Mobile Number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden">
          {/* Table header with count */}
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-700/30 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">All Orders</h2>
              <p className="text-sm text-slate-400 mt-1">
                Showing {startIndex} to {endIndex} of {totalCount} orders
              </p>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs">Live updating</span>
              </div>
            )}
          </div>

          {/* Table */}
          {loading && orders.length === 0 ? (
            <div className="p-8">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-700/50 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-400 mb-2">No orders found</p>
              <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-700/30">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Mobile</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-mono text-blue-400">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 text-sm text-white font-medium">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {order.customer_mobile}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {formatCurrency(order.total_amount)}
                      </td>
                      <td className="px-6 py-4">
                        <OrderStatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          to={`/admin/orders/${order.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-slate-700 bg-slate-700/20 flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Page {page + 1} of {totalPages || 1}
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={page === 0 || loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white transition-colors"
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={page >= totalPages - 1 || loading}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-white transition-colors"
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
