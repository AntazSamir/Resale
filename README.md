# Resale.com — Quality-Checked Pre-Owned Electronics Marketplace 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier C2C and B2B marketplace for quality-checked pre-owned, open-box, and refurbished electronics. Engineered with objective component-level condition grading (A+ to D), 32-point hardware inspection, NID-verified sellers, nationwide Cash on Delivery (COD), decoupled order lifecycle state machines, Pro Merchant storefronts, Verified Creator video reviews, server-authoritative authentication, a comprehensive 48-hour dispute mediation hub, a full marketplace listing governance system with admin moderation and immutable audit history, and a deterministic 0–100 seller reputation scoring engine with transparent calculation breakdown.

---

## ✨ Key Features & Architecture

### 🧭 1. Dual-Tier Navigation & Tree-Connector Dropdowns

- **Desktop Secondary Category Header**: Sticky navigation strip with hover/click dropdowns mounted directly to `document.body` via React Portals (`createPortal`), guaranteeing top-level foreground rendering (`z-[99999]`) over all media layers.
- **Tree-Connector Dropdown UX**: Features vertical spine lines, L-shaped branching arms, and colored icon badges for each category item matching modern design system standards:
  - **[Accessories ▾]**: Chargers & Cables (Orange), Power Banks (Green), Cases & Covers (Blue), Screen Protectors (Purple), Stylus & Pens (Pink), USB Hubs (Yellow), Memory Cards (Teal), Mounts & Stands (Indigo), Keyboard & Mouse (Rose), Camera Bags (Sky), All Accessories.
  - **[Essentials ▾]**: Smartwatches (Orange), Earbuds (Blue), Headphones (Purple), Bluetooth Speakers (Green), Soundbars (Pink), Fitness Bands (Yellow), Smart Home (Teal), Home Products (Indigo).
  - **Direct Category Links**: Smartphones, Laptops, Cameras, Tablets, Gaming Consoles, Sell with Us, Partner Program.
- **Smooth & Vibration-Free Interactions**:
  - **180ms Hover Grace Window**: Intent-based debounce timer (`closeDropdownTimeoutRef`) prevents accidental closing during diagonal mouse movement.
  - **Pixel-Stable Typography**: Fixed font-weight prevents layout shifts and vibration when opening or switching dropdown tabs.
  - **Fluid Transitions**: Spring-like entry animation with backdrop blur (`animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1.5 duration-200`) and subtle icon hover scales.
- **Mobile Drawer Navigation**: Slide-over drawer with expandable accordion submenus, smooth chevron animations, and instant route transitions.

---

### 📊 2. Standardized Condition Grading Guide & Simulator (`/grading`)

- **Objective A+ to D Standard**:
  - **Grade A+ (Like New / Pristine)**: Score 95–100 pts, zero signs of use, pristine OEM display, 95%+ battery health, full original box & accessories.
  - **Grade A (Excellent)**: Score 85–94 pts, faint micro-hairlines invisible at 30cm, 90–94% battery health, 100% functional.
  - **Grade B (Good)**: Score 72–84 pts, light cosmetic pocket wear, zero cracks/bends, 80–89% battery health, certified cable included.
  - **Grade C (Fair)**: Score 55–71 pts, heavy chassis wear or officially disclosed repairs, 100% core operating system functionality.
  - **Grade D (As-Is / Parts & Repair)**: Score <55 pts, known hardware limitation or sold for parts.
- **Interactive Live Grade Simulator**: Real-time 100-point algorithm evaluator allowing users to test Chassis, Screen, Functionality, Battery, and Repairs to observe condition scores and grade-capping logic live.
- **32-Point Hardware Inspection Breakdown**: Comprehensive checklist covering Physical Chassis, Display & Touch Diagnostics, Camera & Optical Sensors, Connectivity & Audio, and Security/Cloud Authentication.
- **48-Hour Return Protection Enforcement**: Built-in guarantee providing full refunds if an item arrives in a condition lower than its certified grade.

---

### 🔐 3. Server-Authoritative Auth, Google OAuth & Resilient Sessions

- **Google OAuth 2.0 Integration**:
  - One-click Google sign-in and sign-up integrated into `/login` and `/register` via `<GoogleAuthButton />`.
  - Seamless Supabase OAuth session synchronization bridge (`syncGoogleSessionFn`) that automatically provisions user records and returns an authoritative session token.
