# Admin Panel Quick Access Guide

## 🚀 Get Started in 3 Steps

### Step 1: Access Admin Login
Navigate to: **http://localhost:5173/admin/login**

Or in the mobile navbar, scroll down and click **"Admin"**

### Step 2: Prepare Your Credentials
Before you can login, you need to:

1. **Create user in Supabase Auth**
   - Go to Supabase Project → Authentication
   - Create a new user with email & password

2. **Run Database Migration**
   - Go to Supabase SQL Editor
   - Copy & run: `scripts/admin-setup.sql`

3. **Set Admin Role**
   ```sql
   UPDATE public.user_profiles
   SET is_admin = true
   WHERE email = 'your-email@example.com';
   ```

### Step 3: Login & Explore
- Enter your email and password
- Click "Sign In"
- You'll be redirected to the Dashboard

---

## 📱 Admin Panel Features

### Dashboard (`/admin/dashboard`)
- Real-time KPI cards
- Total Orders, Today's Orders, Revenue, Pending Orders
- Recent orders preview
- Live system status

### Orders (`/admin/orders`)
- Complete orders table
- Search by Order ID or Mobile Number
- Pagination
- Real-time updates
- Click order to view details

### Order Details (`/admin/orders/:orderId`)
- Customer & shipping information
- Order items with prices
- Status workflow management
- Payment verification
- Internal notes

### Products (`/admin/products`)
- Product management (coming soon)
- Add, edit, delete products
- Image uploads
- Inventory tracking

### Inventory (`/admin/inventory`)
- Stock levels
- Low stock alerts
- Inventory management

### Payments (`/admin/payments`)
- Payment verification
- Transaction details
- UPI QR status

### Settings (`/admin/settings`)
- Admin profile management
- Password change
- System information

---

## 🎯 Common Tasks

### Search Orders
1. Go to **Orders**
2. Use search box to find by:
   - Order ID (e.g., "ORD-001")
   - Mobile Number (e.g., "9876543210")

### Update Order Status
1. Go to **Orders**
2. Click an order ID
3. Use the status dropdown
4. Select new status: Pending → Confirmed → Packed → Shipped → Delivered
5. Changes sync in real-time to customer

### Verify Payment
1. Go to **Order Details**
2. See payment status (Pending/Verified/Failed)
3. Verify UPI transaction ID
4. Mark as Verified or Failed

### Change Password
1. Go to **Settings**
2. Click "Change Password"
3. Enter current password
4. Enter new password twice
5. Click Update

---

## 🔐 Security Features

- ✅ Email/Password Authentication (Supabase Auth)
- ✅ Admin role verification on every request
- ✅ Row Level Security (RLS) on all database tables
- ✅ Session-based access control
- ✅ Auto-logout on session expiry
- ✅ Protected routes (non-admin users redirected to login)

---

## 📊 Real-time Features

### Live Updates
- New orders appear instantly
- Status changes sync immediately
- KPI metrics update in real-time
- Admin notifications for new orders

### Subscriptions
- Uses Supabase PostgreSQL Changes
- WebSocket-based real-time updates
- Automatic cleanup on disconnect
- No polling required

---

## 🛠️ Troubleshooting

### "Access denied. Admin credentials required."
**Solution:** Make sure you've:
1. Run `scripts/admin-setup.sql`
2. Set `is_admin = true` for your user
3. Sign out and sign in again

### Admin page shows blank
**Solution:** Ensure you're accessing `/admin/login` first, not other admin routes directly

### Orders not loading
**Solution:**
1. Check Supabase connection
2. Verify database migration ran successfully
3. Check browser console for errors

### Search not working
**Solution:** Make sure you're typing correct Order ID or Mobile Number without spaces

### Real-time updates not working
**Solution:**
1. Check browser console for errors
2. Verify Supabase connection
3. Make sure you have active internet connection
4. Try refreshing the page

---

## 📞 Key Routes

| Feature | URL | Status |
|---------|-----|--------|
| Admin Login | `/admin/login` | ✅ Live |
| Dashboard | `/admin/dashboard` | ✅ Live |
| Orders | `/admin/orders` | ✅ Live |
| Order Details | `/admin/orders/:orderId` | ✅ Live |
| Products | `/admin/products` | 🟡 Ready |
| Inventory | `/admin/inventory` | 🟡 Ready |
| Payments | `/admin/payments` | 🟡 Ready |
| Settings | `/admin/settings` | ✅ Live |

✅ = Fully functional
🟡 = Structure ready, needs implementation

---

## 💡 Pro Tips

1. **Keyboard Shortcuts** (coming soon)
   - Press `?` for help
   - Press `Ctrl+K` for search

2. **Mobile Access**
   - Responsive design works on all devices
   - Sidebar collapses on mobile
   - Touch-friendly buttons

3. **Notifications**
   - You'll see toast notifications for new orders
   - Sound alert on new order (optional)
   - Real-time badge count

4. **Data Export** (coming soon)
   - Download orders as CSV
   - Export reports as PDF
   - Generate invoices

---

## 📚 For More Information

- **Setup Details:** See `SUPABASE_SETUP.md`
- **All Documentation:** See `ADMIN_PANEL_DOCS_INDEX.md`
- **Implementation Guide:** See `ADMIN_PANEL_README.md`
- **Architecture:** See `ADMIN_PANEL_OVERVIEW.md`

---

## ✨ What's Next?

After accessing the admin panel, you can:

1. Create test orders
2. Update order statuses
3. Monitor real-time updates
4. Verify payment functionality
5. Test order notifications
6. Add and manage products
7. Track inventory levels
8. Customize settings

**Happy managing! 🎉**
