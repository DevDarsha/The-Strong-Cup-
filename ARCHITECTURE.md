# Supabase Integration Architecture

Visual representation of The Strong Cup's Supabase integration architecture.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Browser / Client                              │
│                      (React + TypeScript)                            │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Pages      │  │ Components   │  │      Hooks               │  │
│  ├──────────────┤  ├──────────────┤  ├──────────────────────────┤  │
│  │ /auth        │  │ AuthExample  │  │ useAuth()                │  │
│  │ /shop        │  │ Checkout     │  │ useRealtimeData()        │  │
│  │ /cart        │  │ Cart         │  │ useContext()             │  │
│  │ /orders      │  │ ...          │  │ useState()               │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
│         │                 │                       │                 │
└─────────│─────────────────│───────────────────────│─────────────────┘
          │                 │                       │
          └─────────────────┼───────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │       Frontend Libraries              │
        │  ┌─────────────────────────────────┐  │
        │  │    src/lib/                     │  │
        │  ├─────────────────────────────────┤  │
        │  │ supabase.ts ────────────────┐   │  │
        │  │ auth.ts                     │   │  │
        │  │ database.ts                 │   │  │
        │  └─────────────────────────────┼───┘  │
        │  ┌─────────────────────────────▼───┐  │
        │  │    src/types/                   │  │
        │  ├─────────────────────────────────┤  │
        │  │ supabase.ts (TypeScript types)  │  │
        │  └─────────────────────────────────┘  │
        └──────────────────┬──────────────────┘
                           │
                           ▼
      ┌────────────────────────────────────────────┐
      │     Supabase JavaScript Client             │
      │   (@supabase/supabase-js)                  │
      │                                            │
      │  ┌──────────────────────────────────────┐  │
      │  │  Auth Module                         │  │
      │  │  • Sessions                          │  │
      │  │  • OAuth                             │  │
      │  │  • Magic Links                       │  │
      │  └──────────────────────────────────────┘  │
      │  ┌──────────────────────────────────────┐  │
      │  │  Database Module                     │  │
      │  │  • CRUD Operations                   │  │
      │  │  • Filtering & Sorting               │  │
      │  │  • Pagination                        │  │
      │  └──────────────────────────────────────┘  │
      │  ┌──────────────────────────────────────┐  │
      │  │  Real-time Module                    │  │
      │  │  • WebSocket Subscriptions           │  │
      │  │  • Change Tracking                   │  │
      │  └──────────────────────────────────────┘  │
      └────────────┬──────────────┬──────────────┘
                   │              │
         ┌─────────┘              └──────────┐
         │                                   │
         ▼                                   ▼
    ┌────────────┐                    ┌──────────────────┐
    │   HTTPS    │                    │   WebSocket      │
    │  Requests  │                    │  Connection      │
    └────────────┘                    └──────────────────┘
         │                                   │
         └─────────────┬─────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │                             │
        │    Supabase Backend         │
        │    (Cloud Services)         │
        │                             │
        │  ┌─────────────────────┐    │
        │  │   Authentication    │    │
        │  │   • Email/Password  │    │
        │  │   • OAuth Providers │    │
        │  │   • Sessions        │    │
        │  │   • JWT Tokens      │    │
        │  └─────────────────────┘    │
        │  ┌─────────────────────┐    │
        │  │  PostgreSQL DB      │    │
        │  │  • user_profiles    │    │
        │  │  • user_addresses   │    │
        │  │  • orders           │    │
        │  │  • order_items      │    │
        │  │  • cart_items       │    │
        │  │  + RLS Policies     │    │
        │  └─────────────────────┘    │
        │  ┌─────────────────────┐    │
        │  │  Realtime Engine    │    │
        │  │  • Change Tracking  │    │
        │  │  • Subscriptions    │    │
        │  └─────────────────────┘    │
        │  ┌─────────────────────┐    │
        │  │  Storage (Optional) │    │
        │  │  • File uploads     │    │
        │  │  • Images           │    │
        │  └─────────────────────┘    │
        │                             │
        └─────────────────────────────┘
```

## Data Flow Diagrams

### Authentication Flow

```
User Interface
    │
    ├─ signUp(email, password)
    │   │
    │   ▼
    │ Supabase Auth
    │   │
    │   ├─ Validate credentials
    │   ├─ Hash password
    │   ├─ Create user in auth.users
    │   ├─ Send confirmation email
    │   │
    │   ▼
    │ Return: { user, session }
    │
    ├─ signIn(email, password)
    │   │
    │   ▼
    │ Supabase Auth
    │   │
    │   ├─ Verify credentials
    │   ├─ Create session
    │   ├─ Generate JWT token
    │   │
    │   ▼
    │ Return: { user, session, access_token }
    │
    └─ useAuth() Hook
        │
        ▼
    getSession()
        │
        ▼
    Return: { user, session, loading, error }
