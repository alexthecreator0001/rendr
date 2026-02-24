"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
  depth: number;
}

export function DocsToc() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = document.querySelectorAll("main h2[id], main h3[id]");
    const tocItems: TocItem[] = [];
    headings.forEach((el) => {
      const id = el.getAttribute("id");
      const text = el.textContent?.trim();
      if (id && text) {
        tocItems.push({
          id,
          title: text,
          depth: el.tagName === "H3" ? 3 : 2,
        });
      }
    });
    setItems(tocItems);
  }, []);

  if (items.length === 0) return null;

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
