# Resale.com — Quality-Checked Pre-Owned Electronics Marketplace 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier C2C and B2B marketplace for quality-checked pre-owned, open-box, and refurbished electronics. Engineered with objective component-level condition grading (A+ to D), 32-point hardware inspection, NID-verified sellers, nationwide Cash on Delivery (COD), decoupled order lifecycle state machines, Pro Merchant storefronts, Verified Creator video reviews, and a comprehensive 48-hour dispute mediation hub.

---

## ✨ Key Features & Architecture

### 🧭 1. Dual-Tier Navigation & Rich Portal Dropdowns

- **Desktop Secondary Category Header**: Sticky navigation strip with hover/click dropdowns mounted directly to `document.body` via React Portals (`createPortal`), guaranteeing top-level foreground rendering (`z-[99999]`) over hero banners and media components:
  - **[Accessories ▾]**: Chargers & Cables, Power Banks, Cases & Covers, Screen Protectors, Stylus & Pens, USB Hubs & Docks, Memory Cards, Mounts & Stands, Keyboard & Mouse, Camera Bags & Straps, All Accessories.
  - **[Essentials ▾]**: Smartwatches, Earbuds, Headphones, Bluetooth Speakers, Soundbars, Wearable Fitness Bands, Smart Home Devices, Home Products.
  - **Direct Category Links**: Smartphones, Laptops, Cameras, Tablets, Gaming Consoles, Sell with Us, Partner Program.
- **Mobile Drawer Navigation**: Slide-over drawer featuring expandable accordion submenus for Accessories and Essentials with fluid chevron rotation animations and instant navigation handling.

---

### 🔍 2. Trust Architecture & Progressive Listing UX (Phase 2)

The listing details page (`/listing/$listingId`) presents a structured, high-trust buyer evaluation journey:

1. **Seller Trust Line**: Avatar, name, verified badge with hover tooltip, district/area, and star rating.
2. **Brand & Product Title**: High-contrast typography with subtle uppercase brand tracking.
3. **Condition Score Gauge**: 4-zone segmented progress bar (<60 Heavy Wear, 60–74 Fair, 75–89 Good, 90–100 Excellent) and grade badge.
4. **Quick Trust Pills**: Badges for remaining warranty months, battery health percentage, and original invoice availability.
5. **What's Included**: Chips for included accessories (Original Box, 70W Adapter, MagSafe Cable) or explicit "Device only" notice.
6. **Repair History**: Servicing breakdown (Official / Third-Party / Self-Serviced with dates and repair receipts) or verified "No repairs recorded".
7. **32-Point Hardware Inspection**: 5 evaluation categories (Physical, Functional, Connectivity, Security, Authenticity) with strict data-truth safeguards.
8. **Device Verification Matrix**: IMEI, carrier lock, iCloud/activation lock status with sample verification badges.
9. **Multi-Seller Canonical Catalog (`/product/$productId`)**: Canonical product page aggregating all active seller units with instant grade filtering and price sorting.

---

### 📦 3. Order & Transaction Infrastructure (Phase 3.1)

- **Decoupled Order Lifecycle Engine**:
  - `OrderStatus`: `PENDING` &rarr; `CONFIRMED` &rarr; `PROCESSING` &rarr; `READY_TO_SHIP` &rarr; `SHIPPED` &rarr; `DELIVERED` &rarr; `COMPLETED` (plus `CANCELLED`, `REFUND_REQUESTED`, `REFUNDED`, `DISPUTED`).
  - `PaymentStatus`: `PENDING` (Payment due on delivery), `AUTHORIZED`, `PAID`, `FAILED`, `REFUND_PENDING`, `REFUNDED`.
- **Payment Method Abstraction**: Architecture supports `COD`, `BKASH`, `NAGAD`, `SSLCOMMERZ`, `CARD`, with **Cash on Delivery (COD) as the active method**.
- **Listing Snapshot Preservation**: Each order item permanently preserves the product name, grade, condition score, seller identity, images, and included accessories at the exact moment of checkout.
- **Audited Event Timeline (`/account/orders/$orderId`)**: Chronological event logs recorded by Buyer, Seller, Courier, and Admin.
- **Controlled Cancellation Flow**: Buyers can cancel orders during `PENDING` and `CONFIRMED` stages before courier dispatch with mandatory reason capture.
- **Seller Order Fulfillment Hub (`/seller/orders`)**: Dedicated dashboard for sellers to progress orders through confirmation, packaging, and courier handover.
- **Admin Transaction Monitoring (`/admin/orders`)**: Platform-wide transaction directory with dual Order/Payment state filters, GMV tracking, and direct dispute mediation links.

