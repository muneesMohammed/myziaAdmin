"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { categoryBulkFormSchema } from "@/app/(dashboard)/categories/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { VServerActionResponse } from "@/types/server-action";

export async function editCategories(
  categoryIds: string[],
  formData: FormData
): Promise<VServerActionResponse> {
  const parsedData = categoryBulkFormSchema.safeParse({
    published: !!(formData.get("published") === "true"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { published } = parsedData.data;

  try {
    await Promise.all(
      categoryIds.map((categoryId) =>
        backendRequest(`/categories/${categoryId}`, {
          method: "PUT",
          body: JSON.stringify({ published }),
        })
      )
    );
  } catch (error) {
    return {
      dbError:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.",
    };
  }

  revalidatePath("/categories");

  return { success: true };
}
