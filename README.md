# Resale.com — Pre-Owned Electronics Marketplace (Bangladesh) 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Cloudflare Workers](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier C2C and B2B marketplace for quality-checked pre-owned, open-box, and like-new consumer electronics. Built around transparent condition grading (A+ to D), NID-verified sellers, nationwide Cash on Delivery (COD), and a 48-hour buyer protection guarantee.

---

## ✨ Key Features

### 🛒 1. Listing-First Marketplace Architecture
* **Individual Listings**: Rather than generic catalog aggregates, browse real seller offers with live condition grades, warranty months, district locations, and seller badges.
* **Direct Listing URLs**: Every sellable offer has a unique permalink (`/listing/$listingId`) with full component test results and direct Add to Cart / Checkout actions.
* **Granular Multi-Filters**: Filter by Category, Brand, Condition Grade (A+, A, B, C, D), Price Range, and Seller District across all 64 districts in Bangladesh.

### 🔍 2. Objective 13-Point Condition Grading Standard
* **Grade A+ (Pristine / Open-box)**: Flawless display & housing, 95%+ battery health, original accessories.
* **Grade A (Excellent)**: Micro-scratches only visible under direct light, high battery health, zero functional defects.
* **Grade B (Good)**: Normal cosmetic wear, 100% functional components, all repairs disclosed.
* **Grade C (Fair)**: Noticeable scuffs/scratches, great value for budget buyers.
* **Grade D (Heavy Wear)**: Heavy cosmetic wear or battery under 80%, deeply discounted.

### 🛡️ 3. Buyer & Seller Protection
* **NID Identity Verification**: Government ID verified sellers with trust badges.
* **Cash on Delivery (COD)**: Nationwide delivery via trusted courier partners (RedX, Pathao, eCourier).
* **48-Hour Dispute Policy**: Easy dispute resolution process if an item differs from its graded listing.

### 📱 4. Category Directory & Brand Exploration
* **Dedicated `/categories` Hub**: Compact 2-column mobile, 3-column tablet, and 4-column desktop directory with live model counts and popular brand chips.
* **Featured Brands Directory**: 15+ major electronics brands (Apple, Samsung, Sony, Google, Dell, Lenovo, Fujifilm, Bose, etc.).
* **Slash Deal of the Day**: Limited-time featured listings with instant savings calculations.

### 💼 5. Seller Hub & B2B Partner Program
* **Seller Portal (`/seller/dashboard`)**: Manage active listings, track completed sales, review payout history, and list new items with an interactive condition evaluation wizard.
* **B2B Excess Inventory Intake (`/partner`)**: Tailored application for authorized retailers, distributors, corporate sellers, and refurbishers.
* **Admin Moderation Console (`/admin`)**: Identity verification queue, listing approvals, and platform GMV analytics.

---

## 🛠️ Technology Stack

* **Framework**: [TanStack Start](https://tanstack.com/start) with [TanStack Router](https://tanstack.com/router) (Full SSR + Nitro server engine)
* **Frontend**: React 19, TypeScript
* **Styling**: Tailwind CSS v4, PostCSS, Radix UI Primitives, Lucide Icons
* **Data Layer**: In-memory store + TanStack Query with Server Functions
* **Deployment**: Cloudflare Workers / Nitro Cloudflare Module Preset

---

## 📁 Project Structure

```
├── public/                     # Static public assets (favicons, SVG maps)
├── src/
│   ├── assets/                 # Brand assets & images (logo, hero, product media)
│   ├── components/
│   │   ├── ui/                 # Accessible Radix & Tailwind UI components
│   │   ├── site-header.tsx     # Responsive site header, drawer & footer
│   │   ├── listing-card.tsx    # Listing-first product offer card
│   │   ├── product-card.tsx    # Catalog model card
│   │   ├── grade-badge.tsx     # Visual condition grade pill badge
│   │   └── protected-route.tsx # Auth & Admin route guard
│   ├── data/
│   │   ├── catalog.ts          # Products, listings, brands & price formatting
│   │   └── grading.ts          # Condition grading calculation matrix
│   ├── lib/
│   │   ├── auth-store.tsx      # Authentication state & session manager
│   │   ├── cart-store.tsx      # Cart state & persistence
│   │   ├── order-store.ts      # Orders & delivery status store
│   │   └── server-functions.ts # Nitro server functions (OTP, checkout, etc.)
│   ├── routes/
│   │   ├── __root.tsx          # Root layout & global 404 handler
│   │   ├── index.tsx           # Homepage (Deals, Popular, Bento Grading, Brands)
│   │   ├── products.tsx        # Unified Marketplace & Filtered Listings
│   │   ├── categories.tsx      # Compact Category Catalog Hub
│   │   ├── listing.$listingId.tsx # Individual Listing Details & Inspection
│   │   ├── checkout.tsx        # Multi-step checkout & COD order placement
│   │   ├── sell.index.tsx      # Interactive Grading Wizard & Listing Submission
│   │   ├── partner.tsx         # B2B Corporate Excess Inventory Application
│   │   ├── seller.*.tsx        # Seller Dashboard, My Listings & Payouts
│   │   ├── admin.*.tsx         # Admin Moderation & Identity Verification
│   │   └── contact.tsx         # Support Desk & Knowledge Base FAQ
│   └── styles.css              # Global styles, typography & hairline grid tokens
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.x` or higher
* **Package Manager**: `npm` (v10+)

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
   Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) in your browser.

### Build & Production Check

To compile TypeScript and create the optimized production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npx vite preview
```

---

## 📄 License & Credits

Built with ❤️ for Bangladesh's pre-owned electronics ecosystem.  
© 2026 Resale.com Limited. All rights reserved.
