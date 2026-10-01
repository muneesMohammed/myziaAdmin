import { HiOutlineRefresh } from "react-icons/hi";
import { HiOutlineSquare3Stack3D, HiCalendarDays } from "react-icons/hi2";

import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import { formatAmount } from "@/helpers/formatAmount";
import { DashboardSummary } from "@/types/dashboard";

export default function SalesOverview({ summary }: { summary: DashboardSummary }) {
  const cards = [
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Today's Sales",
      value: formatAmount(summary.today_revenue),
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Yesterday Orders",
      value: formatAmount(summary.yesterday_revenue),
      className: "bg-orange-400",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "This Month",
      value: formatAmount(summary.this_month_revenue),
      className: "bg-blue-500",
    },
    {
      icon: <HiCalendarDays />,
      title: "Last Month",
      value: formatAmount(summary.last_month_revenue),
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays />,
      title: "All-Time Sales",
      value: formatAmount(summary.total_revenue),
      className: "bg-emerald-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-2">
      {cards.map((card, index) => (
        <div
          key={`sales-overview-${index}`}
          className={cn(
            "p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center",
            card.className
          )}
        >
          <div className="[&>svg]:size-8">{card.icon}</div>

          <Typography className="text-base">{card.title}</Typography>

          <Typography className="text-2xl font-semibold">
            {card.value}
          </Typography>
        </div>
      ))}
    </div>
  );
}
