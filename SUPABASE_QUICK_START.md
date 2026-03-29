# Supabase Integration - Quick Start Guide

Get up and running with Supabase in 10 minutes.

## 5-Minute Setup

### 1. Verify Environment Variables

Check that your Vercel project has these variables in Settings → Vars:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

If missing, they need to be added in the Supabase integration settings.

### 2. Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project" (sign up if needed)
3. Create new project:
   - Choose your region (pick closest to your users)
   - Set database password (save it securely)
   - Wait 1-2 minutes for initialization

### 3. Get Your Credentials

In Supabase dashboard:
1. Settings → API
2. Copy **Project URL** and **Anon Public Key**
3. These should already be in Vercel from the integration

### 4. Initialize Database

1. Go to SQL Editor in Supabase dashboard
2. Copy entire content from `/scripts/init-database.sql`
3. Paste into SQL editor and click "Run"
4. Wait for completion (should show success messages)

**That's it!** Your database is ready.

## Common Tasks

### Use Authentication in a Component

```typescript
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {user ? (
        <p>Welcome, {user.email}</p>
      ) : (
        <p>Please sign in</p>
      )}
    </div>
  );
}
```

### Sign In a User

```typescript
import { signIn } from '@/lib/auth';

const { data, error } = await signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (error) {
  console.error('Sign in failed:', error);
} else {
  console.log('Signed in!', data);
}
```

### Save User Address to Database

```typescript
import { saveUserAddress } from '@/lib/database';

const { data, error } = await saveUserAddress(userId, {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '9876543210',
  address: '123 Main St',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001'
});

if (error) {
  console.error('Save failed:', error);
} else {
  console.log('Address saved!', data);
}
```

### Fetch User Addresses

```typescript
import { getUserAddresses } from '@/lib/database';

const { data: addresses, error } = await getUserAddresses(userId);

if (error) {
  console.error('Fetch failed:', error);
} else {
  console.log('Addresses:', addresses);
}
```

### Create an Order

```typescript
import { createOrder } from '@/lib/database';

const { data: order, error } = await createOrder(userId, {
  order_number: 'ORD-12345',
  total_amount: 999.99,
  payment_method: 'card',
  shipping_address_id: addressId
});

if (error) {
  console.error('Order creation failed:', error);
} else {
  console.log('Order created!', order.id);
}
```

### Listen for Real-time Updates

```typescript
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useState } from 'react';

export function OrderTracker({ orderId }) {
  const [order, setOrder] = useState(null);

  const { isConnected, error } = useRealtimeData(
    {
      table: 'orders',
      event: 'UPDATE',
      filter: `id=eq.${orderId}`
    },
    (updatedOrder) => setOrder(updatedOrder)
  );

  return (
    <div>
      {!isConnected && <p>Not connected</p>}
      {error && <p>Error: {error.message}</p>}
      {order && <p>Status: {order.status}</p>}
    </div>
  );
}
```

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Main Supabase client
│   ├── auth.ts                  # Auth functions
│   └── database.ts              # Database helpers
├── hooks/
│   ├── useAuth.ts               # Get auth state
│   └── useRealtimeData.ts       # Subscribe to changes
├── types/
│   └── supabase.ts              # TypeScript types
└── components/
    └── AuthExample.tsx          # Example auth UI

scripts/
└── init-database.sql            # Database setup
```

## Available Functions

### Authentication (`src/lib/auth.ts`)
- `signUp(email, password)` - Create new account
- `signIn(email, password)` - Sign in
- `signOut()` - Sign out
- `signInWithOAuth(provider)` - OAuth (Google, GitHub)
- `resetPassword(email)` - Password reset
- `updatePassword(newPassword)` - Change password

### Database (`src/lib/database.ts`)
- `getUserAddresses(userId)` - Get user addresses
- `saveUserAddress(userId, address)` - Save/update address
- `createOrder(userId, order)` - Create order

### Hooks
- `useAuth()` - Get current user & auth state
- `useRealtimeData(options, callback)` - Subscribe to table changes

## TypeScript Types

Import types from `src/types/supabase.ts`:

```typescript
import type { 
  UserProfile, 
  UserAddress, 
  Order, 
  OrderItem 
} from '@/types/supabase';

const address: UserAddress = {
  id: '123',
  user_id: '456',
  full_name: 'John Doe',
  // ... rest of fields
};
```

## Troubleshooting

### "Missing Supabase environment variables"
- Check Vercel Settings → Vars
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart development server

### Authentication not working
- Check email verification is enabled (Auth → Providers)
- Verify database tables exist (check SQL execution completed)
- Check browser console for specific errors

### "Permission denied" errors
- Enable RLS on tables (check database initialization completed)
- Verify RLS policies exist
- Check user is authenticated (`useAuth` should show user)

### Real-time updates not working
- Enable Realtime in Supabase dashboard for the table
- Check table name is spelled correctly
- Ensure RLS policy allows SELECT

### CORS errors
- Go to Supabase Settings → API
- Add your domain to URL Configuration
- For localhost, it should already be allowed

## Next Steps

1. **Set up authentication UI**: Create login/signup pages using `AuthExample.tsx` as reference
2. **Replace localStorage**: Update Checkout to save to database instead of localStorage
3. **Add user profiles**: Create page to edit user information
4. **Enable Real-time**: Turn on Realtime for `orders` table for live tracking
5. **Set up OAuth**: Add Google/GitHub login (optional)

## Learn More

- **Full Setup Guide**: See `SUPABASE_SETUP.md`
- **Integration Checklist**: See `INTEGRATION_CHECKLIST.md`
- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client Docs**: https://supabase.com/docs/reference/javascript

## Example: Complete Sign-In Flow

```typescript
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { signIn } from '@/lib/auth';

export function SignInPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await signIn({ email, password });
    if (error) {
      setError(error);
    } else {
      // Redirect to home page
      window.location.href = '/';
    }
  };

  if (user) {
    return <p>Already signed in as {user.email}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500">{error}</p>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      
      <button type="submit">Sign In</button>
    </form>
  );
}
```

## Performance Tips

1. **Use pagination** for large datasets:
   ```typescript
   .range(page * 10, (page + 1) * 10 - 1)
   ```

2. **Cache results** with React hooks:
   ```typescript
   const [cached, setCached] = useState(null);
   if (cached) return cached;
   ```

3. **Only subscribe when needed**:
   ```typescript
   useEffect(() => {
     if (shouldSubscribe) {
       subscribe();
     }
   }, [shouldSubscribe]);
   ```

4. **Limit real-time subscriptions**: Only subscribe to tables you need

## Security Checklist

- [x] Using Anon Key in frontend (limited scope)
- [x] Never exposing Service Role Key
- [ ] RLS policies enabled on all tables
- [ ] All queries using `auth.uid()` checks
- [ ] Validating user input before database operations
- [ ] Using HTTPS in production
- [ ] Environment variables not committed to git

---

**Need help?** Check `SUPABASE_SETUP.md` for detailed information.
