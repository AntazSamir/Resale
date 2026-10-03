import { Construction } from "lucide-react";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
      <div className="size-16 rounded-2xl bg-muted flex items-center justify-center">
        <Construction className="size-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-display text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {description ?? "This section is under development and will be available soon."}
        </p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/50">
        <span className="size-1.5 rounded-full bg-amber-500" />
        Coming Soon
      </div>
    </div>
  );
}
