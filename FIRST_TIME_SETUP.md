# First Time Setup - The Strong Cup Tea Shop

## Prerequisites
- **Node.js** version 16 or higher
- **pnpm** (recommended) or npm/yarn
- **Git** (if cloning the repository)

## Step 1: Install Dependencies

```bash
# Navigate to project directory
cd The-Strong-Cup-

# Install all required packages
pnpm install

# Or if using npm:
# npm install
```

## Step 2: Configure Environment Variables

### Create .env.local file

```bash
# Copy the example environment file
cp .env.example .env.local
```

### Get Supabase Credentials

1. **Go to:** https://app.supabase.com/
2. **Sign up or Log in** (free tier available)
3. **Create a new project** or select existing one
4. **Get your credentials:**
   - Go to **Project Settings** → **API**
   - Copy **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy **Anon public key** (starts with `eyJh...`)

### Update .env.local

Open `.env.local` and add your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Gemini AI (Optional, for AI features)
GEMINI_API_KEY="your_gemini_key_here"
```

## Step 3: Initialize Database

### Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy and paste contents from `/scripts/init-database.sql`
5. Click **Run**
6. Then copy and paste contents from `/scripts/admin-setup.sql`
7. Click **Run** again

### Result
You should see success messages. Your database tables are now created!

## Step 4: Create Admin User

### Option A: Using Supabase Auth (Recommended)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Enter your email and password
4. Note the User ID

### Option B: Create Regular User First
Use the signup feature in the app, then mark as admin

## Step 5: Mark User as Admin

### In Supabase SQL Editor:

```sql
UPDATE public.user_profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

## Step 6: Start Development Server

```bash
# Start the dev server
pnpm dev

# You should see output like:
# ➜  Local:   http://localhost:5173/
```

## Step 7: Verify Everything Works

### Check Homepage
- Open http://localhost:5173
- You should see:
  - ✅ Navbar with logo
  - ✅ Hero section with "Strong Cup" title
  - ✅ Product cards with images
  - ✅ Testimonials
  - ✅ Navigation menu

### Check Shop Page
- Click "Shop" or navigate to http://localhost:5173/shop
- Should see product grid

### Check Admin Panel
- Navigate to http://localhost:5173/admin/login
- Should see login form
- Login with your email/password
- Should see admin dashboard with:
  - ✅ Sidebar navigation
  - ✅ KPI cards (Total Orders, etc.)
  - ✅ Recent orders table

## Common Issues & Fixes

### Blank White Screen
**Problem:** Page loads but shows nothing

**Solution:**
```bash
# 1. Check browser console (F12) for errors
# 2. Make sure .env.local has correct Supabase credentials
# 3. Restart dev server: Ctrl+C, then `pnpm dev`
```

### "Cannot find module" errors
**Problem:** Error about missing modules

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules
pnpm install
pnpm dev
```

### Admin Login Not Working
**Problem:** "Email or password incorrect"

**Solution:**
1. Verify you created the user in Supabase Auth (not just user_profiles)
2. Verify the email and password are correct
3. Check that `is_admin` is set to `true` in user_profiles

### Styles Not Loading
**Problem:** Page content shows but without styling

**Solution:**
```bash
# Clear vite cache
rm -rf .vite
pnpm dev
```

## Project Structure

```
The-Strong-Cup-/
├── src/
│   ├── pages/              # Page components (Home, Shop, etc.)
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context (Cart, Admin)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utilities (auth, database, supabase)
│   ├── types/              # TypeScript types
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── scripts/               # Database migration scripts
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── .env.example          # Example environment variables
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `src/App.tsx` | Main router and app setup |
| `src/pages/Home.tsx` | Homepage |
| `src/pages/AdminLogin.tsx` | Admin login page |
| `src/pages/admin/Dashboard.tsx` | Admin dashboard |
| `src/lib/supabase.ts` | Supabase client configuration |
| `src/lib/auth.ts` | Authentication functions |
| `.env.local` | Your environment variables (NEVER commit this!) |

## Next Steps

1. **Configure Supabase further:**
   - Set up Row Level Security (RLS) policies
   - Configure authentication providers (Google, GitHub, etc.)
   - See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

2. **Customize the site:**
   - Update product information in `src/pages/Home.tsx`
   - Customize colors in `src/index.css`
   - Add your branding

3. **Deploy to production:**
   - See deployment guides in documentation
   - Deploy to Vercel, Netlify, or your preferred host

## Support & Documentation

- **Setup Issues?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Supabase Help?** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Admin Panel?** See [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md)
- **Architecture?** See [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**You're all set!** Your Strong Cup Tea Shop is ready to use. 🍵
