-- Supabase Database Initialization Script
-- This script creates all necessary tables and indexes for The Strong Cup application
-- Run this in your Supabase SQL Editor

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- User Profiles (extends auth.users with app-specific fields)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- User Addresses
CREATE TABLE IF NOT EXISTS public.user_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  order_number VARCHAR(50) NOT NULL UNIQUE,
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  shipping_address_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES public.user_addresses(id)
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- Cart Items (for persistent cart across sessions)
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addresses_default ON public.user_addresses(user_id, is_default);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_updated ON public.cart_items(user_id, updated_at DESC);

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.cart_items ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- User Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
CREATE POLICY "Users can insert own profile" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- User Addresses Policies
DROP POLICY IF EXISTS "Users can view own addresses" ON public.user_addresses;
CREATE POLICY "Users can view own addresses" 
ON public.user_addresses 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addresses" ON public.user_addresses;
CREATE POLICY "Users can insert own addresses" 
ON public.user_addresses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own addresses" ON public.user_addresses;
CREATE POLICY "Users can update own addresses" 
ON public.user_addresses 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own addresses" ON public.user_addresses;
CREATE POLICY "Users can delete own addresses" 
ON public.user_addresses 
FOR DELETE 
USING (auth.uid() = user_id);

-- Orders Policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Order Items Policies
DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
CREATE POLICY "Users can insert own order items" 
ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

-- Cart Items Policies
DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
CREATE POLICY "Users can view own cart" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cart items" ON public.cart_items;
CREATE POLICY "Users can insert own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart items" ON public.cart_items;
CREATE POLICY "Users can update own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cart items" ON public.cart_items;
CREATE POLICY "Users can delete own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================================================
-- 5. CREATE FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_addresses_updated_at ON public.user_addresses;
CREATE TRIGGER update_user_addresses_updated_at
  BEFORE UPDATE ON public.user_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- INITIALIZATION COMPLETE
-- ============================================================================
-- All tables, indexes, RLS policies, and triggers have been created successfully.
-- 
-- Next steps:
-- 1. Enable Realtime for tables that need real-time updates
-- 2. Configure Authentication providers in Supabase dashboard
-- 3. Update your frontend to use the new database tables
-- 4. Test the integration thoroughly
