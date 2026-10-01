"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { ServerActionResponse } from "@/types/server-action";

export async function toggleStaffPublishedStatus(
  staffId: string,
  currentPublishedStatus: boolean
): Promise<ServerActionResponse> {
  const newPublishedStatus = !currentPublishedStatus;
  try {
    await backendRequest(`/staff/${staffId}`, {
      method: "PUT",
      body: JSON.stringify({ published: newPublishedStatus }),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Failed to update staff status." };
  }

  revalidatePath("/staff");

  return { success: true };
}