- **HMAC-Signed Resilient Session Tokens**:
  - Cryptographically secure 30-day session tokens (`rst_...`) signed with backend HMAC secrets and embedded expiration (`issueSessionToken`).
  - **Server-Restart Resilience**: `getOrRestoreSession` gracefully re-parses and validates valid token payloads if in-memory session caches reset during server restarts.
- **Robust Client Hydration & No-Flicker Persistence**:
  - `AuthProvider` validates active sessions server-side on mount (`initializeAuth`) with automatic fallback to Supabase Google sessions if stored tokens require renewal.
  - Optimistic cached user state prevents jarring logout flashes during navigation or reloads.
  - `ProtectedRoute` waits for complete client hydration (`isHydrated === true`) before evaluating authorization, eliminating unexpected page-refresh logouts.
  - Logged-in users navigating to `/login` are automatically redirected to the destination in their `?redirect` query parameter or back home.
- **Protected Flow Guards (`/sell`, `/account/disputes`)**:
  - Direct route authentication checks redirect unauthenticated visitors to `/login` with clean `redirect` query preservation.
  - Transparent return navigation restores previous wizard state or dispute claims upon successful sign-in.
- **ID & Password Authentication (`/login`)**:
  - Sign in using verified **Mobile Number** (e.g. `01XXXXXXXXX`) or **Email Address** along with a secure password.
  - Show/hide password visibility toggle with high-contrast icons.
- **OTP-Verified Password Reset & Change**:
  - In-place multi-step modal flow: Enter ID &rarr; Verify 6-digit SMS/Email OTP &rarr; Set & Confirm New Password.
  - Server-side rate limiting and 5-minute OTP TTL (`sendOtpFn`, `changePasswordFn`).
- **NID-Gated Registration (`/register`)**:
  - Enforces mandatory Bangladesh National ID (10, 13, or 17 digits) collection, Full Name, Contact ID, Password creation, and OTP verification.

---

### 📱 4. Responsive Homepage & Promo Discovery

- **Optimized Mobile Hero**:
  - Lightweight, high-fidelity WebP hero visual asset (`hero-banner.webp`) optimized for fast Largest Contentful Paint (LCP) and zero cumulative layout shifts.
  - Theme-aware gradient contrast ensuring crystal-clear text readability over background media.
  - Side-by-side touch-friendly CTA buttons (_Shop Devices_ & _Sell Device_).
  - Dedicated **Mobile Trust Strip** (100% Inspected, 4.8★ Rating, 48h Protection, COD Available) positioned neatly below the hero section on mobile viewports.
- **Dual Side-by-Side Photo Banners**:
  - Clean photographic promotional banners (`Image 1.webp` and `Image 2.webp`) situated in between the _Just Listed_ and _Featured Devices_ sections.
  - Stacked on mobile and presented as a 2-column grid on tablets/desktops without jarring hover scales.
- **Dynamic Product Discovery**:
  - Category Carousels, _Just Listed_ new arrivals, _Featured Devices_, and _Biggest Savings_ discount rails.

---

### 🔍 5. Trust Architecture & Progressive Listing UX (Phase 2)

The listing details page (`/listing/$listingId`) presents a structured, high-trust buyer evaluation journey:

1. **Seller Trust Line & Verified Store Badge**: Avatar, name, verified badge with hover tooltip, district/area, star rating, and real lookup-backed verified store routing with graceful non-linked fallback.
2. **Brand & Product Title**: High-contrast typography with subtle uppercase brand tracking.
3. **Condition Score Gauge**: 4-zone segmented progress bar (<60 Heavy Wear, 60–74 Fair, 75–89 Good, 90–100 Excellent) and grade badge.
4. **Quick Trust Pills**: Badges for remaining warranty months, battery health percentage, and original invoice availability.
5. **What's Included**: Chips for included accessories (Original Box, 70W Adapter, MagSafe Cable) or explicit "Device only" notice.
6. **Repair History**: Servicing breakdown (Official / Third-Party / Self-Serviced with dates and repair receipts) or verified "No repairs recorded".
7. **32-Point Hardware Inspection**: 5 evaluation categories (Physical, Functional, Connectivity, Security, Authenticity) with strict data-truth safeguards.
8. **Device Verification Matrix**: IMEI, carrier lock, iCloud/activation lock status with sample verification badges.
9. **Multi-Seller Canonical Catalog (`/product/$productId`)**: Canonical product page aggregating all active seller units with instant grade filtering and price sorting.

