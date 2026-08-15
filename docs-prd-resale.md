RESALE.COM — Production PRD

Bangladesh's C2C Marketplace for Quality-Checked Pre-Owned, Open-Box & Like-New Products

Version: 3.0 (Production-track — supersedes v1.0 and v2.0)
Market: Bangladesh only (architecture allows future expansion)
Currency: BDT (৳), stored as integer Poisha
Audience: Frontend/backend/DB engineers, UI/UX design, QA, product, operations

1. Executive Summary

Resale.com is a C2C marketplace connecting individual sellers (with a path to verified, professional, business, and creator sellers later) with buyers, for pre-owned, open-box, and like-new electronics in Bangladesh. The platform's core bet is that structured, verifiable trust data — objective condition grading, seller reputation, warranty/invoice status, and fraud controls — outperforms unstructured classifieds (Bikroy, Facebook Marketplace) on buyer confidence, and that this justifies a take rate other platforms can't charge.

MVP goal: prove sellers will list, buyers will trust and buy, COD can be operated sustainably, and disputes/fraud stay controlled — before investing in AI pricing, escrow, or professional-seller tooling.

Mandatory account policy: Per business direction, every account (buyer or seller) requires an NID (National ID) number at registration — this is treated as a firm requirement, not a proposed rule, and is implemented accordingly throughout this document, with the trade-offs documented in §50.

2. Product Vision

"Bangladesh's trusted marketplace for quality-checked pre-owned, open-box, and like-new products."

Resale.com should feel like a professional e-commerce marketplace, not a classifieds board: consistent structured listings, verified sellers, transparent condition scoring, and a checkout experience buyers already trust from e-commerce (Daraz-like), rather than a DM-to-negotiate Facebook Marketplace experience.

3. Business Model

Seller → Resale.com → Buyer

Launch model: C2C marketplace. Architecture must not hard-code this — it must support, without a rebuild:

Future seller type

MVP support

Individual

✅ Full

Verified Individual

✅ Full

Professional Seller

Schema-ready, not marketed in MVP

Business/Brand seller

Schema-ready, not marketed in MVP

Creator/influencer seller

Schema-ready (video URL field), not a distinct account type in MVP

Resale.com-owned inventory

Schema-ready (a "system seller" account), not used in MVP

Refurbished inventory

Category/condition-grade ready, not operated in MVP

Revenue streams:

Seller listing credits (Phase 1) — primary MVP revenue.

Transaction commission (Phase 2, 3–5%, take-rate) — once GMV justifies it.

Future: seller subscriptions (Professional/Business tiers), promoted listings, coupons/promotions funded by Resale.com or sellers.

4. Target Users

Sellers: individuals reselling recently purchased/owned electronics; tech enthusiasts; content creators/YouTubers reselling review units (with linked video); eventually professional/business resellers.

Buyers: value-seeking buyers wanting premium electronics below retail; buyers who've been burned by Facebook Marketplace/Bikroy and want structured trust data before paying.

5. User Personas

Persona

Type

Motivation

Key needs

Rafiq, 27, Dhaka

Individual seller

Upgraded phone, wants fast cash

Simple listing wizard, fast payout, low fees

Nusrat, tech YouTuber

Creator seller

Resells review units, wants credibility

Video-linked listing, "Verified Creator" badge

Tanvir, 24, buyer

Trust-seeking buyer

Wants a cheap laptop, scared of scams

Condition transparency, seller reputation, warranty/invoice visibility

Farhana, 35, buyer

Bargain buyer

Wants best price, less concerned with brand story

Filters, sort by price/discount, COD

Admin/Ops team

Internal

Keep fraud/disputes controlled, GMV growing

Moderation queue, fraud scoring, dispute tools, dashboards

6. Marketplace Model

Critical architectural rule: Product ≠ Listing.

PRODUCT: iPhone 15 Pro 256GB
   ├── LISTING (Seller A): ৳95,000 · Like New · Warranty 4mo
   ├── LISTING (Seller B): ৳88,000 · Excellent · No warranty
   └── LISTING (Seller C): ৳82,000 · Good · No warranty

Product = canonical catalog entry (brand, model, specs) — admin/catalog-managed, potentially crowd-suggested but admin-approved to avoid duplicate/fragmented products.

Listing = one seller's specific unit of that product, with its own price, condition, images, and status.

