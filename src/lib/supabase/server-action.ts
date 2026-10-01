import { cookies } from "next/headers";

const backendUrl =
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api/v1";

type QueryResult<T = unknown> = {
  data: any;
  error: { message: string; code?: string; details?: string } | null;
};

const tablePath: Record<string, string> = {
  categories: "/categories",
  coupons: "/coupons",
  products: "/products",
  staff: "/staff",
  orders: "/orders",
  customers: "/customers",
};

async function request<T>(path: string, init: RequestInit): Promise<T> {
  const token = (await cookies()).get("myziya_access_token")?.value;
  const response = await fetch(`${backendUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Backend request failed with ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function apiError(error: unknown): QueryResult {
  return {
    data: null,
    error: { message: error instanceof Error ? error.message : "Backend request failed" },
  };
}

export const createServerActionClient = () => {
  const client = {
    from(table: string) {
      let operation: "select" | "insert" | "update" | "delete" = "select";
      let body: unknown;
      let id: string | undefined;
      let ids: string[] = [];

      const builder: any = {
        select() {
          // Preserve the original mutation-based operation when a query is chained with .select()
          // e.g. insert(...).select() must remain POST, not GET.
          return builder;
        },
        insert(value: unknown) {
          operation = "insert";
          body = value;
          return builder;
        },
        update(value: unknown) {
          operation = "update";
          body = value;
          return builder;
        },
        delete() {
          operation = "delete";
          return builder;
        },
        eq(field: string, value: string) {
          if (field === "id") id = value;
          return builder;
        },
        in(field: string, values: string[]) {
          const safeValues = values.map(String);
          if (field === "id") {
            ids = safeValues;
            id = safeValues.length === 1 ? safeValues[0] : undefined;
          }
          return builder;
        },
        single() {
          return builder;
        },
        then(resolve: (value: QueryResult) => unknown) {
          const runRequest = async () => {
            const basePath = tablePath[table] || `/${table}`;

            if (operation === "select" && ids.length > 0) {
              const results = await Promise.all(
                ids.map(async (currentId) =>
                  request(`${basePath}/${currentId}`, { method: "GET" })
                )
              );
              return resolve({ data: results, error: null });
            }

            if (operation === "delete" && ids.length > 0) {
              const results = await Promise.all(
                ids.map(async (currentId) =>
                  request(`${basePath}/${currentId}`, { method: "DELETE" })
                )
              );
              return resolve({ data: results, error: null });
            }

            const path = `${basePath}${id ? `/${id}` : ""}`;
            const method = operation === "select" ? "GET" : operation === "insert" ? "POST" : operation === "update" ? "PUT" : "DELETE";
            const data = await request(path, {
              method,
              ...(body ? { body: JSON.stringify(body) } : {}),
            });
            return resolve({ data, error: null });
          };

          return runRequest().catch((error) => resolve(apiError(error)));
        },
      };

      return builder;
    },
    storage: {
      from(_bucket: string) {
        return {
          async upload(path: string, _file?: File) {
            return { data: { path }, error: null };
          },
          getPublicUrl(path: string) {
            return { data: { publicUrl: path } };
          },
          async remove(_paths?: string[]) {
            return { error: null };
          },
        };
      },
    },
  };

  return client;
};
