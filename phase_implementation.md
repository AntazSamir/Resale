# RESALE.COM — Phase Implementation & Roadmap

> **Bangladesh's Trusted C2C & B2B Marketplace for Quality-Checked Pre-Owned, Open-Box & Like-New Electronics**

This document tracks the completed engineering milestones across **Phase 1**, **Phase 2**, **Phase 3.1**, **Phase 3.4**, **Phase 3.6**, and **Phase 4 (4.1A–E, 4.2, 4.4, 4.5, 4.6)**, and outlines the strategic and technical roadmap for remaining milestones.

---

## 🧭 Architectural Foundation: Product ≠ Listing

The platform operates on a multi-seller aggregation architecture:

- **Product (`/product/$productId`)**: Canonical catalog definition (Brand, Model, Technical Specs) managed by platform catalog admins.
- **Listing (`/listing/$listingId`)**: A specific seller's physical unit, complete with its unique condition grade, inspection records, price, warranty, accessories, and photos.

---

## ✅ Phase 1: Marketplace Foundation & Core Discovery Engine

**Status:** `COMPLETED` · **Commit Milestone:** `42b2f41`

Phase 1 established the end-to-end commerce experience, responsive layout system, and buyer/seller interaction loop.

### 1. Homepage & Discovery UX

- **18-Section Alternating Layout**: Modern homepage featuring Hero banners, Trust Value Props, Trending Listings, Grade Highlights, Category Carousels, and Seller Onboarding Teasers.
- **Dynamic Catalog Browser (`/products`)**:
  - Live search with debounce for rapid product/listing discovery.
  - Multi-facet filtering: Category (Phones, Laptops, Audio, Cameras), Brand, Condition Grade (Like New, Grade A, Grade B, Grade C), District/Location, Price Range, and Warranty filter.
  - Responsive sorting: Price (Low to High / High to Low), Condition Score, Date Listed, and Seller Rating.

### 2. Authentication & Seller Verification Gate

- **NID-Gated User Registration (`/register`)**: Mandatory National ID (NID) collection at onboarding to reduce fraud and build accountability.
- **Phone OTP & Session Management**: Secure authentication supporting buyers, verified sellers, and platform administrators.
- **Role-Based Protected Routing**: Distinct routing guards for standard buyers, verified sellers, and admin moderation panels.

### 3. Seller Listing Flow

- **Interactive Multi-Step Listing Wizard (`/sell`)**:
  - Step-by-step listing creation (Select Catalog Product &rarr; Input Condition &rarr; Disclose Defects/Repairs &rarr; Set Price & Warranty &rarr; Upload Photos).
  - Built-in condition tier estimator giving sellers real-time feedback on their grade tier based on inputs.

### 4. Cart & Checkout Operations

- **Persistent Cart Engine (`/cart`)**: Local storage-backed cart managing multi-item selections and seller references.
- **Checkout & Cash on Delivery (COD) Flow (`/checkout`)**:
  - Full Bangladesh delivery address capture (Division, District, Upazila/Area, Street Address).
  - Cash on Delivery (COD) processing with immediate order confirmation and tracking ID generation.
- **Buyer Order History (`/account/orders`)**: Dedicated tracking dashboard for past and active orders with lifecycle status badges.

---

## ✅ Phase 2: Trust Architecture & Progressive Listing UX

**Status:** `COMPLETED` · **Commit Milestones:** `7550966`, `5deed5b`

Phase 2 transformed Resale.com from a standard marketplace into a high-trust, transparent secondhand electronics platform with structured hardware inspection data.

### 1. Progressive Buyer Information Hierarchy

The listing details page (`src/routes/listing.$listingId.tsx`) was reorganized following a strict psychological buyer-trust journey:

1. **Compact Seller Trust Line**: Avatar, name, verified badge with hover tooltip, district/area, and star rating.
2. **Brand & Product Title**: High-contrast typography with subtle uppercase brand tracking.
3. **Condition Score Gauge**: 4-zone segmented progress bar (<60 Heavy Wear, 60–74 Fair, 75–89 Good, 90–100 Excellent) and grade badge.
4. **Quick Trust Pills**: Compact metadata badges for remaining warranty months, battery health percentage, and original invoice availability.
5. **What's Included**: Individual accessory chips (Original Box, 70W Adapter, MagSafe Cable) or explicit "Device only" notice.
6. **Repair History**: Servicing breakdown (Official / Third-Party / Self-Serviced with dates and repair receipts) or verified "No repairs recorded".
7. **Seller's Note**: Blockquote styling clearly attributed to the seller.
8. **Known Issues & Disclosures**: Amber warning card for defects; neutral confirmation for "No known issues reported by seller".
9. **Price & High-Conversion CTAs**: Prominent BDT (`৳`) pricing, shipping origin, **Buy Now** direct checkout, and **Add to Cart** with animated confirmation.

