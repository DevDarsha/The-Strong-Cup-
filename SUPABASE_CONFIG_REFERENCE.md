# Supabase Configuration Reference

Complete reference for all Supabase configuration options and implementation details.

## Table of Contents

1. [Client Initialization](#client-initialization)
2. [Authentication Configuration](#authentication-configuration)
3. [Database Configuration](#database-configuration)
4. [Real-time Configuration](#real-time-configuration)
5. [Security Configuration](#security-configuration)
6. [Environment Variables](#environment-variables)
7. [API Configuration](#api-configuration)
8. [Error Handling](#error-handling)
9. [Advanced Configuration](#advanced-configuration)

## Client Initialization

### Basic Configuration

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,        // Store session in localStorage
    autoRefreshToken: true,       // Auto-refresh before expiry
    detectSessionInBrowser: true, // Detect existing sessions
  },
});
```

### Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `persistSession` | `true` | Persist auth session in browser storage |
| `autoRefreshToken` | `true` | Automatically refresh tokens before expiry |
| `detectSessionInBrowser` | `true` | Detect and restore sessions on page load |
| `storage` | localStorage | Where to store session (localStorage, AsyncStorage, etc.) |
| `storageKey` | `sb-${PROJECT_ID}-auth-token` | Key for session storage |

### Custom Storage (Advanced)

```typescript
// Use custom storage implementation (e.g., AsyncStorage for React Native)
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
  },
});
```

## Authentication Configuration

### Auth Providers

#### Email/Password
```typescript
// Built-in provider - no additional configuration needed
// Users can sign up and sign in with email and password
```

#### OAuth Providers

**Google OAuth Setup**
```typescript
// In Supabase Dashboard: Authentication → Providers → Google

// Configuration required:
// - OAuth 2.0 Client ID (from Google Cloud Console)
// - OAuth 2.0 Client Secret
// - Authorized redirect URIs:
//   - http://localhost:3000/auth/callback (dev)
//   - https://yourdomain.com/auth/callback (prod)

// Frontend implementation:
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

**GitHub OAuth Setup**
```typescript
// Similar to Google
// - Create OAuth App in GitHub Settings
// - Authorization callback URL: https://yourdomain.supabase.co/auth/v1/callback
// - Copy Client ID and Secret to Supabase

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`
  }
});
```

### Password Policy

```typescript
// Configure in Supabase Dashboard: Authentication → Policies

// Default requirements:
// - Minimum 6 characters
// - No special requirements

// To require stronger passwords, implement client-side validation:
const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 number, 1 special char
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};
```

### Session Management

```typescript
// Session timeout (JWT expiration)
// Default: 1 hour (3600 seconds)
// Configure in: Settings → Auth → JWT Expiration

// Refresh token validity: 7 days (default)
// Auto-refresh happens in background

// Manual session check:
const { data, error } = await supabase.auth.getSession();
const session = data.session;

// Manual token refresh:
const { data, error } = await supabase.auth.refreshSession();
```

### Email Configuration

```typescript
// Configure in: Authentication → Email Templates

// Available templates:
// - Confirmation
// - Password Reset
// - Magic Link
// - Change Email
// - Invite

// Custom email from domain:
// Settings → Auth → Email → Custom SMTP
// (Requires premium or custom setup)
```

## Database Configuration

### Connection Settings

```typescript
// Direct connection (backend use only):
// Connection string format:
// postgresql://user:password@host:port/database

// With connection pooling:
// postgresql://user:password@host:6543/database?sslmode=require

// Available in: Settings → Database → Connection String
```

### Connection Pool

```typescript
// Supabase provides two connection methods:

// 1. Direct Connection (1 connection per client)
// - For: Direct database connections from backend
// - Port: 5432
// - Use case: Long-lived connections

// 2. Connection Pooling (shared pool)
// - For: Serverless functions, edge functions
// - Port: 6543
// - Max connections: Based on plan
// - Use case: High-frequency, short connections
```

### Query Configuration

```typescript
// Standard query with options
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('id', value)
  .single();  // Expects single row

// Pagination
const { data, error, count } = await supabase
  .from('table_name')
  .select('*', { count: 'exact' })
  .range(0, 9);  // Get first 10 rows

// Ordering
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .order('created_at', { ascending: false });

