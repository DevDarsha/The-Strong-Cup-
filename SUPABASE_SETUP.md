# Supabase Integration Guide

This document provides comprehensive setup and configuration instructions for integrating Supabase with The Strong Cup e-commerce application.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Configuration](#configuration)
5. [Database Schema](#database-schema)
6. [Authentication Setup](#authentication-setup)
7. [Frontend Integration](#frontend-integration)
8. [Real-time Features](#real-time-features)
9. [Security & Row Level Security (RLS)](#security--row-level-security-rls)
10. [Best Practices](#best-practices)

## Overview

Supabase provides a complete backend platform built on PostgreSQL with real-time capabilities, authentication, and serverless functions. This integration replaces the current localStorage-based system with a robust, scalable backend.

**Key Benefits:**
- Persistent data storage with PostgreSQL
- Built-in authentication (email/password, OAuth, magic links)
- Real-time subscriptions for live data updates
- Row Level Security (RLS) for data protection
- Serverless functions for custom business logic
- File storage with Supabase Storage
- Ready for horizontal scaling

## Prerequisites

- Supabase account (free tier available at supabase.com)
- Environment variables already configured (integration with v0)
- Node.js 16+ and npm/pnpm installed

## Initial Setup

### Step 1: Supabase Project Creation

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up/log in
3. Create a new project:
   - Choose your region (closer to users = better latency)
   - Set a strong database password (store securely)
   - Wait for project initialization (usually 1-2 minutes)

### Step 2: Retrieve Credentials

In your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`
   - **Service Role Key** → (keep secure, use only in backend/server functions)

### Step 3: Configure Environment Variables

The integration automatically provides these environment variables. They are available as:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for backend operations)

Verify in your v0 Settings → Vars panel.

## Configuration

### Vite Configuration

The project is configured to use Supabase with the following setup:

```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInBrowser: true,
  },
});
```

**Configuration Options:**
- `persistSession: true` - Stores session in localStorage for persistence
- `autoRefreshToken: true` - Automatically refreshes tokens before expiry
- `detectSessionInBrowser: true` - Detects existing sessions on page load

## Database Schema

### Core Tables

You need to create the following tables in Supabase SQL Editor. Replace the existing user-related functionality with these database-backed tables:

#### 1. Users Extended Profile

```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

#### 2. User Addresses

```sql
CREATE TABLE public.user_addresses (
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
```

#### 3. Orders

```sql
CREATE TABLE public.orders (
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
```

#### 4. Order Items

```sql
CREATE TABLE public.order_items (
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
```

#### 5. Cart Items (Optional, for persistent cart)

```sql
CREATE TABLE public.cart_items (
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
```

### Indexes for Performance

Create these indexes to optimize query performance:

```sql
CREATE INDEX idx_user_addresses_user_id ON public.user_addresses(user_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
```

## Authentication Setup

### Email/Password Authentication

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Ensure **Email** provider is enabled
3. Configure email templates (optional, defaults are provided)

### OAuth Setup (Google, GitHub, etc.)

To enable OAuth providers:

1. Go to **Authentication** → **Providers**
2. Click on desired provider (Google, GitHub, etc.)
3. Create OAuth credentials in the provider's console
4. Add Redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://yourdomain.com/auth/callback`

**Example: Google OAuth**
1. Create OAuth 2.0 credentials at [Google Cloud Console](https://console.cloud.google.com)
2. Set Authorized redirect URIs to your app's callback URL
3. Copy Client ID and Client Secret to Supabase provider settings

## Frontend Integration

### 1. Authentication Hook

Use the provided `useAuth` hook to access authentication state:

```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, session, loading, error } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {user ? (
        <div>Welcome, {user.email}</div>
      ) : (
        <div>Please sign in</div>
      )}
    </div>
  );
}
```

### 2. Database Operations

Use the provided utilities for common database operations:

```typescript
import { getUserAddresses, saveUserAddress, createOrder } from '@/lib/database';

// Fetch user addresses
const { data: addresses, error } = await getUserAddresses(userId);

// Save address
const { data: savedAddress, error } = await saveUserAddress(userId, {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  address: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001'
});

// Create order
const { data: order, error } = await createOrder(userId, {
  order_number: 'ORD-001',
  total_amount: 999.99,
  payment_method: 'card',
  shipping_address_id: addressId
});
```

### 3. Real-time Subscriptions

Use the `useRealtimeData` hook for live updates:

```typescript
import { useRealtimeData } from '@/hooks/useRealtimeData';

export function OrderTracker({ orderId }) {
  const [order, setOrder] = useState(null);

  useRealtimeData(
    {
      table: 'orders',
      event: 'UPDATE',
      filter: `id=eq.${orderId}`,
    },
    (newOrder) => setOrder(newOrder)
  );

  return <div>Order Status: {order?.status}</div>;
}
```

## Real-time Features

### Enabling Realtime

1. Go to **Realtime** in Supabase dashboard
2. Click **Enable Realtime** for tables you want to monitor:
   - `orders` (for order updates)
   - `cart_items` (for multi-device cart sync)
   - `user_addresses` (for address changes)

### Realtime Events

Available events:
- `INSERT` - New rows added
- `UPDATE` - Existing rows modified
- `DELETE` - Rows deleted
- `*` - All events

### Example: Real-time Order Updates

```typescript
const { isConnected, error } = useRealtimeData(
  {
    table: 'orders',
    event: 'UPDATE',
    filter: `user_id=eq.${userId}`
  },
  (updatedOrder) => {
    console.log('Order updated:', updatedOrder);
    // Update UI with new order status
  }
);
```

## Security & Row Level Security (RLS)

### Understanding RLS

Row Level Security ensures users can only access their own data. Always enable RLS on production tables.

### Enable RLS on Tables

In SQL Editor, run:

```sql
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
```

### Create RLS Policies

```sql
-- Users can only view their own profile
CREATE POLICY "Users can view own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Users can only view their own addresses
CREATE POLICY "Users can view own addresses" 
ON public.user_addresses 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own addresses
CREATE POLICY "Users can insert own addresses" 
ON public.user_addresses 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses" 
ON public.user_addresses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only view their own orders
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only view items from their orders
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

-- Similar policies for cart_items
CREATE POLICY "Users can view own cart" 
ON public.cart_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" 
ON public.cart_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items" 
ON public.cart_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" 
ON public.cart_items 
FOR DELETE 
USING (auth.uid() = user_id);
```

## Best Practices

### 1. Error Handling

Always handle errors in database operations:

```typescript
const { data, error } = await getUserAddresses(userId);
if (error) {
  console.error('Failed to fetch addresses:', error.message);
  // Show user-friendly error message
  return;
}
```

### 2. Loading States

Show loading indicators during async operations:

```typescript
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const { data, error } = await getUserAddresses(userId);
    // Handle result
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Session Management

Always check authentication state before sensitive operations:

```typescript
const { user } = useAuth();

if (!user) {
  // Redirect to login
  return <Navigate to="/login" />;
}
```

### 4. Data Validation

Validate data before sending to database:

```typescript
const validateAddress = (address: any): boolean => {
  return !!(
    address.full_name?.trim() &&
    address.phone?.trim() &&
    address.address?.trim() &&
    address.city?.trim() &&
    address.pincode?.trim()
  );
};
```

### 5. Pagination

For large datasets, implement pagination:

```typescript
const fetchAddresses = async (userId: string, page = 0, pageSize = 10) => {
  const { data, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', userId)
    .range(page * pageSize, (page + 1) * pageSize - 1);

  return { data, error };
};
```

### 6. Transaction Handling

For complex operations, consider using database transactions or serverless functions.

### 7. Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
const [lastRequest, setLastRequest] = useState(0);
const RATE_LIMIT = 1000; // 1 second between requests

const throttledFetch = async () => {
  const now = Date.now();
  if (now - lastRequest < RATE_LIMIT) {
    console.warn('Rate limited');
    return;
  }
  setLastRequest(now);
  // Fetch data
};
```

## Deployment Checklist

- [ ] All environment variables configured in production
- [ ] Database tables created and indexed
- [ ] RLS policies enabled on all tables
- [ ] Real-time enabled for necessary tables
- [ ] OAuth redirect URLs updated for production
- [ ] Email templates customized (optional)
- [ ] Error handling implemented across app
- [ ] Rate limiting implemented
- [ ] Session timeout configured appropriately
- [ ] Data backup strategy in place

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in your environment.

### Issue: CORS errors

**Solution:** Add your domain to Supabase allowed origins:
1. Go to **Settings** → **API**
2. Add your domain to "URL Configuration"

### Issue: Real-time not working

**Solution:** 
1. Ensure Realtime is enabled for the table
2. Check RLS policies aren't blocking the connection
3. Verify user has SELECT permission on the table

### Issue: Authentication redirects not working

**Solution:** Ensure redirect URLs in OAuth provider match your app's domain exactly.

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JavaScript Client Reference](https://supabase.com/docs/reference/javascript/introduction)
- [Real-time Guide](https://supabase.com/docs/guides/realtime)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Authentication Guide](https://supabase.com/docs/guides/auth)

## Support

For issues or questions:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Visit [Supabase Community](https://discord.supabase.com)
3. Open an issue in the project repository