---

### 📦 6. Order & Transaction Infrastructure & Seller Confirmation

- **Decoupled Order Lifecycle Engine**:
  - `OrderStatus`: `PENDING` &rarr; `CONFIRMED` &rarr; `PROCESSING` &rarr; `READY_TO_SHIP` &rarr; `SHIPPED` &rarr; `DELIVERED` &rarr; `COMPLETED` (plus `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`, `DISPUTED`).
  - `PaymentStatus`: `PENDING` (Payment due on delivery), `AUTHORIZED`, `PAID`, `FAILED`, `REFUND_PENDING`, `REFUNDED`.
- **Authentic Buyer Identity & Order Binding**:
  - Checkout automatically binds real authenticated buyer profile records (User ID, full name, email, and phone) to order records and persistent storage.
- **Atomic Listing Reservation (`RESERVED`)**:
  - Atomic reservation locks all purchased second-hand listings upon order placement to prevent double-purchase race conditions.
  - Automatically sends instant `ORDER_PLACED` in-app notifications to affected sellers.
- **Real Seller Confirmation Workflow**:
  - Server function `confirmOrderAsSellerFn` authorizes sellers to verify and confirm incoming orders directly from `/seller/orders` and `/seller/dashboard`.
  - Emits an audited confirmation event, marks the order as `CONFIRMED`, and triggers an instant `ORDER_CONFIRMED` notification to the buyer.
- **Buyer Order Tracking Lifecycle Banners (`/account/orders`, `/account/orders/$orderId`)**:
  - Prominent real-time status banners:
    - **Pending Confirmation**: Informs buyer that the seller is inspecting and validating stock.
    - **Seller Confirmed**: Reassures buyer with seller verification timestamp as order moves to packaging and courier dispatch.
- **Pure Production Telemetry (Zero Demo Fallbacks)**:
  - Completely purged all mock/sample order data, placeholder badges, and demo fallback IDs across `/seller/orders`, `/seller/dashboard`, and `/account/orders`.
- **Listing Snapshot Preservation**: Each order item permanently preserves product name, condition grade, score, seller identity, images, and included accessories at the exact moment of checkout.
- **Audited Event Timeline (`/account/orders/$orderId`)**: Chronological audit trail recorded by Buyer, Seller, Courier, and Admin.
- **Payment Method Abstraction**: Architecture supports `COD`, `BKASH`, `NAGAD`, `SSLCOMMERZ`, `CARD`, with **Cash on Delivery (COD) as the primary method**.

---

### 🏪 7. Pro Storefronts, Public Seller Profiles & Creator Suite

- **Public Dynamic Seller Profiles (`/seller/$sellerId`)**:
  - Dedicated public profile for individual and merchant sellers displaying verified badges, member since timeline, operating district/division, dynamic trust score math link, and real-time active inventory catalog.
- **Public Branded Storefronts (`/store/:slug`)**: Verified merchant profiles with cover banners, operational badges, warranty policies, and live catalog filtering backed by Supabase `public.stores`.
- **Verified Creator Video Hub (`/creator/:slug`)**: Direct creator channels featuring short-form and long-form hands-on device unboxings with exact-unit inspection tag links.
- **Hands-on Video Review Strip**: Listing pages embed creator review cards with modal video players and timestamps.
- **Bulk CSV / JSON Inventory Importer (`/seller/inventory/import`)**: Drag-and-drop importer with validation previews, schema mapping, and one-click bulk drafting.

---

### ⚖️ 8. Dispute Mediation Hub & Fraud Shield (Phase 3.6)

- **48-Hour Buyer Inspection Window (`/account/disputes`)**:
  - Protected behind authentication guards with automatic redirect preservation.
  - Enforced delivery timestamp validation with real-time countdown badges.
  - 32-point inspection defect checklist targeting specific component mismatches.
  - Interactive drag-and-drop evidence dropzone (photos/videos with quota limits: max 5MB/photo, max 15MB/video).
  - PII masking on sensitive contact info (`017****1234`, `****-****-9201`).