```

### Database Operation Flow

```
Component / Hook
    │
    ├─ saveUserAddress(userId, addressData)
    │   │
    │   ▼
    │ src/lib/database.ts
    │   │
    │   ├─ Validate input
    │   ├─ Prepare data
    │   │
    │   ▼
    │ supabase.from('user_addresses').upsert()
    │   │
    │   ▼
    │ Supabase Client
    │   │
    │   ├─ Add auth token
    │   ├─ Send HTTPS request
    │   │
    │   ▼
    │ PostgreSQL Database
    │   │
    │   ├─ Check RLS policy: auth.uid() = user_id ✓
    │   ├─ Execute UPSERT
    │   ├─ Trigger: update updated_at
    │   ├─ Broadcast change (if Realtime enabled)
    │   │
    │   ▼
    │ Return updated row
    │
    └─ Handle response in component
        │
        ├─ Success: Update UI
        └─ Error: Show error message
```

### Real-time Flow

```
User A makes change
    │
    ▼
Database Update
    │
    ▼
PostgreSQL Triggers Update
    │
    ▼
Realtime Engine Detects Change
    │
    ├─ Broadcast to all subscribers
    │
    ▼
User B's Subscription
    │
    ├─ Receive change via WebSocket
    │
    ▼
useRealtimeData Callback
    │
    ▼
Component State Update
    │
    ▼
UI Re-render with New Data
```

## Component Interaction

```
App Component
│
├─ AuthContext (Future)
│   │
│   ├─ useAuth() Hook
│   │   │
│   │   ├─ Get user state
│   │   └─ Get session state
│   │
│   └─ Auth Functions
│       ├─ signUp()
│       ├─ signIn()
│       ├─ signOut()
│       └─ ...
│
├─ CartContext (Existing)
│   │
│   ├─ Local state
│   └─ Future: Sync to database with useEffect + createOrder()
│
├─ Router
│   │
│   ├─ Public Pages
│   │   ├─ Home
│   │   ├─ Shop
│   │   └─ About
│   │
│   ├─ Protected Pages (Require auth)
│   │   ├─ Checkout
│   │   │   └─ getUserAddresses() → display saved addresses
│   │   │   └─ saveUserAddress() → save new address
│   │   │   └─ createOrder() → create order
│   │   │
│   │   ├─ Orders
│   │   │   └─ useRealtimeData() → live order updates
│   │   │
│   │   └─ Profile
│   │       └─ Database operations for user data
│   │
│   └─ Auth Pages
│       ├─ Login → signIn()
│       ├─ Signup → signUp()
│       └─ Reset Password → resetPassword()
│
└─ Error Boundary (Catch database errors)
    └─ Show user-friendly error messages
```

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Auth                            │
│                    (auth.users)                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  id (UUID) │ email │ encrypted_password │ ...          │ │
│  └────────────┬───────────────────────────────────────────┘ │
└───────────────┼────────────────────────────────────────────┘
                │ 1:1 (auth.uid() = id)
                │ Foreign Key
                ▼
    ┌──────────────────────────────────┐
    │      user_profiles               │
    ├──────────────────────────────────┤
    │ id (FK to auth.users) ←──────────┼─ User Registration
    │ email                            │
    │ full_name                        │
    │ avatar_url                       │
    │ phone                            │
    │ created_at / updated_at          │
    └──────┬───────────────────────────┘
           │ 1:N (user_id)
           │
      ┌────┴────┐
      │          │
      ▼          ▼
    ┌──────────────────────────┐    ┌──────────────────────────┐
    │  user_addresses          │    │  orders                  │
    ├──────────────────────────┤    ├──────────────────────────┤
    │ id (UUID)                │    │ id (UUID)                │
    │ user_id (FK)             │    │ user_id (FK)             │
    │ full_name                │    │ order_number             │
    │ email                    │    │ status                   │
    │ phone                    │    │ total_amount             │
    │ address                  │    │ payment_method           │
    │ city                     │    │ payment_status           │
    │ state                    │    │ shipping_address_id (FK) ├───┐
    │ pincode                  │    │ created_at / updated_at  │   │
    │ is_default               │    └──────┬───────────────────┘   │
    │ created_at / updated_at  │           │ 1:N (order_id)       │
    └──────────────────────────┘           │                      │
                                           ▼                      │
                                  ┌──────────────────────────┐    │
                                  │  order_items             │    │
                                  ├──────────────────────────┤    │
                                  │ id (UUID)                │    │
                                  │ order_id (FK)            │    │
                                  │ product_id               │    │
                                  │ product_name             │    │
                                  │ quantity                 │    │
                                  │ unit_price               │    │
                                  │ total_price              │    │
                                  │ created_at               │    │
                                  └──────────────────────────┘    │
                                                                  │
                                  ┌──────────────────────────┐    │
                                  │  (Reference)             │◄───┘
                                  │  - shipping_address_id   │
                                  │    points to user_       │
                                  │    addresses.id          │
                                  └──────────────────────────┘

┌─────────────────────────────────┐
│  cart_items                     │
├─────────────────────────────────┤
│ id (UUID)                       │
│ user_id (FK to auth.users)      │
│ product_id                      │
│ product_name                    │
│ quantity                        │
│ unit_price                      │
│ created_at / updated_at         │
└─────────────────────────────────┘
```

## Row Level Security (RLS) Policies

