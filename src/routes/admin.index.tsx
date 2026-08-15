import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Shield, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Resale.com" }],
  }),
  component: AdminDashboardPage,
});

export function AdminSidebar({ active }: { active: "dashboard" | "moderation" | "identity" }) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-2 sticky top-24">
        <Link
          to="/admin"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <LayoutDashboard className="size-4" /> Overview
        </Link>
        <Link
          to="/admin/moderation"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "moderation" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <Shield className="size-4" /> Listing Moderation
        </Link>
        <Link
          to="/admin/identity"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "identity" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <Users className="size-4" /> Identity Verification
        </Link>
      </nav>
    </aside>
  );
}

function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
        <AdminSidebar active="dashboard" />

        <div className="flex-1">
          <h1 className="text-3xl mb-8">Platform Overview</h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="size-4" /> Monthly GMV
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display">৳4.2M</div>
                <p className="text-xs text-success mt-1">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="size-4" /> Pending Moderation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display text-destructive">24</div>
                <p className="text-xs text-muted-foreground mt-1">Listings awaiting approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="size-4" /> Pending NID Verifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-display text-primary">8</div>
                <p className="text-xs text-muted-foreground mt-1">Identity docs to review</p>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl mb-4">Recent Platform Activity</h2>
          <Card>
            <div className="p-6 text-sm text-muted-foreground">
              <ul>
                <li className="py-2 border-b">
                  Seller <strong>Rafiq Islam</strong> submitted a new listing. (2 mins ago)
                </li>
                <li className="py-2 border-b">
                  Order <strong>ORD-99120</strong> was delivered. (15 mins ago)
                </li>
                <li className="py-2 border-b">
                  Buyer <strong>Nusrat</strong> registered an account. (1 hour ago)
                </li>
                <li className="py-2">
                  Listing <strong>#882</strong> was flagged for Suspicious Pricing. (2 hours ago)
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
