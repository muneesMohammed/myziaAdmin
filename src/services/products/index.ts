import axiosInstance from "@/helpers/axiosInstance";
import {
  Product,
  FetchProductsParams,
  FetchProductsResponse,
  ProductDetails,
} from "./types";

export async function fetchProducts(
  {
    page = 1,
    limit = 10,
    search,
    category,
    priceSort,
    status,
    published,
    dateSort,
  }: FetchProductsParams
): Promise<FetchProductsResponse> {
  const { data } = await axiosInstance.get<Product[]>("/products", {
    params: {
      skip: ((page || 1) - 1) * (limit || 10),
      limit,
      search,
      category_slug: category,
      published_only: published,
      sort_by:
        priceSort === "lowest-first"
          ? "price_asc"
          : priceSort === "highest-first"
          ? "price_desc"
          : "newest",
      ...(status === "selling" ? { min_price: 0 } : {}),
    },
  });

  const pageSize = limit || 10;
  return {
    data,
    pagination: {
      limit: pageSize,
      current: page || 1,
      items: data.length,
      pages: data.length < pageSize ? page || 1 : (page || 1) + 1,
      next: data.length < pageSize ? null : (page || 1) + 1,
      prev: page && page > 1 ? page - 1 : null,
    },
  };
}

export async function fetchProductDetails(
  { slug }: { slug: string }
) {
  const { data: product } = await axiosInstance.get<ProductDetails>(
    `/products/${slug}`
  );
  return { product };
}
