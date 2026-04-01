# Supabase Setup with Your Credentials

## Your Supabase Project Details

**Project URL**: `https://bdqnpufvawsdxisdytmm.supabase.co`
**Publishable Key**: `sb_publishable_AntET11C3M6XSjch040VWQ_CPko4GVx`

## Step 1: Update Environment Variables

Create or update `.env.local` in the project root with these credentials:

```env
VITE_SUPABASE_URL=https://bdqnpufvawsdxisdytmm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_AntET11C3M6XSjch040VWQ_CPko4GVx
```

## Step 2: Create Admin User in Supabase

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: **bdqnpufvawsdxisdytmm**
3. Navigate to **Authentication** → **Users**
4. Click **Add User**
5. Fill in:
   - **Email**: `Admin@demo.com`
   - **Password**: `Nanu@me`
   - Check **Auto Confirm User**
6. Click **Create User**

## Step 3: Mark User as Admin

After creating the user, you need to set them as admin in the database:

1. Go to **SQL Editor** in Supabase
2. Create a new query
3. Copy this SQL and replace `YOUR_USER_ID` with the user ID from Step 2:

```sql
-- First, ensure the is_admin column exists
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Mark the user as admin (replace with the actual user ID from Supabase Auth)
UPDATE public.user_profiles 
SET is_admin = true 
WHERE id = 'YOUR_USER_ID';
```

4. Click **Run**

## Step 4: Create user_profiles Entry (If Not Exists)

If the user_profiles table doesn't have an entry for the admin user, run this:

```sql
INSERT INTO public.user_profiles (id, email, full_name, is_admin)
VALUES ('YOUR_USER_ID', 'Admin@demo.com', 'Admin', true)
ON CONFLICT (id) DO UPDATE SET is_admin = true;
```

## Step 5: Verify Setup

1. Start your development server:
   ```bash
   pnpm dev
   ```

2. Click the logo 5 times to access admin login
3. Enter credentials:
   - **Email**: `Admin@demo.com`
   - **Password**: `Nanu@me`

## Troubleshooting

### "Failed to fetch" Error
- **Solution**: Make sure Supabase project is active (not paused)
- Check that `.env.local` is properly saved
- Verify the URL and key are correct
- Restart development server after updating `.env.local`

### "Invalid login credentials"
- Confirm user was created in Supabase Authentication
- Check email spelling: `Admin@demo.com` (not `admin@demo.com`)
- Verify password is exactly: `Nanu@me`

### "Access denied. Admin credentials required"
- User exists but is_admin is not set to true
- Run the SQL command from Step 3 in Supabase SQL Editor
- Make sure you're using the correct user ID

### Can't find User ID in Supabase
- Go to **Authentication** → **Users** in Supabase Dashboard
- Click on the Admin user
- Copy the **UUID** from the top of the user details panel

## Next Steps

Once admin login works:
1. You can manage orders in the admin dashboard
2. Create and manage products
3. Track inventory
4. Verify payments
5. View analytics

For more details, see:
- ADMIN_ACCESS.md - Easter egg access instructions
- ADMIN_PANEL_README.md - Admin panel features
- TROUBLESHOOTING.md - General troubleshooting
