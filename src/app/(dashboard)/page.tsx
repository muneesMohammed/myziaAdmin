import { Fragment } from "react";
import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import SalesOverview from "./_components/SalesOverview";
import StatusOverview from "./_components/StatusOverview";
import DashboardCharts from "./_components/dashboard-charts";
import RecentOrders from "@/app/(dashboard)/orders/_components/orders-table";
import { backendRequest } from "@/helpers/backendRequest";
import { DashboardSummary } from "@/types/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const summary = await backendRequest<DashboardSummary>("/dashboard/summary");

  return (
    <Fragment>
      <section>
        <PageTitle>Dashboard Overview</PageTitle>

        <div className="space-y-8 mb-8">
          <SalesOverview summary={summary} />
          <StatusOverview summary={summary} />
          <DashboardCharts summary={summary} />
        </div>
      </section>

      <section>
        <PageTitle component="h2">Recent Orders</PageTitle>

        <RecentOrders />
      </section>
    </Fragment>
  );
}