- **Seller Claims Hub (`/seller/disputes`)**:
  - 24-hour response SLA countdown timer with automatic escalation to admin review upon timeout.
  - Counter-evidence and explanation uploader (dispatch packaging photos, IMEI serial match proof).
- **Admin Mediation Workbench (`/admin/disputes`)**:
  - Side-by-side comparison matrix: Original 32-Point Listing Baseline vs. Buyer Claim & Evidence vs. Seller Response.
  - Deterministic Rule-Based Risk Analyzer (0–100 score) and Evidence Consistency Confidence (0–100%).
  - Binding verdict execution: Full Refund, Reverse Courier Return Pickup (`#REV-XXXXX`), or Seller Payout Release.

---

### 📈 9. Seller Analytics Intelligence (Phase 4.4)

- **Evidence-Based Metrics**: Dedicated `/seller/analytics` page derived strictly from recorded Resale telemetry.
- **Listing Views & Cart Telemetry**: 7-day, 30-day, and all-time views (`LISTING_VIEWED`) and cart additions (`CART_ADDED`) with session duplicate suppression.
- **Strict GMV Calculation**: Revenue calculated strictly from `DELIVERED` and `COMPLETED` orders.
- **Deterministic Intelligent Insights**: Automated rule-based alerts for pricing adjustments, high-interest listings, completed sale milestones, and dispute monitoring.

---

### 🔔 10. Database-Backed In-App Notifications (Phase 4.5)

- **13 Specialized Notification Types**: Categorized real-time notifications for order lifecycle transitions (`ORDER_PLACED`, `ORDER_CONFIRMED`, `ORDER_SHIPPED`, `ORDER_DELIVERED`, `ORDER_CANCELLED`), dispute stages (`DISPUTE_FILED`, `DISPUTE_STATUS_UPDATED`, `DISPUTE_RESOLVED`), listing approvals (`LISTING_APPROVED`, `LISTING_REJECTED`), seller payouts (`PAYOUT_PROCESSED`), and future buyer signals (`PRICE_DROP`, `SAVED_SEARCH_MATCH`).
- **PostgreSQL & Row-Level Security**: Backed by `public.notifications` and `public.notification_preferences` Supabase tables with strict per-user RLS policies.
- **Server-Authoritative Service**: Core functions (`fetchNotificationsFn`, `fetchUnreadCountFn`, `markNotificationReadFn`, `markAllNotificationsReadFn`, `fetchPreferencesFn`, `updatePreferenceFn`) running via `getSupabaseAdmin()` with validated session tokens.
- **Deterministic Deduplication & Privacy Guard**: Generates deterministic reference keys (`userId:type:entityType:entityId`) to eliminate duplicate alerts and enforces strict zero-PII content formatting.
- **Interactive UI Header Dropdown**: `<NotificationPanel />` component in the primary desktop header and mobile drawer featuring real-time unread badges, timestamp formatting, single-click read markers, and mark-all-as-read actions.

---

### 🎯 11. Rule-Based Personalization Engine (Phase 4.6)

- **Deterministic Purchase-Driven Discovery**: `src/lib/recommendation-engine.ts` analyzes authenticated users' actual qualifying purchases (excluding cancelled and refunded orders) to recommend related catalog listings.
- **Structured Matching Priority**: Tier 1: Same Category & Same Brand &rarr; Tier 2: Same Category & Different Brand &rarr; Tier 3: Category Fallback, automatically excluding the exact purchased listing ID.
- **Personalized Homepage Shelf**: Dynamically injects a responsive "Based on your recent order" shelf on `/` with transparent reason attribution (e.g. `Because you ordered {productName}`).
- **Strict Data-Truth & Privacy Guarantees**: Zero fake recommendations for guests or zero-history users; non-existent dependencies (Favorites, Saved Searches) are cleanly declared unavailable rather than fabricated; purchase history is isolated strictly to the authenticated user.
- **Consolidated Catalog Recommendations**: Powers canonical product page `/product/$productId` "You May Also Like" discovery from a unified, testable module.

---

### 🛡️ 12. Marketplace Trust & Listing Governance (Phase 5.1)

Every seller listing now passes through a server-enforced governance lifecycle before becoming publicly discoverable.

