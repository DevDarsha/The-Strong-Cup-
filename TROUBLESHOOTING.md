# Troubleshooting Guide - The Strong Cup

## Issue: Blank White Screen on Startup

### Symptoms
- Page loads but shows nothing
- No errors visible in browser
- All pages show blank screen

### Root Causes & Solutions

#### 1. **Supabase Not Configured** (Most Common)
**Error Message:** If you check the browser console, you'll see a warning about missing `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Solution:**
```bash
# 1. Copy the example environment file
cp .env.example .env.local

# 2. Get your Supabase credentials from:
# https://app.supabase.com/projects
# - Go to Project Settings > API
# - Copy the "Project URL" and "anon public key"

# 3. Update your .env.local file:
VITE_SUPABASE_URL="your_project_url_here"
VITE_SUPABASE_ANON_KEY="your_anon_key_here"

# 4. Restart the dev server
npm run dev
# or
pnpm dev
```

#### 2. **Module Import Errors**
**Symptoms:** Check browser DevTools Console (F12) for red error messages about missing modules

**Solution:**
```bash
# Clear node_modules and reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml  # or package-lock.json/yarn.lock
pnpm install
# or
npm install

# Restart dev server
pnpm dev
```

#### 3. **Port Already in Use**
**Error Message:** "Error: listen EADDRINUSE: address already in use :::5173"

**Solution:**
```bash
# Kill the process using port 5173
lsof -ti:5173 | xargs kill -9

# Or use a different port
pnpm dev -- --port 3000
```

#### 4. **Asset Not Loading**
**Symptoms:** Page shows but styles/images missing

**Solution:**
```bash
# Clear vite cache
rm -rf .vite

# Restart dev server
pnpm dev
```

## How to Check for Errors

### 1. **Browser Console**
- Press `F12` or Right-click → Inspect
- Go to "Console" tab
- Look for red error messages

### 2. **Terminal Output**
- Check the terminal where you ran `pnpm dev`
- Look for error messages or stack traces

### 3. **Network Tab**
- Go to DevTools → Network tab
- Reload page
- Look for red failed requests
- 404 errors usually indicate missing files

## Environment Setup Checklist

- [ ] Copied `.env.example` to `.env.local`
- [ ] Added Supabase URL to `VITE_SUPABASE_URL`
- [ ] Added Supabase Anon Key to `VITE_SUPABASE_ANON_KEY`
- [ ] Saved `.env.local` file
- [ ] Restarted dev server after updating `.env.local`
- [ ] No errors in browser console (F12)
- [ ] Page loads and shows content

## Quick Start Verification

After fixing the blank screen:

1. **Homepage loads with:**
   - Navbar at top with logo
   - Hero section with "Strong Cup" title
   - Product cards
   - Testimonials section

2. **Shop page works:**
   - Navigate to /shop
   - See product grid
   - Can add to cart

3. **Admin panel accessible:**
   - Go to http://localhost:5173/admin/login
   - Shows login form (not blank)

## Still Having Issues?

1. **Check the logs carefully** - scroll up in your terminal to see the first error
2. **Clear everything and start fresh:**
   ```bash
   # Remove all dependencies and caches
   rm -rf node_modules .vite dist
   rm pnpm-lock.yaml
   
   # Reinstall fresh
   pnpm install
   
   # Start fresh
   pnpm dev
   ```

3. **Verify file structure:**
   ```bash
   # Make sure key files exist
   ls src/App.tsx
   ls src/pages/Home.tsx
   ls src/components/Navbar.tsx
   ls src/index.css
   ls index.html
   ```

4. **Check Node version:**
   ```bash
   node --version  # Should be 16+ 
   pnpm --version  # Should be 7+
   ```

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '@supabase/supabase-js'` | Dependencies not installed | Run `pnpm install` |
| `ENOENT: no such file or directory...index.html` | Project not in correct directory | `cd` to project root |
| `Module not found: Error: Can't resolve './pages/Home'` | Missing component file | Verify file exists with `ls src/pages/Home.tsx` |
| `createRoot(...) is not a function` | React version mismatch | Run `pnpm install` again |
| Blank white page | No render output | Check browser console (F12) for errors |

---

**Need Help?** Check the detailed setup guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database configuration
- [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md) - Admin features
- [README.md](./README.md) - Project overview
