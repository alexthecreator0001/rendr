"use client";

import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
  depth: number;
}

interface DocsTocProps {
  items?: TocItem[];
}

const defaultItems: TocItem[] = [
  { id: "overview", title: "Overview", depth: 2 },
  { id: "authentication", title: "Authentication", depth: 2 },
  { id: "request", title: "Making a request", depth: 2 },
  { id: "response", title: "Response format", depth: 2 },
  { id: "errors", title: "Error handling", depth: 2 },
];

export function DocsToc({ items = defaultItems }: DocsTocProps) {
  return (
    <nav className="py-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                item.depth === 3 && "pl-3"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