A product page aggregates all active listings for that product (like Daraz/Amazon's "multiple sellers" pattern) so buyers can compare.

Sellers search/select an existing Product during listing creation (§12 wizard step 3) rather than freely typing a new product each time; "suggest a new product" is an escape hatch that goes to admin catalog review if no match exists.

7. User Journeys

7.1 Buyer journey

Browse → Search/Filter → Product Page (all listings)
   → Select Listing → Listing Detail (condition, seller, warranty)
   → Add to Cart / Buy Now → Checkout (address + payment method)
   → COD or Digital Payment → Order Placed → Seller Confirms
   → Courier Pickup → Shipped → Delivered → Payment Settled
   → Review (product + seller) [48h window]

7.2 Seller journey

Register (phone OTP + NID number, mandatory) → Seller Profile Setup
   → Create Listing (13-step wizard) → Submit for Moderation
   → Approved → Listing Live → Order Received → Confirm Order
   → Hand off to Courier → Delivered → Return/Dispute Window Closes
   → Payout Eligible → Payout Processed → Review Received

7.3 Dispute journey

Buyer reports issue (within 48h of delivery) → Uploads evidence
   → Seller notified → Seller responds (48h SLA)
   → Admin reviews (listing snapshot + evidence + order history)
   → Decision: Full refund / Partial refund / Return / Replacement / Reject
   → Seller penalty applied if at fault → Case closed, logged

8. Feature Requirements (Summary Matrix)

Feature area

MVP

Phase 1.5

Phase 2

Buyer browse/search/filter

✅

—

NLP search

Seller accounts + NID-gated registration

✅

—

—

Listing wizard + condition grading

✅

—

AI-assisted grading

Listing moderation

✅ (manual)

Semi-auto rules

ML-assisted

Cart & checkout

✅

—

1-click repeat buy

COD

✅

Risk scoring v2

Auto courier settlement

Digital payments (bKash/Nagad/Rocket/card)

✅ basic

Full webhook reconciliation

Escrow

Orders (state machine)

✅

—

—

Returns & disputes

✅ basic

SLA automation

—

Reviews & reputation

✅

—

—

Fraud/risk scoring

✅ basic rules

Behavioral scoring

ML fraud model

Seller credits

✅

Bulk packages

Promotions engine

Seller payouts

✅ ledger, manual disbursement

Automated disbursement

Instant payout

Admin dashboard

✅

Advanced charts

Predictive alerts

Pricing engine

Rule-based (optional at MVP)

Refined rules

AI/market-data pricing

Commission

—

—

✅ 3–5%

9. Seller System

9.1 Registration (mandatory fields)

Phone number (Bangladesh format, +8801XXXXXXXXX) — OTP verified, blocking

NID number — required, blocking (see §33/§39/§50 for handling)

Name, email (optional but recommended), password

Location (Division → District, minimum)

PROPOSED BUSINESS RULE: NID number is required at account creation for every user (buyer and seller) per business direction. NID document image upload + admin cross-check is a separate, optional step that upgrades status from identity_pending to identity_verified. Rationale: collecting the number alone is much lower-friction than requiring document upload/OCR at signup, while still (a) satisfying the "must give NID number" requirement, (b) creating a strong duplicate-account/fraud deterrent since NID numbers are checked for uniqueness across accounts, and (c) leaving room for full identity verification later without blocking every signup on manual document review from day one.

9.2 Seller types

individual | verified_individual | professional | business — MVP actively supports individual and verified_individual only; other enum values exist in schema but are not exposed in seller-facing UI at launch.

9.3 Seller profile (public)

Name, photo, join date, location (district-level, not exact address), verification badge, rating, # successful sales, completed-order %, cancellation rate, return rate, dispute rate, response rate, active listings count, reviews.

Example card:

Verified Seller ✓
4.8 ★ · 32 successful sales
98% order completion · 2% cancellation
Member since Jan 2026 · Dhaka

9.4 Verification status enum

unverified → phone_verified → identity_pending → identity_verified (plus rejected, suspended)

phone_verified: default post-signup state (NID number captured but not yet document-checked).

identity_pending: seller has uploaded NID front/back images for review.

identity_verified: admin-approved → unlocks "Verified" badge + (future) higher COD limits.

Sensitive identity data (NID number, document images) is never exposed publicly — only the resulting badge state is shown.

10. Buyer System

Buyer accounts exist (profile, addresses, orders, wishlist, reviews, returns, disputes, notifications, saved searches) — see §37 origin spec.

PROPOSED BUSINESS RULE: Full buyer accounts are supported end-to-end in the schema/API from day one, but the MVP UX defaults to lightweight signup at checkout (name, phone, address, NID number) rather than a separate upfront registration wall, to protect browse-to-purchase conversion. Buyers can optionally complete a fuller profile after their first order. NID number is still captured (per business requirement) at the point an order is placed, since that is the first point real money/identity risk is created — see §50 for the alternative if this trade-off proves too costly to conversion.

Buyer capabilities: browse, search, filter, sort, compare listings, save/wishlist, cart, buy now, choose address, choose payment method, place order, track order, request return, report issue, review seller & product.

11. Product Catalog

Categories (launch set): Smartphones, Laptops, Tablets, Headphones, Earbuds, Smartwatches, Cameras, Gaming Consoles, Computer Accessories, Mobile Accessories, Monitors, TVs, Speakers, Other Electronics.

Category system requirements:

Parent/child hierarchy (e.g., Headphones → Over-Ear / In-Ear).

Category-specific attributes and condition-inspection checklists (a phone's checklist ≠ a monitor's).

Category-specific specification schema (JSON-schema-driven so new categories/attributes don't require code changes).

SEO metadata per category, images, manual/auto sort order, filter configuration.

Product (catalog entry): brand, model, canonical spec sheet, images (stock/reference), slug — admin-curated to prevent duplicate/fragmented product entries. Sellers pick from existing products; new-product suggestions route to an admin approval queue before becoming selectable.

12. Listing System — Seller Wizard (13 steps)

What are you selling? (free-text search against Product catalog)

Select category (auto-suggested from product, editable)

Select/confirm product, brand, model (or "suggest new product")

Enter product specifications (pre-filled from Product catalog where available; editable for variant-specific specs like RAM/storage)

Select overall condition grade (A+/A/B/C/D — §13)

Enter detailed condition information (component-level checklist — §13)

Enter purchase/warranty information (purchase date, warranty status, invoice availability)

Enter accessories included

Upload photos (minimum 4, recommend 6+; video URL optional)

Set price (original/MRP reference + resale price; optional pricing-engine suggestion shown — §14)

Select delivery/pickup options + seller location

Preview listing (exactly as buyers will see it)

Submit for moderation (status = pending_review)

Listing status enum: draft → pending_review → approved → (live) → sold | expired | removed, with rejected and suspended as moderation outcomes.

13. Condition & QC (Objective Grading)

Grades: A+ (Like New) · A (Excellent) · B (Good) · C (Fair) · D (Heavy Wear/Limited) — never a bare subjective label; every grade must be backed by structured component data so buyers see why, not just the letter.

13.1 Universal inspection fields (all electronics)

Screen, body/frame, back panel, camera, speaker, microphone, buttons, ports, charging, battery, connectivity (Wi-Fi/Bluetooth/Cellular), water damage, repairs, replaced parts.

13.2 Category-specific additions

Smartphones: battery health %, IMEI, activation lock status, network lock status, screen/battery/camera replacement history, other repairs.

Laptops: keyboard, trackpad, display, storage, RAM, benchmark/performance note.

Cameras: shutter count where available, lens condition.

13.3 Buyer-facing condition transparency block (required on every PDP)

Overall Condition:  A — Excellent
Physical:           Minor signs of use
Screen:              No visible scratches
Battery:             92%
Repairs:             None
Accessories:         Charger included
Invoice:             Available
Warranty:            3 months remaining

13.4 Sensitive fields

IMEI/serial number are collected but never publicly displayed — visible only to the buyer post-purchase (for warranty claims) and to admin (for authenticity/fraud checks, blacklist screening).

14. Pricing Engine (rule-based at MVP)

Inputs: original price, product age (from purchase date), condition grade, warranty status, battery health (if applicable), accessories completeness, repairs, seller location/market.

Output: recommended min/avg/max resale price range + a short explanation string, shown to the seller during wizard step 10 as a non-blocking suggestion (seller can override).

Original price:        ৳145,000
Current market price:  ৳128,000  (rule: category depreciation curve)
Condition:              A
Battery:                94%
Warranty:                4 months remaining

Recommended range:  ৳118,000 – ৳124,000

MVP implementation: simple depreciation-curve + condition-multiplier rules per category, hand-tuned by ops. Phase 2: incorporate historical Resale.com sales data, live demand signals, seller reputation, location, seasonality; Phase 3 (post-MVP, optional): ML/AI pricing model. Do not build AI pricing before the rule-based version is validated against real sales data.

15. Search & Discovery

Search targets: product name, brand, model, category, specifications, seller name, listing title.

Filters: category, brand, price range, condition grade, location (division/district), warranty presence, invoice availability, verified-seller-only, delivery availability, pickup availability, battery health (where applicable).

Sort: relevance, newest, price ↑/↓, most viewed, most saved, best-selling, best condition.

MVP implementation: PostgreSQL full-text search + filtered/indexed queries. Post-MVP: Meilisearch/Elasticsearch for scale and typo-tolerance; natural-language query parsing (e.g., "iPhone under ৳80,000 with warranty and good condition" → structured filters) is a Phase 2+ feature, not MVP.

16. Location

Bangladesh administrative hierarchy: Division → District → Upazila/Thana → Area/Postal code.

Listings store seller location (district-level display; precise address private, used only for courier).

Buyers can filter/search "near [district/division]" (Phase 1.5+; MVP can launch division-level only if needed to simplify).

Delivery availability is modeled per-listing (some sellers may restrict to their division for pickup-heavy items like large monitors/TVs).

17. Cart & Checkout

Cart supports guest session (cookie/local cart) that merges into account cart if buyer registers mid-flow.

Checkout collects: buyer name, phone (OTP-verified), NID number (business requirement — see §50 discussion), delivery address (Division/District/Area/postal code), payment method.

Multi-seller cart: if a buyer buys from 2 different sellers in one cart, this creates 2 separate orders (each seller confirms/ships independently) even though checkout is a single UI flow — critical for the order/courier/payout model to work per-seller.

Price/availability re-validated at checkout (PRICE_CHANGED, LISTING_NOT_APPROVED errors possible if seller edited/removed the listing mid-cart).

18. Payments

Bangladesh payment abstraction — never couple business logic to one provider:

PaymentService
   ├── CashOnDeliveryProvider   (MVP primary)
   ├── BkashProvider            (MVP, basic)
   ├── NagadProvider            (MVP, basic)
   ├── RocketProvider           (Phase 1.5)
   └── CardProvider             (Phase 1.5, via local PSP e.g. SSLCommerz)

All non-COD providers integrate via webhook confirmation — never trust a frontend "payment success" callback as source of truth; order only advances to PAID once the backend receives and signature-verifies the provider webhook.

Seller listing-credit purchases always use a digital provider (bKash/Nagad/card) since there's no physical delivery to attach COD to.

Idempotency keys required on all payment-initiating requests (see §30 origin spec / §42).

19. COD System

COD is the MVP's primary and highest-risk payment path.

Order placed → Buyer verification (OTP) → Seller confirmation
   → Courier pickup → Shipment → Delivery attempt
   → Buyer receives & pays → Payment collected → Seller payout

Failure modes to handle explicitly: buyer refuses order at door, seller fails to ship, courier fails delivery, incorrect address, buyer unreachable, fake/prank orders, repeated COD abuse by one buyer identity, high-value COD orders, buyer cancels after seller already confirmed.

19.1 COD risk score

Composite score (0–100) combining signals: new buyer account, high order value, prior refused/failed COD orders on this buyer's phone/NID, mismatched delivery address patterns, velocity (many orders in short window).

New buyer + High-value order + Multiple prior failed deliveries = HIGH risk

Controls by risk tier:

Risk tier

Control

LOW

Standard flow

MEDIUM

SMS/OTP re-confirmation before courier pickup

HIGH

Manual ops call-to-confirm before pickup; possible COD value cap

CRITICAL

Require partial deposit or block COD, offer digital payment only

PROPOSED BUSINESS RULE: COD is capped at a configurable maximum order value (recommend starting at ৳50,000) for phone_verified-only buyers; higher-value COD orders require identity_verified buyer status. Admin-configurable, not hard-coded.

20. Orders

Order state machine (strict — no arbitrary transitions, every change logged to audit_logs):

PENDING_PAYMENT → PAID → CONFIRMED → PROCESSING → PACKED
   → SHIPPED → OUT_FOR_DELIVERY → DELIVERED → COMPLETED

PENDING_PAYMENT → CANCELLED
PAID → CANCELLED
CONFIRMED → CANCELLED
DELIVERED → RETURN_REQUESTED → ... (see §21)

For COD orders, PAID is effectively skipped/renamed conceptually to CONFIRMED at seller-confirmation (cash is collected at DELIVERED) — implement as: COD orders go PENDING_PAYMENT → CONFIRMED → PROCESSING → PACKED → SHIPPED → OUT_FOR_DELIVERY → DELIVERED → COMPLETED, with payment_status tracked as a separate field (unpaid → collected → settled) from order status, since "delivered" and "cash actually collected" are not always the same instant in courier operations.

21. Returns

Return reasons: wrong product, not as described, damaged, defective, missing accessory, counterfeit/suspicious, other.

Requested → Under Review → Approved → Pickup → Received
   → Inspection → Approved for Refund → Refunded → Closed
                              ↘ Rejected → Closed

PROPOSED BUSINESS RULE: Return window = 48 hours from delivery for condition-mismatch claims (matches dispute SLA in §22); defective/DOA electronics get a longer window (recommend 7 days) since some defects only surface after initial use.

22. Disputes

Issue reported (within 48h of delivery) → Evidence uploaded (photos/video)
   → Seller notified → Seller responds (48h SLA)
   → Admin reviews (order snapshot + evidence + history)
   → Decision → Full refund | Partial refund | Return | Replacement | Seller warning/penalty | Buyer claim rejected

Evidence types: photos, video, order details, listing snapshot at time of purchase (critical — see §44), messages, QC records.

If seller doesn't respond within SLA, case auto-escalates to admin with seller flagged as non-responsive (impacts response-rate reputation metric, §24).

23. Reviews & Reputation

Three separate review types — do not conflate:

Type

Question

Visible on

Product review

"How was the product?"

Product page

Seller review

"How was the seller?"

Seller profile

Transaction review

"How was the overall experience?"

Internal/analytics, optionally shown as part of seller review

Only verified purchases generate verified reviews — no review without a completed order tied to the reviewer's account. This is a hard constraint to prevent rating manipulation.

Seller reputation score aggregates: average rating, successful sales, completed-order %, cancellation rate, return rate, dispute rate, response rate, account age, verification level — computed server-side on a schedule/trigger, never client-editable.

24. Fraud & Risk

Signals feeding a 0–100 risk score per listing/order/account:
new seller, new buyer, extremely low price relative to product/market, high-value device, no invoice, no warranty, repeated account creation (same device/IP), multiple phone numbers tied to one NID, duplicate images across listings (reverse-image hash match), suspicious device/IMEI patterns, multiple failed COD orders, high cancellation rate, high return rate, multiple disputes, suspicious IP/device behavior.

Risk levels: LOW | MEDIUM | HIGH | CRITICAL — HIGH/CRITICAL listings require manual moderation before going live, regardless of seller's existing verification tier.

NID as a fraud control: because NID number is mandatory and checked for uniqueness across accounts (§9.1), this directly mitigates "repeated account creation" fraud — one legitimate NID can't back unlimited fresh accounts after a suspension, which is a meaningful anti-abuse benefit worth weighing against the signup-friction cost noted in §50.

25. Moderation

Listing status enum (moderation lifecycle): draft | pending_review | approved | rejected | suspended | sold | expired | removed

Structured rejection reasons: suspected counterfeit, incorrect category, misleading condition, invalid image, suspicious price, missing information, prohibited item, duplicate listing.

Admin capabilities: review/approve/reject/request-changes on listings; suspend seller/buyer; review reports, disputes, fraud alerts, suspicious pricing, identity verification submissions, product authenticity flags; manage categories/products/sellers/orders/returns. Every admin action writes an audit log entry (actor, action, target, timestamp, reason).

26. Notifications

Channels: SMS (primary for Bangladesh), Email, WhatsApp (where number is available), Push (once a mobile app/PWA exists).

Trigger events: OTP, account created, listing approved/rejected, order placed, seller order notification, seller confirmed, shipment created, out for delivery, delivered, return requested/approved, refund initiated/completed, dispute opened/resolved, seller payout processed.

Each event maps to a templated, localizable (English + Bangla) message.

27. Seller Credits

Ledger model — never mutate a balance directly; every change is a transaction row.

Free credits: 5 on signup.

Purchased credits: ৳500 = 10 credits (৳50/credit), paid via bKash/Nagad/card.

Promotional credits: admin-grantable (support cases, campaigns).

1 credit consumed at publish (moving draft/pending_review → live, not at draft save).

Credits table types: free | purchased | promotional | consumed | expired | refunded.

28. Seller Payouts

Order delivered → Return/dispute window closes (48h+)
   → Payout eligible → Payout processed → Seller balance updated

MVP note: because MVP payment is COD-dominant, cash is often collected by the courier and remitted to the seller outside the platform in the simplest version — but the schema/ledger (seller_payouts, transaction history) must track this from day one so Phase 2 (commission deduction) doesn't require a redesign. Recommended MVP default: Resale.com does not intermediate COD cash flow initially (seller keeps 100%, platform earns only via listing credits — matches §51/§18 note in prior draft); the payout ledger exists in schema now specifically so Phase 2's commission-deduction flow has infrastructure to plug into.

Payout status enum: pending | available | processing | paid | failed | reversed.

29. Admin Dashboard

Top-line metrics: GMV, orders, revenue (credits + commission), successful deliveries, cancellation rate, COD refusal rate, return rate, dispute rate, active sellers, active buyers, new listings, pending moderation count, fraud alerts, pending payouts, pending disputes.

Charts: daily orders, daily GMV, new sellers, new buyers, listing growth, category performance, COD success rate trend, return rate trend.

30. Analytics

Tracked events: product viewed, listing viewed, search performed, filter applied, listing saved, add to cart, checkout started, order placed/cancelled/delivered, return requested, dispute opened, review submitted, seller listing created.

Core KPIs: GMV, take rate, orders, conversion rate, listing-to-order conversion, COD success rate, COD refusal rate, return rate, dispute rate, seller activation rate, seller retention, buyer retention, AOV, average selling price, time-to-sale.

31. SEO

Product pages, category pages, brand pages, and (where appropriate) seller pages need: SEO title, meta description, canonical URL, Open Graph tags, Product/BreadcrumbList structured data (schema.org), sitemap, robots.txt. Do not index the combinatorial explosion of filter-parameter URLs (e.g., ?condition=A&price=1-2&sort=newest) — canonicalize filtered views back to the base category URL for crawlers.

32. Security

JWT access tokens + refresh-token rotation; bcrypt/argon2 password hashing; OTP rate limiting; API rate limiting; RBAC (buyer/seller/admin/support roles); input validation on every endpoint; SQL injection & XSS protection (parameterized queries, output encoding); CSRF protection on cookie-based flows; secure/HttpOnly cookies where used; webhook signature verification (bKash/Nagad/card payment webhooks); file-upload validation (type/size/malware scan for verification docs and listing images); audit logging; encryption of sensitive data at rest (NID numbers, verification documents); strict PII access controls (role-gated, logged access to NID data).

Never store: raw passwords, raw card numbers, publicly-accessible verification documents.

33. Privacy

Sensitive data classes: phone, email, address, NID number, NID document images, payment information, IP, device information.

For each class, define (finalize with legal counsel before launch, per Bangladesh data-protection expectations):

Who can access it: NID number/documents — admin verification role only, plus the owning user; never exposed to other buyers/sellers or in any public API response.

Retention: retain NID data for the life of the account + regulatory minimum after closure (confirm exact period with legal); document images stored in a private bucket, never CDN-public.

Encryption: NID number encrypted at rest (application-level encryption or pgcrypto), documents stored in access-controlled object storage with signed, short-lived URLs only.

Deletion: account-deletion requests purge/anonymize PII per policy, subject to legal retention holds (e.g., open disputes, fraud investigations).

Buyer/seller visibility: users can see and correct their own NID number/status; they cannot see anyone else's.

34. Non-Functional Requirements

Currency: BDT displayed; integer Poisha stored (§27 origin spec, §36).

Localization: English at launch; Bangla strongly recommended for buyer-facing surfaces given target market breadth.

Mobile-first: majority of Bangladesh traffic is mobile; optimize for lower-bandwidth conditions.

Phone-centric identity: phone number (OTP), not email, is the primary identity anchor for both buyers and sellers.

Performance targets: API p95 < 500ms for normal reads; listing page < 1s; search < 500ms where feasible; CDN-optimized images.

Availability: target ≥99.5% uptime for checkout/order-critical paths at MVP scale.

35. Database Architecture

PostgreSQL, UUID primary keys throughout.

Money: integer Poisha (1 BDT = 100 Poisha) — never floating point. API layer converts to/from display strings ("৳25,000").

Enums: native Postgres ENUM types for fixed-vocabulary fields (order status, listing status, verification status, etc.) rather than free-text, to keep state machines enforceable at the DB layer too.

Soft delete: use deleted_at TIMESTAMPTZ NULL on user-generated content tables (listings, reviews, reports) rather than hard delete, to preserve order/dispute history integrity; hard delete only for GDPR-style erasure requests after legal retention holds clear.

Audit: every admin mutation and every state-machine transition writes to audit_logs (actor_id, actor_role, action, entity_type, entity_id, before/after snapshot, created_at).

Sensitive data segregation: NID number/documents live in a dedicated user_identity_documents table (not inline on users), with stricter access control than the rest of the schema, so most services never need to touch it.

36. Complete Database Schema

Full DDL for core tables below; secondary/support tables listed with key columns in the summary table that follows. All tables include id UUID PRIMARY KEY DEFAULT gen_random_uuid(), created_at, updated_at unless noted.

-- ========== USERS & IDENTITY ==========

CREATE TYPE verification_status AS ENUM (
  'unverified','phone_verified','identity_pending','identity_verified','rejected','suspended'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(15) UNIQUE NOT NULL,          -- +8801XXXXXXXXX
  phone_verified_at TIMESTAMPTZ,
  email VARCHAR(255) UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  profile_photo_url TEXT,
  division VARCHAR(50),
  district VARCHAR(50),
  role_flags JSONB NOT NULL DEFAULT '{"buyer": true, "seller": false}',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  is_suspended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- NID stored separately from `users` for stricter access control (§33, §35)
CREATE TABLE user_identity_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nid_number_encrypted TEXT NOT NULL,          -- app-level or pgcrypto encrypted
  nid_number_hash TEXT UNIQUE NOT NULL,        -- deterministic hash for uniqueness checks w/o decrypting
  nid_front_image_url TEXT,
  nid_back_image_url TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMPTZ,
  status verification_status NOT NULL DEFAULT 'phone_verified',
  rejection_reason TEXT
);
CREATE UNIQUE INDEX idx_identity_nid_hash ON user_identity_documents(nid_number_hash);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_info JSONB,
  ip_address INET,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(50),                            -- "Home", "Office"
  recipient_name VARCHAR(120) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  division VARCHAR(50) NOT NULL,
  district VARCHAR(50) NOT NULL,
  area VARCHAR(120),
  thana_upazila VARCHAR(80),
  postal_code VARCHAR(10),
  address_line TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE seller_type AS ENUM ('individual','verified_individual','professional','business');

CREATE TABLE seller_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_type seller_type NOT NULL DEFAULT 'individual',
  bio TEXT,
  social_links JSONB,                           -- e.g., YouTube channel for creators
  rating_avg NUMERIC(2,1) DEFAULT 0,
  successful_sales_count INT NOT NULL DEFAULT 0,
  completed_order_pct NUMERIC(5,2) DEFAULT 0,
  cancellation_rate NUMERIC(5,2) DEFAULT 0,
  return_rate NUMERIC(5,2) DEFAULT 0,
  dispute_rate NUMERIC(5,2) DEFAULT 0,
  response_rate NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== CATALOG ==========

CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  logo_url TEXT
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  attribute_schema JSONB,                        -- category-specific spec/condition fields
  seo_title VARCHAR(160),
  seo_description VARCHAR(320),
  sort_order INT DEFAULT 0,
  image_url TEXT
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES brands(id),
  category_id UUID NOT NULL REFERENCES categories(id),
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) UNIQUE NOT NULL,
  base_specifications JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'approved',  -- pending_review | approved | rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(120),                       -- e.g., "256GB / Titanium"
  specifications JSONB
);

CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ========== LISTINGS ==========

CREATE TYPE condition_grade AS ENUM ('A_PLUS','A','B','C','D');
CREATE TYPE listing_status AS ENUM (
  'draft','pending_review','approved','rejected','suspended','sold','expired','removed'
);

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  product_id UUID NOT NULL REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  title VARCHAR(200) NOT NULL,
  original_price_poisha BIGINT NOT NULL,
  resale_price_poisha BIGINT NOT NULL,
  condition_grade condition_grade NOT NULL,
  condition_score SMALLINT,                        -- 0-100 computed from checklist
  purchase_date DATE,
  warranty_status VARCHAR(120),
  invoice_available BOOLEAN NOT NULL DEFAULT false,
  accessories JSONB,
  battery_health SMALLINT,
  known_defects TEXT,
  serial_number_encrypted TEXT,
  imei_encrypted TEXT,
  seller_division VARCHAR(50),
  seller_district VARCHAR(50),
  pickup_available BOOLEAN DEFAULT false,
  delivery_available BOOLEAN DEFAULT true,
  negotiable BOOLEAN DEFAULT false,
  status listing_status NOT NULL DEFAULT 'draft',
  moderation_reason TEXT,
  credit_consumed BOOLEAN NOT NULL DEFAULT false,
  views_count INT NOT NULL DEFAULT 0,
  saves_count INT NOT NULL DEFAULT 0,
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_listings_product ON listings(product_id) WHERE status = 'approved';
CREATE INDEX idx_listings_seller ON listings(seller_id);

