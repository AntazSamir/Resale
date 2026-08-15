import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SellerSidebar } from "./seller.dashboard";
import { Button } from "@/components/ui/button";
import { taka } from "@/data/catalog";

export const Route = createFileRoute("/seller/payouts")({
  head: () => ({
    meta: [{ title: "Payouts & Credits | Resale.com" }],
  }),
  component: SellerPayoutsPage,
});

function SellerPayoutsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-7xl px-5 py-10 w-full flex gap-10">
        <SellerSidebar active="payouts" />

        <div className="flex-1">
          <h1 className="text-3xl mb-8">Payouts & Credits</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {/* Payouts Box */}
            <Card>
              <CardHeader>
                <CardTitle>Available Payout</CardTitle>
                <CardDescription>Funds cleared from delivered orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display text-primary mb-6">{taka(115000)}</div>
                <Button className="w-full">Withdraw to bKash</Button>
              </CardContent>
            </Card>

            {/* Credits Box */}
            <Card>
              <CardHeader>
                <CardTitle>Listing Credits</CardTitle>
                <CardDescription>Required to publish new listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-display mb-6">
                  4 <span className="text-lg text-muted-foreground font-sans">credits</span>
                </div>
                <Button variant="outline" className="w-full">
                  Buy More Credits
                </Button>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-xl mb-4">Payout History</h2>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-6 py-4">2026-07-25</td>
                    <td className="px-6 py-4">{taka(45000)}</td>
                    <td className="px-6 py-4">Bank Transfer</td>
                    <td className="px-6 py-4 text-success">Completed</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">2026-06-12</td>
                    <td className="px-6 py-4">{taka(22000)}</td>
                    <td className="px-6 py-4">bKash</td>
                    <td className="px-6 py-4 text-success">Completed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
