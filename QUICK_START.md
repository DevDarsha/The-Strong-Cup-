# Quick Start - The Strong Cup Tea Shop

## 🚀 Get Running in 5 Minutes

### 1️⃣ Install Dependencies
```bash
pnpm install
```

### 2️⃣ Setup Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Add these from your Supabase project:
VITE_SUPABASE_URL="https://xxx.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGc..."
```

### 3️⃣ Start Dev Server
```bash
pnpm dev
```

### 4️⃣ Visit Your Site
Open http://localhost:5173

✅ You should see the homepage with products!

---

## 📋 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Homepage |
| http://localhost:5173/shop | Product shop |
| http://localhost:5173/cart | Shopping cart |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:5173/admin/dashboard | Admin panel |

---

## ⚙️ Setup Checklist

- [ ] Installed dependencies: `pnpm install`
- [ ] Created `.env.local` file
- [ ] Added Supabase URL to `.env.local`
- [ ] Added Supabase Anon Key to `.env.local`
- [ ] Saved the file
- [ ] Started dev server: `pnpm dev`
- [ ] Homepage loads and shows products
- [ ] Can navigate between pages
- [ ] Can add items to cart

---

## 🔧 Troubleshooting

### Blank White Screen?
```bash
# Check browser console (F12) for errors
# Make sure .env.local has your Supabase credentials
# Restart server: Ctrl+C, then 'pnpm dev'
```

### Styles Missing?
```bash
rm -rf .vite
pnpm dev
```

### Module Errors?
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

---

## 📚 Full Documentation

- **Setup Guide:** [FIRST_TIME_SETUP.md](./FIRST_TIME_SETUP.md)
- **Troubleshooting:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **What Was Fixed:** [BLANK_SCREEN_FIX_SUMMARY.md](./BLANK_SCREEN_FIX_SUMMARY.md)
- **Supabase Setup:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Admin Panel:** [ADMIN_PANEL_README.md](./ADMIN_PANEL_README.md)

---

## 🎯 What Works Now

✅ Homepage with hero section
✅ Product catalog with 3 products
✅ Shopping cart (localStorage)
✅ Navigation between pages
✅ Admin login page (requires Supabase)
✅ Responsive mobile design
✅ Tea-themed colors and styling

---

## 📞 Need Help?

1. **Check browser console** (F12) for error messages
2. **Read** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Follow** [FIRST_TIME_SETUP.md](./FIRST_TIME_SETUP.md) step-by-step

---

That's it! Your Strong Cup tea shop is ready! 🍵
