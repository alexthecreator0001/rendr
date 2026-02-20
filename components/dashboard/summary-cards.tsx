import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SummaryCard {
  title: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
}

interface SummaryCardsProps {
  cards: SummaryCard[];
}

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold tabular-nums">{card.value}</p>
            {card.change && (
              <p
                className={cn(
                  "mt-1 text-xs",
                  card.changeType === "up" && "text-emerald-600 dark:text-emerald-400",
                  card.changeType === "down" && "text-red-600 dark:text-red-400",
                  card.changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {card.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
