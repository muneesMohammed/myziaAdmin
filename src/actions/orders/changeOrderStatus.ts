"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";
import { OrderStatus } from "@/services/orders/types";

export async function changeOrderStatus(
  orderId: string,
  newOrderStatus: OrderStatus
): Promise<ServerActionResponse> {
  try {
    await backendRequest(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: newOrderStatus }),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Failed to update order status." };
  }

  revalidatePath("/orders");
  revalidatePath(`/orders/${orderId}`);

  return { success: true };
}
