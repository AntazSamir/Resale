import React from "react";

interface LoaderProps {
  /** Optional label shown below the loader */
  label?: string;
  /** Extra class names applied to the wrapper */
  className?: string;
}

/**
 * Custom animated loader.
 * Uses the `.loader` CSS class defined in styles.css.
 */
export function Loader({ label, className = "" }: LoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="loader" aria-busy="true" aria-label={label ?? "Loading"} />
      {label && <p className="text-sm font-medium text-muted-foreground">{label}</p>}
    </div>
  );
}
