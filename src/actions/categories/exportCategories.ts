"use server";

import { backendRequest } from "@/helpers/backendRequest";

type ExportResponse = { data: unknown[] } | { error: string };

export async function exportCategories(): Promise<ExportResponse> {
  try {
    const data = await backendRequest<unknown[]>("/categories");
    return { data };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { error: "Failed to fetch data for categories." };
  }
}
