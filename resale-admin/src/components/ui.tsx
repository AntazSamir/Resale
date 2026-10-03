import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
export { cn };

// ── Badge ──────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "secondary" | "outline" | "destructive" | "warning" | "success";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const base =
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium font-mono";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border text-foreground",
    destructive: "bg-destructive/15 text-destructive border border-destructive/30",
    warning: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30",
    success:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
  };
  return <span className={cn(base, variants[variant], className)}>{children}</span>;
}

// ── Button ─────────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "icon";
  children: ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer rounded-lg";
  const variants: Record<string, string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-border bg-background hover:bg-muted/60 text-foreground",
    ghost: "hover:bg-muted/60 text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };
  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    icon: "h-8 w-8 p-0",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────────────────────────────
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1 p-6", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-base font-semibold leading-none tracking-tight", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

// ── Input ──────────────────────────────────────────────────────────────────────
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

// ── Label ──────────────────────────────────────────────────────────────────────
export function Label({
  children,
  className,
  htmlFor,
}: {
  children: ReactNode;
  className?: string;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("text-xs font-medium text-foreground leading-none", className)}
    >
      {children}
    </label>
  );
}

// ── Alert ──────────────────────────────────────────────────────────────────────
export function Alert({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: "default" | "destructive";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 rounded-lg border p-3 text-sm",
        variant === "destructive"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-muted/40 text-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}

// ── Loader ─────────────────────────────────────────────────────────────────────
export function Loader({ className, label }: { className?: string; label?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="size-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  className,
}: {
  title: string;
  value: string | number;
  sub?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className="text-2xl font-bold font-display text-foreground">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
          {Icon && (
            <div className="size-9 rounded-lg bg-primary/8 flex items-center justify-center shrink-0">
              <Icon className="size-4.5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