CREATE TABLE listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE listing_condition_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  component VARCHAR(60) NOT NULL,                  -- 'screen','battery','ports',...
  status VARCHAR(120) NOT NULL,                     -- free text or enum per category schema
  notes TEXT
);

-- ========== INVENTORY / RESERVATION (unit-level) ==========

CREATE TYPE inventory_status AS ENUM ('available','reserved','sold');

CREATE TABLE inventory_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID UNIQUE NOT NULL REFERENCES listings(id),
  status inventory_status NOT NULL DEFAULT 'available',
  reserved_until TIMESTAMPTZ
);

-- ========== CART / CHECKOUT ==========

CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),                -- nullable for guest carts
  session_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id),
  price_snapshot_poisha BIGINT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== ORDERS ==========

CREATE TYPE order_status AS ENUM (
  'pending_payment','confirmed','processing','packed','shipped',
  'out_for_delivery','delivered','completed','cancelled',
  'return_requested','returned'
);
CREATE TYPE payment_status AS ENUM ('unpaid','paid','collected','settled','refunded','failed');

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(20) UNIQUE NOT NULL,
  buyer_id UUID REFERENCES users(id),                -- nullable if buyer never created an account
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  listing_id UUID NOT NULL REFERENCES listings(id),
  -- snapshot fields (§44) — never join back to live listing for historical accuracy
  listing_title_snapshot VARCHAR(200) NOT NULL,
  price_snapshot_poisha BIGINT NOT NULL,
  condition_snapshot condition_grade NOT NULL,
  warranty_snapshot VARCHAR(120),
  image_snapshot_url TEXT,
  buyer_name VARCHAR(120) NOT NULL,
  buyer_phone VARCHAR(15) NOT NULL,
  buyer_nid_hash TEXT,                                -- reference only, not raw NID
  shipping_address_id UUID REFERENCES addresses(id),
  status order_status NOT NULL DEFAULT 'pending_payment',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  payment_method VARCHAR(20) NOT NULL,                 -- cod | bkash | nagad | rocket | card
  cod_amount_poisha BIGINT,
  commission_poisha BIGINT DEFAULT 0,                  -- Phase 2
  courier_partner VARCHAR(40),
  courier_tracking_id VARCHAR(80),
  risk_score SMALLINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX idx_orders_seller ON orders(seller_id);
