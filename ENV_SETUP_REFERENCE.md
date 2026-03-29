# Environment Variables Reference

## Your Supabase Credentials

Copy and paste these into `.env.local`:

```env
VITE_SUPABASE_URL=https://bdqnpufvawsdxisdytmm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_AntET11C3M6XSjch040VWQ_CPko4GVx
```

## Where to Put .env.local

```
The-Strong-Cup-/
├── src/
├── public/
├── .env.local          ← Create/Edit this file
├── .env.example
├── package.json
└── vite.config.ts
```

## How to Create .env.local

### Option 1: Copy from .env.example
```bash
cp .env.example .env.local
```
Then edit `.env.local` and replace:
- `YOUR_SUPABASE_URL` → `https://bdqnpufvawsdxisdytmm.supabase.co`
- `YOUR_SUPABASE_ANON_KEY` → `sb_publishable_AntET11C3M6XSjch040VWQ_CPko4GVx`

### Option 2: Create New File
1. Create file `.env.local` in project root
2. Add the credentials above
3. Save

## Verification

After adding credentials:

1. **Check file exists**: 
   ```bash
   ls -la .env.local
   ```

2. **Verify content**:
   ```bash
   cat .env.local
   ```

3. **Restart dev server**:
   ```bash
   pnpm dev
   ```

4. **Check browser console** for any Supabase warnings

## Next Steps

1. Create admin user in Supabase Dashboard
2. Mark user as admin in database
3. Login at `/admin/login`

See: `ADMIN_LOGIN_SETUP_CHECKLIST.md`