### 2. 32-Point Standardized Hardware Inspection

- **5 Evaluation Categories**: Physical, Functional, Connectivity, Security, and Authenticity.
- **Documentation Completeness Levels**:
  - `Fully Documented` (25+ checks)
  - `Partially Documented` (10–24 checks)
  - `Minimally Documented` (1–9 checks)
  - `No Individual Checks Recorded` (0 checks)
- **Data Truth Safeguards**: Unrecorded inspection checks display muted as `— Not individually recorded`. Unrecorded checks are never styled as green passes or red fails.

### 3. Device Verification Matrix

- **Security & Cloud Status**: Clear verification status for Serial / Diagnostic, Camera & Network, iCloud / Activation Lock, and User Account Removal.
- **Sample Data Disclaimer**: Prominent `SAMPLE VERIFICATION DATA — NOT LIVE-CHECKED` notice ensuring users distinguish demo data from certified live verification.

### 4. Grade Standards & Deep Technical Specifications

- **Interactive Grade Standards**: Side-by-side comparison of Grade Like New, A, B, and C with the current listing's grade highlighted with `(This Listing)`.
- **Grouped Technical Specifications**: Responsive 1/2/3 column layout organizing Display, Performance, Camera, Battery, and Connectivity specs.

### 5. Multi-Seller Comparison Product Page

- Canonical product view (`/product/$productId`) aggregating all active seller units for a specific device, enabling buyers to filter by Grade and sort by Price to choose their preferred unit.

---

## ✅ Phase 3.1: Order & Transaction Infrastructure

**Status:** `COMPLETED` · **Commit Milestones:** `c1af4a7`, `3630476`, `d7fdeab`, `f7d0467`

Phase 3.1 established the core transaction and order lifecycle backbone, decoupling the order system from payment providers while maintaining active COD fulfillment, mandatory authentication, and strict data snapshot integrity.

### 1. Decoupled Lifecycle State Machine

- **Order Lifecycle States**: `PENDING` &rarr; `CONFIRMED` &rarr; `PROCESSING` &rarr; `READY_TO_SHIP` &rarr; `SHIPPED` &rarr; `DELIVERED` &rarr; `COMPLETED` (plus `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`, `DISPUTED`).
- **Independent Payment Status**: `PENDING` (payment due on delivery), `AUTHORIZED`, `PAID`, `FAILED`, `REFUND_PENDING`, `REFUNDED`.
- **Payment Method Abstraction**: Architecture supports `COD`, `BKASH`, `NAGAD`, `SSLCOMMERZ`, `CARD`, with **COD as the only active provider** in this phase.

### 2. Mandatory Authentication & Pre-Fill

- **Gated Checkout & Tracking**: Checkout (`/checkout`) and Order Tracking (`/account/orders/*`) require active user login.
- **Post-Auth Redirection**: Integrated `redirect` query parameter support returning users directly to their checkout session upon login/registration.
- **Credential Auto-Fill**: Verified user name and phone automatically populate shipping address forms.

### 3. Order Snapshot & Financial Integrity

- **Listing Snapshot Preservation**: Each order item permanently captures the listing's product name, grade, condition score, seller identity, images, and included accessories at the exact moment of checkout.
- **Shared Price Calculator**: Centralized `calculateOrderTotals` helper enforcing consistent math across Cart, Checkout, Order Confirmation, Buyer Tracking, Seller Hub, and Admin Console.

### 4. Buyer Order Tracking & Controlled Cancellation

- **Audited Event Timeline (`/account/orders/$orderId`)**: Displays chronological application events with timestamp, actor (`BUYER`, `SELLER`, `COURIER`, `ADMIN`), and verified note.
- **Controlled Cancellation Flow**: Buyers can cancel only at `PENDING` or `CONFIRMED` stages before dispatch, with required reason logging and audit trail update.

### 5. Seller Fulfillment Hub (`/seller/orders`)

