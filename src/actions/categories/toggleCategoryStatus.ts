"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function toggleCategoryPublishedStatus(
  categoryId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  const newPublishedStatus = !currentPublishedStatus;
  try {
    await backendRequest(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify({ published: newPublishedStatus }),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Failed to update category status." };
  }

  revalidatePath("/categories");

  return { success: true };
}
