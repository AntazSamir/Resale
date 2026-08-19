# Resale.com — Quality-Checked Pre-Owned Electronics Marketplace 🇧🇩

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TanStack Router](https://img.shields.io/badge/TanStack-Router-FF4154?logo=react-router&logoColor=white)](https://tanstack.com/router)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Cloudflare](https://img.shields.io/badge/Deploy-Cloudflare-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com/)

**Resale.com** is Bangladesh's premier C2C and B2B marketplace for quality-checked pre-owned, open-box, and refurbished electronics. Engineered with objective component-level condition grading (A+ to D), NID-verified sellers, nationwide Cash on Delivery (COD), and a 48-hour buyer protection guarantee.

---

## ✨ Key Features & User Experience

### 🧭 1. Dual-Tier Navigation & Rich Dropdown Engine
* **Desktop Secondary Category Header**: Sticky navigation strip with hover/click dropdowns mounted directly to `document.body` via React Portals (`createPortal`), guaranteeing top-level foreground rendering (`z-[99999]`) over hero banners and media components:
  * **[Accessories ▾]**: Chargers & Cables, Power Banks, Cases & Covers, Screen Protectors, Stylus & Pens, USB Hubs & Docks, Memory Cards, Mounts & Stands, Keyboard & Mouse, Camera Bags & Straps, All Accessories.
  * **[Essentials ▾]**: Smartwatches, Earbuds, Headphones, Bluetooth Speakers, Soundbars, Wearable Fitness Bands, Smart Home Devices, Home Products.
  * **Direct Category Links**: Smartphones, Laptops, Cameras, Tablets, Gaming Consoles, Sell with Us, Partner Program.
* **Mobile Drawer Navigation**: Slide-over drawer featuring expandable accordion submenus for Accessories and Essentials with fluid chevron rotation animations and instant navigation handling.

### 📝 2. 4-Step Interactive Selling Wizard (`/sell`)
* **Step 1 — Product & Details**:
  * Category dropdown selection (9 main marketplace categories).
  * Product Name / Model text input (e.g. *Apple iPhone 15 Pro 256GB Natural Titanium*).
  * Short Description / Seller Note textarea for usage history and details.
  * Warranty status dropdown (*Active Manufacturer Warranty*, *Expired*, *No Warranty*).
  * Accessories included dropdown (*Box and all original accessories*, *Some original accessories*, *Device only*).
  * **Full Validation Engine**: Visual asterisks (`*`), red border highlighting on submit attempt, inline helper error messages.
* **Step 2 — Diagnostic Condition Grading Checklist**:
  * 5 objective hardware checks totaling 100 points.
  * **Conditional Repair Disclosure**: Selecting *"Official service repair, documented"* or *"Third-party repair"* opens a required input for replaced parts details.
* **Step 3 — Media & Pricing**:
  * Multi-photo drag-and-drop dropzone with instant thumbnail rendering, photo order badges (`#1`, `#2`...), and deletion (`✕`).
  * Selling price in BDT (৳) with platform fee and credit estimates.
* **Step 4 — Preview & Submit**:
  * Consolidated pre-moderation summary previewing category badge, product title, seller notes, calculated condition grade, checklist breakdown, and photo gallery.

### 🔍 3. Objective Condition Grading Matrix (100-Point Scale)
* **Grade A+ (Like New / Open-box)**: 95–100 pts · Flawless display & housing, 95%+ battery capacity, complete accessories.
* **Grade A (Excellent)**: 85–94 pts · Micro-scratches only visible under direct light, high battery health, zero functional defects.
* **Grade B (Good)**: 70–84 pts · Normal everyday cosmetic wear, 100% functional components, all repairs disclosed.
* **Grade C (Fair)**: 55–69 pts · Noticeable casing marks or scuffs, fully operational for value buyers.
* **Grade D (Heavy Wear)**: < 55 pts · Heavy wear or replaced parts sold with full disclosure and discount pricing.

### 🛡️ 4. Trust & Buyer Protection Ecosystem
* **NID Identity Verification**: Government-verified seller profiles ensuring platform safety.
* **Nationwide Cash on Delivery (COD)**: Safe transactions delivered through trusted courier partners across all 64 districts.
* **48-Hour Inspection & Return Policy**: Escrow protection window allowing buyers to inspect their device upon arrival.
* **Seller Portal (`/seller/listings`)**: Comprehensive dashboard showing active listings and pending drafts with live grade breakdowns, warranty tags, and repair disclosures.

---

## 🎨 UI/UX Design System Guidelines

| Token / Layer | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Brand Orange)** | `hsl(24, 95%, 53%)` (`#ea580c`) | Highlights & Action CTAs | Primary buttons, active tabs, badges |
| **Background Canvas** | `hsl(0, 0%, 100%)` | `hsl(240, 10%, 3.9%)` | Page background |
| **Card / Surface** | `hsl(0, 0%, 98%)` | `hsl(240, 10%, 6%)` | Elevated cards, forms, drawer backgrounds |
| **Hairline Dividers** | `hsl(240, 5.9%, 90%)` | `hsl(240, 3.7%, 15.9%)` | Crisp 1px structural grid lines |
| **Success / Verified** | `hsl(142, 76%, 36%)` | `hsl(142, 70%, 45%)` | NID verification badges, 100% functional tags |
| **Destructive / Error** | `hsl(0, 84.2%, 60.2%)` | `hsl(0, 62.8%, 30.6%)` | Validation errors, defect warnings |

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| **Frontend** | React 19, TypeScript 5.7+ |
| **Styling** | Tailwind CSS v4, PostCSS, Radix UI Primitives, Lucide Icons |
| **State & Data** | In-Memory Catalog Data Store, TanStack Query, Nitro Server Functions |
| **Deployment** | Vercel (Edge & Serverless) / Cloudflare Workers / Nitro Multi-target Preset |

