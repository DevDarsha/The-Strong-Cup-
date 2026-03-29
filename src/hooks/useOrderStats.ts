import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface OrderStats {
  totalOrders: number;
  todaysOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  loading: boolean;
  error: string | null;
}

export const useOrderStats = (): OrderStats & { refetch: () => Promise<void> } => {
  const [stats, setStats] = useState<OrderStats>({
    totalOrders: 0,
    todaysOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    loading: true,
    error: null,
  });

  const fetchStats = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true, error: null }));

      const today = new Date().toISOString().split('T')[0];
      const startOfDay = `${today}T00:00:00Z`;
      const endOfDay = `${today}T23:59:59Z`;

      // Fetch all stats in parallel
      const [totalResult, todayResult, revenueResult, pendingResult] = await Promise.all([
        // Total orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true }),
        
        // Today's orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .gte('created_at', startOfDay)
          .lte('created_at', endOfDay),
        
        // Total revenue (sum of completed orders)
        supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'delivered'),
        
        // Pending orders count
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
      ]);

      let totalOrders = 0;
      let todaysOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;

      if (!totalResult.error && totalResult.count) {
        totalOrders = totalResult.count;
      }

      if (!todayResult.error && todayResult.count) {
        todaysOrders = todayResult.count;
      }

      if (!revenueResult.error && revenueResult.data) {
        totalRevenue = revenueResult.data.reduce(
          (sum, order) => sum + parseFloat(order.total_amount.toString()),
          0
        );
      }

      if (!pendingResult.error && pendingResult.count) {
        pendingOrders = pendingResult.count;
      }

      setStats({
        totalOrders,
        todaysOrders,
        totalRevenue,
        pendingOrders,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error('[v0] Error fetching order stats:', err);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch stats',
      }));
    }
  };

  useEffect(() => {
    fetchStats();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('order-stats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          // Refetch stats when orders change
          fetchStats();
        }
      )
      .subscribe();

    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return {
    ...stats,
    refetch: fetchStats,
  };
};

export default useOrderStats;