- **Seller Order Management**: Stage-by-stage progression controls (`Confirm Order` &rarr; `Start Packing` &rarr; `Mark Ready` &rarr; `Hand to Courier` &rarr; `Confirm Delivery`).
- **Integrated Seller Hub**: Added to `SellerSidebar` with live pending order counts and GMV metrics.

### 6. Admin Transaction Oversight (`/admin/orders`)

- **Platform-Wide Transaction Audit**: Searchable order directory with dual Order/Payment status filters, total GMV volume tracking, and instant access to dispute audit logs.

---

## ✅ Phase 3.4: Creator & Pro Storefronts

**Status:** `COMPLETED` · **Target Scope Delivered**

Phase 3.4 integrated professional merchant storefronts, tech reviewer creator hubs, video-linked product diagnostics, exact-unit review badges, and high-throughput bulk inventory ingestion.

### 1. Professional Branded Storefronts (`/store/$storeSlug`)

- **Public Merchant Hubs**: Dedicated store pages featuring custom branding, hero banner covers, logo avatars, verified store badges, business operating hours, physical outlet addresses, and direct WhatsApp/Phone support channels.
- **Store Policies & Warranty Modal**: Popover/dialog detailing official shop warranty terms, return windows, and inspection disclosures.
- **Store-Filtered Inventory Grid**: Real-time searchable and category/grade filtered catalog displaying exclusively listings owned by the store.
- **Merchant Storefront Studio (`/seller/storefront`)**: Integrated self-service dashboard for pro sellers to customize store profiles, generate verified URL slugs, preview live storefronts, and manage customer service contacts.
- **Store Identity Integration**: `StoreBadge` embedded throughout product comparison rows, listing pages, and seller trust lines.

### 2. Verified Tech Creator Hubs (`/creator/$creatorSlug`)

- **Creator Profiles**: Dedicated reviewer hub displaying channel branding, reviewer bios, verification badges, and social media channel links (YouTube, Facebook, TikTok).
- **Reviewed Electronics Portfolio**: Comprehensive grid of all hands-on video teardowns and tests published by the creator.
- **Creator Management Studio (`/seller/creator-profile`)**: Portal for tech reviewers to manage creator handles, link external review videos, categorize review types (`FULL_REVIEW`, `BATTERY_TEST`, `CAMERA_COMPARISON`, `UNBOXING`, `LONG_TERM`), and optionally attach active physical units for sale.

### 3. Video-Linked Product Reviews & Exact-Unit Badging

- **Master Product Review Deck (`CreatorReviewStrip`)**: Embedded above multi-seller comparison tables on canonical product pages (`/product/$productId`), surfacing hands-on diagnostic videos without disrupting purchase flows.
- **Exact-Unit Verified Badge**: When a reviewer sells the exact device tested on camera, the listing (`/listing/$listingId`) renders an exclusive **"Featured in Creator Review (Exact Unit Tested)"** callout banner with an instant sandboxed video player modal.
- **Sandboxed Video Player (`CreatorVideoModal`)**: Zero-cookie YouTube embed with restricted permissions preventing tracking and popup injection.

### 4. High-Throughput Bulk CSV Inventory Importer (`/seller/inventory/import`)

- **Drag-and-Drop Ingestion**: Interactive upload zone with pre-formatted downloadable sample spreadsheet templates.
- **CSV Formula Injection Defense**: Sanitizes leading `=, +, -, @` formula prefixes to neutralize spreadsheet injection vulnerabilities.
- **Intelligent Catalog Matching**: Fuzzy and exact ID/Name matcher resolving batch items against canonical master products.
- **Inspection Integrity & Grade Validation**: Validates condition grades (`A+` to `D`), price thresholds (min ৳500), battery health ranges (50%–100%), and warranty limits. Does **not** fabricate 32-point inspection results, preserving honest platform trust.
- **Validation Preview & Error Quarantining**: Interactive validation table displaying error chips for malformed rows while enabling one-click publishing for valid inventory units.

---

## 🚀 Upcoming Strategic & Engineering Roadmap (Phase 3.2, 3.3, 3.5, 3.6)

