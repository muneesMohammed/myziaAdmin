"use server";

import { revalidatePath } from "next/cache";

import { backendRequest } from "@/helpers/backendRequest";
import { categoryFormSchema } from "@/app/(dashboard)/categories/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { CategoryServerActionResponse } from "@/types/server-action";
import { SBCategory } from "@/services/categories/types";

export async function addCategory(
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
  let newCategory;
  try {
    newCategory = await backendRequest<SBCategory>("/categories", {
      method: "POST",
      body: JSON.stringify({ ...categoryData, published: false, image_url: "" }),
    });
  } catch (error) {
    return { dbError: error instanceof Error ? error.message : "Could not create category." };
  }

  revalidatePath("/categories");

  return { success: true, category: newCategory };
}
