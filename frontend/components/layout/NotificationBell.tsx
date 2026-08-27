"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  fetchMyNotifications,
  fetchUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from "@/lib/api";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUnreadNotificationCount().then(setUnread).catch(() => {});
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchMyNotifications().then(setItems).catch(() => setItems([]));
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleItemClick(item: NotificationItem) {
    if (!item.read) {
      await markNotificationRead(item.id).catch(() => {});
      setItems((prev) => prev?.map((n) => (n.id === item.id ? { ...n, read: true } : n)) ?? null);
      setUnread((prev) => Math.max(0, prev - 1));
    }
    setOpen(false);
    router.push("/minhas-recargas");
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead().catch(() => {});
    setItems((prev) => prev?.map((n) => ({ ...n, read: true })) ?? null);
    setUnread(0);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notificações"
        className="relative flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
      >
        <Bell className="size-4.5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-border p-3">
            <p className="text-sm font-semibold text-foreground">Notificações</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-primary hover:underline"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {items === null && (
              <p className="p-4 text-center text-sm text-muted-foreground">A carregar…</p>
            )}
            {items?.length === 0 && (
              <p className="p-4 text-center text-sm text-muted-foreground">
                Ainda não tens notificações.
              </p>
            )}
            {items?.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={cn(
                  "flex w-full flex-col items-start gap-0.5 border-b border-border p-3 text-left last:border-0 hover:bg-muted/50",
                  !item.read && "bg-primary/5"
                )}
              >
                <span className="flex w-full items-center gap-1.5">
                  {!item.read && <span className="size-1.5 shrink-0 rounded-full bg-primary" />}
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </span>
                <span className="text-xs text-muted-foreground">{item.message}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString("pt-PT", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
