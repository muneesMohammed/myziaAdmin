"use server";

import { backendRequest } from "@/helpers/backendRequest";

export async function exportCoupons(): Promise<
  { data: unknown[] } | { error: string }
> {
  try {
    return { data: await backendRequest<unknown[]>("/coupons") };
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return { error: "Failed to fetch data for coupons." };
  }
}