CREATE INDEX idx_orders_buyer ON orders(buyer_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_status order_status,
  to_status order_status NOT NULL,
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== PAYMENTS ==========

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id),
  purpose VARCHAR(30) NOT NULL,                       -- 'order' | 'listing_credit'
  provider VARCHAR(20) NOT NULL,                       -- cod | bkash | nagad | rocket | card
  amount_poisha BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'initiated',     -- initiated | success | failed | refunded
  idempotency_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  provider_transaction_id VARCHAR(120),
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(20) NOT NULL,
  payload JSONB NOT NULL,
  signature_valid BOOLEAN NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  amount_poisha BIGINT NOT NULL,
  reason TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== SHIPPING ==========

CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID UNIQUE NOT NULL REFERENCES orders(id),
  courier_partner VARCHAR(40) NOT NULL,
  tracking_id VARCHAR(80),
  picked_up_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);

CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  event VARCHAR(60) NOT NULL,
  raw_payload JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== RETURNS & DISPUTES ==========

CREATE TABLE returns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  reason VARCHAR(60) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'requested',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id)
);

CREATE TABLE return_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  return_id UUID NOT NULL REFERENCES returns(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id)
);

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  raised_by UUID NOT NULL REFERENCES users(id),
  reason TEXT NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'open',           -- open | investigating | resolved
  resolution VARCHAR(30),                                 -- refund | partial_refund | return | replacement | rejected
  resolution_notes TEXT,
  deadline_at TIMESTAMPTZ NOT NULL,                       -- delivery + 48h
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id UUID NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES users(id)
);

-- ========== REVIEWS ==========

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),          -- enforces "verified purchase only"
  product_id UUID REFERENCES products(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE seller_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== WISHLIST / COUPONS ==========

CREATE TABLE wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id)
);
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  listing_id UUID NOT NULL REFERENCES listings(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(30) UNIQUE NOT NULL,
  discount_type VARCHAR(10) NOT NULL,                    -- percent | flat
  discount_value INT NOT NULL,
  valid_from TIMESTAMPTZ, valid_to TIMESTAMPTZ,
  usage_limit INT, per_user_limit INT DEFAULT 1
);
CREATE TABLE coupon_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id),
  user_id UUID NOT NULL REFERENCES users(id),
  order_id UUID REFERENCES orders(id),
  used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== CREDITS & PAYOUTS ==========

CREATE TYPE credit_txn_type AS ENUM ('free','purchased','promotional','consumed','expired','refunded');

CREATE TABLE seller_credits (
  seller_id UUID PRIMARY KEY REFERENCES seller_profiles(id),
  balance INT NOT NULL DEFAULT 0
);

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  type credit_txn_type NOT NULL,
  amount INT NOT NULL,                                    -- positive=credit, negative=debit
  reference_id UUID,                                       -- payment_id or listing_id
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE payout_status AS ENUM ('pending','available','processing','paid','failed','reversed');

CREATE TABLE seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES seller_profiles(id),
  order_id UUID REFERENCES orders(id),
  amount_poisha BIGINT NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  payout_method VARCHAR(20),                               -- bkash | nagad | bank
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========== FRAUD / MODERATION / SUPPORT ==========

CREATE TABLE fraud_risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL,                        -- 'user' | 'listing' | 'order'
  entity_id UUID NOT NULL,
  score SMALLINT NOT NULL,
  level VARCHAR(10) NOT NULL,                               -- LOW|MEDIUM|HIGH|CRITICAL
  signals JSONB,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(20) NOT NULL,                         -- seller|listing|product|review|message
  entity_id UUID NOT NULL,
  reported_by UUID NOT NULL REFERENCES users(id),
  reason VARCHAR(60) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open',                -- open|under_review|resolved|dismissed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  channel VARCHAR(10) NOT NULL,                              -- sms|email|whatsapp|push
  event VARCHAR(60) NOT NULL,
  payload JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'queued',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES users(id),
  actor_role VARCHAR(20),
  action VARCHAR(60) NOT NULL,
  entity_type VARCHAR(40) NOT NULL,
  entity_id UUID,
  before_state JSONB,
  after_state JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

36.1 Secondary tables (summary)

Table

Key columns

warehouses

id, name, division, district, address (only relevant if/when Resale.com-owned inventory is activated)

inventory_reservations

id, inventory_unit_id, cart_id, expires_at

product_specifications

product_id, key, value (for flexible spec key/value pairs beyond JSONB base_specifications)

37. ERD (textual)

users 1───1 seller_profiles
users 1───1 user_identity_documents
users 1───* addresses
users 1───* user_sessions
users 1───1 wishlists ──* wishlist_items ──* listings

brands 1───* products
categories 1───* products
categories 1───* categories (self, parent/child)
products 1───* product_variants
products 1───* product_images

seller_profiles 1───* listings
products 1───* listings
listings 1───* listing_images
listings 1───* listing_condition_details
listings 1───1 inventory_units

carts 1───* cart_items ──* listings

