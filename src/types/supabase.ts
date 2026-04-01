import { User, Session } from '@supabase/supabase-js';

/**
 * Extended user profile with app-specific fields
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

/**
 * User address for shipping
 */
export interface UserAddress {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Order status enum
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

/**
 * Order information
 */
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  payment_method?: string;
  payment_status: PaymentStatus;
  shipping_address_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Order item (product in order)
 */
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

/**
 * Cart item for persistent cart
 */
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  created_at: string;
  updated_at: string;
}

/**
 * Auth context state
 */
export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
  signUp: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ data: any; error: any }>;
  updatePassword: (newPassword: string) => Promise<{ data: any; error: any }>;
}

/**
 * Database operation response
 */
export interface DatabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
}

/**
 * Database error
 */
export interface DatabaseError {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
