import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article";
  size?: "sm" | "md" | "lg" | "xl";
}

export function Section({ as: Tag = "section", className, size = "lg", children, ...props }: SectionProps) {
  return (
    <Tag
      className={cn(
        size === "sm" && "py-10 sm:py-14",
        size === "md" && "py-14 sm:py-20",
        size === "lg" && "py-20 sm:py-28",
        size === "xl" && "py-28 sm:py-36",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