orders *───1 seller_profiles
orders *───1 listings (source, plus denormalized snapshot fields)
orders *───0..1 users (buyer, nullable for guest)
orders 1───* order_status_history
orders 1───* payments ──* payment_transactions
orders 1───0..1 shipments ──* shipment_events
orders 1───0..* returns ──* return_evidence
orders 1───0..* disputes ──* dispute_evidence
orders 1───0..* reviews
orders 1───0..* seller_reviews
orders 1───0..* seller_payouts

seller_profiles 1───1 seller_credits ──* credit_transactions

38. API Architecture

Base path: /api/v1

Auth: Authorization: Bearer <JWT>; refresh via rotating refresh tokens (httpOnly cookie or secure storage on mobile).

Roles: buyer | seller | admin | support (a user can hold both buyer and seller roles simultaneously — see role_flags on users).

All monetary values in responses: { "amountPoisha": 2500000, "currency": "BDT", "displayAmount": "৳25,000" }.

Idempotency-Key header required on: checkout, payment initiation, refund, order creation, return creation, seller payout trigger.

Pagination: cursor-based (?cursor=...&limit=...) for feed-like endpoints (listings, orders, notifications).

39. Complete API Specification

Representative full detail given for the highest-complexity endpoints; remaining endpoints given as structured summary tables (method, path, auth, role, purpose, key request/response fields) — sufficient for implementation without ambiguity given the shared conventions above.

39.1 Auth

POST /auth/register
Auth: none | Role: none
Body: {
  phone: string (required, +8801XXXXXXXXX),
  password: string (required, min 8 chars),
  name: string (required),
  nidNumber: string (required, 10 or 13 or 17 digits — see §50),
  email?: string,
  division?: string, district?: string
}
Validation:
  - phone must be unique & valid BD format → else 409 PHONE_ALREADY_REGISTERED
  - nidNumber required, format-validated, checked via nid_number_hash uniqueness
    → duplicate NID on a different account → 409 NID_ALREADY_REGISTERED
Success 201: { success:true, data:{ userId, verificationStatus:"unverified" } }
Errors: 400 VALIDATION_ERROR, 409 PHONE_ALREADY_REGISTERED, 409 NID_ALREADY_REGISTERED
Rate limit: 5/hour/IP
Idempotency: not required (natural uniqueness on phone/NID)

POST /auth/otp/send        Body: { phone }                 → sends OTP, rate-limited 3/10min
POST /auth/otp/verify      Body: { phone, otp }             → sets phone_verified_at, status→phone_verified
POST /auth/login           Body: { phone, password }        → { accessToken, refreshToken }
POST /auth/refresh         Body: { refreshToken }           → rotates & returns new pair
POST /auth/logout          Auth: required                   → revokes session
POST /auth/forgot-password Body: { phone }                  → sends OTP-based reset flow

39.2 Identity verification (NID document upload — upgrade to identity_verified)

POST /me/identity/documents
Auth: required | Role: buyer|seller
Body (multipart): nidFrontImage, nidBackImage
Effect: status → identity_pending; enters admin verification queue
Errors: 400 INVALID_FILE, 409 ALREADY_PENDING

39.3 User / Addresses

GET   /me                          Auth: required
PATCH /me                          Auth: required   Body: { name?, email?, profilePhotoUrl?, division?, district? }
GET    /me/addresses                Auth: required
POST   /me/addresses                Auth: required   Body: { label, recipientName, phone, division, district, area, thanaUpazila, postalCode, addressLine, isDefault? }
PATCH  /me/addresses/:id            Auth: required
DELETE /me/addresses/:id            Auth: required

39.4 Products & Categories

GET /categories                     Auth: none  → tree of categories
GET /products                       Auth: none  Query: category, brand, q, cursor, limit
GET /products/:slug                 Auth: none  → product + aggregated active listings
GET /products/:id/reviews           Auth: none  Query: cursor, limit

39.5 Listings (seller-facing)

POST /seller/listings
Auth: required | Role: seller (must be at least phone_verified)
Body: {
  productId, variantId?, title, originalPricePoisha, resalePricePoisha,
  conditionGrade, conditionDetails:[{component, status, notes?}],
  purchaseDate?, warrantyStatus?, invoiceAvailable, accessories?[],
  batteryHealth?, knownDefects?, serialNumber?, imei?,
  pickupAvailable, deliveryAvailable, negotiable?, videoUrl?
}
Validation:
  - min 4 images required before submit (added via separate image endpoint, referenced by listingId)
  - resalePricePoisha > 0
  - seller must have available credit OR be within free-5 allotment → else 402 INSUFFICIENT_CREDITS
Success 201: { data: { listingId, status: "draft" } }

POST   /seller/listings/:id/images        multipart, up to 10 images
PATCH  /seller/listings/:id               edit while draft/rejected
POST   /seller/listings/:id/submit        draft → pending_review (consumes 1 credit on success)
  Errors: 402 INSUFFICIENT_CREDITS, 400 MISSING_REQUIRED_FIELDS, 400 MIN_IMAGES_REQUIRED
DELETE /seller/listings/:id               only if draft/rejected/no active orders
GET    /seller/listings                   own listings, filter by status

39.6 Listings (buyer-facing) & Search

GET /listings                Auth: none   Query: category, brand, priceMin, priceMax, condition,
                                                   division, district, warranty, invoiceAvailable,
                                                   verifiedSellerOnly, deliveryAvailable, pickupAvailable,
                                                   sort, cursor, limit
GET /listings/:id            Auth: none
GET /search                  Auth: none   Query: q, + all filters above
GET /search/suggestions      Auth: none   Query: q

39.7 Cart & Checkout

GET    /cart                              Auth: optional (guest via session cookie)
POST   /cart/items          Body:{listingId, qty=1}
PATCH  /cart/items/:id      Body:{qty}
DELETE /cart/items/:id
POST   /checkout
  Auth: optional (guest allowed, NID + phone still required in body per §50)
  Header: Idempotency-Key (required)
  Body: {
    cartId, buyerName, buyerPhone, buyerNidNumber,
    shippingAddress:{...} | shippingAddressId,
    paymentMethod: "cod"|"bkash"|"nagad"|"rocket"|"card"
  }
  Validation: re-checks listing status/price → 409 PRICE_CHANGED / 409 LISTING_NOT_APPROVED
  Effect: creates 1 order PER SELLER in the cart (§17)
  Success 201: { data: { orders:[{orderId, orderNumber, status}], paymentIntent? } }
POST /checkout/validate      pre-flight check without creating orders (price/availability only)

39.8 Orders

GET  /orders                     Auth: required (buyer) | scoped to own orders
GET  /orders/:id                 Auth: required, owner or seller or admin
POST /orders/:id/cancel          Auth: required   Allowed only from pending_payment/confirmed
GET  /orders/:id/tracking        Auth: required

-- Seller-side --
GET   /seller/orders                        filter by status
POST  /seller/orders/:id/confirm            confirmed → processing path start
POST  /seller/orders/:id/reject             seller can't fulfil → cancelled, listing re-activated

39.9 Returns & Disputes

POST /orders/:id/returns          Body:{reason, description}
GET  /returns                     Auth: required, scoped to self
GET  /returns/:id
POST /orders/:id/disputes         Body:{reason, description}  → deadline_at = delivered_at + 48h
GET  /disputes
GET  /disputes/:id
POST /disputes/:id/evidence       multipart file upload
POST /admin/disputes/:id/resolve  Role: admin  Body:{resolution, notes, refundAmountPoisha?}

39.10 Reviews

POST /products/:id/reviews        Body:{orderId, rating, comment?}  — order must belong to reviewer & be completed
POST /sellers/:id/reviews         Body:{orderId, rating, comment?}

39.11 Wishlist

GET    /wishlist
POST   /wishlist/items       Body:{listingId}
DELETE /wishlist/items/:id

39.12 Payments & Webhooks

