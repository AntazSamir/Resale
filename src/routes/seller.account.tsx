import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/seller/account")({
  head: () => ({
    meta: [{ title: "My Account & Verification | Seller Hub | Resale.com" }],
  }),
});
