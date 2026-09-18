# Clearer Product Trust and Browsing Controls

## Goal

Make product discovery easier and purchasing terms clearer by surfacing the information customers need before opening or buying a listing.

## What will change

### 1. Product assurance details

- Add a compact assurance row to listing cards showing:
  - delivery availability;
  - Cash on Delivery;
  - the existing 48-hour inspection/return window;
  - the listing’s actual warranty duration, or “No warranty” when none exists.
- Add a clearer purchase assurance panel beside the price and purchase actions on the individual listing page.
- Use only existing marketplace policies and each listing’s stored warranty value; no new guarantee or delivery estimate will be invented.

### 2. Stronger filters above listings

- Add a prominent quick-filter bar above the results for Category, Price, Grade, Location, and Brand.
- Keep the detailed desktop sidebar and mobile filter drawer for battery, storage, RAM, and other advanced filters.
- Connect the quick controls to the existing filter state so counts, active-filter chips, clearing, sorting, and results remain synchronized.
- Ensure the controls wrap cleanly on narrow screens and remain keyboard accessible.

### 3. Grade explanation at first encounter

- Add a concise A+–D grade guide directly above the listing results, before customers encounter grade badges on product cards.
- Show each grade’s short label, with a compact explanation available without leaving the page.
- Reuse the existing authoritative grade labels and criteria so wording stays consistent across browse, product, and listing pages.

## Verification

- Check desktop and mobile layouts for overflow, wrapping, and touch target size.
- Confirm each quick filter changes the visible results and can be cleared.
- Confirm product cards and the listing purchase area show the correct warranty state and existing delivery, payment, and return terms.
- Confirm the grade guide is visible before the first listing and uses the same A+–D definitions as product details.

## Technical details

- Reuse `Listing`, `gradeLabel`, and `gradeCriteria` from the current catalog model.
- Extend the existing `/products` filter UI rather than create a second filtering engine.
- Build small shared presentation components for assurance details and the grade guide to prevent copy drift across pages.
- No backend, checkout rules, pricing logic, or marketplace policy changes are included.