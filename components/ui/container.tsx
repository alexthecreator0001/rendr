import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Container({ className, size = "xl", children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        size === "sm" && "max-w-2xl",
        size === "md" && "max-w-4xl",
        size === "lg" && "max-w-5xl",
        size === "xl" && "max-w-7xl",
        size === "full" && "max-w-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
