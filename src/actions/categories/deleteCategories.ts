"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function deleteCategories(
  categoryIds: string[]
): Promise<ServerActionResponse> {
  try {
    await Promise.all(
      categoryIds.map((categoryId) =>
        backendRequest(`/categories/${categoryId}`, { method: "DELETE" })
      )
    );
  } catch (error) {
    return {
      dbError:
        error instanceof Error
          ? error.message
          : "Could not delete the categories.",
    };
  }

  revalidatePath("/categories");

  return { success: true };
}
