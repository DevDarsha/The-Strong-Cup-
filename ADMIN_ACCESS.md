# Admin Panel Access Guide

## Easter Egg: Secret Admin Login Access

### Hidden Activation Method

To access the admin login panel, follow these steps:

1. **Go to the homepage** at `http://localhost:5173/` or your live domain
2. **Click on "THE STRONG CUP" logo** in the navbar exactly **5 times**
3. You'll see a visual indicator showing your progress (small dots below the logo)
4. After the 5th click, you'll be automatically redirected to `/admin/login`

### Progress Indicators

- **Clicks 1-2**: Logo is clickable, no visible indicator
- **Click 3**: "Keep clicking! 3/5" message appears briefly
- **Clicks 4-5**: Progress dots fill up below the logo
- **Click 5**: Automatic redirect to admin login page

### Important Notes

- If you stop clicking for 5 seconds, the counter resets
- The counter is shown in the button's title attribute when hovered
- This is a fun Easter egg - customers won't know about it!

---

## Admin Login Credentials

Once you reach the admin login page (`/admin/login`), use these credentials:

### Demo Admin Account

- **Email**: `Admin@demo`
- **Password**: `Nanu@me`

### Login Steps

1. Enter email: `Admin@demo`
2. Enter password: `Nanu@me`
3. Click "Login"
4. You'll be redirected to the admin dashboard

---

## Admin Dashboard Features

Once logged in, you'll have access to:

### Dashboard Home
- Real-time KPI cards:
  - Total Orders
  - Today's Orders
  - Revenue
  - Pending Orders

### Orders Management
- View all orders in a table
- Search by Order ID
- Search by Mobile Number
- Pagination (20 orders per page)
- Real-time order updates

### Order Details
- Customer information
- Shipping address
- Order items with prices
- Status workflow: Pending → Confirmed → Packed → Shipped → Delivered
- Payment status: Pending/Verified/Failed
- Internal notes

### Settings
- Profile management
- Password change
- Account preferences

---

## Desktop vs Mobile

- **Desktop**: Click the logo 5 times, redirect to admin
- **Mobile**: Same easter egg works on mobile navigation

---

## If You Can't Access Admin

### If the login page appears blank:

Make sure you have configured Supabase:

1. Go to Settings > Vars (top right)
2. Add these environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your public Supabase key

Without these, the admin features won't work.

### If credentials don't work:

The demo account needs to be created in Supabase first:

1. Go to Supabase SQL Editor
2. Run this command:
   ```sql
   -- Create admin user
   INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
   VALUES ('Admin@demo', crypt('Nanu@me', gen_salt('bf')), now());
   
   -- Set admin role
   UPDATE public.user_profiles
   SET is_admin = true
   WHERE email = 'Admin@demo';
   ```

---

## Logout

To logout from the admin panel:

1. Click your name in the top-right corner
2. Click "Logout"
3. You'll be redirected to the homepage

---

## Tips

- Keep your credentials safe
- Don't share the Easter egg method with customers
- The admin panel is only accessible to admins
- All actions are logged in Supabase
- Use the settings to change your password regularly

---

For more admin features and documentation, see:
- `ADMIN_PANEL_README.md` - Full admin panel documentation
- `ADMIN_QUICK_REFERENCE.md` - Quick lookup guide
- `ADMIN_PANEL_OVERVIEW.md` - Architecture and features
