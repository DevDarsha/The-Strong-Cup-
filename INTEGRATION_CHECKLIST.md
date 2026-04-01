# Supabase Integration Checklist

Complete the following steps to fully integrate Supabase into The Strong Cup application.

## Phase 1: Project Setup ✓

- [x] Supabase package installed (`@supabase/supabase-js`)
- [x] Environment variables configured in Vercel project settings
- [x] Supabase client created at `src/lib/supabase.ts`
- [x] TypeScript types defined at `src/types/supabase.ts`

## Phase 2: Authentication Infrastructure ✓

- [x] Auth utilities created at `src/lib/auth.ts`
- [x] useAuth hook created at `src/hooks/useAuth.ts`
- [x] Sign up function implemented
- [x] Sign in function implemented
- [x] Sign out function implemented
- [x] OAuth integration template provided
- [x] Password reset function implemented
- [x] AuthExample component provided as reference

## Phase 3: Database Configuration (To Be Done)

### 3.1 Create Supabase Project
- [ ] Create account at https://supabase.com
- [ ] Create new project (choose nearest region)
- [ ] Note database password in secure location
- [ ] Wait for project initialization (1-2 minutes)

### 3.2 Retrieve Credentials
- [ ] Go to Settings → API
- [ ] Copy Project URL to `VITE_SUPABASE_URL`
- [ ] Copy Anon Public Key to `VITE_SUPABASE_ANON_KEY`
- [ ] Copy Service Role Key to `SUPABASE_SERVICE_ROLE_KEY` (secure storage only)
- [ ] Verify all environment variables are set in Vercel project

### 3.3 Initialize Database Schema
- [ ] Log in to Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Copy content from `scripts/init-database.sql`
- [ ] Paste and execute the SQL script
- [ ] Verify all tables created successfully:
  - [ ] `user_profiles`
  - [ ] `user_addresses`
  - [ ] `orders`
  - [ ] `order_items`
  - [ ] `cart_items`
- [ ] Verify indexes created
- [ ] Verify RLS is enabled on all tables
- [ ] Verify RLS policies are in place

### 3.4 Configure Realtime (Optional but Recommended)
- [ ] Go to Realtime section in Supabase dashboard
- [ ] Enable Realtime for:
  - [ ] `orders` table
  - [ ] `cart_items` table
  - [ ] `user_addresses` table

## Phase 4: Authentication Configuration

### 4.1 Email/Password Auth
- [ ] Go to Authentication → Providers
- [ ] Verify Email provider is enabled
- [ ] (Optional) Customize email templates:
  - [ ] Confirmation email
  - [ ] Reset password email
  - [ ] Magic link email

### 4.2 OAuth Configuration (Optional)

