import axiosInstance from "@/helpers/axiosInstance";
import {
  Order,
  FetchOrdersParams,
  FetchOrdersResponse,
} from "./types";

export async function fetchOrders(
  {
    page = 1,
    limit = 10,
    search,
    status,
    method,
    startDate,
    endDate,
  }: FetchOrdersParams
): Promise<FetchOrdersResponse> {
  const { data } = await axiosInstance.get<Order[]>("/orders", {
    params: { status_filter: status, search },
  });
  const filtered = data.filter((order) => {
    if (method && order.payment_method !== method) return false;
    const timestamp = new Date(order.order_time).getTime();
    if (startDate && timestamp < new Date(startDate).getTime()) return false;
    if (endDate && timestamp > new Date(`${endDate}T23:59:59`).getTime()) return false;
    return true;
  });
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

