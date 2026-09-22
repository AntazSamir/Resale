import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "My Account & Verification | Resale.com" },
      {
        name: "description",
        content:
          "Manage your Resale account details, upload your NID documents and track your seller verification status.",
      },
      { property: "og:title", content: "My Account & Verification | Resale.com" },
      {
        property: "og:description",
        content:
          "Manage your Resale account details, upload your NID documents and track your seller verification status.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});
