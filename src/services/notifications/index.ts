import axiosInstance from "@/helpers/axiosInstance";
import { Notification } from "./types";

export async function fetchNotifications(
  { staffId }: { staffId: string }
): Promise<Notification[]> {
  const { data } = await axiosInstance.get<Notification[]>("/notifications");
  return data;
}

export async function deleteNotification(
  { notificationId }: { notificationId: string }
) {
  await axiosInstance.patch(`/notifications/${notificationId}/read`);
}

export async function fetchNotificationsCount(
  { staffId }: { staffId: string }
): Promise<number> {
  const { data } = await axiosInstance.get<Notification[]>("/notifications", {
    params: { unread_only: true },
  });
  return data.length;
}
