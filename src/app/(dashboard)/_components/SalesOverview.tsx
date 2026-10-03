import { HiOutlineRefresh } from "react-icons/hi";
import { HiOutlineSquare3Stack3D, HiCalendarDays } from "react-icons/hi2";
import { TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import { formatAmount } from "@/helpers/formatAmount";
import { DashboardSummary } from "@/types/dashboard";

export default function SalesOverview({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      icon: <DollarSign className="size-5 text-teal-600 dark:text-teal-400" />,
      title: "Today's Sales",
      value: formatAmount(summary.today_revenue),
      accent: "from-teal-500/10 to-teal-500/5 border-teal-500/20",
      badgeText: "Realtime",
      badgeColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    },
    {
      icon: <HiOutlineSquare3Stack3D className="size-5 text-amber-600 dark:text-amber-400" />,
      title: "Yesterday Sales",
      value: formatAmount(summary.yesterday_revenue),
      accent: "from-amber-500/10 to-amber-500/5 border-amber-500/20",
      badgeText: "Previous Day",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    },
    {
      icon: <HiOutlineRefresh className="size-5 text-blue-600 dark:text-blue-400" />,
      title: "This Month",
      value: formatAmount(summary.this_month_revenue),
      accent: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
      badgeText: "Current Cycle",
      badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
      icon: <HiCalendarDays className="size-5 text-indigo-600 dark:text-indigo-400" />,
      title: "Last Month",
      value: formatAmount(summary.last_month_revenue),
      accent: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/20",
      badgeText: "Prior Cycle",
      badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    },
    {
      icon: <TrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />,
      title: "All-Time Revenue",
      value: formatAmount(summary.total_revenue),
      accent: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/20",
      badgeText: "Cumulative",
      badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
      {cards.map((card, index) => (
        <div
          key={`sales-overview-${index}`}
          className={cn(
            "p-5 rounded-xl border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden flex flex-col justify-between",
            card.accent
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-background border border-border/50 shadow-2xs">
              {card.icon}
            </div>
            <span className={cn("text-[10px] font-semibold font-mono px-2 py-0.5 rounded-full", card.badgeColor)}>
              {card.badgeText}
            </span>
          </div>

          <div>
            <Typography className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
              {card.title}
            </Typography>

            <Typography className="text-xl font-bold tracking-tight text-foreground font-mono">
              {card.value}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
