# Resale.com — Quality-Checked Pre-Owned Electronics Marketplace 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier C2C and B2B marketplace for quality-checked pre-owned, open-box, and refurbished electronics. Engineered with objective component-level condition grading (A+ to D), 32-point hardware inspection, NID-verified sellers, nationwide Cash on Delivery (COD), decoupled order lifecycle state machines, Pro Merchant storefronts, Verified Creator video reviews, server-authoritative authentication, and a comprehensive 48-hour dispute mediation hub.

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

### 🔐 3. Server-Authoritative Auth & Protected Routes

- **Protected Flow Guards (`/sell`, `/account/disputes`)**:
  - Direct route authentication checks redirect unauthenticated visitors to `/login` with clean `redirect` query preservation.
  - Transparent return navigation restores previous wizard state or dispute claims upon successful sign-in.
- **ID & Password Authentication (`/login`)**:
  - Sign in using verified **Mobile Number** (e.g. `01XXXXXXXXX`) or **Email Address** along with a secure password.
  - Show/hide password visibility toggle with high-contrast icons.
  - Direct redirect preservation (`?redirect=/checkout`) returning users immediately to their previous session upon login.
- **OTP-Verified Password Reset & Change**:
  - In-place multi-step modal flow: Enter ID &rarr; Verify 6-digit SMS/Email OTP &rarr; Set & Confirm New Password.
  - Server-side rate limiting and 5-minute OTP TTL (`sendOtpFn`, `changePasswordFn`).
- **NID-Gated Registration (`/register`)**:
  - Enforces mandatory Bangladesh National ID (10, 13, or 17 digits) collection, Full Name, Contact ID, Password creation, and OTP verification.
- **Server Session Tokens**:
  - Cryptographically secure 30-day session tokens (`rst_...`) stored and validated exclusively on the backend (`validateSessionFn`), preventing client-side role spoofing.

---

### 📱 4. Responsive Homepage & Promo Discovery

- **Optimized Mobile Hero**:
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

### 📦 6. Order & Transaction Infrastructure (Phase 3.1 & 4.1A)

- **Decoupled Order Lifecycle Engine**:
  - `OrderStatus`: `PENDING` &rarr; `CONFIRMED` &rarr; `PROCESSING` &rarr; `READY_TO_SHIP` &rarr; `SHIPPED` &rarr; `DELIVERED` &rarr; `COMPLETED` (plus `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`, `DISPUTED`).
  - `PaymentStatus`: `PENDING` (Payment due on delivery), `AUTHORIZED`, `PAID`, `FAILED`, `REFUND_PENDING`, `REFUNDED`.
- **Payment Method Abstraction**: Architecture supports `COD`, `BKASH`, `NAGAD`, `SSLCOMMERZ`, `CARD`, with **Cash on Delivery (COD) as the active method**.
- **Backend Persistence & Local-First Remote Sync**:
  - Bidirectional remote synchronization for Cart Items, Orders, Disputes, Listings, and Stores backed by server functions in `src/lib/db-server.ts`.
  - Silent error degradation ensuring optimistic local-first browser responsiveness even if database tables are in transit.
- **Listing Snapshot Preservation**: Each order item permanently preserves the product name, grade, condition score, seller identity, images, and included accessories at the exact moment of checkout.
- **Audited Event Timeline (`/account/orders/$orderId`)**: Chronological event logs recorded by Buyer, Seller, Courier, and Admin.
- **Seller Order Fulfillment Hub (`/seller/orders`)**: Dedicated dashboard for sellers to progress orders through confirmation, packaging, and courier handover.

---

### 🏪 7. Pro Storefronts & Creator Suite (Phase 3.4 & 4.1B)

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
│   │   ├── ui/                         # Accessible Radix & Tailwind UI components (Button, Input, Sheet, etc.)
│   │   ├── storefront/                 # Storefront components (StoreBadge, store verification chips)
│   │   ├── site-header.tsx             # Dual header bar, tree dropdowns, notification bell & mobile drawer
│   │   ├── site-footer.tsx             # Footer, newsletter subscription & platform directory
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
│   │   └── protected-route.tsx         # Auth guard with redirect support
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
│   │   ├── auth-store.tsx              # User authentication session store
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
│   │   ├── notification-service.ts     # Notification creation, dedup, preference checks
│   │   ├── notification-store.ts       # Zustand store for notification UI state
│   │   └── server-functions.ts         # Nitro server functions (loginFn, changePasswordFn, verifyOtpFn, etc.)
│   ├── routes/
│   │   ├── __root.tsx                  # Root HTML layout & global error boundary
│   │   ├── index.tsx                   # Homepage (Hero, mobile trust strip, dual banners, catalog rails)
│   │   ├── grading.tsx                 # Dedicated Standardized Grading (A+ to D) & Simulator
│   │   ├── products.tsx                # Unified Marketplace with full multi-facet filter engine
│   │   ├── categories.tsx              # Category & Subcategory Catalog Hub
│   │   ├── product.$productId.tsx      # Multi-seller aggregated product view
│   │   ├── listing.$listingId.tsx      # Progressive Listing Details & 32-Point Report
│   │   ├── store.$storeSlug.tsx        # Public Branded Merchant Storefront
│   │   ├── creator.$creatorSlug.tsx    # Verified Creator Profile & Video Hub
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
│   │   ├── login.tsx                   # ID & Password login with OTP password reset modal
│   │   ├── register.tsx                # NID-Verified Registration with Password setup
│   │   ├── partner.tsx                 # B2B Corporate Excess Inventory Application
│   │   └── contact.tsx                 # Support Desk & Knowledge Base FAQ
│   └── styles.css                      # Global styles, typography & hairline grid tokens
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
