# Admin Panel - Quick Reference Guide

## Access Points

| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/admin/login` | Admin login | No |
| `/admin/dashboard` | Main dashboard with KPIs | Yes |
| `/admin/orders` | Order management table | Yes |
| `/admin/orders/:id` | Order details & management | Yes |
| `/admin/products` | Product management | Yes |
| `/admin/inventory` | Stock tracking | Yes |
| `/admin/payments` | Payment verification | Yes |
| `/admin/settings` | Admin profile & settings | Yes |

## Key Files Reference

```
src/pages/AdminLogin.tsx              Login page (email/password)
src/pages/admin/Dashboard.tsx         KPI dashboard (real-time)
src/pages/admin/Orders.tsx            Orders table with search
src/pages/admin/OrderDetails.tsx      Order details & status update
src/pages/admin/Settings.tsx          Admin profile management

src/components/AdminRoute.tsx         Route protection wrapper
src/components/admin/AdminLayout.tsx  Main layout container
src/components/admin/AdminSidebar.tsx Sidebar navigation (6 items)
src/components/admin/AdminTopBar.tsx  Top bar with profile & logout
src/components/admin/KPICard.tsx      Reusable KPI card component

src/hooks/useAdminOrders.ts           Fetch & manage orders
src/hooks/useOrderStats.ts            Fetch dashboard KPIs
src/hooks/useSingleOrder.ts           Fetch & update single order

src/context/AdminContext.tsx          Notifications & global state
src/lib/auth.ts                       Auth utilities (extended)
```

## Common Tasks

### Protect a Route
```tsx
<AdminRoute>
  <YourComponent />
</AdminRoute>
```

### Show Toast Notification
```tsx
const { addToast } = useAdmin();
addToast('Order updated!', 'success', 4000);
```

### Fetch All Orders
```tsx
const { orders, loading, error } = useAdminOrders({ pageSize: 20 });
```

### Fetch Dashboard Stats
```tsx
const { totalOrders, todaysOrders, totalRevenue, pendingOrders } = useOrderStats();
```

### Fetch Single Order
```tsx
const { order, updateStatus, updatePaymentStatus } = useSingleOrder(orderId);
```

### Update Order Status
```tsx
const result = await updateStatus('shipped');
if (result.success) {
  addToast('Status updated!', 'success');
}
```

### Subscribe to Real-time Updates
```tsx
useEffect(() => {
  const channel = supabase
    .channel('my-channel')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'orders'
    }, (payload) => {
      console.log('Update:', payload);
    })
    .subscribe();

  return () => channel.unsubscribe();
}, []);
```

## Database Setup

### Run Migration
1. Go to Supabase Dashboard → SQL Editor
2. Execute `scripts/admin-setup.sql`

### Make User Admin
```sql
UPDATE public.user_profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

### Check Admin Status
```sql
SELECT id, email, is_admin FROM public.user_profiles WHERE is_admin = true;
```

## Color System

| Color | Tailwind | Use Case |
|-------|----------|----------|
| Blue | `text-blue-400` | Primary actions, pending status |
| Green | `text-green-400` | Success, delivered status |
| Yellow | `text-yellow-400` | Warning, confirmed status |
| Red | `text-red-400` | Danger, pending status |
| Orange | `text-orange-400` | Info, pending orders |
| Slate | `text-slate-400` | Secondary text |

## Component Props

### KPICard
```tsx
<KPICard
  title="Orders"
  value={123}
  icon={ShoppingCart}
  color="blue"
  loading={false}
  trend={{ value: 12, isPositive: true }}
/>
```

### OrderStatusBadge
```tsx
<OrderStatusBadge status="shipped" size="md" />
// Sizes: 'sm' | 'md' | 'lg'
// Status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered'
```

### AdminRoute
```tsx
<AdminRoute>
  <Dashboard />
</AdminRoute>
// Automatically checks auth & admin role
// Redirects to /admin/login if unauthorized
```

## API Queries

### Get Orders
```typescript
const { data, count } = await supabase
  .from('orders')
  .select('*', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(0, 19);
```

