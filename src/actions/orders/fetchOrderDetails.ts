"use server";

import { backendRequest } from "@/helpers/backendRequest";
import { OrderDetails } from "@/services/orders/types";

export async function fetchOrderDetails({ id }: { id: string }) {
  const data = await backendRequest<any>(`/orders/${encodeURIComponent(id)}`);

  const order: OrderDetails = {
    id: data.id,
    invoice_no: data.invoice_no,
    order_time: data.order_time,
    total_amount: Number(data.total_amount ?? 0),
    shipping_cost: Number(data.shipping_cost ?? 0),
    payment_method: data.payment_method,
    status: data.status,
    customers: {
      name: data.customer_name ?? "Customer",
      email: data.customer_email ?? "",
      phone: data.customer_phone ?? null,
      address: data.customer_address ?? null,
    },
    order_items: (data.items ?? data.order_items ?? []).map((item: any) => ({
      quantity: Number(item.quantity ?? 0),
      unit_price: Number(item.unit_price ?? 0),
      products: {
        name: item.product_name ?? item.products?.name ?? "Product",
      },
    })),
    coupons: data.coupons ?? null,
  };

  return { order };
}