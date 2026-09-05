# Admin Console — Audit Findings and Revised Plan

## Audit of the current repository

What I verified by reading the code, not assuming:

- **Authentication is custom, not Supabase Auth.** `loginFn`, `sendOtpFn`, `verifyOtpFn`, `validateSessionFn`, `signOutFn` in `src/lib/server-functions.ts` issue and validate opaque session tokens against `public.users`. Admin identity is `users.role === 'ADMIN'`, surfaced as `session.isAdmin`. There is no `user_roles` table and no Supabase Auth session.
- **Phase 5.1 listing governance is real and server-authoritative.** `getModerationQueueFn` and `moderateListingFn` both reject non-admin sessions server-side, write to `listing_audit_history`, and fire seller notifications. `/admin/moderation` is fully wired to these.
- **`/admin/orders` and `/admin/disputes` are client-side.** They read `order-store.ts` and `dispute-store.ts` (localStorage plus a Supabase mirror through the browser client). There is no admin-scoped server function and no server-side authorization for those two surfaces.
- **`/admin/identity` is entirely mock.** `pendingDocs` is a hardcoded array in the route file. The schema has only `users.nid_number`; there is no NID document table, no verification-status column, no storage bucket.
- **`/admin` dashboard numbers are hardcoded strings** (৳4.2M GMV, 24 pending, 8 NID).
- **Service-role access already exists** — `src/lib/supabase-admin.ts` plus `SUPABASE_SERVICE_ROLE_KEY` in the environment, used by `src/lib/db-server.ts`.
- **`roadmap.md` does not exist yet.**

## Answering your earlier question, corrected

I previously proposed a separate Lovable project. The audit changes that recommendation. All authoritative logic — session validation, admin role check, moderation state machine, audit history — lives in this repo's server functions, which are same-origin RPC endpoints. A separate project could not call them without either duplicating that logic or building a new public HTTP API surface. Both violate your constraint.

**Recommendation: keep the admin console in this repo as a genuinely separate UI layer.** It gets its own shell (no marketplace header/footer/cart), its own sign-in entry at `/admin/login`, and its own route subtree. It reuses the existing session and admin-role logic unchanged. This gives you a distinct admin experience and a single authoritative backend.

## Scope

### In scope

1. `roadmap.md` created at project root with the tasks below.
2. **Admin shell**: a dedicated layout replacing `SiteHeader`/`SiteFooter` on all `/admin/*` routes, with sidebar, admin identity chip, and sign-out. `AdminSidebar` moves out of `admin.index.tsx` into `src/components/admin/admin-shell.tsx`.
3. **Admin sign-in at `/admin/login`**: a distinct page that calls the existing `loginFn`, then rejects the session client-side if `isAdmin` is false and shows "This account is not an administrator." No new auth logic, no new tables, no new tokens.
4. **`/admin/moderation`**: unchanged behaviour, restyled into the new shell.
5. **`/admin/orders` and `/admin/disputes`**: move their reads behind new admin-authorized server functions that wrap the existing store conversion helpers, reusing the same `validateSession` + `isAdmin` guard already used by `getModerationQueueFn`. No new order or dispute business rules; resolution still runs through the existing `resolveDisputeByAdmin` transition logic.
6. **`/admin` dashboard**: replace hardcoded numbers with counts derived from data that actually exists — pending-review listing count from the moderation queue, open dispute count, order count by status. Anything without a real source is removed, not faked.

### Explicitly out of scope

- **NID / identity verification.** No document table, no storage bucket, no verification workflow exists. `/admin/identity` will be **removed** rather than left showing fabricated pending documents. It returns when the underlying schema and secure document storage land.
- **GMV / revenue metrics.** No settled-payment or commission data exists; order amounts alone are not GMV. No revenue tile.
- **New service-role code paths.** Admin server functions use the existing `db-server.ts` privileged helpers only where those helpers already exist; no new `getSupabaseAdmin()` call sites beyond that pattern.
- **A `user_roles` table or Supabase Auth migration.** The existing role model stays authoritative.
- **Any change to the listing governance state machine, order state machine, or dispute resolution rules.**

## Technical notes

- New admin server functions live in `src/lib/server-functions.ts` alongside the existing ones and copy the exact guard shape already in use:
  `if (!session || (!session.isAdmin && session.role !== "ADMIN")) return { error: "Unauthorized" }`.
- `ProtectedRoute requireAdmin` stays as the UI gate; server-side checks remain the security boundary.
- Admin routes stay under the `/admin/*` path so existing links and the moderation workbench keep working.
- One separate fix, unrelated to admin: the home page currently throws a hydration mismatch because `getCreators()` is read during render and returns localStorage data on the client but demo data on the server. It will be moved into a mount effect.

## Phases

1. Create `roadmap.md`; fix the home-page hydration mismatch.
2. Extract the admin shell and sidebar; apply to all `/admin/*` routes.
3. Add `/admin/login` and admin-aware sign-out.
4. Add admin-authorized server functions for orders and disputes; rewire those two pages.
5. Replace dashboard placeholder metrics with real counts; remove `/admin/identity` and its sidebar entry.
6. Verify: sign in as non-admin and confirm 403, sign in as admin and confirm each page loads real data; typecheck and build.

## Decisions taken

- Admin console lives in this project as its own section with its own sign-in and layout — a separate project could not reach the existing accounts and moderation rules without rebuilding them.
- `/admin/identity` is removed for now and returns when real ID-document storage exists.
- Dashboard shows only counts derived from real data; no sales/revenue figure until settled-payment data exists.

