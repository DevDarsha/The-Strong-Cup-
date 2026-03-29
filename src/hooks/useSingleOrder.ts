import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface OrderDetail {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  payment_method: string;
  notes: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  shipping_address_id: string;
  customer: {
    full_name: string;
    email: string;
    phone: string;
  };
  shipping_address: {
    full_name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
  }>;
}

export const useSingleOrder = (orderId: string) => {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch order with all related data
        const { data, error: fetchError } = await supabase
          .from('orders')
          .select(
            `
            id,
            order_number,
            status,
            payment_status,
            total_amount,
            payment_method,
            notes,
            created_at,
            updated_at,
            user_id,
            shipping_address_id,
            user_profiles (
              full_name,
              email,
              phone
            ),
            user_addresses (
              full_name,
              email,
              phone,
              address,
              city,
              state,
              pincode
            ),
            order_items (
              id,
              product_name,
              quantity,
              unit_price,
              total_price
            )
            `
          )
          .eq('id', orderId)
          .single();

        if (fetchError) throw fetchError;

        const formattedOrder: OrderDetail = {
          id: data.id,
          order_number: data.order_number,
          status: data.status,
          payment_status: data.payment_status,
          total_amount: data.total_amount,
          payment_method: data.payment_method,
          notes: data.notes || '',
          created_at: data.created_at,
          updated_at: data.updated_at,
          user_id: data.user_id,
          shipping_address_id: data.shipping_address_id,
          customer: {
            full_name: data.user_profiles?.full_name || 'Unknown',
            email: data.user_profiles?.email || '',
            phone: data.user_profiles?.phone || '',
          },
          shipping_address: data.user_addresses || {
            full_name: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
          },
          items: data.order_items || [],
        };

        setOrder(formattedOrder);
      } catch (err) {
        console.error('[v0] Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();

    // Subscribe to real-time updates for this order
    const channel = supabase
      .channel(`order:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        () => {
          fetchOrder();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [orderId]);

  const updateStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // Update local state
      setOrder({
        ...order,
        status: newStatus,
        updated_at: new Date().toISOString(),
      });

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      console.error('[v0] Error updating order status:', err);
      return { success: false, error: errorMessage };
    }
  };

  const updatePaymentStatus = async (newPaymentStatus: string, verificationNote?: string) => {
    if (!order) return;

    try {
      const updateData: any = { payment_status: newPaymentStatus };
      if (verificationNote) {
        updateData.notes = `${order.notes}\n[Payment ${newPaymentStatus}] ${verificationNote}`;
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', order.id);

      if (updateError) throw updateError;

      // Update local state
      setOrder({
        ...order,
        payment_status: newPaymentStatus,
        notes: updateData.notes || order.notes,
        updated_at: new Date().toISOString(),
      });

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment status';
      console.error('[v0] Error updating payment status:', err);
      return { success: false, error: errorMessage };
    }
  };

  const addNote = async (newNote: string) => {
    if (!order) return;

    try {
      const updatedNotes = order.notes ? `${order.notes}\n${newNote}` : newNote;

      const { error: updateError } = await supabase
        .from('orders')
        .update({ notes: updatedNotes })
        .eq('id', order.id);

      if (updateError) throw updateError;

      setOrder({
        ...order,
        notes: updatedNotes,
        updated_at: new Date().toISOString(),
      });

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add note';
      console.error('[v0] Error adding note:', err);
      return { success: false, error: errorMessage };
    }
  };

  return {
    order,
    loading,
    error,
    updateStatus,
    updatePaymentStatus,
    addNote,
  };
};

export default useSingleOrder;