#### Google OAuth
- [ ] Create OAuth 2.0 credentials at [Google Cloud Console](https://console.cloud.google.com)
- [ ] Create new OAuth 2.0 Client ID
- [ ] Set Application name
- [ ] Add Authorized JavaScript origins:
  - [ ] `http://localhost:3000` (development)
  - [ ] Your production domain
- [ ] Add Authorized redirect URIs:
  - [ ] `http://localhost:3000/auth/callback`
  - [ ] `https://yourdomain.com/auth/callback`
  - [ ] `https://yourdomain.supabase.co/auth/v1/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Go to Supabase Authentication → Providers → Google
- [ ] Paste credentials in Supabase dashboard

#### GitHub OAuth (Similar process)
- [ ] Create OAuth App at [GitHub Developer Settings](https://github.com/settings/developers)
- [ ] Set Authorization callback URL to your Supabase redirect URL
- [ ] Copy Client ID and Client Secret
- [ ] Go to Supabase Authentication → Providers → GitHub
- [ ] Paste credentials

### 4.3 Email Settings
- [ ] Go to Authentication → Email Templates
- [ ] (Optional) Set from email address (custom domain)
- [ ] (Optional) Customize email subjects and content
- [ ] Test email sending (send test email to yourself)

## Phase 5: Frontend Integration

### 5.1 Create Authentication Routes/Pages
- [ ] Create login page component
- [ ] Create signup page component
- [ ] Create password reset page component
- [ ] Create email verification page
- [ ] Create OAuth callback handler page at `/auth/callback`
- [ ] Integrate with existing router (React Router in this project)

### 5.2 Update App Components
- [ ] Update Navbar to show authentication status
- [ ] Add sign out button to user menu
- [ ] Protect routes that require authentication
- [ ] Redirect unauthenticated users to login
- [ ] Show loading state while checking auth

### 5.3 Replace UserService with Database Operations
- [ ] Update Checkout component to use database instead of localStorage
- [ ] Update Success page to fetch order from database
- [ ] Update TrackOrder page to fetch orders from Supabase
- [ ] Update CartContext to use database for persistent cart
- [ ] Update Payment page to create order in database

### 5.4 Implement User Features
- [ ] Create user profile page
- [ ] Create address management page
- [ ] Create order history page
- [ ] Create edit profile functionality
- [ ] Create address CRUD operations

## Phase 6: Data Migration (If Needed)

- [ ] Export existing user data from localStorage
- [ ] Transform data to match new schema
- [ ] Import data into Supabase tables
- [ ] Verify all data migrated correctly
- [ ] Clean up old localStorage data

## Phase 7: Testing

### 7.1 Authentication Testing
- [ ] Test email/password signup
- [ ] Test email/password signin
- [ ] Test email verification flow
- [ ] Test password reset flow
- [ ] Test OAuth signups (if enabled)
- [ ] Test session persistence (refresh page, browser restart)
- [ ] Test sign out

### 7.2 Database Testing
- [ ] Test creating user addresses
- [ ] Test updating addresses
- [ ] Test deleting addresses
- [ ] Test creating orders
- [ ] Test fetching order history
- [ ] Test order item creation
- [ ] Test RLS policies (verify users can only access their data)

### 7.3 Real-time Testing (If Enabled)
- [ ] Test order status updates in real-time
- [ ] Test cart updates across multiple tabs
- [ ] Test address changes reflecting immediately
- [ ] Test disconnection handling

### 7.4 Error Handling Testing
- [ ] Test network error handling
- [ ] Test validation errors
- [ ] Test permission errors (RLS)
- [ ] Test rate limiting
- [ ] Verify user-friendly error messages

## Phase 8: Security Review

- [ ] Verify all environment variables are properly configured
- [ ] Verify no sensitive data in frontend code
- [ ] Verify RLS policies are correctly implemented
- [ ] Verify CORS settings are properly configured
- [ ] Test that users cannot access other users' data
- [ ] Verify password reset tokens expire
- [ ] Verify session tokens are secure (HTTP-only cookies)
- [ ] Enable HTTPS in production
- [ ] Configure rate limiting if needed

### 8.1 CORS Configuration
- [ ] Go to Supabase Settings → API
- [ ] Add allowed origins:
  - [ ] `http://localhost:3000` (development)
  - [ ] Your production domain

### 8.2 API Keys
- [ ] Verify using Anon Key in frontend (limited scope)
- [ ] Never expose Service Role Key in frontend code
- [ ] Rotate keys if compromised
- [ ] Monitor API key usage

## Phase 9: Deployment Preparation

- [ ] Set environment variables in production Vercel project
- [ ] Update production domain in Supabase CORS settings
- [ ] Update OAuth redirect URLs for production domain
- [ ] Configure email sender domain (optional)
- [ ] Enable database backups (Supabase automatic)
- [ ] Review and update security policies
- [ ] Set up database connection limits
- [ ] Configure auto-scaling if needed

## Phase 10: Performance Optimization (Optional)

- [ ] Implement pagination for large datasets
- [ ] Add database query caching
- [ ] Optimize database indexes
- [ ] Implement lazy loading for images
- [ ] Monitor query performance
- [ ] Set up alerts for slow queries
- [ ] Consider connection pooling for backend functions

## Phase 11: Monitoring & Maintenance

- [ ] Set up error tracking (Sentry or similar)
- [ ] Monitor database query performance
- [ ] Set up alerts for failed authentication attempts
- [ ] Monitor storage usage
- [ ] Review authentication logs regularly
- [ ] Plan for regular security audits
- [ ] Update dependencies regularly

## Phase 12: Documentation

- [ ] Update README with setup instructions
- [ ] Document API endpoints
- [ ] Document database schema
- [ ] Create user guide for features
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Document RLS policies
- [ ] Create API documentation for team

## Quick Reference

### Important Files
```
src/
├── lib/
│   ├── supabase.ts          # Supabase client initialization
│   ├── auth.ts              # Authentication functions
│   └── database.ts          # Database operation utilities
├── hooks/
│   ├── useAuth.ts           # Authentication state hook
│   └── useRealtimeData.ts   # Real-time subscription hook
├── types/
│   └── supabase.ts          # TypeScript types and interfaces
└── components/
    └── AuthExample.tsx      # Reference authentication component

scripts/
└── init-database.sql        # Database initialization script

SUPABASE_SETUP.md            # Detailed setup guide
INTEGRATION_CHECKLIST.md     # This file
```

### Environment Variables
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Common Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Important URLs
- Supabase Dashboard: https://app.supabase.com
- Documentation: https://supabase.com/docs
- Discord Community: https://discord.supabase.com
- GitHub Issues: https://github.com/supabase/supabase/issues

## Support & Help

If you encounter issues:
1. Check the [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) troubleshooting section
2. Visit [Supabase Documentation](https://supabase.com/docs)
3. Join [Supabase Discord Community](https://discord.supabase.com)
4. Check [GitHub Issues](https://github.com/supabase/supabase/issues)
5. Contact Vercel support if integration-related

## Notes

- All database times are stored in UTC (TIMESTAMP WITH TIME ZONE)
- All IDs are UUIDs for better security and scalability
- RLS is enabled on all tables for data isolation
- Real-time is optional but recommended for better UX
- Authentication state persists across page reloads
- Sessions auto-refresh before expiry

## Timeline Estimate

- Phase 1: 5 minutes (already done)
- Phase 2: 10 minutes (already done)
- Phase 3: 15-20 minutes
- Phase 4: 10-15 minutes (more if adding OAuth)
- Phase 5: 2-3 hours (depends on scope)
- Phase 6: 30 minutes (if needed)
- Phase 7: 1-2 hours
- Phase 8: 1 hour
- Phase 9: 30 minutes
- Phase 10+: As needed

**Total Estimated Time: 6-10 hours for complete integration**

---

Last Updated: 2024
For the latest information, refer to [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
