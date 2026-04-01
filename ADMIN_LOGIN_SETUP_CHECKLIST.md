# Admin Login Setup Checklist

## Quick Setup (5 minutes)

### Step 1: Environment Variables
- [ ] Open `.env.local` in project root
- [ ] Add these variables:
  ```env
  VITE_SUPABASE_URL=https://bdqnpufvawsdxisdytmm.supabase.co
  VITE_SUPABASE_ANON_KEY=sb_publishable_AntET11C3M6XSjch040VWQ_CPko4GVx
  ```
- [ ] Save the file
- [ ] Restart dev server: `pnpm dev`

### Step 2: Create Admin User in Supabase
- [ ] Go to https://app.supabase.com
- [ ] Select project: **bdqnpufvawsdxisdytmm**
- [ ] Go to **Authentication** → **Users**
- [ ] Click **Add User**
- [ ] Enter:
  - Email: `Admin@demo.com`
  - Password: `Nanu@me`
- [ ] Check **Auto Confirm User**
- [ ] Click **Create User**
- [ ] **Copy the User ID (UUID)** - you'll need it next

### Step 3: Set Admin Permission
- [ ] Go to **SQL Editor** in Supabase
- [ ] Create new query
- [ ] Paste this (replace UUID):
  ```sql
  UPDATE public.user_profiles 
  SET is_admin = true 
  WHERE id = 'PASTE_USER_ID_HERE';
  ```
- [ ] Click **Run**

### Step 4: Test Login
- [ ] Open http://localhost:5173
- [ ] Click logo **5 times** (watch for click counter)
- [ ] You should see admin login page
- [ ] Enter:
  - Email: `Admin@demo.com`
  - Password: `Nanu@me`
- [ ] Click **Login**
- [ ] You should see the Admin Dashboard

## ✅ Success Indicators

- Logo shows click counter (dots below logo)
- Admin login page appears after 5 clicks
- Login succeeds with your credentials
- Dashboard loads with KPI cards

## If Something Goes Wrong

### "Failed to fetch"
- Check `.env.local` is saved
- Verify Supabase project is not paused
- Check credentials match exactly
- Restart dev server

### "Invalid login credentials"
- Verify email is: `Admin@demo.com` (with capital A and .com)
- Verify password is: `Nanu@me` (exact case)
- Confirm user was created in Supabase Auth

### "Access denied"
- User exists but is_admin is false
- Run SQL command from Step 3 again
- Make sure you used correct User ID

## Need Help?

See these files:
- `SUPABASE_CREDENTIALS_SETUP.md` - Detailed setup guide
- `ADMIN_LOGIN_TROUBLESHOOTING.md` - Common issues
- `TROUBLESHOOTING.md` - General troubleshooting
