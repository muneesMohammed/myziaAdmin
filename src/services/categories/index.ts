import axiosInstance from "@/helpers/axiosInstance";
import {
  Category,
  CategoryDropdown,
  FetchCategoriesParams,
  FetchCategoriesResponse,
} from "./types";

export async function fetchCategories(
  { page = 1, limit = 10, search }: FetchCategoriesParams
): Promise<FetchCategoriesResponse> {
  const { data } = await axiosInstance.get<Category[]>("/categories");
  const filtered = search
    ? data.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      )
    : data;
  const offset = (page - 1) * limit;
  const pageData = filtered.slice(offset, offset + limit);
  return {
    data: pageData,
    pagination: {
      limit,
      current: page,
      items: filtered.length,
      pages: Math.max(1, Math.ceil(filtered.length / limit)),
      next: offset + limit < filtered.length ? page + 1 : null,
      prev: page > 1 ? page - 1 : null,
    },
  };
}
export async function fetchCategoriesDropdown(): Promise<CategoryDropdown[]> {
  const { data } = await axiosInstance.get<Category[]>("/categories");
  return data.map(({ id, name, slug }) => ({ id, name, slug }));
}
