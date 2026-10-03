import { createFileRoute } from "@tanstack/react-router";

function getAdminUrl() {
  if (typeof window !== "undefined") {
    return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5174"
      : "https://admin.resale.com";
  }
  return typeof process !== "undefined" && process.env?.ADMIN_APP_URL
    ? process.env.ADMIN_APP_URL
    : "http://localhost:5174";
}

export const Route = createFileRoute("/admin/")({
  loader: () => {
    if (typeof window !== "undefined") {
      window.location.replace(getAdminUrl());
    }
  },
  component: AdminRedirectComponent,
});

function AdminRedirectComponent() {
  const adminUrl = getAdminUrl();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-2xl font-bold">Admin Console</h1>
      <p className="text-muted-foreground text-sm max-w-md">
        The admin panel is hosted on the dedicated webapp. If you are not redirected automatically,
        please click below:
      </p>
      <a
        href={adminUrl}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Open Standalone Admin Panel &rarr;
      </a>
    </div>
  );
}
