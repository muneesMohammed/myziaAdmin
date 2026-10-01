import { cookies } from "next/headers";

const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000/api/v1";

export async function backendRequest<T>(path: string, init: RequestInit = {}) {
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