- **Dual-Status Architecture**:
  - _Moderation Status_: `DRAFT` → `PENDING_REVIEW` → `APPROVED` / `REJECTED`
  - _Operational Status_: `DRAFT` → `PENDING_REVIEW` → `ACTIVE` → `PAUSED` / `RESERVED` / `SOLD` / `DELISTED`
  - A listing is **never publicly discoverable** unless both `status === ACTIVE` and `moderationStatus === APPROVED`.
- **Seller Workflow**:
  - **Save as Draft** from the sell wizard without submitting for review.
  - **Submit for Review** — listing enters the admin moderation queue.
  - **Edit & Resubmit** for rejected listings — editing any trust-sensitive field on a live listing automatically triggers re-moderation.
  - Seller receives in-app notifications on `APPROVED` and `REJECTED` outcomes.
- **Admin Moderation Workbench (`/admin/moderation`)**: Live `PENDING_REVIEW` queue with approve and reject (standardized reason codes + required admin explanation). Full audit trail per listing.
- **Immutable Audit History**: Every state transition recorded append-only in `listing_audit_history` with actor, role, previous/new status, and reason. Accessible to the listing owner or admin only.
- **Race Condition Lock (`RESERVED`)**: At order placement, the listing is atomically set to `RESERVED`, preventing two buyers from purchasing the same unique second-hand unit simultaneously. Transitions to `SOLD` only on confirmed delivery — not checkout.
- **Seller Listings Dashboard (`/seller/listings`)**: Filter tabs (Active & Public / Under Review / Revisions Needed / Drafts / Paused & Sold), colour-coded status badges, rejection feedback, audit history slide-over.
- **Public Discovery Gating**: `isListingPubliclyEligible()` applied across the products catalog browser, product page offers, recommendation shelves, and listing detail route.

---

### 🏅 13. Deterministic Seller Reputation & Trust Tiering (Phase 5.2)

Resale.com replaces subjective, easily-manipulated 5-star ratings with a mathematically deterministic 0–100 Trust Score and transparent tiering engine based strictly on verified platform telemetry:

- **Deterministic Trust Formula (100 pts max)**:
  - **Fulfillment Ratio (Max 45 pts)**: Proportion of completed & delivered orders versus seller-initiated cancellations.
  - **Dispute-Free Record (Max 35 pts)**: Weighted by the absence of upheld buyer dispute claims or condition mismatches.
  - **Identity Verification Tier (Max 20 pts)**: Awarded for completed Bangladesh National ID (NID) verification and verified physical outlet operations.
  - **SLA Fulfillment Speed (Reserved)**: Architecture prepared for automated dispatch timing integration.
- **Transparent Score Breakdown Dialog (`<SellerTrustBreakdownDialog />`)**:
  - Buyers can click **"View Trust Math"** on any seller card or listing detail page to inspect the exact point-by-point breakdown, verified completed order count, upheld dispute history, and data coverage statement.
- **Seller Reputation Tiers & Badges**:
  - **`NEW_SELLER`**: Score displayed honestly as `N/A` with `"New Seller (First 3 sales pending)"` badge to prevent misleading buyer trust.
  - **`RISING`**: Sellers actively establishing verified fulfillment volume.
  - **`VERIFIED_MERCHANT`**: NID-verified merchants with proven track records.
  - **`TOP_RATED`**: Elite sellers maintaining high scores (85+ pts) and zero unresolved disputes.
- **Strict Data-Truth Integrity**: Seller scores are computed on-demand from real PostgreSQL transaction records via server functions — never hardcoded, seeded, or artificially inflated.

---

### 💫 14. Brand Design System & Custom Animated Loader Component

- **Custom-Engineered Dual-Bar Animated Loader**:
  - Reusable `<Loader label="..." className="..." />` component (`src/components/ui/loader.tsx`) utilizing dedicated keyframe choreography (`@keyframes l29-1` and `l29-2` in `src/styles.css`).
  - Replaces generic spinner icons with a fluid, brand-themed loading animation that maintains consistent typography and zero layout shifting.
  - Unified across asynchronous loading states:
    - Seller Analytics Intelligence (`/seller/analytics`)
    - Seller Inventory Management (`/seller/listings`)
    - Admin Moderation Queue (`/admin/moderation`)
    - Buyer Order Tracking & Real-Time Timelines (`/account/orders/$orderId`)
- **Lightweight Visual Assets**:
  - Modern WebP hero banner asset (`hero-banner.webp`) engineered for instant Largest Contentful Paint (LCP) and zero cumulative layout shifts across mobile and desktop devices.