**Status:** `PLANNED` · **Target Milestones**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             UPCOMING ROADMAP                                │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│   3.2 Logistics &     │   3.3 Automated         │   3.5 AI Valuation &      │
│   Courier APIs        │   Diagnostics           │   Smart Pricing           │
├───────────────────────┼─────────────────────────┼───────────────────────────┤
│   3.6 Dispute &       │   Future Payment        │   Escrow Settlement       │
│   Fraud Shield        │   Gateways (bKash/Nagad)│   Architecture            │
└───────────────────────┴─────────────────────────┴───────────────────────────┘
```

---

### 🚚 3.2 3rd-Party Courier & Automated Tracking Integration

- **Direct Logistics APIs**: Integration with Bangladesh courier APIs (**Steadfast**, **Pathao Courier**, **Paperfly**, **RedX**).
- **Automated Tracking Workflow**: Consignment note generation, printable shipping labels, live webhook order status sync (`Pending Pickup` &rarr; `In Transit` &rarr; `Delivered`), and automated COD reconciliation.

---

### 🔍 3.3 Live IMEI & Automated Device Diagnostics

- **Real-Time IMEI / Serial Verification**: Integration with GSMA blacklist databases.
- **Browser & Mobile Diagnostic Runner**: Lightweight test runner for touch screens, pixels, sensors, and battery health reporting.

---

### 🤖 3.5 AI-Powered Smart Pricing & Valuation Engine

- **Fair-Market Price Recommendation**: Machine learning model based on historical completed sales.
- **Depreciation Tracker**: Visual price depreciation charts for popular smartphones and laptops.

---

### ⚖️ 3.6 Dispute Mediation Hub & Fraud Shield (Completed)

- **Structured Dispute Resolution Center (`/account/disputes`)**:
  - Enforced 48-hour buyer inspection guarantee eligibility window with real-time countdown badges.
  - 32-point inspection defect checklist targeting specific component mismatches (display scratches, battery degradation, missing accessories).
  - Drag-and-drop evidence dropzone supporting high-resolution photos and video clips with strict file size/quota protection (max 5MB/photo, max 15MB/video).
  - Quick sample proof generators for instant testing of condition discrepancies.
  - PII Masking: Sensitive buyer and seller phones and NID numbers are securely masked (`017****1234`, `****-****-9201`).
- **Seller Dispute & Claims Hub (`/seller/disputes`)**:
  - 24-hour response SLA countdown timer with automatic escalation to admin review upon expiry.
  - "Accept Return & Authorize Full Refund (Simulation)" one-click seller agreement flow.
  - Contest and counter-evidence uploader (dispatch packaging photos, IMEI serial match proof).
- **Admin Mediation Workbench (`/admin/disputes`)**:
  - Side-by-side comparison matrix: Original 32-Point Listing Baseline vs. Buyer Claim & Evidence vs. Seller Counter-Evidence.
  - Deterministic rule-based Risk Assessment score (0–100 scale, higher = higher risk) and separate Evidence Consistency Confidence metric (0–100%).
  - Trust factors and risk flags breakdown with audit guidance.
  - Binding simulated verdict console: Approve Full Refund, Approve Return & Reverse Courier Pickup (`#REV-XXXXX`), or Reject Claim & Release Seller Payout.
- **Truthfulness & Safety Standards**:
  - Escrow hold, payment release, and courier pickup are clearly marked and executed as simulated local marketplace state updates without false external API claims.

---

## 📊 Summary Milestone Table

| Milestone     | Key Focus Area               | Deliverables                                                                                                                                                                      |    Status    |
| ------------- | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| **Phase 1**   | Marketplace Core & Catalog   | Alternating Homepage, Catalog Filters, Cart, COD Checkout, NID Auth, Seller Wizard                                                                                                | ✅ Completed |
| **Phase 2**   | Trust & Inspection UX        | 32-Point Inspection, Condition Gauge, Seller Trust Line, Device Verification, Product Multi-Seller Page                                                                           | ✅ Completed |
| **Phase 3.1** | Order & Transaction Backbone | Decoupled Lifecycle State Machine, Payment Abstraction (COD Active), Mandatory Auth & Redirect, Buyer Timeline & Cancellation, Seller Fulfillment Hub, Admin Oversight            | ✅ Completed |
| **Phase 3.4** | Creator & Pro Storefronts    | Public Branded Storefronts (`/store/:slug`), Verified Creator Profiles (`/creator/:slug`), Hands-on Product Video Reviews, Exact-Unit Review Badging, Bulk CSV Inventory Importer | ✅ Completed |
| **Phase 3.6** | Dispute Mediation Hub        | 48h Inspection Window, 24h Seller SLA, Evidence Dropzone, Side-by-Side Admin Workbench, Deterministic Risk Analyzer, Simulated Payout Holds & Reverse Logistcs                    | ✅ Completed |
| **Phase 3.2** | Courier Logistics            | Steadfast/Pathao API integration, live tracking webhooks, automated COD reconciliation                                                                                            |  📋 Planned  |
| **Phase 3.3** | Automated Diagnostics        | Live IMEI verification API, device hardware test runner, certified badges                                                                                                         |  📋 Planned  |
| **Phase 3.5** | AI Valuation Engine          | Real-time price recommender, price history graphs, "Fair Deal" badges                                                                                                             |  📋 Planned  |