// Filtering
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('status', 'active')
  .gt('created_at', '2024-01-01');

// Limit
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .limit(10);
```

## Real-time Configuration

### Enable Real-time

```typescript
// In Supabase Dashboard:
// 1. Go to Realtime section
// 2. Click "Enable Realtime"
// 3. Select tables to enable for real-time

// Per-table basis for fine-grained control
```

### Realtime Channel

```typescript
// Subscribe to changes
const channel = supabase
  .channel('table-changes')
  .on(
    'postgres_changes',
    {
      event: '*',        // INSERT | UPDATE | DELETE | *
      schema: 'public',
      table: 'orders',
      filter: `user_id=eq.${userId}`  // Optional filter
    },
    (payload) => {
      console.log('Change:', payload);
      // Handle: payload.new (new data), payload.old (old data)
    }
  )
  .on('subscribe', () => console.log('Subscribed'))
  .on('unsubscribe', () => console.log('Unsubscribed'))
  .subscribe();

// Cleanup
supabase.removeChannel(channel);
```

### Realtime Options

| Option | Type | Description |
|--------|------|-------------|
| `event` | string | INSERT, UPDATE, DELETE, or * |
| `schema` | string | Database schema (usually 'public') |
| `table` | string | Table name |
| `filter` | string | PostgreSQL filter (optional) |

## Security Configuration

### Row Level Security (RLS)

```sql
-- Enable RLS on table
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policy: users can view own orders
CREATE POLICY "Users can view own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy: users can insert own orders
CREATE POLICY "Users can insert own orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy: users can update own orders
CREATE POLICY "Users can update own orders" 
ON public.orders 
FOR UPDATE 
USING (auth.uid() = user_id);
```

### API Key Management

```typescript
// Frontend: Use Anonymous (Anon) Key
// - Limited scope by RLS policies
// - Safe to expose in frontend code
// - Restricted operations only

// Backend: Use Service Role Key (NEVER in frontend)
// - Full database access
// - Bypass RLS
// - Only for trusted server code
// - Keep in .env, never expose

// In Supabase client:
const anonClient = createClient(url, anonKey);     // Frontend
const serviceClient = createClient(url, serviceKey); // Backend
```

### CORS Configuration

```typescript
// In Supabase Dashboard: Settings → API → CORS

// Add allowed origins:
// - http://localhost:3000 (development)
// - https://yourdomain.com (production)
// - https://www.yourdomain.com (with www)

// CORS headers automatically handled by Supabase
```

## Environment Variables

### Required Variables

```bash
# Vite frontend variables (public, prefixed with VITE_)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend variables (private, no prefix)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

### Optional Variables

```bash
# Database connection strings
POSTGRES_URL=postgresql://user:password@host/dbname
POSTGRES_URL_NON_POOLING=postgresql://user:password@host:5432/dbname
POSTGRES_PRISMA_URL=postgresql://user:password@host/dbname?pgbouncer=true

# Database credentials (if using direct connection)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_PORT=5432
POSTGRES_DATABASE=postgres
```

### Variable Naming Convention

```bash
# Public variables (accessible in browser)
VITE_*=value

# Private variables (backend only)
SECRET_*=value
SUPABASE_*=value (for Supabase-specific variables)
```

## API Configuration

### Request Headers

```typescript
// Supabase automatically adds headers:
// Authorization: Bearer {token}
// Content-Type: application/json

// Custom headers:
const { data, error } = await supabase
  .from('table')
  .select('*')
  .headers({
    'x-custom-header': 'value'
  });
```

### Retry Strategy

```typescript
// Implement retry logic for failed requests
const retryFetch = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
};

const { data, error } = await retryFetch(
  () => supabase.from('table').select('*')
);
```

### Rate Limiting

```typescript
// Implement rate limiting on client side
const createRateLimiter = (maxRequests, windowMs) => {
  const requests = [];
  
  return async (fn) => {
    const now = Date.now();
    requests = requests.filter(t => now - t < windowMs);
    
    if (requests.length >= maxRequests) {
      throw new Error('Rate limit exceeded');
    }
    
    requests.push(now);
    return fn();
  };
};

const limiter = createRateLimiter(10, 60000); // 10 requests per minute
```

## Error Handling

