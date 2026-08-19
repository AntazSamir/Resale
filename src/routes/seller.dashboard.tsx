import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, List, Wallet, Plus, Star } from "lucide-react";
import { taka } from "@/data/catalog";
import { ProtectedRoute } from "@/components/protected-route";
import resaleLogo from "@/assets/resale-logo.png";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [{ title: "Seller Dashboard | Resale.com" }],
  }),
  component: SellerDashboardPage,
});

export function SellerSidebar({ active }: { active: "dashboard" | "listings" | "payouts" }) {
  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-2 sticky top-24">
        <Link
          to="/seller/dashboard"
          className="flex items-center gap-2 px-4 py-2 mb-4 border-b border-border text-foreground hover:opacity-90 transition-opacity"
        >
          <img
            src={resaleLogo}
            alt="Resale logo"
            className="h-7 w-auto object-contain shrink-0"
          />
          <span className="font-display font-bold text-sm tracking-tight">Seller Hub</span>
        </Link>
        <Link
          to="/seller/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <LayoutDashboard className="size-4" /> Dashboard
        </Link>
        <Link
          to="/seller/listings"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "listings" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <List className="size-4" /> My Listings
        </Link>
        <Link
          to="/seller/payouts"
          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active === "payouts" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
        >
          <Wallet className="size-4" /> Payouts & Credits
        </Link>

        <div className="pt-6 mt-6 border-t border-border">
          <Button asChild className="w-full">
            <Link to="/sell">
              <Plus className="size-4 mr-2" /> New Listing
            </Link>
          </Button>
        </div>
      </nav>
    </aside>
  );
}

function SellerDashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
          <SellerSidebar active="dashboard" />

          <div className="flex-1">
            <h1 className="text-3xl mb-8">Seller Dashboard</h1>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total GMV
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-display">{taka(450000)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime sales</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Successful Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">98% completion rate</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    4.8 <Star className="size-5 fill-primary text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on 10 reviews</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Listing Credits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Available to use</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl mb-4">Recent Orders</h2>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Item</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-6 py-4 font-medium">ORD-99120</td>
                      <td className="px-6 py-4">Samsung Galaxy S24 Ultra</td>
                      <td className="px-6 py-4">{taka(115000)}</td>
                      <td className="px-6 py-4 text-primary">Pending Dispatch</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">ORD-81022</td>
                      <td className="px-6 py-4">Apple AirPods Pro 2</td>
                      <td className="px-6 py-4">{taka(22000)}</td>
                      <td className="px-6 py-4 text-muted-foreground">Delivered</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
