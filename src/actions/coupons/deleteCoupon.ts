"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCoupon(
  couponId: string
): Promise<ServerActionResponse> {
  try {
    await backendRequest(`/coupons/${couponId}`, { method: "DELETE" });
  } catch (error) {
    return {
      dbError:
        error instanceof Error ? error.message : "Could not delete the coupon.",
    };
  }

  revalidatePath("/coupons");

  return { success: true };
}