POST /payments                    Body:{purpose:"order"|"listing_credit", orderId?|creditPackageId, provider}
POST /payments/:id/confirm        client-side confirmation ping (NOT trusted as final — see §18)
POST /webhooks/bkash              signature-verified, updates payment_transactions + order/credit state
POST /webhooks/nagad
POST /webhooks/payment            generic/card PSP webhook

39.13 Seller dashboard

GET /seller/dashboard          summary metrics
GET /seller/orders
GET /seller/listings
GET /seller/analytics          views/saves/conversion per listing
GET /seller/payouts
GET /seller/reputation
POST /seller/credits/purchase  Body:{packageId, provider}  Header: Idempotency-Key
GET  /seller/credits/balance

39.14 Admin

GET  /admin/dashboard
GET  /admin/users
GET  /admin/sellers                    + verification queue filter
POST /admin/sellers/:id/verify         Body:{decision:"approve"|"reject", reason?}
GET  /admin/listings                   + pending_review filter
POST /admin/listings/:id/moderate      Body:{decision:"approve"|"reject"|"suspend", reason?}
GET  /admin/products
GET  /admin/orders
GET  /admin/returns
GET  /admin/disputes
GET  /admin/reports
GET  /admin/fraud
GET  /admin/reviews
POST /admin/categories  / PATCH /admin/categories/:id
POST /admin/credits/adjust             Body:{sellerId, amount, reason}
GET  /admin/audit-logs

40. API Error Model

Envelope:

// success
{ "success": true, "data": {}, "meta": {} }
// error
{ "success": false, "error": { "code": "PRODUCT_NOT_FOUND", "message": "Product not found." } }

Standardized codes:
AUTH_REQUIRED · INVALID_OTP · INVALID_TOKEN · PHONE_ALREADY_REGISTERED · NID_ALREADY_REGISTERED · SELLER_NOT_VERIFIED · LISTING_NOT_FOUND · LISTING_NOT_APPROVED · MIN_IMAGES_REQUIRED · PRODUCT_NOT_FOUND · OUT_OF_STOCK · PRICE_CHANGED · CHECKOUT_EXPIRED · PAYMENT_FAILED · COD_NOT_AVAILABLE · ORDER_ALREADY_CANCELLED · RETURN_WINDOW_EXPIRED · DISPUTE_WINDOW_EXPIRED · INSUFFICIENT_CREDITS · SELLER_SUSPENDED · HIGH_RISK_TRANSACTION · VALIDATION_ERROR

41. Authentication & Authorization

JWT access tokens (short-lived, ~15 min) + rotating refresh tokens (longer-lived, revocable via user_sessions).

RBAC roles: buyer, seller (a users row can be both — see role_flags), admin, support (read + limited-action subset of admin).

Route guards enforce role + resource ownership (e.g., a seller can only PATCH their own listings; a buyer can only view their own orders unless admin).

Sensitive admin actions (seller verification decisions, dispute resolution, credit adjustments) require admin role and are always audit-logged.

42. Background Jobs

Queue-driven (BullMQ/Redis-backed): notifications dispatch, payment reconciliation, COD reconciliation, search index sync, image processing/thumbnailing, seller payout processing, fraud scoring (re-score on new signals), expired cart-reservation cleanup (inventory_reservations), expired listing cleanup, analytics aggregation (nightly rollups for admin dashboard charts).

43. File Storage

S3-compatible object storage; do not store images/video/documents in Postgres.

Presigned upload URLs for: product images, listing images, review images, return evidence, dispute evidence, seller NID documents.

NID documents and any dispute/return evidence containing PII are never publicly accessible — served only via short-lived signed URLs to authorized roles (owning user, admin).

44. Event Architecture

Domain events (published internally, e.g., via Postgres LISTEN/NOTIFY or a lightweight event bus at MVP scale — full message broker is a Phase 2 concern) for: listing.approved, order.placed, order.confirmed, order.delivered, dispute.opened, payout.processed, etc. Consumers: notification service, analytics aggregator, fraud scorer. Keep this lightweight for MVP — a full event-sourcing architecture is not required at launch, but naming these events now keeps the modular monolith's internal boundaries clean for an eventual service split.

Order/listing snapshotting (critical rule): orders always store denormalized snapshot fields (title, price, condition, warranty, image) at creation time — never re-join to the live listings row for historical display, since sellers can edit listings after an order is placed.

45. Deployment Architecture

Stack:

Layer

Choice

Frontend

Next.js + TypeScript

Backend

NestJS + TypeScript

Database

PostgreSQL

ORM

Prisma

Cache

Redis

Queue

BullMQ

Search

Postgres full-text (MVP) → Meilisearch/Elasticsearch (scale)

Storage

S3-compatible object storage

CDN

Cloudflare (or equivalent)

Auth

JWT + refresh tokens

Monitoring

Sentry + structured logging

Deployment

Docker, modular monolith (no premature microservices)

Folder structure:

src/
├── auth/ users/ sellers/ products/ categories/ brands/
├── listings/ inventory/ conditions/ carts/ checkout/ orders/
├── payments/ shipments/ returns/ disputes/ reviews/ wishlists/
├── coupons/ credits/ payouts/ fraud/ moderation/ notifications/
├── uploads/ analytics/ admin/ common/

46. MVP Scope

Buyer browsing, search, filters, product pages; seller accounts with mandatory phone OTP + NID number; seller profiles; seller listings + 13-step wizard; condition grading (rule-based, manual entry); listing moderation (manual); cart; checkout; COD + basic bKash/Nagad; orders (full state machine); seller confirmation; shipment tracking (manual/semi-manual courier coordination); basic returns; basic disputes; reviews; seller reputation; admin dashboard; fraud basics (rule-based risk score); seller credits (ledger); seller payout ledger (tracking only — see §28).

47. Phase 1.5

Rocket + card payment providers; automated payment webhook reconciliation; refined COD risk scoring (behavioral signals); bulk/discounted credit packages; SLA automation for dispute/return deadlines; Meilisearch/Elasticsearch search upgrade; division/district-level "near me" search; Bangla localization.

48. Phase 2

Transaction commission (3–5%), which requires an escrow-style online-payment redesign (§28); AI-assisted/market-data pricing engine; AI listing generation/image analysis; advanced recommendations; advanced ML-based fraud detection; automated courier-API routing/settlement; advanced analytics/predictive alerts; professional/business seller subscription tools; Resale.com-owned inventory & refurbishment center; international expansion groundwork.

49. Acceptance Criteria (representative)

Feature: Seller creates a listing

Seller must be authenticated and at least phone_verified (NID number on file per registration).

Required product information (product, condition grade, condition details, price, warranty status, invoice availability) must be present.

At least 4 images uploaded before submit is allowed.

Price > 0.

On submit: 1 credit consumed (or covered by free allotment) → listing enters pending_review.

Seller receives a "listing submitted" notification.

Listing appears in the admin moderation queue.

Feature: Buyer places a COD order

Cart must contain ≥1 valid, approved listing.

Checkout requires buyer name, phone (OTP-verifiable), NID number, and a complete delivery address.

One order is created per distinct seller in the cart.

Listing price/status is re-validated at order creation (PRICE_CHANGED/LISTING_NOT_APPROVED block otherwise).

Order enters pending_payment → confirmed only after seller confirms.

Order and listing snapshot fields are immutably stored on the order row.

Feature: Buyer opens a dispute

Dispute can only be opened within 48 hours of delivered_at.

At least one piece of evidence (photo/video/description) is required.

Seller is notified and has 48 hours to respond before auto-escalation.

Admin resolution updates order/return/refund state and is audit-logged.

50. Risks & Mitigations

Risk

Impact

Mitigation

Mandatory NID at every account creation reduces signup conversion, especially for casual buyers who just want to browse/buy once

