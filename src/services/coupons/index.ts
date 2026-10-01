import axiosInstance from "@/helpers/axiosInstance";
import { Coupon, FetchCouponsParams, FetchCouponsResponse } from "./types";

export async function fetchCoupons(
  { page = 1, limit = 10, search }: FetchCouponsParams
): Promise<FetchCouponsResponse> {
  const { data } = await axiosInstance.get<Coupon[]>("/coupons");
  const filtered = search
    ? data.filter((coupon) =>
        `${coupon.campaign_name} ${coupon.code}`
          .toLowerCase()
          .includes(search.toLowerCase())
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