---

## 🚧 Phase 4: Real Persistence, Intelligence & Buyer Retention

**Status:** `IN PROGRESS` (Phase 4.1A, 4.1B, 4.1C, 4.1D, 4.1E, 4.2, 4.4, 4.5 & 4.6 Complete) · **Architecture Audit:** August 2026

Phase 4 transitions Resale.com from browser-local `localStorage` into a **real shared, persistent, multi-user marketplace architecture backed by Supabase PostgreSQL**, followed by behavioral signal tracking, buyer retention tools, and evidence-based seller analytics.

---

### 4.1A — Supabase Persistence & Shared Orders Foundation ✅ COMPLETED

**Objective**: Establish Supabase as the production-ready persistent database and bridge all order management to shared remote PostgreSQL state.

- **Supabase Client & RLS**: Connected `taqsfmxkiznbjyxbmbge.supabase.co` with live tables (`users`, `products`, `listings`, `inspection_items`, `orders`, `disputes`) and verified Row Level Security policies.
- **Shared Multi-User Orders**: Replaced isolated browser `localStorage` orders with bidirectional Supabase sync (`fetchOrdersAsync()`, `saveOrderAsync()`, `syncOrderToSupabase()`, `onOrdersChange()`).
- **Snapshot Integrity**: Preserved immutable `_orderSnapshot` in `shipping_address_json` (items, 32-point inspection baseline, seller identity, condition score, delivery fee, timeline events).
- **Foreign-Key Resolution**: Auto-upserts verified user records (`public.users`) on checkout, satisfying `orders_buyer_id_fkey`.
- **Integrated Routes**:
  - `/account/orders` (Buyer order list with live sync)
  - `/account/orders/$orderId` (Buyer cancellation & status timeline)
  - `/seller/orders` (Seller order fulfillment & transition workbench)
  - `/seller/dashboard` (Live GMV & active order metrics)
  - `/admin/orders` (Admin transaction oversight)
  - `src/lib/server-functions.ts` (`placeOrderFn`, `verifyOtpFn`, `createListingFn`)
- **Cross-Browser Verification**: E2E verified — an order placed by a Buyer in Browser A is immediately fetched and updated by a Seller in Browser B and an Admin in Browser C.

---

### 4.1B — Storefronts & Creator Hub Remote Persistence ✅ COMPLETED

**Objective**: Migrate Pro Storefronts and Creator Profiles from `localStorage` to Supabase PostgreSQL.

- **Storefronts Migration**: Added `public.stores` table (`supabase/migrations/20260823_phase4_stores_creators.sql`) with slug uniqueness, verification badges, business hours, and store catalogs.
- **Creator Profiles & Video Reviews**: Added `public.creator_profiles` and `public.product_videos` tables with platform validation and listing associations.
- **Bi-directional Stores & Creators Sync**: Implemented `storefrontToSupabase()`, `fetchStoresAsync()`, `saveStorefrontAsync()`, `creatorProfileToSupabase()`, `fetchCreatorsAsync()`, and `saveProductVideoAsync()` with automatic local-storage caching fallbacks.
- **Cross-User Visibility**: Newly created merchant stores (`/store/:slug`) and video reviews (`/creator/:slug`) are instantly persisted and queryable across all client browsers.

---

### 4.1C — Disputes & Evidence Persistence ✅ COMPLETED

**Objective**: Migrate Dispute Mediation Hub from `localStorage` (`resale.disputes.v1`) to remote Supabase `disputes` with server functions and resilient fallbacks.

- **Dispute Server Functions**: Added `upsertDisputeFn` and `listDisputesFn` in `src/lib/db-server.ts` with graceful failure handling.
- **Background Sync**: `saveDisputes` in `src/lib/dispute-store.ts` automatically mirrors dispute filings, evidence metadata, SLA timestamps, and admin verdicts to PostgreSQL.
- **Audit Logs & Meta**: Stores complete structured dispute records and audit timeline events in `meta` JSONB format with deterministic risk assessments.

