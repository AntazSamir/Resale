import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-store";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminShell } from "@/components/AdminShell";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ListingsPage } from "@/pages/ListingsPage";
import { ModerationPage } from "@/pages/ModerationPage";
import { InspectionsPage } from "@/pages/InspectionsPage";
import { OrdersPage } from "@/pages/OrdersPage";
import { DisputesPage } from "@/pages/DisputesPage";
import { UsersPage } from "@/pages/UsersPage";
import { IdentityPage } from "@/pages/IdentityPage";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { ComingSoonPage } from "@/pages/ComingSoonPage";

function AdminLayout() {
  return (
    <ProtectedRoute>
      <AdminShell>
        <ErrorBoundary>
          <Routes>
            <Route index element={<DashboardPage />} />
            <Route path="listings" element={<ListingsPage />} />
            <Route path="moderation" element={<ModerationPage />} />
            <Route path="inspections" element={<InspectionsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="disputes" element={<DisputesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="identity" element={<IdentityPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            {/* Stub pages */}
            <Route path="returns" element={<ComingSoonPage title="Returns & Refunds" />} />
            <Route path="payouts" element={<ComingSoonPage title="Seller Payouts" />} />
            <Route path="products" element={<ComingSoonPage title="Products" />} />
            <Route path="categories" element={<ComingSoonPage title="Categories & Brands" />} />
            <Route path="reviews" element={<ComingSoonPage title="Reviews" />} />
            <Route path="promotions" element={<ComingSoonPage title="Promotions" />} />
            <Route path="notifications" element={<ComingSoonPage title="Notifications" />} />
            <Route path="support" element={<ComingSoonPage title="Support Tickets" />} />
            <Route path="content" element={<ComingSoonPage title="Website Content" />} />
            <Route path="settings" element={<ComingSoonPage title="Settings" />} />
            <Route path="roles" element={<ComingSoonPage title="Roles & Permissions" />} />
            <Route path="partners" element={<ComingSoonPage title="Partners" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </AdminShell>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
