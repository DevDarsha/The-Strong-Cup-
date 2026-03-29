import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UseRealtimeDataOptions {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

/**
 * Hook to subscribe to real-time database changes
 * Automatically manages subscription lifecycle
 */
export const useRealtimeData = <T,>(
  options: UseRealtimeDataOptions,
  onDataChange: (data: T) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const subscribe = async () => {
      try {
        channel = supabase
          .channel(`${options.table}-changes`)
          .on(
            'postgres_changes',
            {
              event: options.event || '*',
              schema: 'public',
              table: options.table,
              filter: options.filter,
            },
            (payload) => {
              onDataChange(payload.new as T);
            }
          )
          .on('subscribe', () => {
            setIsConnected(true);
            setError(null);
          })
          .on('system', ({ message, status }) => {
            console.log(`[Supabase] ${status}: ${message}`);
          })
          .subscribe();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Subscription failed'));
        setIsConnected(false);
      }
    };

    subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [options.table, options.event, options.filter, onDataChange]);

  return { isConnected, error };
};
