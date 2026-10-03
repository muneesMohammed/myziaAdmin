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
      const totalItems = customersData.length;
      const totalPages = Math.ceil(totalItems / limit) || 1;
      const currentPage = page;
      const nextPage = currentPage < totalPages ? currentPage + 1 : null;
      const prevPage = currentPage > 1 ? currentPage - 1 : null;

      return {
        data: customersData as any,
        pagination: {
          limit,
          current: currentPage,
          items: totalItems,
          pages: totalPages,
          next: nextPage,
          prev: prevPage,
        },
      };
    } else if (customersData && Array.isArray(customersData.data)) {
      return customersData;
    }
  } catch (error) {
    console.warn("[FastAPI] fetchCustomers failed, trying Supabase fallback:", error);
  }

  // Fallback to Supabase if backend fails
  try {
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
  } catch (err) {
    console.warn("Supabase customers table fallback failed, attempting users table fallback:", err);
    try {
      let query = (client as any).from("users").select("*", { count: "exact" }).eq("role", "customer");
      if (search) {
        query = query.or(
          `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
        );
      }
      query = query.order("created_at", { ascending: false });
      const paginatedCustomers = await queryPaginatedTable<Customer, any>({
        name: "customers",
        page,
        limit,
        query,
      });
      return paginatedCustomers;
    } catch (usersErr) {
      console.error("Failed to fetch customers fallback:", usersErr);
      return {
        data: [],
        pagination: {
          limit,
          current: 1,
          items: 0,
          pages: 1,
          next: null,
          prev: null,
        },
      };
    }
  }
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

  try {
    const selectQuery = `
      id,
      invoice_no,
      order_time,
      payment_method,
      total_amount,
      status
    `;

    const { data, error } = await (client as any)
      .from("orders")
      .select(selectQuery)
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase fetchCustomerOrders failed:", error.message);
      return { customerOrders: [] };
    }

    return {
      customerOrders: (data || []) as CustomerOrder[],
    };
  } catch (err) {
    console.error("Failed to fetch customer orders:", err);
    return { customerOrders: [] };
  }
}