---

## 🛠️ Technology Stack

| Layer            | Technology                                                                                          |
| :--------------- | :-------------------------------------------------------------------------------------------------- |
| **Framework**    | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router)       |
| **Frontend**     | React 19, TypeScript 5.7+ (Strict Optional Types)                                                   |
| **Styling**      | Tailwind CSS v4, PostCSS, Radix UI Primitives, Lucide Icons, **Apple‑style CSS micro‑interactions** |
| **State & Data** | In‑Memory Catalog & Store Engines, TanStack Query, Nitro Server Functions, **Supabase PostgreSQL**  |
| **Deployment**   | Cloudflare Workers / Nitro Multi‑target Preset / Vercel                                             |

---

## 📁 Project Structure

```
├── public/                             # Static public assets (logos, maps, favicons)
├── src/
│   ├── assets/                         # Brand assets & images (official logo, promo banners, product images)
│   ├── components/
│   │   ├── ui/                         # Accessible Radix & Tailwind UI components (Button, Input, Loader, Sheet, etc.)
│   │   ├── storefront/                 # Storefront components (StoreBadge, store verification chips)
│   │   ├── seller/                     # Seller components (ListingStatusBadge, SellerTrustBadge, SellerTrustBreakdownDialog)
│   │   ├── moderation/                 # Admin moderation components (RejectionDialog, AuditHistorySheet)
│   │   ├── site-header.tsx             # Dual header bar, tree dropdowns, notification bell & mobile drawer
│   │   ├── site-footer.tsx             # Footer, newsletter subscription & platform directory
│   │   ├── google-auth-button.tsx      # Google OAuth authentication button
│   │   ├── listing-card.tsx            # Listing-first product offer card
│   │   ├── product-card.tsx            # Catalog model showcase card
│   │   ├── grade-badge.tsx             # Visual condition grade badge (A+ to D)
│   │   ├── condition-score.tsx         # 4-zone condition score gauge
│   │   ├── seller-trust-card.tsx       # SellerTrustLine and SellerTrustCard
│   │   ├── device-verification.tsx     # Security and cloud activation matrix
│   │   ├── inspection-report.tsx       # 32-point inspection breakdown
│   │   ├── notification-panel.tsx      # In-app notification bell with dropdown
│   │   ├── repair-history.tsx          # Component servicing disclosure table
│   │   ├── whats-included.tsx          # Accessory tags and inclusions
│   │   └── protected-route.tsx         # Auth guard with redirect & hydration support
│   ├── data/
│   │   ├── catalog.ts                  # Products catalog, active listings, brands & pricing utilities
│   │   ├── grading.ts                  # 100-point condition grading calculation matrix
│   │   ├── storefront.ts               # Merchant storefronts and store data
│   │   └── creator.ts                  # Verified creator profiles and video reviews
│   ├── db/
│   │   ├── index.ts                    # In-memory database with passwords, sessions, and OTP maps
│   │   ├── schema.ts                   # Drizzle ORM database schema definitions
│   │   └── seed.ts                     # Database seed data
│   ├── lib/
│   │   ├── auth-store.tsx              # User authentication & session store with Google sync
│   │   ├── cart-store.tsx              # Shopping cart store & remote sync persistence
│   │   ├── order-store.ts              # Orders, lifecycle state machine, & Supabase sync
│   │   ├── dispute-store.ts            # Dispute lifecycle, SLA engine, & Supabase persistence
│   │   ├── store-store.ts              # Pro merchant storefronts store
│   │   ├── creator-store.ts            # Creator profiles & video review relations
│   │   ├── bulk-importer.ts            # CSV / JSON inventory parsing & validation engine
│   │   ├── event-tracker.ts            # 12-type behavioral telemetry engine
│   │   ├── supabase.ts                 # Supabase client configuration
│   │   ├── supabase-admin.ts           # Supabase admin client
│   │   ├── db-server.ts                # Server functions for Supabase orders, carts, disputes & stores
│   │   ├── listing-eligibility.ts      # Canonical isListingPubliclyEligible() governance check
│   │   ├── notification-service.ts     # Notification creation, dedup, preference checks
│   │   ├── notification-store.ts       # Zustand store for notification UI state
│   │   ├── recommendation-engine.ts    # Deterministic rule-based recommendation & personalization engine
│   │   └── server-functions.ts         # Nitro server functions (auth, listing lifecycle, moderation, orders)
│   ├── routes/
│   │   ├── __root.tsx                  # Root HTML layout & global error boundary
│   │   ├── index.tsx                   # Homepage (Hero, mobile trust strip, dual banners, catalog rails)
│   │   ├── about.tsx                   # About Resale.com story, values, and inspection criteria
│   │   ├── grading.tsx                 # Dedicated Standardized Grading (A+ to D) & Simulator
│   │   ├── products.tsx                # Unified Marketplace with full multi-facet filter engine
│   │   ├── categories.tsx              # Category & Subcategory Catalog Hub
│   │   ├── category.$categorySlug.tsx  # Dynamic category & subcategory catalog browser
│   │   ├── product.$productId.tsx      # Multi-seller aggregated product view
│   │   ├── listing.$listingId.tsx      # Progressive Listing Details & 32-Point Report
│   │   ├── store.$storeSlug.tsx        # Public Branded Merchant Storefront
│   │   ├── seller.$sellerId.tsx        # Public Dynamic Seller Profile & Inventory Catalog
│   │   ├── creator.$creatorSlug.tsx    # Verified Creator Profile & Video Hub
│   │   ├── cart.tsx                    # Cart manager with listing snapshot verification
│   │   ├── checkout.tsx                # Gated 3-step checkout & COD order placement
│   │   ├── account.orders.tsx          # Buyer Order History & status filters
│   │   ├── account.orders.$orderId.tsx # Buyer Detailed Timeline Tracking & 48h Inspection Timer
│   │   ├── account.disputes.tsx        # Protected Buyer Dispute Filing & Evidence Dropzone
│   │   ├── sell.index.tsx              # Protected 4-Step Grading Wizard & Listing Submission
│   │   ├── seller.dashboard.tsx        # Seller Hub Overview & Analytics links
│   │   ├── seller.analytics.tsx        # Seller Analytics Intelligence & Performance Telemetry
│   │   ├── seller.orders.tsx           # Seller Order Fulfillment Hub & Step Progression
│   │   ├── seller.disputes.tsx         # Seller Claims Response Portal & 24h SLA Countdown
│   │   ├── seller.storefront.tsx       # Seller Storefront Profile Editor
│   │   ├── seller.creator-profile.tsx  # Seller Creator Profile & Video Linker
│   │   ├── seller.inventory.import.tsx # Bulk CSV / JSON Inventory Importer
│   │   ├── seller.listings.tsx         # Seller Inventory Management
│   │   ├── seller.payouts.tsx          # Seller Earnings & Escrow Settlements
│   │   ├── admin.index.tsx             # Admin Overview & Navigation
│   │   ├── admin.orders.tsx            # Admin Platform-Wide Transactions & Audits
│   │   ├── admin.disputes.tsx          # Admin Mediation Workbench & Side-by-Side Inspector
│   │   ├── admin.moderation.tsx        # Admin Listing Review Queue
│   │   ├── admin.identity.tsx          # Admin NID Verification Queue
│   │   ├── login.tsx                   # ID & Password login with Google OAuth & OTP password reset
│   │   ├── register.tsx                # NID-Verified Registration with Password setup
│   │   ├── partner.tsx                 # B2B Corporate Excess Inventory Application
│   │   └── contact.tsx                 # Support Desk & Knowledge Base FAQ
│   └── styles.css                      # Global styles, typography, loader animations & tokens
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v20.x` or higher
- **Package Manager**: `npm` (`v10+`)

### Installation & Local Development

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AntazSamir/Resale.git
   cd Resale
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the local development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:8080](http://localhost:8080) in your browser.

4. **Verify formatting, linting, and production build:**
   ```bash
   npm run format
   npm run lint
   npm run build
   ```

---

## 📬 Contact & Support

For platform support, partnership inquiries, or merchant onboarding assistance:

- **Email**: [asr.resale@gmail.com](mailto:asr.resale@gmail.com)
- **WhatsApp**: [+880 1765-918998](https://wa.me/8801765918998) (`01765918998`)

---

## 📄 License & Credits

Built with ❤️ for Bangladesh's pre-owned electronics ecosystem.  
© 2026 Resale.com Limited. All rights reserved.
