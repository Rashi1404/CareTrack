import { Activity } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { HOSPITAL } from "@/lib/mock-data";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex min-w-0 items-center gap-2.5">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Activity className="size-5" />
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-display text-base font-semibold text-foreground">
          {HOSPITAL.app}
        </span>
        {!compact && (
          <span className="block truncate text-[11px] text-muted-foreground">
            {HOSPITAL.name}
          </span>
        )}
      </span>
    </Link>
  );
}