### Common Error Codes

```typescript
// Authentication errors
// SIGNUP_DISABLED - Signup not enabled
// USER_EXISTS - User already registered
// INVALID_CREDENTIALS - Wrong password
// EMAIL_NOT_CONFIRMED - User hasn't verified email
// SESSION_NOT_FOUND - No valid session

// Database errors
// PGRST116 - Requested object not found (404)
// PGRST204 - No content (successful delete)
// 42P01 - Table doesn't exist
// 23505 - Unique constraint violated

// RLS errors
// PGRST301 - RLS policy violation
// 42000 - Permission denied
```

### Error Handler Pattern

```typescript
import { PostgrestError } from '@supabase/supabase-js';

interface ApiError {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
}

const handleError = (error: any): ApiError => {
  if (error?.code) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    };
  }
  
  if (error?.message) {
    return { message: error.message };
  }
  
  return { message: 'An unknown error occurred' };
};

// Usage
try {
  const { data, error } = await supabase.from('table').select();
  if (error) {
    const apiError = handleError(error);
    console.error(`[${apiError.code}] ${apiError.message}`);
  }
} catch (error) {
  const apiError = handleError(error);
  // Handle error
}
```

## Advanced Configuration

### Custom Auth Flows

```typescript
// Sign in with phone number (requires custom setup)
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890',
  channel: 'sms'
});

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
});

// Magic link (email)
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourdomain.com/auth/callback'
  }
});
```

### Batch Operations

```typescript
// Batch insert
const { data, error } = await supabase
  .from('orders')
  .insert([
    { user_id, order_number: 'ORD-001', ... },
    { user_id, order_number: 'ORD-002', ... },
  ]);

// Batch update
const { data, error } = await supabase
  .from('orders')
  .update({ status: 'shipped' })
  .in('id', [id1, id2, id3]);

// Batch delete
const { error } = await supabase
  .from('orders')
  .delete()
  .in('id', [id1, id2, id3]);
```

### Transactions (Edge Functions)

```typescript
// For ACID transactions, use Postgres directly or Edge Functions
// Supabase JS client doesn't support explicit transactions
// Use stored procedures for multi-statement transactions

// Create stored procedure in Supabase:
CREATE FUNCTION create_order_with_items(
  p_user_id uuid,
  p_order_data jsonb,
  p_items jsonb
) RETURNS orders AS $$
DECLARE
  v_order_id uuid;
BEGIN
  INSERT INTO orders (...) VALUES (...) RETURNING id INTO v_order_id;
  INSERT INTO order_items (...) VALUES (...);
  RETURN (SELECT * FROM orders WHERE id = v_order_id);
END;
$$ LANGUAGE plpgsql;

// Call from frontend
const { data, error } = await supabase.rpc('create_order_with_items', {
  p_user_id: userId,
  p_order_data: {...},
  p_items: [...]
});
```

### Vector Search (Embeddings)

```typescript
// Requires pgvector extension
// Use with: OpenAI embeddings, Hugging Face, etc.

// Create vector column
CREATE TABLE documents (
  id uuid PRIMARY KEY,
  content text,
  embedding vector(1536)
);

// Insert with embedding
const { data, error } = await supabase
  .from('documents')
  .insert({
    content: 'Document text',
    embedding: [0.1, 0.2, 0.3, ...] // Vector from OpenAI
  });

// Search with vector similarity
const { data, error } = await supabase
  .rpc('search_documents', {
    query_embedding: [0.1, 0.2, 0.3, ...],
    match_threshold: 0.7,
    match_count: 5
  });
```

## Best Practices Checklist

- [x] Use Anon Key in frontend only
- [x] Keep Service Role Key secret
- [x] Enable RLS on all tables
- [x] Implement proper error handling
- [x] Use TypeScript for type safety
- [x] Cache results when possible
- [x] Implement pagination for large datasets
- [x] Use filters for efficient queries
- [x] Enable Realtime only when needed
- [x] Validate input before database operations
- [x] Use connection pooling for serverless
- [x] Implement retry logic for network failures
- [x] Monitor database usage
- [x] Regular backups (automatic with Supabase)
- [x] Update dependencies regularly

---

For more information, visit [Supabase Documentation](https://supabase.com/docs).
