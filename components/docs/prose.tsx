import { cn } from "@/lib/utils";

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

export function Prose({ children, className }: ProseProps) {
  return (
    <div
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none",
        "prose-headings:tracking-tight prose-headings:font-semibold",
        "prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-[-0.03em]",
        "prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4",
        "prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3",
        "prose-p:text-sm prose-p:leading-relaxed prose-p:text-muted-foreground",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:rounded-none",
        "prose-strong:font-semibold prose-strong:text-foreground",
        "prose-li:text-sm prose-li:text-muted-foreground",
        "prose-hr:border-border",
        className
      )}
    >
      {children}
    </div>
  );
}
