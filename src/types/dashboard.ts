export interface DashboardSummary {
  total_revenue: number;
  total_orders: number;
  total_products: number;
  total_customers: number;
  low_stock_products_count: number;
  pending_orders_count: number;
  processing_orders_count: number;
  delivered_orders_count: number;
  cancelled_orders_count: number;
  today_revenue: number;
  yesterday_revenue: number;
  this_month_revenue: number;
  last_month_revenue: number;
  weekly_sales: { date: string; revenue: number; orders: number }[];
  best_sellers: { product_id: string; product_name: string; quantity_sold: number }[];
}