### Search Orders
```typescript
const { data } = await supabase
  .from('orders')
  .select('*')
  .or(`order_number.ilike.%ABC%,user_profiles.phone.ilike.%98765%`);
```

### Get Order with Relations
```typescript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    user_profiles (full_name, email, phone),
    user_addresses (*),
    order_items (*)
  `)
  .eq('id', orderId)
  .single();
```

### Update Order
```typescript
await supabase
  .from('orders')
  .update({ status: 'shipped' })
  .eq('id', orderId);
```

### Add Note
```typescript
await supabase
  .from('orders')
  .update({ notes: 'New note' })
  .eq('id', orderId);
```

## Order Status Workflow

```
Pending ──→ Confirmed ──→ Packed ──→ Shipped ──→ Delivered
   ↑                                              ↓
   └──────────────────────────────────────────────┘
                    No backward transitions
```

## Real-time Channels

| Channel | Purpose |
|---------|---------|
| `admin-notifications` | New order notifications |
| `admin-orders` | All orders changes |
| `order:${id}` | Single order changes |
| `admin-new-orders` | New orders insert |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Admin login fails | Check `user_profiles.is_admin = true` |
| Real-time not working | Enable Realtime in Supabase Settings |
| Orders not loading | Check RLS policies allow access |
| Search not working | Verify search debounce (500ms) |
| Status update fails | Check order `id` exists |

## Performance Tips

1. **Pagination**: Use pageSize of 20-50 orders
2. **Search**: Implement 500ms debounce
3. **Stats**: Cache for 30 seconds minimum
4. **Subscriptions**: Unsubscribe on unmount
5. **Queries**: Use parallel Promise.all() for stats

## Security Checklist

- [ ] User is authenticated
- [ ] User has `is_admin = true`
- [ ] RLS policies are enabled
- [ ] No hardcoded passwords
- [ ] Session stored securely
- [ ] Sensitive data not in localStorage
- [ ] Routes protected with AdminRoute
- [ ] Error messages generic

## Responsive Breakpoints

- **Mobile**: 0-768px (sidebar hides, single column)
- **Tablet**: 768-1024px (sidebar visible, 2 columns)
- **Desktop**: 1024px+ (sidebar visible, 4 columns)

## Dependencies

Core packages used:
- `react`: UI framework
- `react-router-dom`: Routing
- `@supabase/supabase-js`: Database & auth
- `lucide-react`: Icons
- `motion`: Animations
- `tailwindcss`: Styling

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

## Example: Add Toast
```tsx
import { useAdmin } from '../context/AdminContext';

export function MyComponent() {
  const { addToast } = useAdmin();

  const handleSave = async () => {
    try {
      await saveData();
      addToast('Saved successfully!', 'success', 4000);
    } catch (error) {
      addToast('Save failed', 'error', 4000);
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Example: Use Order Data
```tsx
import { useSingleOrder } from '../hooks/useSingleOrder';

export function OrderCard({ orderId }) {
  const { order, loading, updateStatus } = useSingleOrder(orderId);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Not found</div>;

  return (
    <div>
      <h2>{order.order_number}</h2>
      <p>{order.customer.full_name}</p>
      <button onClick={() => updateStatus('shipped')}>
        Mark as Shipped
      </button>
    </div>
  );
}
```

## Admin Panel Limits

| Resource | Limit | Notes |
|----------|-------|-------|
| Orders per page | 20 | Configurable |
| Search debounce | 500ms | Can adjust |
| Stats refresh | 30s | Real-time on change |
| Simultaneous orders | Unlimited | Database limited |
| Admin users | Unlimited | Set via `is_admin` |

## Next Steps

1. Run `scripts/admin-setup.sql` migration
2. Set admin user: `UPDATE ... SET is_admin = true`
3. Navigate to `/admin/login`
4. Login with admin credentials
5. View dashboard and manage orders

## Support Links

- Supabase Docs: https://supabase.com/docs
- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

Last Updated: 2026-03-29
Version: 1.0
Status: Production Ready
