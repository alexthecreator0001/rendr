import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { JobStatus } from "@/lib/mock/jobs";

interface StatusPillProps {
  status: JobStatus;
  className?: string;
}

const statusConfig: Record<JobStatus, { label: string; variant: "success" | "info" | "warning" | "destructive" | "secondary" }> = {
  done: { label: "Done", variant: "success" },
  processing: { label: "Processing", variant: "info" },
  queued: { label: "Queued", variant: "secondary" },
  failed: { label: "Failed", variant: "destructive" },
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} className={cn("font-medium", className)}>
      {config.label}
    </Badge>
  );
}
