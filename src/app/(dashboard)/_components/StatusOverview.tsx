import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { DashboardSummary } from "@/types/dashboard";

export default function StatusOverview({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      icon: <HiOutlineShoppingCart className="size-5" />,
      title: "Total Orders",
      value: String(summary.total_orders),
      badgeText: "Lifetime",
      className:
        "text-orange-600 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800/40",
    },
    {
      icon: <HiOutlineRefresh className="size-5" />,
      title: "Pending Orders",
      value: String(summary.pending_orders_count),
      badgeText: "Requires Action",
      className:
        "text-amber-600 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/40",
    },
    {
      icon: <BsTruck className="size-5" />,
      title: "Processing",
      value: String(summary.processing_orders_count),
      badgeText: "In Fulfillment",
      className:
        "text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/40",
    },
    {
      icon: <HiOutlineCheck className="size-5" />,
      title: "Completed & Delivered",
      value: String(summary.delivered_orders_count),
      badgeText: "Fulfilled",
      className:
        "text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="rounded-xl border shadow-xs transition-all hover:shadow-md">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "size-11 rounded-xl border grid place-items-center shrink-0 shadow-2xs",
                  card.className
                )}
              >
                {card.icon}
              </div>

              <div className="flex flex-col">
                <Typography className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {card.title}
                </Typography>

                <Typography className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {card.value}
                </Typography>
              </div>
            </div>

            <span className="text-[10px] font-mono font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-md hidden lg:inline-block">
              {card.badgeText}
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