---

### 4.1D — Cart Cloud Synchronization ✅ COMPLETED

**Objective**: Upgrade `resale.cart` with cloud persistence for authenticated users.

- **Cart Server Functions**: Added `upsertCartItemFn`, `removeCartItemFn`, `clearCartItemsFn`, and `listCartItemsFn` in `src/lib/db-server.ts`.
- **Guest-to-User Merge**: Local cart preserves items for guests, automatically merging into persistent cloud cart upon login hydration in `CartProvider`.
- **Optimistic Responsiveness**: Local storage serves as the immediate source of truth for instant UI feedback, while background async updates maintain remote PostgreSQL state.

---

### 4.1E — Server-Authoritative Admin Auth & Email Registration ✅ COMPLETED

**Objective**: Eliminate client-side permission tampering (sessionStorage spoofing) with backend-issued session tokens and introduce email-based user registration & login.

- **Server-Issued Session Tokens**: Upon OTP verification, `verifyOtpFn` generates high-entropy session tokens (`rst_...`) stored in the server's `db.sessions` memory map with a 30-day TTL.
- **Server Role Authority**: The user's role (`ADMIN`, `SELLER`, `BUYER`) and `isAdmin` status are determined strictly on the backend — client storage cannot elevate privileges.
- **Hydration Session Validation**: `AuthProvider` calls `validateSessionFn` on every app mount to verify token validity and role directly against the server, revoking tampered sessions.
- **Email Registration & Login**: Added tab toggle on `/register` and `/login` supporting both phone numbers and email addresses with OTP verification (`sendOtpFn` & `verifyOtpFn`).
- **Explicit Session Revocation**: `signOutFn` deletes server session tokens upon logout.

---

### 4.2 — Event & Analytics Foundation ✅ COMPLETED

**Objective**: Instrument the 12-type behavioral event model to power all intelligence features.

- **Event Types**: `PRODUCT_VIEWED`, `LISTING_VIEWED`, `SEARCH_PERFORMED`, `FILTER_APPLIED`, `CART_ADDED`, `CART_REMOVED`, `CHECKOUT_STARTED`, `ORDER_COMPLETED`, `STORE_VIEWED`, `CREATOR_VIDEO_PLAYED`, `FAVORITE_ADDED`, `FAVORITE_REMOVED`.
- **Privacy Standards**: Session-based anonymous tracking — zero PII (NID, phone) in event payloads. All events stored in Resale's own database via `public.user_events` Supabase table.
- **Data Truth Rule**: Events are only recorded when they actually occur. Never backfilled, inferred, or fabricated.
- **Micro-interactions**: Apple-style press-feedback and card-hover-lift utilities implemented across all buttons, product cards, listing cards, and seller trust cards using pure CSS (no animation libraries). Respects `prefers-reduced-motion`.

---

### 4.3 — Favorites & Saved Searches ⭐ HIGH

**Objective**: Allow buyers to save listings/products and persist search queries with optional new-listing alerts.

- **Favorites**: Heart button on listing and product pages. Saved to database. Private to the saving user.
- **Saved Searches**: "Save this search" action in `/products`. Stores query + active filters.
- **New Routes**: `/account/favorites` — buyer favorites dashboard.

---

### 4.4 — Seller Analytics Intelligence ✅ COMPLETED

**Objective**: Give sellers evidence-based performance metrics derived strictly from actual recorded Resale data.

- **Verified Data-Truth Metrics**:
  - **Listing Views**: Real 7-day, 30-day, and all-time views aggregated from `public.user_events` (`LISTING_VIEWED`).
  - **Cart Additions**: Real 7-day, 30-day, and all-time additions from `public.user_events` (`CART_ADDED`).
  - **Favorites Status**: Honest unavailable state (`"Favorites: Not available yet"`) acknowledging Phase 4.3 status without fabrication.
  - **Orders Breakdown**: Direct counts of Placed/Pending, Confirmed, Delivered/Completed, and Cancelled/Refunded orders.
  - **Delivered GMV**: Revenue calculated strictly from `DELIVERED` and `COMPLETED` orders (excluding unfulfilled orders and pending COD).
  - **Conversion Rate**: Verified ratio of delivered sales to listing views (with `"Not enough recorded data"` empty state when views = 0).
  - **Average Days to Sale**: Average duration between listing date and sale completion across completed sales.
  - **Dispute Rate**: Percentage of seller orders associated with buyer dispute filings.
