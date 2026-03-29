import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface OrderWithCustomer {
  id: string;
  order_number: string;
  customer_name: string;
  customer_mobile: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  user_id: string;
}

interface UsePaginationOptions {
  pageSize?: number;
}

export const useAdminOrders = (options: UsePaginationOptions = {}) => {
  const [orders, setOrders] = useState<OrderWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = options.pageSize || 20;

  const fetchOrders = useCallback(async (searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('orders')
        .select(
          `
          id,
          order_number,
          total_amount,
          status,
          payment_status,
          created_at,
          user_id,
          user_profiles (
            full_name,
            phone
          )
          `,
          { count: 'exact' }
        );

      // Apply search filter if provided
      if (searchTerm) {
        query = query.or(
          `order_number.ilike.%${searchTerm}%,user_profiles.phone.ilike.%${searchTerm}%`
        );
      }

      // Apply pagination
      const { data, count, error: fetchError } = await query
        .order('created_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (fetchError) throw fetchError;

      const formattedOrders: OrderWithCustomer[] = (data || []).map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.user_profiles?.full_name || 'Unknown',
        customer_mobile: order.user_profiles?.phone || '-',
        total_amount: order.total_amount,
        status: order.status,
        payment_status: order.payment_status,
        created_at: order.created_at,
        user_id: order.user_id,
      }));

      setOrders(formattedOrders);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('[v0] Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('admin-orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          // Refetch orders when any change occurs
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [page, fetchOrders]);

  const goToPage = (pageNum: number) => {
    setPage(Math.max(0, pageNum));
  };

  const nextPage = () => {
    if ((page + 1) * pageSize < totalCount) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    orders,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    pageSize,
    goToPage,
    nextPage,
    prevPage,
    refetch: fetchOrders,
  };
};

export default useAdminOrders;
