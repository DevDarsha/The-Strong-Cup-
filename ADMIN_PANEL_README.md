## Admin Panel - Complete Implementation Guide

The admin panel is a production-ready order management system with real-time updates, secure authentication, and professional UI components.

---

## Quick Start

### 1. Database Setup

First, run the admin migration script in your Supabase SQL Editor:

```
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Copy the contents of scripts/admin-setup.sql
4. Execute the migration
```

This will:
- Add `is_admin` field to `user_profiles` table
- Create `products` table for future product management
- Set up Row Level Security (RLS) policies for admin access

### 2. Create Admin User

After migration, mark a user as admin:

```sql
UPDATE public.user_profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

### 3. Access Admin Panel

Navigate to: `http://localhost:5173/admin/login`

Login with:
- Email: your admin email
- Password: your password

---

## File Structure

```
src/
├── pages/
│   ├── AdminLogin.tsx                    # Admin login page
│   └── admin/
│       ├── Dashboard.tsx                 # Dashboard with KPIs
│       ├── Orders.tsx                    # Order management table
│       ├── OrderDetails.tsx              # Order details & status update
│       ├── Products.tsx                  # Product management (placeholder)
│       ├── Inventory.tsx                 # Inventory tracking (placeholder)
│       ├── Payments.tsx                  # Payment verification (placeholder)
│       └── Settings.tsx                  # Admin settings & profile
├── components/
│   ├── AdminRoute.tsx                    # Route protection wrapper
│   └── admin/
│       ├── AdminLayout.tsx               # Main layout container
│       ├── AdminSidebar.tsx              # Navigation sidebar
│       ├── AdminTopBar.tsx               # Top navigation bar
│       ├── KPICard.tsx                   # KPI card component
│       └── OrderStatusBadge.tsx          # Status badge component
├── hooks/
│   ├── useAdminOrders.ts                 # Fetch & manage orders
│   ├── useOrderStats.ts                  # Fetch dashboard stats
│   └── useSingleOrder.ts                 # Fetch single order details
├── context/
│   └── AdminContext.tsx                  # Admin notifications & toasts
├── lib/
│   ├── auth.ts                           # Auth utilities (extended)
│   ├── supabase.ts                       # Supabase client
│   └── database.ts                       # Database utilities
└── types/
    └── supabase.ts                       # TypeScript types

scripts/
└── admin-setup.sql                       # Admin migration script
```

---

## Features

### Admin Login (`/admin/login`)

- Secure email & password authentication using Supabase Auth
- Admin role verification on login
- Persistent session management
- Auto-redirect to dashboard if already logged in

### Dashboard (`/admin/dashboard`)

Real-time KPI cards:
- **Total Orders**: Count of all orders
- **Today's Orders**: Orders placed today
- **Total Revenue**: Sum of delivered orders
- **Pending Orders**: Orders awaiting action

Recent orders preview with direct links to order details.

### Order Management (`/admin/orders`)

**Table Features:**
- Search by Order ID or Mobile Number
- View order status with color-coded badges
- Pagination (20 orders per page)
- Real-time updates as orders change
- Click any order to view full details

**Order Status Workflow:**
```
Pending → Confirmed → Packed → Shipped → Delivered
```

### Order Details (`/admin/orders/:orderId`)

**Customer Information:**
- Full name, email, phone
- Shipping address with city, state, pincode

**Order Items:**
- Product name, quantity, unit price
- Itemized breakdown with totals

**Order Management:**
- Status workflow buttons
- Payment verification (Pending, Verified, Failed)
- Internal notes for order tracking
- Download invoice (placeholder)

**Real-time Updates:**
- Subscribes to individual order changes
- Instant UI updates when status changes

### Admin Settings (`/admin/settings`)

- Update profile (name)
- Change password
- View system information

---

## Real-Time Features

### Order Subscriptions

The system subscribes to database changes in real-time:

```typescript
// Orders table subscription
supabase.channel('admin-orders').on(
  'postgres_changes',
  { event: '*', schema: 'public', table: 'orders' },
  () => { /* refetch orders */ }
)

// Individual order subscription
supabase.channel(`order:${orderId}`).on(
  'postgres_changes',
  { 
    event: '*', 
    schema: 'public', 
    table: 'orders',
    filter: `id=eq.${orderId}`
  },
  () => { /* update order */ }
)
```

### Notifications

New orders trigger:
1. Toast notification with order number
2. Notification bell update
3. Beep sound alert (optional)

Managed via `AdminContext` for global access.