---

### 🏪 4. Pro Storefronts & Creator Suite (Phase 3.4)

- **Public Branded Storefronts (`/store/:slug`)**: Verified merchant profiles with cover banners, operational badges, warranty policies, and live catalog filtering.
- **Verified Creator Video Hub (`/creator/:slug`)**: Direct creator channels featuring short-form and long-form hands-on device unboxings with exact-unit inspection tag links.
- **Hands-on Video Review Strip**: Listing pages embed creator review cards with modal video players and timestamps.
- **Bulk CSV / JSON Inventory Importer (`/seller/inventory/import`)**: Drag-and-drop importer with validation previews, schema mapping, and one-click bulk drafting.

---

### ⚖️ 5. Dispute Mediation Hub & Fraud Shield (Phase 3.6)

- **48-Hour Buyer Inspection Window (`/account/disputes`)**:
  - Enforced delivery timestamp validation with real-time countdown badges.
  - 32-point inspection defect checklist targeting specific component mismatches.
  - Interactive drag-and-drop evidence dropzone (photos/videos with quota limits: max 5MB/photo, max 15MB/video) and quick sample proof loaders.
  - PII masking on sensitive contact info (`017****1234`, `****-****-9201`).
- **Seller Claims Hub (`/seller/disputes`)**:
  - 24-hour response SLA countdown timer with automatic escalation to admin review upon timeout.
  - _"Accept Return & Authorize Full Refund (Simulation)"_ 1-click agreement flow.
  - Counter-evidence and explanation uploader (dispatch packaging photos, IMEI serial match proof).
- **Admin Mediation Workbench (`/admin/disputes`)**:
  - Side-by-side comparison matrix: Original 32-Point Listing Baseline vs. Buyer Claim & Evidence vs. Seller Response.
  - Deterministic Rule-Based Risk Analyzer (0–100 score, higher = higher risk) and Evidence Consistency Confidence (0–100%).
  - Verdict execution console: Approve 100% Refund, Approve Return & Reverse Courier Pickup (`#REV-XXXXX`), or Reject Claim & Release Seller Payout.

---

## 🎨 UI/UX Design System Tokens

| Token / Layer              | Light Mode                      | Dark Mode                | Usage                                         |
| :------------------------- | :------------------------------ | :----------------------- | :-------------------------------------------- |
| **Primary (Brand Orange)** | `hsl(24, 95%, 53%)` (`#ea580c`) | Highlights & Action CTAs | Primary buttons, active tabs, badges          |
| **Background Canvas**      | `hsl(0, 0%, 100%)`              | `hsl(240, 10%, 3.9%)`    | Page background                               |
| **Card / Surface**         | `hsl(0, 0%, 98%)`               | `hsl(240, 10%, 6%)`      | Elevated cards, forms, drawer backgrounds     |
| **Hairline Dividers**      | `hsl(240, 5.9%, 90%)`           | `hsl(240, 3.7%, 15.9%)`  | Crisp 1px structural grid lines               |
| **Success / Verified**     | `hsl(142, 76%, 36%)`            | `hsl(142, 70%, 45%)`     | NID verification badges, 100% functional tags |
| **Destructive / Error**    | `hsl(0, 84.2%, 60.2%)`          | `hsl(0, 62.8%, 30.6%)`   | Validation errors, defect warnings            |

---

## 🛠️ Technology Stack

| Layer            | Technology                                                                                    |
| :--------------- | :-------------------------------------------------------------------------------------------- |
| **Framework**    | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| **Frontend**     | React 19, TypeScript 5.7+ (Strict Optional Types)                                             |
| **Styling**      | Tailwind CSS v4, PostCSS, Radix UI Primitives, Lucide Icons                                   |
| **State & Data** | In-Memory Catalog & Store Engines, TanStack Query, Nitro Server Functions                     |
| **Deployment**   | Vercel (Edge & Serverless) / Cloudflare Workers / Nitro Multi-target Preset                   |

