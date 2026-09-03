# Admin Panel Plan — Separate App with Shared Backend

## Decision Summary

Build the admin panel as a **separate Lovable project/deployment** that talks to the same Supabase backend as the buyer-seller marketplace. It will have its own URL, its own admin login page, and its own minimal UI chrome. This gives you security isolation (admin code never ships to public users) while keeping one shared database so listings, orders, disputes, and NID docs are consistent.

## What we will build

1. **Fix the home-page hydration bug** that is currently crashing the public preview (creator avatar/href mismatch between server and client).
2. **Scaffold a new admin project** and connect it to the same Supabase project.
3. **Admin authentication**: dedicated `/login` page, email+password only for admin accounts, server-side role check using a `user_roles` table.
4. **Admin console pages**:
   - `/` — dashboard with pending counts (moderation, NID, disputes, GMV).
   - `/listings` — approve or reject pending seller listings.
   - `/identity` — review uploaded NID documents and mark verified/rejected.
   - `/disputes` — view and mediate buyer-seller disputes.
   - `/orders` — view transactions and platform activity.
5. **Security hardening**: admin routes protected by server-side auth middleware, no client-only gates, service-role operations verified by role.

## Technical approach

### Shared backend

- Both apps point at the same Supabase project URL and publishable key.
- Admin app uses `requireSupabaseAuth` server functions and service-role helpers for privileged reads/writes.
- Main marketplace app keeps using the public client and authenticated user functions.
- Add a `public.user_roles` table with an `app_role` enum (`admin`, `moderator`) and a security-definer `has_role()` function for RLS and server checks, following the project user-roles knowledge.

### Admin app structure

- New Lovable project (e.g. `resale-admin`) with its own `src/routes/`.
- Minimal monochrome UI consistent with the marketplace design tokens, but no public header/footer.
- Auth layout: public `/login`; all other routes under `_authenticated/` with the managed gate.
- Server functions live in `src/lib/admin.functions.ts` and load `supabaseAdmin` inside handlers only.

### Hydration bug fix (public app)

- In `src/routes/index.tsx`, replace the module-level `const creators = getCreators().slice(0, 3)` call with a client-only state/effect so the server and first client render use the same `INITIAL_DEMO_CREATORS`, then hydrate to localStorage contents after mount.

## Phases

### Phase 1 — Stabilize public preview
- Fix creator-section hydration mismatch in `src/routes/index.tsx`.
- Verify no console hydration errors on `/`.

### Phase 2 — Admin project scaffold
- Create/list the new Lovable admin project and connect it to the existing Supabase backend.
- Copy design tokens and base layout (sidebar + top bar).
- Add `user_roles` table, `app_role` enum, and `has_role()` security definer in a migration.

### Phase 3 — Admin auth
- Build admin `/login` with email+password.
- Add `_authenticated/` route gate.
- Seed the first admin account and role.

### Phase 4 — Admin features
- Dashboard counts from real tables.
- Listing moderation: list pending, approve/reject with reason.
- NID verification: review front/back images and NID number, approve/reject.
- Dispute mediation: view disputes, assign status, add resolution note.
- Orders/transactions: read-only list with search and filters.

### Phase 5 — Security & deploy
- Audit all admin server functions for `requireSupabaseAuth` + role checks.
- Remove any admin-only code from the public app bundle.
- Publish/preview both apps.

## Open questions before starting

- Should the first admin account be seeded automatically, or do you want to create it manually?
- Do you need a `/moderators` page inside the admin app to invite other staff later, or is one admin enough for now?
