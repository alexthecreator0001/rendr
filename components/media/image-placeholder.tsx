import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  width?: number;
  height?: number;
  aspect?: string; // e.g. "16/9", "4/3", "1/1"
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  variant?: "light" | "dark" | "auto";
  className?: string;
}

export function ImagePlaceholder({
  label,
  width,
  height,
  aspect,
  rounded = "xl",
  variant = "auto",
  className,
}: ImagePlaceholderProps) {
  const roundedMap = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const dimensionLabel =
    width && height ? `${width}×${height}` : aspect ? `${aspect.replace("/", ":")}` : "";

  const inlineStyle: React.CSSProperties = {};
  if (width) inlineStyle.width = width;
  if (height && !aspect) inlineStyle.height = height;
  if (aspect) inlineStyle.aspectRatio = aspect.replace("/", " / ");

  return (
    <div
      className={cn(
        "relative overflow-hidden border-2 border-dashed flex items-center justify-center",
        variant === "light" && "border-zinc-300 bg-zinc-100",
        variant === "dark" && "border-zinc-600 bg-zinc-800",
        variant === "auto" && "border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900",
        roundedMap[rounded],
        className
      )}
      style={inlineStyle}
    >
      {/* CSS-only diagonal stripe background */}
      <div
        className={cn(
          "absolute inset-0",
          variant === "light" && "[background-image:repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(0,0,0,0.04)_8px,rgba(0,0,0,0.04)_9px)]",
          variant === "dark" && "[background-image:repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.06)_8px,rgba(255,255,255,0.06)_9px)]",
          variant === "auto" && "[background-image:repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(0,0,0,0.04)_8px,rgba(0,0,0,0.04)_9px)] dark:[background-image:repeating-linear-gradient(-45deg,transparent,transparent_8px,rgba(255,255,255,0.05)_8px,rgba(255,255,255,0.05)_9px)]"
        )}
      />
      {/* Centered label */}
      <div className="relative z-10 flex flex-col items-center gap-2 px-4 text-center">
        <div
          className={cn(
            "rounded-md border px-3 py-1 text-xs font-medium tracking-wide",
            variant === "light" && "border-zinc-300 bg-white text-zinc-500",
            variant === "dark" && "border-zinc-600 bg-zinc-900 text-zinc-400",
            variant === "auto" &&
              "border-zinc-200 bg-white text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
          )}
        >
          IMAGE
        </div>
        <p
          className={cn(
            "max-w-[80%] text-xs leading-relaxed",
            variant === "light" && "text-zinc-500",
            variant === "dark" && "text-zinc-400",
            variant === "auto" && "text-zinc-500 dark:text-zinc-400"
          )}
        >
          {label}
        </p>
      </div>
      {/* Dimension badge */}
      {dimensionLabel && (
        <div
          className={cn(
            "absolute bottom-2 right-2 rounded px-1.5 py-0.5 font-mono text-[10px]",
            variant === "light" && "bg-zinc-200 text-zinc-500",
            variant === "dark" && "bg-zinc-700 text-zinc-400",
            variant === "auto" &&
              "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400"
          )}
        >
          {dimensionLabel}
        </div>
      )}
    </div>
  );
}