---

## 📁 Project Structure

```
├── public/                             # Static public assets (logos, maps, favicons)
├── src/
│   ├── assets/                         # Brand assets & images (official logo, hero media, product images)
│   ├── components/
│   │   ├── ui/                         # Accessible Radix & Tailwind UI components (Button, Sheet, Select, etc.)
│   │   ├── site-header.tsx             # Dual header bar, portal dropdown engine & mobile drawer
│   │   ├── site-footer.tsx             # Footer, newsletter subscription & platform directory
│   │   ├── listing-card.tsx            # Listing-first product offer card
│   │   ├── product-card.tsx            # Catalog model showcase card
│   │   ├── grade-badge.tsx             # Visual condition grade badge (A+ to D)
│   │   ├── condition-score.tsx         # 4-zone condition score gauge
│   │   ├── seller-trust-card.tsx       # SellerTrustLine and SellerTrustCard
│   │   ├── device-verification.tsx     # Security and cloud activation matrix
│   │   ├── inspection-report.tsx       # 32-point inspection breakdown
│   │   ├── repair-history.tsx          # Component servicing disclosure table
│   │   ├── whats-included.tsx          # Accessory tags and inclusions
│   │   └── protected-route.tsx         # Auth guard with redirect support
│   ├── data/
│   │   ├── catalog.ts                  # Products catalog, active listings, brands & pricing utilities
│   │   ├── grading.ts                  # 100-point condition grading calculation matrix
│   │   ├── storefront.ts               # Merchant storefronts and store data
│   │   └── creator.ts                  # Verified creator profiles and video reviews
│   ├── lib/
│   │   ├── auth-store.tsx              # User authentication session store
│   │   ├── cart-store.tsx              # Shopping cart store & persistence
│   │   ├── grade-store.ts              # Graded listing drafts store
│   │   ├── order-store.ts              # Orders, lifecycle state machine, & timeline engine
│   │   ├── dispute-store.ts            # Dispute lifecycle, SLA engine, & deterministic risk model
│   │   ├── store-store.ts              # Pro merchant storefronts store
│   │   ├── creator-store.ts            # Creator profiles & video review relations
│   │   ├── bulk-importer.ts            # CSV / JSON inventory parsing & validation engine
│   │   └── server-functions.ts         # Nitro server functions (OTP auth, checkout handlers)
│   ├── routes/
│   │   ├── __root.tsx                  # Root HTML layout & global error boundary
│   │   ├── index.tsx                   # Homepage (18 discovery sections with mobile bento grid)
│   │   ├── products.tsx                # Unified Marketplace with full multi-facet filter engine
│   │   ├── categories.tsx              # Category & Subcategory Catalog Hub
│   │   ├── product.$productId.tsx      # Multi-seller aggregated product view
│   │   ├── listing.$listingId.tsx      # Progressive Listing Details & 32-Point Report
│   │   ├── store.$storeSlug.tsx        # Public Branded Merchant Storefront
│   │   ├── creator.$creatorSlug.tsx    # Verified Creator Profile & Video Hub
│   │   ├── checkout.tsx                # Gated 3-step checkout & COD order placement
│   │   ├── account.orders.tsx          # Buyer Order History & status filters
│   │   ├── account.orders.$orderId.tsx # Buyer Detailed Timeline Tracking & 48h Inspection Timer
│   │   ├── account.disputes.tsx        # Buyer Dispute Filing & Evidence Upload Dropzone
│   │   ├── sell.index.tsx              # Interactive 4-Step Grading Wizard & Listing Submission
│   │   ├── seller.dashboard.tsx        # Seller Hub Analytics & Navigation
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
│   │   ├── login.tsx                   # Phone OTP Login with return redirection
│   │   ├── register.tsx                # NID-Verified Registration
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

   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Verify formatting, linting, and production build:**
   ```bash
   npm run format
   npm run lint
   npm run build
   ```

---

## 📄 License & Credits

Built with ❤️ for Bangladesh's pre-owned electronics ecosystem.  
© 2026 Resale.com Limited. All rights reserved.
