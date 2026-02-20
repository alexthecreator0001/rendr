"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({
  code,
  language = "bash",
  filename,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative my-4 rounded-xl border border-border bg-zinc-950 dark:bg-zinc-900 overflow-hidden", className)}>
      {/* Header bar */}
      {(filename || language) && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="font-mono text-xs text-zinc-400">
            {filename ?? language}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
            onClick={handleCopy}
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
        </div>
      )}
      {/* If no header, show copy button absolutely positioned */}
      {!filename && !language && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-3 h-6 w-6 rounded text-zinc-400 hover:text-zinc-200 hover:bg-white/10"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      )}

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={cn(
          "font-mono text-zinc-200",
          language === "json" && "text-zinc-200",
          language === "bash" && "text-zinc-200",
        )}>
          {code.trim()}
        </code>
      </pre>
    </div>
  );
}