---

## 📁 Project Structure

```
├── vercel.json                 # Vercel deployment configuration
├── public/                     # Static public assets (logos, maps, favicons)
├── src/
│   ├── assets/                 # Brand assets & images (official logo, hero media, product images)
│   ├── components/
│   │   ├── ui/                 # Accessible Radix & Tailwind UI components (Button, Sheet, Select, etc.)
│   │   ├── site-header.tsx     # Dual header bar, portal dropdown engine & mobile drawer
│   │   ├── site-footer.tsx     # Footer, newsletter subscription & platform directory
│   │   ├── listing-card.tsx    # Listing-first product offer card
│   │   ├── product-card.tsx    # Catalog model showcase card
│   │   ├── grade-badge.tsx     # Visual condition grade badge (A+ to D)
│   │   ├── grade-selector.tsx  # Condition grading form & conditional repair inputs
│   │   └── protected-route.tsx # Auth guard for accounts, sellers & admin
│   ├── data/
│   │   ├── catalog.ts          # Products catalog, active listings, brands & pricing utilities
│   │   └── grading.ts          # 100-point condition grading calculation matrix
│   ├── lib/
│   │   ├── auth-store.tsx      # User authentication session store
│   │   ├── cart-store.tsx      # Shopping cart store & persistence
│   │   ├── grade-store.ts      # Graded listing drafts store
│   │   ├── order-store.ts      # Orders & delivery tracking store
│   │   └── server-functions.ts # Nitro server functions (OTP auth, checkout handlers)
│   ├── routes/
│   │   ├── __root.tsx          # Root HTML layout & global error boundary
│   │   ├── index.tsx           # Homepage (Hero, Deals, Categories, Banners, Grading, Brands)
│   │   ├── products.tsx        # Unified Marketplace with full facet filter engine
│   │   ├── categories.tsx      # Compact Category Catalog Hub
│   │   ├── listing.$listingId.tsx # Individual Listing Details & Diagnostic Report
│   │   ├── checkout.tsx        # Multi-step checkout & COD order placement
│   │   ├── sell.index.tsx      # Interactive 4-Step Grading Wizard & Listing Submission
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

---

## ☁️ Deployment

### 1. Deploying to Vercel (Recommended)

This project is pre-configured with [`vercel.json`](./vercel.json) for instant, one-click deployments on Vercel:

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." ➔ "Project"**.
3. Select the `AntazSamir/Resale` repository.
4. Leave all settings default (`vercel.json` automatically triggers `NITRO_PRESET=vercel vite build`).
5. Click **"Deploy"**.

### 2. Deploying to Cloudflare Workers

To compile TypeScript and build for Cloudflare Workers / Nitro:

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
