# RESALE.COM — Phase Implementation & Roadmap

> **Bangladesh's Trusted C2C Marketplace for Quality-Checked Pre-Owned, Open-Box & Like-New Electronics**

This document tracks the completed engineering milestones across **Phase 1** and **Phase 2**, and outlines the strategic and technical roadmap for **Phase 3**.

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

## 🚀 Phase 3: Future Strategic & Engineering Roadmap

**Status:** `PLANNED` · **Target Milestones**

Phase 3 focuses on scaling platform operations, financial automation, logistics integration, and intelligent pricing tooling.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PHASE 3 ROADMAP                                 │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│   3.1 Payments &      │   3.2 Logistics &       │   3.3 Automated           │
│   Escrow Engine       │   Courier APIs          │   Diagnostics             │
├───────────────────────┼─────────────────────────┼───────────────────────────┤
│   3.4 Creator &       │   3.5 AI Valuation &    │   3.6 Dispute &           │
│   Business Storefronts│   Smart Pricing         │   Fraud Shield            │
└───────────────────────┴─────────────────────────┴───────────────────────────┘
```

---

## ✅ Phase 3.1: Order & Transaction Infrastructure

**Status:** `COMPLETED`

Phase 3.1 established the core transaction and order lifecycle backbone, decoupling the order system from payment providers while maintaining active COD fulfillment and strict data snapshot integrity.

### 1. Decoupled Lifecycle State Machine
- **Order Lifecycle States**: `PENDING` &rarr; `CONFIRMED` &rarr; `PROCESSING` &rarr; `READY_TO_SHIP` &rarr; `SHIPPED` &rarr; `DELIVERED` &rarr; `COMPLETED` (plus `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`, `DISPUTED`).
- **Independent Payment Status**: `PENDING` (payment due on delivery), `AUTHORIZED`, `PAID`, `FAILED`, `REFUND_PENDING`, `REFUNDED`.
- **Payment Method Abstraction**: Architecture supports `COD`, `BKASH`, `NAGAD`, `SSLCOMMERZ`, `CARD`, with **COD as the only active provider** in this phase.

### 2. Order Snapshot & Financial Integrity
- **Listing Snapshot Preservation**: Each order item permanently captures the listing's product name, grade, condition score, seller identity, images, and included accessories at the exact moment of checkout.
- **Shared Price Calculator**: Centralized `calculateOrderTotals` helper enforcing consistent math across Cart, Checkout, Order Confirmation, Buyer Tracking, Seller Hub, and Admin Console.

### 3. Buyer Order Tracking & Controlled Cancellation
- **Audited Event Timeline (`/account/orders/$orderId`)**: Displays chronological application events with timestamp, actor (`BUYER`, `SELLER`, `COURIER`, `ADMIN`), and verified note.
- **Controlled Cancellation Flow**: Buyers can cancel only at `PENDING` or `CONFIRMED` stages before dispatch, with required reason logging and audit trail update.

### 4. Seller Fulfillment Hub (`/seller/orders`)
- **Seller Order Management**: Stage-by-stage progression controls (`Confirm Order` &rarr; `Start Packing` &rarr; `Mark Ready` &rarr; `Hand to Courier` &rarr; `Confirm Delivery`).
- **Integrated Seller Hub**: Added to `SellerSidebar` with live pending order counts and GMV metrics.

### 5. Admin Transaction Oversight (`/admin/orders`)
- **Platform-Wide Transaction Audit**: Searchable order directory with dual Order/Payment status filters, total GMV volume tracking, and instant access to dispute audit logs.

---

## 🚀 Upcoming Strategic & Engineering Roadmap (Phase 3.2 – 3.6)

**Status:** `PLANNED` · **Target Milestones**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             UPCOMING ROADMAP                                │
├───────────────────────┬─────────────────────────┬───────────────────────────┤
│   3.2 Logistics &     │   3.3 Automated         │   3.4 Creator &           │
│   Courier APIs        │   Diagnostics           │   Business Storefronts    │
├───────────────────────┼─────────────────────────┼───────────────────────────┤
│   3.5 AI Valuation &  │   3.6 Dispute &         │   Future Payment Gateways │
│   Smart Pricing       │   Fraud Shield          │   (bKash/Nagad/Escrow)    │
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

### 🏪 3.4 Professional & Creator Reseller Storefronts
- **Creator / Reviewer Verified Listings**: Embedded YouTube/TikTok review unit links.
- **Professional Shop Accounts**: Tiered subscriptions, branded storefront profiles, and bulk CSV inventory upload.

---

### 🤖 3.5 AI-Powered Smart Pricing & Valuation Engine
- **Fair-Market Price Recommendation**: Machine learning model based on historical completed sales.
- **Depreciation Tracker**: Visual price depreciation charts for popular smartphones and laptops.

---

### ⚖️ 3.6 Automated Dispute Mediation & Fraud Shield
- **Structured Dispute Resolution Center (`/account/disputes`)**: Evidence upload portal (photo/video unboxing), SLA timers, and one-click admin arbitration.
- **Seller Strike & Anti-Fraud Engine**: Automated trust score degradation and serial deduplication.

---

## 📊 Summary Milestone Table

| Milestone | Key Focus Area | Deliverables | Status |
|---|---|---|:---:|
| **Phase 1** | Marketplace Core & Catalog | Alternating Homepage, Catalog Filters, Cart, COD Checkout, NID Auth, Seller Wizard | ✅ Completed |
| **Phase 2** | Trust & Inspection UX | 32-Point Inspection, Condition Gauge, Seller Trust Line, Device Verification, Product Multi-Seller Page | ✅ Completed |
| **Phase 3.1** | Order & Transaction Backbone | Decoupled Lifecycle State Machine, Payment Abstraction (COD Active), Buyer Timeline & Cancellation, Seller Fulfillment Hub, Admin Oversight | ✅ Completed |
| **Phase 3.2** | Courier Logistics | Steadfast/Pathao API integration, live tracking webhooks, automated COD reconciliation | 📋 Planned |
| **Phase 3.3** | Automated Diagnostics | Live IMEI verification API, device hardware test runner, certified badges | 📋 Planned |
| **Phase 3.4** | Creator & Pro Storefronts | Video-linked review units, custom shop profiles, bulk inventory uploader | 📋 Planned |
| **Phase 3.5** | AI Valuation Engine | Real-time price recommender, price history graphs, "Fair Deal" badges | 📋 Planned |
| **Phase 3.6** | Dispute Mediation Hub | Evidence upload portal, SLA timers, admin dispute workbench, fraud scoring | 📋 Planned |

---

*Last Updated: August 2026 · Resale.com Engineering Team*

