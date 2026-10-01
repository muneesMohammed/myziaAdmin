"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { categoryFormSchema } from "@/app/(dashboard)/categories/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/types/server-action";
import { SBCategory } from "@/services/categories/types";

export async function editCategory(
  categoryId: string,
  formData: FormData
): Promise<CategoryServerActionResponse> {
  const parsedData = categoryFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    slug: formData.get("slug"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...categoryData } = parsedData.data;
  void image;
  let updatedCategory;
  try {
    updatedCategory = await backendRequest<SBCategory>(`/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Could not update category." };
  }

  revalidatePath("/categories");

  return { success: true, category: updatedCategory };
}
