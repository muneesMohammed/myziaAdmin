import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
import {
  Customer,
  FetchCustomersParams,
  FetchCustomersResponse,
  CustomerOrder,
} from "./types";
import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import axiosInstance from "@/helpers/axiosInstance";

export async function fetchCustomers(
  client: SupabaseClient<Database>,
  { page = 1, limit = 10, search }: FetchCustomersParams
): Promise<FetchCustomersResponse> {
  try {
    const params: Record<string, any> = { skip: (page - 1) * limit, limit };
    if (search) params.search = search;

    const res = await axiosInstance.get("/customers", { params });
    const customersData = res.data;

    if (Array.isArray(customersData)) {
      return {
        data: customersData as any,
        pagination: {
          page,
          limit,
          total: customersData.length,
          totalPages: Math.ceil(customersData.length / limit) || 1,
        },
      };
    }
  } catch (error) {
    console.warn("[FastAPI] fetchCustomers failed, trying Supabase fallback:", error);
  }

  // Fallback to Supabase if backend fails
  let query = client.from("customers").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    );
  }

  query = query.order("created_at", { ascending: false });

  const paginatedCustomers = await queryPaginatedTable<Customer, "customers">({
    name: "customers",
    page,
    limit,
    query,
  });

  return paginatedCustomers;
}

export async function fetchCustomerOrders(
  client: SupabaseClient<Database>,
  { id }: { id: string }
) {
  try {
    const res = await axiosInstance.get(`/customers/${id}`);
    if (res.data && res.data.orders) {
      const formatted = res.data.orders.map((o: any) => ({
        id: o.id,
        invoice_no: o.invoice_no,
        order_time: o.order_time,
        payment_method: o.payment_method || "cash",
        total_amount: o.total_amount,
        status: o.status,
        customers: {
          name: res.data.name,
          address: res.data.address,
          phone: res.data.phone,
        },
      }));
      return { customerOrders: formatted as CustomerOrder[] };
    }
  } catch (error) {
    console.warn("[FastAPI] fetchCustomerOrders failed, trying Supabase fallback:", error);
  }

  const selectQuery = `
    id,
    invoice_no,
    order_time,
    payment_method,
    total_amount,
    status,
    customers(name, address, phone)
  `;

  const { data, error } = await client
    .from("orders")
    .select(selectQuery)
    .eq("customer_id", id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch customer orders: ${error.message}`);
  }

  if (!data) {
    console.error("Failed to fetch customer orders");
    throw new Error("Failed to fetch customer orders");
  }

  return {
    customerOrders: data as CustomerOrder[],
  };
}
