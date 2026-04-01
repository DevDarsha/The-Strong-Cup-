# Admin Login Quick Fix - 3 Minutes

## Error: "Failed to fetch" on Admin Login Page

### Fastest Solution

1. **Check .env.local exists** and has:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

2. **Create admin user in Supabase:**
   - Go to: Supabase → Authentication → Users
   - Click: Add User
   - Email: `Admin@demo`
   - Password: `Nanu@me`
   - Click: Create User
   - Copy the User ID

3. **Mark as admin:**
   - Go to: Supabase → SQL Editor
   - Run:
   ```sql
   UPDATE public.user_profiles
   SET is_admin = true
   WHERE id = 'PASTE_USER_ID_HERE';
   ```

4. **Restart dev server:**
   ```bash
   # Press Ctrl+C to stop
   # Then run again
   pnpm dev
   ```

5. **Test login:**
   - Click logo 5 times
   - Login with Admin@demo / Nanu@me

## Common Issues & Instant Fixes

| Issue | Fix |
|-------|-----|
| Still "Failed to fetch" | Restart dev server after .env changes |
| "Invalid login credentials" | Verify admin user exists in Supabase |
| "Access denied" | Run UPDATE query to mark user as admin |
| Blank page | Clear cache (Ctrl+Shift+Delete) |

## Detailed Help

- Full guide: `ADMIN_USER_SETUP.md`
- Deep debugging: `ADMIN_LOGIN_TROUBLESHOOTING.md`
- SQL helper: `scripts/create-admin-user.sql`

That's it! You should now be able to login to the admin panel.
