import { create } from "zustand";
import type { Notification } from "./types";

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: (token: string, limit?: number, offset?: number) => Promise<void>;
  fetchUnreadCount: (token: string) => Promise<void>;
  markRead: (token: string, notificationId: string) => Promise<void>;
  markAllRead: (token: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,

  fetchNotifications: async (token, limit = 20, offset = 0) => {
    set({ loading: true, error: null });
    try {
      const { fetchNotificationsFn } = await import("./notification-service");
      const result = await fetchNotificationsFn({ data: { token, limit, offset } });
      if (result.success && result.data) {
        set({ notifications: result.data as Notification[], loading: false });
      } else {
        set({ error: result.error ?? "Failed to fetch notifications", loading: false });
      }
    } catch (err) {
      set({ error: String(err), loading: false });
    }
  },

  fetchUnreadCount: async (token) => {
    try {
      const { fetchUnreadCountFn } = await import("./notification-service");
      const result = await fetchUnreadCountFn({ data: { token } });
      if (result.success && result.data !== null) {
        set({ unreadCount: result.data as number });
      }
    } catch {
      // silently fail
    }
  },

  markRead: async (token, notificationId) => {
    try {
      const { markNotificationReadFn } = await import("./notification-service");
      await markNotificationReadFn({ data: { token, notificationId } });
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // silently fail
    }
  },

  markAllRead: async (token) => {
    try {
      const { markAllNotificationsReadFn } = await import("./notification-service");
      await markAllNotificationsReadFn({ data: { token } });
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch {
      // silently fail
    }
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
