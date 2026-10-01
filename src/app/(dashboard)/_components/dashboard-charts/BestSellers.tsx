"use client";

import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/use-get-mount-status";

export default function BestSellers({ products }: { products: { product_id: string; product_name: string; quantity_sold: number }[] }) {
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Best Selling Products
      </Typography>

      <CardContent className="pb-2">
        <div className="relative h-[18.625rem]">
          {mounted && products.length > 0 ? (
            <Pie
              data={{
                labels: products.map((product) => product.product_name),
                datasets: [
                  {
                    label: "Orders",
                    data: products.map((product) => product.quantity_sold),
                    backgroundColor: [
                      "rgb(34, 197, 94)",
                      "rgb(59, 130, 246)",
                      "rgb(249, 115, 22)",
                      "rgb(99, 102, 241)",
                    ],
                    borderColor:
                      theme === "light" ? "rgb(255,255,255)" : "rgb(23,23,23)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          ) : mounted ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No product sales yet.</div>
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
