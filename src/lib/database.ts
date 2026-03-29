import { supabase } from './supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface DatabaseError extends PostgrestError {
  message: string;
  details?: string;
  hint?: string;
}

/**
 * Generic error handler for database operations
 */
export const handleDatabaseError = (error: any): DatabaseError => {
  if (error?.code) {
    return {
      code: error.code,
      message: error.message || 'An error occurred',
      details: error.details,
      hint: error.hint,
    };
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unknown error occurred',
  };
};

/**
 * Example: Fetch user addresses from database
 * Replace with actual table queries based on your schema
 */
export const getUserAddresses = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleDatabaseError(error) };
  }
};

/**
 * Example: Save/update user address
 * Replace with actual table operations based on your schema
 */
export const saveUserAddress = async (userId: string, address: any) => {
  try {
    const { data, error } = await supabase
      .from('user_addresses')
      .upsert(
        {
          user_id: userId,
          ...address,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleDatabaseError(error) };
  }
};

/**
 * Example: Save order to database
 * Replace with actual table operations based on your schema
 */
export const createOrder = async (userId: string, orderData: any) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          ...orderData,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    return { data: data?.[0], error: null };
  } catch (error) {
    return { data: null, error: handleDatabaseError(error) };
  }
};