```
For Every Operation (SELECT, INSERT, UPDATE, DELETE)
    │
    ▼
Check: Is user authenticated?
    │
    ├─ No  → Denied (403 Forbidden)
    │
    └─ Yes → Check RLS Policy
        │
        ├─ user_profiles table:
        │  └─ auth.uid() = id ? (User can only access own profile)
        │
        ├─ user_addresses table:
        │  └─ auth.uid() = user_id ? (User can only access own addresses)
        │
        ├─ orders table:
        │  └─ auth.uid() = user_id ? (User can only access own orders)
        │
        ├─ order_items table:
        │  └─ EXISTS (SELECT 1 FROM orders WHERE 
        │            orders.id = order_items.order_id AND
        │            orders.user_id = auth.uid()) ?
        │     (User can access items from their orders only)
        │
        └─ cart_items table:
           └─ auth.uid() = user_id ? (User can only access own cart)
```

## Request/Response Cycle

```
User Action in React Component
    │
    ├─ Example: Click "Save Address"
    │
    ▼
Call: saveUserAddress(userId, addressData)
    │
    ▼
src/lib/database.ts:
    │
    ├─ Validate input data
    ├─ Call supabase.from('user_addresses').upsert()
    │
    ▼
HTTP Request (HTTPS)
    │
    ├─ Method: POST/PATCH
    ├─ URL: https://xxxxx.supabase.co/rest/v1/user_addresses
    ├─ Headers: 
    │   ├─ Authorization: Bearer {JWT_TOKEN}
    │   ├─ Content-Type: application/json
    │
    ▼
Supabase API Gateway
    │
    ├─ Validate JWT token
    ├─ Extract auth.uid() from token
    │
    ▼
PostgreSQL Database
    │
    ├─ Check RLS: auth.uid() = user_id ? ✓
    ├─ Execute: INSERT/UPDATE
    ├─ Trigger: Update updated_at timestamp
    ├─ (Optional) Broadcast to subscribers
    │
    ▼
HTTP Response
    │
    ├─ Status: 200 (Success) | 403 (Denied) | 400 (Error)
    ├─ Body: Updated row data (JSON)
    │
    ▼
JavaScript Promise resolves
    │
    ├─ { data: {...}, error: null }  OR
    └─ { data: null, error: {...} }
        │
        ▼
    Component Error Handler:
        │
        ├─ Success → Update component state
        └─ Error → Display error message to user
            │
            ▼
        User sees result on screen
```

## Technology Stack

```
Frontend
├─ Language: TypeScript 5.8
├─ Framework: React 19
├─ Build Tool: Vite 6.2
├─ Styling: Tailwind CSS 4.1
├─ Router: React Router 7
└─ HTTP Client: Supabase JS SDK

Backend
├─ Database: PostgreSQL 15 (Supabase managed)
├─ Authentication: Supabase Auth
├─ Real-time: Supabase Realtime (WebSocket)
├─ API: RESTful (auto-generated from schema)
└─ Storage: Supabase Storage (S3-compatible)

Infrastructure
├─ Hosting: Vercel (Frontend)
├─ Backend: Supabase Cloud
├─ CDN: Vercel Edge Network
├─ SSL/TLS: Automatic (Let's Encrypt)
└─ Monitoring: Built-in Supabase dashboard
```

## Security Model

```
Public Data Access
├─ No authentication required
└─ Example: Product catalog (future implementation)

Authenticated User Access (RLS Policy)
├─ Requires valid JWT token
├─ Check: auth.uid() = user_id
└─ Data isolation by user

Service-level Access (Backend only)
├─ Uses Service Role Key
├─ Bypass RLS (use with caution)
└─ Example: Create order from payment webhook

API Key Hierarchy
├─ Anon Key (Frontend)
│   ├─ Limited scope
│   ├─ Public token
│   └─ Restricted by RLS
│
└─ Service Role Key (Backend)
    ├─ Full database access
    ├─ Secret token (environment variable)
    └─ Bypass RLS policies
```

## Deployment Architecture

```
Development
│
├─ Local: npm run dev
│   ├─ Vite dev server: localhost:3000
│   ├─ Connected to Supabase dev project
│   └─ Hot module reloading
│
└─ Git Branch: development (optional)

Production
│
├─ GitHub
│   └─ Push to main branch
│
├─ Vercel Deployment
│   ├─ Automatic build & deploy
│   ├─ Environment variables configured
│   └─ Production domain: yourdomain.com
│
└─ Supabase Production Project
    ├─ Database backups (automatic)
    ├─ SSL/TLS encryption
    ├─ DDoS protection
    └─ Automatic scaling
```

## Performance Optimization

```
Client-side Caching
├─ Session in localStorage
├─ Components memoization
└─ React state management

Database Optimization
├─ Indexes on foreign keys
├─ Pagination for large datasets
├─ Selective column queries
└─ Connection pooling

Network Optimization
├─ API request batching
├─ Compression (gzip)
└─ CDN caching (static assets)

Real-time Optimization
├─ WebSocket connection pooling
├─ Filter subscriptions
└─ Selective event listening
```

---

This architecture ensures a **scalable, secure, and maintainable** integration between your React frontend and Supabase backend.
