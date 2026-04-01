# Admin Login "Failed to fetch" Error - Complete Guide

## Quick Fix Checklist

- [ ] Check .env.local has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Verify Supabase project is **ACTIVE** (not paused)
- [ ] Confirm admin user exists in Supabase Authentication
- [ ] Check admin user is marked as `is_admin = true` in user_profiles table
- [ ] Try in incognito/private browser window
- [ ] Clear browser cache and cookies
- [ ] Restart dev server

## Error Messages & Solutions

### "Failed to fetch"

**Root Cause:** Network connectivity issue or Supabase misconfiguration

**Solutions:**

1. **Check Internet Connection**
   ```bash
   # Test connectivity
   ping google.com
   ```

2. **Verify Environment Variables**
   ```bash
   # Check .env.local
   cat .env.local
   ```
   Should contain:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

3. **Verify Supabase Project Status**
   - Go to Supabase Dashboard
   - Check if project shows "Active" (not "Paused")
   - If paused, click resume button

4. **Test Supabase URL**
   - Open `VITE_SUPABASE_URL` in browser
   - Should see JSON response (not 404 or 500)

5. **Restart Dev Server**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   pnpm dev
   ```

### "Invalid login credentials"

**Root Cause:** Wrong email/password or user doesn't exist

**Solution:**
1. Go to Supabase → Authentication → Users
2. Find the user and verify email: `Admin@demo`
3. If doesn't exist, create it:
   - Email: `Admin@demo`
   - Password: `Nanu@me`
   - Click **Create User**

### "Access denied. Admin credentials required."

**Root Cause:** User exists but isn't marked as admin

**Solution:**
1. Get user ID:
   ```sql
   SELECT id FROM auth.users WHERE email = 'Admin@demo';
   ```
2. Mark as admin:
   ```sql
   UPDATE public.user_profiles
   SET is_admin = true
   WHERE id = 'USER_ID_HERE';
   ```
3. Verify:
   ```sql
   SELECT * FROM public.user_profiles WHERE email = 'Admin@demo' AND is_admin = true;
   ```

## Debugging Steps

### 1. Check Browser Console

**Open DevTools:**
- Windows/Linux: `F12` or `Ctrl+Shift+I`
- Mac: `Cmd+Option+I`

**Look for red errors in Console tab**
- Screenshot any errors
- Note the exact error message

### 2. Check Network Activity

In DevTools → Network tab:
1. Try to login
2. Look for requests to `.supabase.co`
3. Check if requests get 401, 403, 500 errors
4. Look at response to see error details

### 3. Enable Console Logging

The login page now logs details. Check console for:
```
[v0] Starting admin login with email: Admin@demo
[v0] Sign in response: {...}
[v0] Checking admin status...
[v0] Admin status check: {...}
```

## Detailed Setup Instructions

### Complete Setup from Scratch

**1. Ensure Database Migrations Ran**

In Supabase SQL Editor, run:
```sql
-- Check if user_profiles table exists
SELECT * FROM information_schema.tables WHERE table_name = 'user_profiles';

-- Check if products table exists
SELECT * FROM information_schema.tables WHERE table_name = 'products';
```

If not exist, run:
- `/scripts/init-database.sql`
- `/scripts/admin-setup.sql`

**2. Create Admin User**

In Supabase Dashboard → Authentication → Users:
- Click **Add User**
- Email: `Admin@demo`
- Password: `Nanu@me`
- Click **Create User**
- **Copy the User ID** that appears

**3. Mark as Admin**

In Supabase SQL Editor:
```sql
-- Replace YOUR_USER_ID with copied ID
UPDATE public.user_profiles
SET is_admin = true
WHERE id = 'YOUR_USER_ID';

-- Verify
SELECT * FROM public.user_profiles WHERE is_admin = true;
```

**4. Test Login**

1. Go to http://localhost:5173
2. Click logo 5 times
3. You'll be redirected to `/admin/login`
4. Enter credentials:
   - Email: `Admin@demo`
   - Password: `Nanu@me`
5. Should see dashboard

## Advanced Debugging

### Test Supabase Connection

Create a test file `src/test-supabase.ts`:

```typescript
import { supabase } from './lib/supabase';

async function testSupabase() {
  console.log('[test] Starting Supabase connection test...');

  try {
    // Test 1: Get auth status
    const { data: { user } } = await supabase.auth.getUser();
    console.log('[test] Current user:', user?.email || 'No user logged in');

    // Test 2: List users
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, is_admin')
      .limit(5);

    if (error) {
      console.error('[test] Query error:', error);
    } else {
      console.log('[test] Users found:', data?.length, data);
    }

    // Test 3: Test sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'Admin@demo',
      password: 'Nanu@me',
    });

    if (signInError) {
      console.error('[test] Sign in error:', signInError);
    } else {
      console.log('[test] Sign in successful:', signInData.user?.email);
    }
  } catch (error) {
    console.error('[test] Exception:', error);
  }
}

export default testSupabase;
```

Then in browser console:
```javascript
import testSupabase from '/src/test-supabase.ts';
testSupabase();
```

### Check Supabase Project Configuration

Go to Supabase Dashboard:

1. **Settings → API**
   - Copy `Project URL`
   - Copy `anon public` key
   - Verify they match `.env.local`

2. **Authentication → Providers**
   - Email/Password should be enabled

3. **Database → Public Schema**
   - Check `auth.users` table has your user
   - Check `public.user_profiles` table
   - Check `is_admin` column exists

## Common Causes Summary

| Error | Most Likely Cause | Fix |
|-------|------------------|-----|
| Failed to fetch | Wrong Supabase URL or key | Check .env.local |
| Failed to fetch | Supabase project paused | Activate project |
| Invalid login credentials | User doesn't exist | Create admin@demo user |
| Access denied | User not marked as admin | Set is_admin = true |
| Blank error | User_profiles table missing | Run init-database.sql |

## Still Stuck?

1. **Restart everything:**
   ```bash
   # Clear cache
   rm -rf node_modules/.vite
   
   # Kill server
   # Ctrl+C
   
   # Restart
   pnpm dev
   ```

2. **Check logs:**
   - Browser console (F12)
   - Terminal output
   - Supabase logs (if available)

3. **Try different browser:**
   - Chrome incognito
   - Firefox private
   - Safari private
   - Eliminates cache issues

4. **Verify each step:**
   - [ ] .env.local correct
   - [ ] Supabase active
   - [ ] Database migrations ran
   - [ ] Admin user created
   - [ ] User marked as admin
   - [ ] Dev server restarted

---

**Need Help?** Check the console logs and refer to the error message table above. Each error maps to a specific cause and solution.
