import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, Check, X } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useNotificationStore } from "@/lib/notification-store";
import type { Notification } from "@/lib/types";

export function NotificationPanel() {
  const { token, user } = useAuth();
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markRead,
    markAllRead,
    loading,
  } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (token) {
      fetchUnreadCount(token);
      fetchNotifications(token);
    }
  }, [token, fetchNotifications, fetchUnreadCount]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!token || !user) return null;

  const handleMarkRead = async (id: string) => {
    await markRead(token, id);
  };

  const handleMarkAllRead = async () => {
    await markAllRead(token);
  };

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="relative text-subtle-foreground hover:text-foreground p-1"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 size-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-[11px] text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No notifications yet
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleMarkRead(n.id)}
                    className={`w-full text-left px-3 py-2.5 border-b border-border/50 hover:bg-accent/50 transition-colors flex gap-2.5 items-start ${
                      n.is_read ? "opacity-60" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 shrink-0 size-1.5 rounded-full ${n.is_read ? "bg-muted" : "bg-primary"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-tight">{n.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-tight mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-muted-foreground/70">
                        {formatTime(n.created_at)}
                      </span>
                    </div>
                    {!n.is_read && <Check className="size-3 text-primary shrink-0 mt-0.5" />}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