- **Intelligent Deterministic Insights**:
  - High views with 0 cart additions pricing & listing suggestions.
  - Active cart interest with no orders notification.
  - Initial traffic awaiting notice for new listings.
  - Milestone acknowledgements for completed sales.
  - Proactive alerts for recorded dispute activity.
- **Seller Privacy & Authorization Isolation**:
  - Server-side session verification in `getSellerAnalyticsFn` prevents client ID spoofing or IDOR attacks.
  - Database queries strictly isolate listings, events, orders, and disputes to the authenticated seller ID.
- **Dedicated Route**: `/seller/analytics` (`src/routes/seller.analytics.tsx`) featuring overview metrics cards, deterministic insights, search & filter, desktop table, and mobile card grid.
- **Dashboard Overhaul**: Updated `src/routes/seller.dashboard.tsx` with live analytics links and honest unrecorded metrics.

---

### 4.5 — Notifications Infrastructure ✅ COMPLETED

**Objective**: Build a real, database-backed in-app notification system that triggers only from actual recorded events/state changes.

- **Database**: `public.notifications` table with 13 notification types, `public.notification_preferences` table with per-type enable/disable controls, RLS policies on both tables.
- **Server Functions**: `fetchNotificationsFn`, `fetchUnreadCountFn`, `markNotificationReadFn`, `markAllNotificationsReadFn`, `fetchPreferencesFn`, `updatePreferenceFn` — all using service-role key with session-based authorization.
- **Notification Service**: `createNotification`, `createOrderNotification`, `createDisputeNotification` with deterministic dedup key (`userId:type:entityType:entityId`) and preference checking.
- **Triggers**: ORDER_PLACED on `placeOrderFn`, ORDER_STATUS_UPDATED on `upsertOrderFn`, DISPUTE_FILED/DISPUTE_STATUS_UPDATED/DISPUTE_RESOLVED on `upsertDisputeFn`.
- **UI**: `<NotificationPanel />` component with bell icon, unread count badge, dropdown panel showing notification list with mark-as-read functionality. Added to `site-header.tsx` for both desktop and mobile views.
- **Privacy**: Notification content excludes NID numbers, full phone numbers, passwords, OTP codes, payment credentials, and unnecessary private buyer information. Duplicate prevention via deterministic reference keys.
- **No Email/SMS**: MVP delivers in-app notifications only; delivery abstraction structured for future email/SMS addition.
- **No Price Drop/Saved Search**: These types defined but disabled until Phase 4.3 (Favorites & Saved Searches) is implemented.

---

### 4.6 — Rule-Based Personalization Engine ✅ COMPLETED

**Objective**: Surface relevant products and listings based strictly on the user's actual recorded behavior and honest data-truth constraints.

- **Deterministic Recommendation Engine (`src/lib/recommendation-engine.ts`)**:
  - `getRecommendationsFromRecentOrder`: Evaluates user's most recent qualifying order (excluding cancelled/refunded orders), prioritizes Same Category + Same Brand &rarr; Same Category &rarr; Other Categories fallback, and excludes the exact purchased listing ID.
  - `getProductRecommendations`: Consolidated shared rule-based "You May Also Like" algorithm for canonical product pages (`/product/$productId`).
  - `getEditorialFallback`: Returns curated catalog listings without deceptive personalization labels.
  - `getUserPersonalizedShelves`: Typed orchestrator mapping real authenticated user purchase telemetry into UI shelves while explicitly declaring non-existent dependencies (Favorites, Saved Searches) as unavailable.
- **Personalized Homepage Shelf (`src/routes/index.tsx`)**:
  - "Based on your recent order" shelf rendered dynamically with honest contextual subtitles (e.g. `Because you ordered {productName}`).
  - Strict Data-Truth Protection: Never rendered for guest visitors or users without qualifying purchase history. Editorial sections (Just Listed, Featured Devices, Biggest Savings) remain completely intact.
- **Privacy & Authorization**: Derives purchase history strictly from the authenticated user's session. No cross-user data leakage, no PII in recommendation payloads, zero client ID tampering.
- **Consolidated Product Page (`src/routes/product.$productId.tsx`)**: Refactored to consume `getProductRecommendations()` without duplicate inline code.

---

