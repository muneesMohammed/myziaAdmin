"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategory(
  categoryId: string
): Promise<ServerActionResponse> {
  try {
    await backendRequest(`/categories/${categoryId}`, { method: "DELETE" });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Could not delete the category." };
  }

  revalidatePath("/categories");

  return { success: true };
}
