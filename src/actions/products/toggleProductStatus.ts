"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function toggleProductPublishedStatus(
  productId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  const newPublishedStatus = !currentPublishedStatus;
  try {
    await backendRequest(`/products/${productId}`, {
      method: "PUT",
      body: JSON.stringify({ published: newPublishedStatus }),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Failed to update product status." };
  }

  revalidatePath("/products");

  return { success: true };
}