High — could suppress buyer acquisition significantly compared to Bikroy/Facebook Marketplace, which require no ID

Business has directed NID be required; implemented as specified. Recommended softer variant if conversion data proves this too costly post-launch: require NID only to complete checkout or publish a listing (i.e., at the moment of real transactional/financial risk), not merely to create a browsing account — this still satisfies "must give NID to transact" while not gating pure browsing. Flagging for a data-driven decision after MVP launch.

COD refusal/fraud erodes seller trust in platform

High

Risk scoring (§19.1) + tiered controls (SMS re-confirm, manual call, COD value caps, deposit requirement at CRITICAL tier)

Duplicate/fragmented product catalog entries from free-text listing creation

Medium

Seller must select existing Product; new-product suggestions go through admin approval (§6, §11)

Condition misrepresentation disputes damage trust (core differentiator)

High

Structured, component-level condition checklist (§13) + 48h dispute window + listing snapshotting (§44) so "what was promised" is provable

NID/PII data breach

Severe (legal + reputational)

Segregated user_identity_documents table, encryption at rest, access-controlled signed URLs, strict RBAC + audit logging (§32, §33)

Seller doesn't ship after confirming

Medium

Seller confirmation step + cancellation-rate reputation metric feeding into seller score/visibility

Phase 2 commission has no clean collection point under pure-COD

Medium (future)

Payout ledger infrastructure built from MVP (§28) even though unused for deduction yet, specifically to avoid a schema rework later

51. Open Decisions

(Consolidated list of items marked PROPOSED BUSINESS RULE throughout this document — confirm with business/legal before/at launch.)

NID collection scope: number-only at signup vs. document verification required before transacting (§9.1, §50).

Exact Bangladesh NID format validation rule (10/13/17-digit handling) — confirm against current Election Commission formats with legal/compliance.

Buyer account model: lightweight checkout-time capture vs. upfront registration wall (§10).

Return window: 48h (condition mismatch) vs. 7 days (defective/DOA) — confirm exact policy (§21).

COD value cap by verification tier — recommended ৳50,000 for phone-only-verified buyers (§19.1) — confirm with finance/ops.

MVP seller payout model: does Resale.com touch COD cash at all, or purely earn via listing credits in Phase 1 (§28)?

NID data retention period post account-closure — confirm with legal (§33).

Phase 2 commission collection mechanism (escrow redesign) — needs a dedicated design spike before Phase 2 kickoff (§28, §48).

52. Recommended Next Steps

Legal/compliance review of NID collection, storage, and retention policy specifically for Bangladesh — before any production NID data is collected (§33, Open Decision 1/2/7).

Finalize the 8 Open Decisions (§51) with business stakeholders.

Stand up the modular monolith skeleton (§45 folder structure) with auth, users, sellers, listings, orders first — these unblock the seller-onboarding-to-first-listing E2E flow, the fastest path to validating MVP question #1 (§1, §48 MVP scope).

Implement the order state machine + snapshotting (§20, §44) early — it's load-bearing for disputes/returns/reviews and expensive to retrofit.

Negotiate initial courier partner(s) (Pathao/Sundarban/RedX/Steadfast) and payment providers (bKash/Nagad merchant accounts) in parallel with engineering, since these are external dependencies with their own onboarding timelines.

Build the admin moderation + dispute tooling before public launch, not after — given trust/fraud is the core differentiator, ops needs these day one, not as a fast-follow.

Instrument analytics events (§30) from day one so the 5 MVP validation questions (§1) are actually measurable at launch, not retrofitted.

53. Brand & UI Color Scheme

Design direction: Premium, minimalist, monochrome e-commerce interface inspired by the visual language of the reference website, adapted for Resale.com. The interface should remain clean, spacious, modern, trustworthy, and product-focused. Product photography should provide most of the visual color rather than introducing a highly colorful UI.

53.1 Core Color Palette

Role

Color

Hex

Usage

Primary / Brand

Black

#000000

Primary brand elements, strong emphasis, key UI controls

Primary Text

Near Black

#111111

Main headings, body text, important information

Secondary Text

Dark Gray

#555555

Secondary descriptions, metadata, supporting content

Muted Text

Gray

#777777

Placeholders, captions, low-emphasis information

Page Background

White

#FFFFFF

Main page background

Card Background

White

#FFFFFF

Product cards, listing cards, panels

Secondary Background

Off White

#F7F7F7

Secondary sections, filters, subtle surfaces

Surface

Light Gray

#F8F8F8

Inputs, hover surfaces, supporting UI areas

Border

Light Gray

#E5E5E5

Card borders, dividers, input borders

Dark Border

Medium Light Gray

#D0D0D0

Stronger separators and focused structural boundaries

Primary Button

Black

#111111

Main CTAs such as Buy Now, Checkout, Publish Listing

Primary Button Hover

Dark Gray

#2A2A2A

Hover state for primary buttons

Secondary Button

White

#FFFFFF

Secondary actions

Secondary Button Border

Black

#111111

Outlined secondary buttons

Sale / Discount

Red

#D32F2F

Sale badges, discounts, price reductions, urgent pricing states

Success / Verified

Green

#2E7D32

Success states, verified indicators, in-stock states, completed actions

Warning

Amber

#F59E0B

Warnings, pending states, attention-required messages

Rating

Warm Yellow

#F5B301

Star ratings and rating indicators

53.2 CSS Variables

The frontend should define the palette centrally so the visual system can be changed without modifying individual components.

:root {
  --primary: #111111;
  --primary-hover: #2A2A2A;

  --text-primary: #111111;
  --text-secondary: #555555;
  --text-muted: #777777;

  --background: #FFFFFF;
  --surface: #F8F8F8;
  --surface-hover: #F2F2F2;

  --border: #E5E5E5;
  --border-dark: #D0D0D0;

  --sale: #D32F2F;
  --success: #2E7D32;
  --warning: #F59E0B;

  --rating: #F5B301;

  --button-primary: #111111;
  --button-primary-hover: #333333;

  --button-secondary: #FFFFFF;
  --button-secondary-border: #111111;
}

53.3 Visual Balance

The approximate visual balance should be:

70% — White / #FFFFFF

15% — Black / #111111

10% — Light gray / #F8F8F8

3% — Dark gray / supporting text and metadata

2% — Accent colors such as red, green, amber, and rating yellow

These percentages are design guidance rather than hard implementation limits.

53.4 UI Usage Rules

Primary black (#111111) should be reserved for the strongest actions and brand emphasis:

Buy Now

Add to Cart where appropriate

Checkout

Publish Listing

Confirm Order

Important navigation elements

Primary headings and high-priority text

White (#FFFFFF) should remain the dominant page and card background to preserve the premium, spacious marketplace feel.

Light gray (#F7F7F7 / #F8F8F8) should be used to visually separate sections without introducing heavy borders or large blocks of color.

Red (#D32F2F) should be used sparingly for:

Discount labels

Sale prices or discount indicators

Urgent warnings related to pricing

Destructive actions only where appropriate

Red should not be used as the primary brand color.

Green (#2E7D32) should be used for:

Verified Seller badges

Successful actions

In-stock states

Completed order states

Successful payment states

Amber (#F59E0B) should be used for:

Pending states

Warnings

Attention-required information

Warm yellow (#F5B301) should be used primarily for ratings/stars.

53.5 Resale.com Brand Direction

Do not turn the entire interface green simply because Resale.com targets Bangladesh. Bangladesh localization should be communicated through the product, content, BDT pricing, local payment methods, shipping experience, trust messaging, and localized operations rather than by replacing the minimalist monochrome visual identity with a national-color-heavy interface.

The overall visual identity should communicate:

Premium

Trustworthy

Minimal

Modern

Clean

Product-focused

Transparent