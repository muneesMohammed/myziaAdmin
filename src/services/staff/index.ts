import axiosInstance from "@/helpers/axiosInstance";
import {
  Staff,
  StaffRolesDropdown,
  FetchStaffParams,
  FetchStaffResponse,
  SBStaff,
} from "./types";

export async function fetchStaff(
  { page = 1, limit = 10, search, role }: FetchStaffParams
): Promise<FetchStaffResponse> {
  const { data } = await axiosInstance.get<Staff[]>("/staff");
  const filtered = data.filter((staff) => {
    if (role && staff.staff_roles?.name !== role) return false;
    if (!search) return true;
    return `${staff.name} ${staff.email} ${staff.phone || ""}`
      .toLowerCase()
      .includes(search.toLowerCase());
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

export async function fetchStaffRolesDropdown(
): Promise<StaffRolesDropdown[]> {
  const { data } = await axiosInstance.get<StaffRolesDropdown[]>("/staff/roles");
  return data;
}

export async function fetchStaffDetails(
): Promise<SBStaff | null> {
  const { data } = await axiosInstance.get<SBStaff>("/auth/me");
  return data;
}