### 4.7 — Device Lifecycle Passport ⭐ LOW

**Objective**: Build a persistent, honest record of a device's history on the Resale platform.

- **What Can Be Recorded**: Listing date, grade, condition score, number of inspection checks recorded, sale date, sold price, disputes filed.
- **Implementation**: `/product/$productId/history` sub-page showing the device's Resale timeline.

---

## 📊 Updated Summary Milestone Table

| Milestone      | Key Focus Area               | Deliverables                                                                                                                                                                        |    Status    |
| -------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------: |
| **Phase 1**    | Marketplace Core & Catalog   | Alternating Homepage, Catalog Filters, Cart, COD Checkout, NID Auth, Seller Wizard                                                                                                  | ✅ Completed |
| **Phase 2**    | Trust & Inspection UX        | 32-Point Inspection, Condition Gauge, Seller Trust Line, Device Verification, Product Multi-Seller Page                                                                             | ✅ Completed |
| **Phase 3.1**  | Order & Transaction Backbone | Decoupled Lifecycle State Machine, Payment Abstraction (COD Active), Mandatory Auth & Redirect, Buyer Timeline & Cancellation, Seller Fulfillment Hub, Admin Oversight              | ✅ Completed |
| **Phase 3.4**  | Creator & Pro Storefronts    | Public Branded Storefronts (`/store/:slug`), Verified Creator Profiles (`/creator/:slug`), Hands-on Product Video Reviews, Exact-Unit Review Badging, Bulk CSV Inventory Importer   | ✅ Completed |
| **Phase 3.6**  | Dispute Mediation Hub        | 48h Inspection Window, 24h Seller SLA, Evidence Dropzone, Side-by-Side Admin Workbench, Deterministic Risk Analyzer, Simulated Payout Holds & Reverse Logistics                     | ✅ Completed |
| **Phase 3.2**  | Courier Logistics            | Steadfast/Pathao API integration, live tracking webhooks, automated COD reconciliation                                                                                              |  📋 Planned  |
| **Phase 3.3**  | Automated Diagnostics        | Live IMEI verification API, device hardware test runner, certified badges                                                                                                           |  📋 Planned  |
| **Phase 3.5**  | AI Valuation Engine          | Real-time price recommender, price history graphs, "Fair Deal" badges                                                                                                               |  📋 Planned  |
| **Phase 4.1A** | Supabase Orders Persistence  | Remote PostgreSQL orders sync, user foreign-key resolution, snapshot immutability, cross-browser shared state                                                                       | ✅ Completed |
| **Phase 4.1B** | Remote Stores & Creators     | Supabase persistence for Pro Storefronts (`stores`) and Creator Hub (`creator_profiles`, `product_videos`)                                                                          | ✅ Completed |
| **Phase 4.1E** | Backend Admin Auth & Email   | Server-issued session tokens, backend role enforcement, spoofing prevention, email registration/login with OTP                                                                      | ✅ Completed |
| **Phase 4.1C** | Remote Dispute Persistence   | Supabase persistence for Disputes (`disputes`) and evidence metadata                                                                                                                | ✅ Completed |
| **Phase 4.1D** | Cloud Cart Sync              | Guest-to-user cart cloud persistence & automatic login merging                                                                                                                      | ✅ Completed |
| **Phase 4.2**  | Event & Analytics Model      | 12-type behavioral event model, privacy-safe session tracking, analytics foundation                                                                                                 | ✅ Completed |
| **Phase 4.3**  | Favorites & Saved Searches   | Listing/product favorites, saved search persistence, new-listing alerts                                                                                                             |  📋 Planned  |
| **Phase 4.4**  | Seller Intelligence          | Real listing view/conversion metrics, seller analytics page, dashboard overhaul                                                                                                     | ✅ Completed |
| **Phase 4.5**  | Notifications Infrastructure | Database-backed notifications table, RLS policies, notification preferences, order/dispute/price-drop triggers, in-app notification panel with bell icon, server-side authorization | ✅ Completed |
| **Phase 4.6**  | Rule-Based Personalization   | Deterministic recommendation engine, recent-order homepage shelf, consolidated product page "You May Also Like", strict data-truth fallback                                         | ✅ Completed |
| **Phase 4.7**  | Device Lifecycle Passport    | Honest per-device Resale history page, inspection/sale/dispute timeline                                                                                                             |  📋 Planned  |

---

_Last Updated: August 2026 · Resale.com Engineering Team_
