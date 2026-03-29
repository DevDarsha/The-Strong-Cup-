# Admin User Setup Guide

## The "Failed to fetch" Error

If you see "Failed to fetch" on the admin login page, it typically means one of the following:

1. **Admin user account doesn't exist yet**
2. **Supabase authentication isn't configured**
3. **Network/CORS issues**
4. **Supabase credentials are incorrect**

## Step-by-Step Setup

### Step 1: Verify Supabase is Connected

Check that your `.env.local` file has:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 2: Create Admin User in Supabase

Go to your Supabase Dashboard:

1. Navigate to **Authentication → Users**
2. Click **Add User**
3. Enter:
   - Email: `Admin@demo`
   - Password: `Nanu@me`
   - Click **Create User**

### Step 3: Mark User as Admin

Go to your Supabase Dashboard:

1. Navigate to **SQL Editor**
2. Create a new query and run:

```sql
-- First, get the user ID from auth
SELECT id, email FROM auth.users WHERE email = 'Admin@demo';

-- Then update the user_profiles table (replace with actual user ID)
UPDATE public.user_profiles
SET is_admin = true
WHERE id = 'YOUR_USER_ID_HERE';

-- Verify
SELECT * FROM public.user_profiles WHERE is_admin = true;
```

### Step 4: Run Database Migrations

Make sure you've run these migrations in Supabase SQL Editor:

1. `scripts/init-database.sql` - Base tables
2. `scripts/admin-setup.sql` - Admin and products tables

### Step 5: Test Login

1. Go to http://localhost:5173
2. Click the logo **5 times**
3. You'll be redirected to `/admin/login`
4. Enter:
   - Email: `Admin@demo`
   - Password: `Nanu@me`

## Troubleshooting

### Still seeing "Failed to fetch"?

**Check Browser Console:**
1. Open DevTools (F12)
2. Look at the **Console** tab
3. Screenshot any red error messages

**Common Issues:**

| Issue | Solution |
|-------|----------|
| "Failed to fetch" | Check Supabase URL & key in `.env.local` |
| "Invalid login credentials" | Admin user doesn't exist - create in Supabase auth |
| "Access denied. Admin credentials required." | User isn't marked as admin in `user_profiles` table |
| Blank page | Reload page or clear browser cache |

### Check Supabase Status

In Supabase dashboard, verify:
- ✅ Project is active (not paused)
- ✅ Authentication is enabled
- ✅ Database is accessible
- ✅ API Keys are correct

## Command Line Alternative

If using `psql` to connect directly:

```bash
# List all users
SELECT id, email FROM auth.users;

# Update admin status
UPDATE public.user_profiles
SET is_admin = true
WHERE email = 'Admin@demo';
```

## Still Having Issues?

1. **Clear browser cache** - Ctrl+Shift+Delete
2. **Check .env.local** - Make sure variables are correct
3. **Restart dev server** - Sometimes caches env vars
4. **Check network tab** - See actual API errors in DevTools
5. **Verify user exists** - Check Supabase auth.users table

## Next Steps After Login

Once logged in, you can:
- View dashboard with real-time stats
- Manage orders and update status
- Add/edit products
- Monitor inventory
- Verify payments
- Access admin settings

---

**Note:** The credentials `Admin@demo` / `Nanu@me` are for development. Change them before production deployment!
