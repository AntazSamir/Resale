# Resale.com Roadmap & Admin Console Architecture

## Current Milestone: Admin Console Implementation (Completed)

The Admin Console is implemented as a dedicated UI layer under `/admin/*` sharing the existing repository, server functions, custom HMAC session authentication, and Supabase database.

### Key Deliverables:

1. **Dedicated Administrative Shell (`<AdminShell />`)**:
   - Replaced consumer `SiteHeader` and `SiteFooter` across all `/admin/*` routes.
   - Purpose-built top navigation bar with brand icon, "Admin Console" badge, logged-in admin identity badge, and instant sign-out.
   - Sticky sidebar navigation for Overview, Orders, Moderation, Disputes, and Identity.
2. **Dedicated Administrative Sign-In (`/admin/login`)**:
   - Reuses authoritative `loginFn` and session token issuance.
   - Automatically blocks and signs out non-admin accounts with explicit access-denied warnings.
3. **Multi-Layer Administrative Authorization**:
   - UI Layer: `<ProtectedRoute requireAdmin>` protects routes from unauthenticated navigation flashes.
   - Server Layer: Every privileged server function (`getAdminDashboardMetricsFn`, `getAdminOrdersFn`, `getModerationQueueFn`, `moderateListingFn`) independently validates the HMAC signature and requires `session.role === 'ADMIN'`.
4. **Authoritative Real-Time Platform Metrics**:
   - Replaced all hardcoded strings (e.g. `৳4.2M GMV`, `24 Pending`, fake user activities).
   - Queries Supabase PostgreSQL (with dev compatibility fallback):
     - Pending Moderation: Listings in `PENDING_REVIEW` or `PENDING_MODERATION`.
     - Active Listings: Listings in `ACTIVE` and `APPROVED`.
     - Total Transactions & Status Breakdown: Real order distribution across lifecycle states.
     - Settled GMV: Computed strictly from orders with `DELIVERED` or `COMPLETED` statuses.
     - Governance Audit Log: Real events from `listing_audit_history`.
5. **Data Minimization in Transactions**:
   - Excluded sensitive National ID (NID) data from normal administrative order responses.
6. **Intentionally Deferred Modules**:
   - **Dispute Mediation (`/admin/disputes`)**: Purged fake seed disputes. Clean deferred status displayed pending persistent dispute and evidence bucket schema.
   - **Identity Document Review (`/admin/identity`)**: Purged fake pending document records. Clean deferred status displayed pending encrypted document storage infrastructure.
7. **Isolated Bugfix**:
   - Resolved client/server hydration mismatch on homepage (`/`) by isolating `getCreators()` and `getStores()` into `useEffect`.

---

## Future Phases & Deferred Milestones

### Phase 6: Production Dispute Schema & Storage Pipeline

- Provision persistent Supabase PostgreSQL `disputes` table with SLA tracking columns.
- Deploy secure object storage bucket for buyer and seller unboxing photo/video evidence.
- Activate admin mediation decision actions (Reverse pickup, Refund, Seller Release).

### Phase 7: NID Document Storage & Identity Verification Pipeline

- Provision private encrypted storage bucket for NID front and back smartcard images.
- Implement document upload wizard and verification queue with OCR/manual validation desk.