---

## Security

### Authentication

- Email/password authentication via Supabase Auth
- Admin role verification before access
- Session-based authentication
- Automatic logout on auth state change

### Row Level Security (RLS)

```sql
-- Admins can view ALL orders
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Regular users can only view their orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);
```

### Route Protection

```typescript
<AdminRoute>
  <Dashboard />
</AdminRoute>
```

The `AdminRoute` wrapper:
- Checks authentication status
- Verifies admin role
- Redirects unauthorized users to `/admin/login`
- Shows loading state during verification

---

## API Integration

### Supabase Queries

**Fetch Orders with Pagination:**
```typescript
const { data, count } = await supabase
  .from('orders')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 19);
```

**Update Order Status:**
```typescript
await supabase
  .from('orders')
  .update({ status: 'shipped' })
  .eq('id', orderId);
```

**Fetch Single Order with Relations:**
```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    id, order_number, status,
    user_profiles (full_name, email, phone),
    user_addresses (*),
    order_items (*)
  `)
  .eq('id', orderId)
  .single();
```

---

## Customization

### Adding New Admin Pages

1. Create new page in `src/pages/admin/NewPage.tsx`
2. Wrap with `AdminLayout` component
3. Add route in `App.tsx` with `AdminRoute` protection
4. Add navigation item to `AdminSidebar`

### Styling

The admin panel uses:
- **Colors**: Slate grays with blue/green accents
- **Theme**: Dark mode (slate-800 backgrounds)
- **Framework**: Tailwind CSS
- **Icons**: Lucide React

Override colors in design tokens or component level.

### Real-time Subscriptions

Add subscription to any component:

```typescript
useEffect(() => {
  const channel = supabase
    .channel('my-channel')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'my_table'
    }, (payload) => {
      // Handle update
    })
    .subscribe();

  return () => channel.unsubscribe();
}, []);
```

---

## Troubleshooting

### Admin Login Not Working

1. Verify user exists in `auth.users` in Supabase
2. Check `user_profiles.is_admin = true`
3. Clear browser cache and cookies
4. Check console for error messages

### Real-time Updates Not Working

1. Verify Realtime is enabled in Supabase Settings
2. Check RLS policies allow the operation
3. Ensure subscription channel name is unique
4. Check browser console for WebSocket errors

### Orders Not Showing

1. Check orders exist in database
2. Verify RLS policy allows admin access
3. Check order_number, user_id, and timestamps are valid
4. Run migration script again if needed

---

## Performance Optimization

### Pagination

Orders page loads 20 orders per page by default. Adjust `pageSize` in `useAdminOrders`:

```typescript
const { orders } = useAdminOrders({ pageSize: 50 });
```

### Caching

Dashboard stats refresh every 30 seconds by default:

```typescript
// In useOrderStats
const interval = setInterval(fetchStats, 30000); // 30 seconds
```

### Real-time Debouncing

Search is debounced by 500ms to prevent excessive queries:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500);
  return () => clearTimeout(timer);
}, [searchTerm]);
```

---

## Next Steps

### Future Enhancements

1. **Products Management**: Full CRUD for products with image upload
2. **Inventory System**: Stock tracking and low-stock alerts
3. **Analytics Dashboard**: Revenue charts and trends
4. **Bulk Actions**: Update multiple orders at once
5. **Export**: Download orders as CSV/PDF
6. **Admin Activity Logs**: Track admin actions for audit
7. **Multi-admin Support**: Role-based access control
8. **Email Notifications**: Auto-send customer updates

### Integration Points

- Payment gateway reconciliation
- Shipping API integration
- Email notification service
- SMS alerts for new orders
- Google Analytics integration

---

## Support & Testing

### Manual Testing Checklist

- [ ] Admin login/logout works
- [ ] Dashboard KPIs update in real-time
- [ ] Orders table loads and paginates
- [ ] Search filters work correctly
- [ ] Order status updates reflect in real-time
- [ ] Payment verification works
- [ ] Notes can be added to orders
- [ ] Settings page saves profile changes
- [ ] Unauthorized users cannot access admin pages
- [ ] RLS policies prevent unauthorized data access

### Performance Testing

- Load test with 1000+ orders
- Test simultaneous status updates
- Verify real-time update latency
- Check database query performance

---

## License & Credits

Built with:
- React 19
- Supabase (PostgreSQL + Auth)
- Tailwind CSS
- Lucide React Icons
- React Router v7

For detailed Supabase setup, see `SUPABASE_SETUP.md`.
