# Resale.com — Quality-Checked Pre-Owned Electronics Marketplace 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier marketplace for quality-checked pre-owned, open-box, and like-new consumer electronics. Designed with objective component-level condition grading (A+ to D), NID-verified sellers, nationwide Cash on Delivery (COD), and a 48-hour buyer protection guarantee.

---

## ✨ Key Features & User Experience

### 🛒 1. Listing-First Marketplace Architecture
* **Verified Seller Units**: Browse real, individualized units with condition scores, seller district locations, warranty statuses, and verified badges.
* **Direct Permalink URLs**: Every listing has its own dedicated page (`/listing/$listingId`) with full diagnostic inspection checklists, seller notes, invoice statuses, and direct checkout actions.
* **Responsive Listings Grid**: Clean multi-column grid across all devices (2 columns on mobile, 3 columns on tablet, 4 columns on desktop) with granular facet filters.

### 🧭 2. Secondary Category Navigation & Instant Filters
* **Secondary Category Navbar**: Fast desktop navigation strip and mobile drawer linking directly to targeted inventory:
  * **[Accessories]**: Fast wireless chargers, MagSafe gear, high-output power banks, and styluses.
  * **[Earbuds]**: AirPods Pro 2, Samsung Galaxy Buds, Sony WF-1000XM5 ANC earbuds.
  * **[Headphones]**: Sony WH-1000XM5, Bose QuietComfort Ultra over-ear headphones.
  * **[Speakers]**: JBL portable Bluetooth speakers, smart home displays.
  * **[Wearables]**: Apple Watch Series 9, smartwatch inventory with battery and sensor reports.
  * **[Tablets]**: iPad Pro M2 and tablet devices.
  * **[Home Products]**: Smart home displays and voice assistants.

### 🏷️ 3. Service & Promotional Banners
* **Instant Device Cashout (`/sell`)**: Integrated service banner connecting sellers with instant algorithmic valuations, free doorstep pickup across 64 districts, and same-day payout.
* **Resale Assurance & Warranty (`/products`)**: Dedicated assurance highlight featuring 32-point hardware diagnostics, genuine parts certification, and 48-hour return windows.
* **Slash Deal of the Day**: Limited-time featured listings with automated retail-price comparison and savings badges.

### 🔍 4. Objective Condition Grading Matrix
* **Grade A+ (Like New / Open-box)**: Flawless display & housing, 95%+ battery health, complete original accessories.
* **Grade A (Excellent)**: Micro-scratches only visible under direct light, high battery health, zero functional defects.
* **Grade B (Good)**: Normal cosmetic wear, 100% functional components, all repairs disclosed in full.
* **Grade C (Fair)**: Noticeable scuffs or casing marks, fully functional for value buyers.
* **Grade D (Heavy Wear)**: Heavy cosmetic wear or battery under 80%, sold with deep discount pricing and full disclosure.

### 🛡️ 5. Trust & Protection Ecosystem
* **NID Identity Verification**: Government-verified seller profiles ensuring platform safety.
* **Nationwide Cash on Delivery (COD)**: Safe transactions delivered through trusted courier partners.
* **48-Hour Inspection & Return Policy**: Protection window allowing buyers to inspect their device and raise instant disputes if not as described.

### 💼 6. Seller Hub & B2B Partner Program
* **Interactive Selling Wizard (`/sell`)**: Step-by-step diagnostic condition questionnaire with automated grade scoring and instant listing publication.
* **Seller Portal (`/seller/dashboard`)**: Comprehensive management dashboard for active listings, sales analytics, and payout tracking.
* **B2B Excess Inventory Intake (`/partner`)**: Corporate partner program for authorized retailers, distributors, and bulk refurbishers.
* **Admin Moderation Portal (`/admin`)**: Listing moderation, identity review queue, and GMV analytics.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| **Frontend** | React 19, TypeScript 5.7+ |
| **Styling** | Tailwind CSS v4, PostCSS, Radix UI Primitives, Lucide Icons |
| **State & Data** | In-Memory Catalog Data Store, TanStack Query, Nitro Server Functions |
| **Deployment** | Cloudflare Workers / Nitro Cloudflare Module Preset |

---

## 📁 Project Structure

```
├── public/                     # Static public assets (logos, maps, favicons)
├── src/
│   ├── assets/                 # Brand assets & images (official logo, hero media, product images)
│   ├── components/
│   │   ├── ui/                 # Accessible Radix & Tailwind UI components (Button, Sheet, Select, etc.)
│   │   ├── site-header.tsx     # Header bar, secondary category navigation strip & mobile drawer
│   │   ├── site-footer.tsx     # Footer, newsletter subscription & platform directory
│   │   ├── listing-card.tsx    # Listing-first product offer card
│   │   ├── product-card.tsx    # Catalog model showcase card
│   │   ├── grade-badge.tsx     # Visual condition grade badge (A+ to D)
│   │   └── protected-route.tsx # Auth guard for accounts, sellers & admin
│   ├── data/
│   │   ├── catalog.ts          # Products catalog, active listings, brands & pricing utilities
│   │   └── grading.ts          # Condition grading calculation matrix
│   ├── lib/
│   │   ├── auth-store.tsx      # User authentication session store
│   │   ├── cart-store.tsx      # Shopping cart store & persistence
│   │   ├── order-store.ts      # Orders & delivery tracking store
│   │   └── server-functions.ts # Nitro server functions (OTP auth, checkout handlers)
│   ├── routes/
│   │   ├── __root.tsx          # Root HTML layout & global error boundary
│   │   ├── index.tsx           # Homepage (Hero, Deals, Categories, Banners, Grading, Brands)
│   │   ├── products.tsx        # Unified Marketplace with full facet filter engine
│   │   ├── categories.tsx      # Compact Category Catalog Hub
│   │   ├── listing.$listingId.tsx # Individual Listing Details & Diagnostic Report
│   │   ├── checkout.tsx        # Multi-step checkout & COD order placement
│   │   ├── sell.index.tsx      # Interactive Grading Wizard & Listing Submission
│   │   ├── partner.tsx         # B2B Corporate Excess Inventory Application
│   │   ├── seller.*.tsx        # Seller Dashboard, My Listings & Payouts
│   │   ├── admin.*.tsx         # Admin Moderation & Identity Verification
│   │   └── contact.tsx         # Support Desk & Knowledge Base FAQ
│   └── styles.css              # Global styles, editorial typography & hairline grid tokens
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm` (`v10+`)

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

### Build & Production Check

To compile TypeScript and build the Cloudflare Worker SSR bundle:

```bash
npm run build
```

To preview the production bundle locally:

```bash
npx vite preview
```

---

## 📄 License & Credits

Built with ❤️ for Bangladesh's pre-owned electronics ecosystem.  
© 2026 Resale.com Limited. All rights reserved.
