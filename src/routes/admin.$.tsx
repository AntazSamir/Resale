import { createFileRoute } from "@tanstack/react-router";

function getAdminUrl(subpath = "") {
  const base =
    typeof window !== "undefined"
      ? window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
        ? "http://localhost:5174"
        : "https://admin.resale.com"
      : typeof process !== "undefined" && process.env?.ADMIN_APP_URL
        ? process.env.ADMIN_APP_URL
        : "http://localhost:5174";
  return `${base.replace(/\/$/, "")}/${subpath.replace(/^\//, "")}`;
}

export const Route = createFileRoute("/admin/$")({
  loader: ({ params }) => {
    if (typeof window !== "undefined") {
      window.location.replace(getAdminUrl(params._splat));
    }
  },
  component: AdminSplatRedirectComponent,
});

function AdminSplatRedirectComponent() {
  const { _splat } = Route.useParams();
  const target = getAdminUrl(_splat);
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="font-display text-2xl font-bold">Admin Console</h1>
      <p className="text-muted-foreground text-sm max-w-md">
        Redirecting to the dedicated admin console...
      </p>
      <a
        href={target}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Continue to Admin Panel &rarr;
      </a>
    </div>
  );
}
