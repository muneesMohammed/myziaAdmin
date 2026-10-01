import { backendRequest } from "@/helpers/backendRequest";

export type BackendUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export async function getUser(): Promise<BackendUser | null> {
  try {
    return await backendRequest<BackendUser>("/auth/me");
  } catch {
    return null;
  }
}
