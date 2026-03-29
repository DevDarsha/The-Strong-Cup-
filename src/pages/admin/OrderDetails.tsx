import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Check, X, AlertCircle } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { OrderStatusBadge } from '../../components/admin/OrderStatusBadge';
import { useSingleOrder } from '../../hooks/useSingleOrder';

const statusWorkflow = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { order, loading, error, updateStatus, updatePaymentStatus, addNote } = useSingleOrder(orderId || '');
  
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [paymentUpdating, setPaymentUpdating] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setStatusUpdating(true);
    setStatusError(null);

    const result = await updateStatus(newStatus);
    if (!result.success) {
      setStatusError(result.error || 'Failed to update status');
    }

    setStatusUpdating(false);
  };

  const handlePaymentVerification = async (verified: boolean) => {
    setPaymentUpdating(true);
    setPaymentError(null);

    const result = await updatePaymentStatus(verified ? 'verified' : 'failed');
    if (!result.success) {
      setPaymentError(result.error || 'Failed to update payment status');
    }

    setPaymentUpdating(false);
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;

    setAddingNote(true);
    const result = await addNote(noteText);
    
    if (result.success) {
      setNoteText('');
    }

    setAddingNote(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="h-96 bg-slate-700/50 rounded-lg animate-pulse"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <button
            onClick={() => navigate('/admin/orders')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <div className="flex gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-300 mb-1">Error Loading Order</h3>
                <p className="text-red-200 text-sm">{error || 'Order not found'}</p>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const currentStatusIndex = statusWorkflow.indexOf(order.status);
  const nextStatuses = statusWorkflow.slice(currentStatusIndex + 1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Orders
        </button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{order.order_number}</h1>
            <p className="text-slate-400">Order placed on {formatDate(order.created_at)}</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Download size={18} />
            Download Invoice
          </button>
        </div>

        {/* Status error */}
        {statusError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{statusError}</p>
          </div>
        )}

        {/* Payment error */}
        {paymentError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-200 text-sm">{paymentError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Status</h2>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400">Current Status</span>
                  <OrderStatusBadge status={order.status} size="md" />
                </div>
                <p className="text-sm text-slate-500">Last updated: {formatDate(order.updated_at)}</p>
              </div>

              {/* Status update buttons */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Update Status To:</label>
                <div className="grid grid-cols-2 gap-2">
                  {nextStatuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(status)}
                      disabled={statusUpdating}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 text-white rounded-lg transition-colors text-sm font-medium capitalize"
                    >
                      {status}
                    </button>
                  ))}
                  {nextStatuses.length === 0 && (
                    <p className="text-sm text-slate-500">Order is in final status</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Order Items</h2>
              
              {order.items.length === 0 ? (
                <p className="text-slate-400 text-center py-6">No items in this order</p>
              ) : (
                <div className="space-y-3 divide-y divide-slate-700">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-white">{item.product_name}</p>
                          <p className="text-sm text-slate-400 mt-1">
                            Qty: <span className="font-semibold">{item.quantity}</span> × {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                        <p className="font-semibold text-white">{formatCurrency(item.total_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-lg font-semibold text-white">Total Amount</span>
                <span className="text-2xl font-bold text-green-400">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Internal Notes</h2>
              
              {order.notes && (
                <div className="mb-4 p-3 bg-slate-700/50 border border-slate-700 rounded-lg">
                  <p className="text-sm text-slate-300 whitespace-pre-wrap">{order.notes}</p>
                </div>
              )}

              <div className="space-y-2">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add internal note..."
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  rows={3}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || addingNote}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {addingNote ? 'Adding...' : 'Add Note'}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Customer Info</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 mb-1">Name</p>
                  <p className="text-white font-medium">{order.customer.full_name}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Email</p>
                  <p className="text-white font-medium break-all">{order.customer.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 mb-1">Phone</p>
                  <p className="text-white font-medium">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Shipping Address</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="font-medium text-white">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                <p>{order.shipping_address.phone}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Payment Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Method</p>
                  <p className="text-white capitalize font-medium">{order.payment_method || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Status</p>
                  <div className="flex gap-2">
                    {order.payment_status === 'pending' && (
                      <>
                        <button
                          onClick={() => handlePaymentVerification(true)}
                          disabled={paymentUpdating}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <Check size={16} />
                          Verify
                        </button>
                        <button
                          onClick={() => handlePaymentVerification(false)}
                          disabled={paymentUpdating}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          <X size={16} />
                          Failed
                        </button>
                      </>
                    )}
                    {order.payment_status !== 'pending' && (
                      <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        order.payment_status === 'verified'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {order.payment_status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetails;
