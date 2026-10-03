"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/helpers/axiosInstance";
import { Activity } from "lucide-react";

export default function SystemStatusBadge() {
  const [status, setStatus] = useState<"healthy" | "offline" | "checking">("checking");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await axiosInstance.get("/health");
        setStatus("healthy");
      } catch (err) {
        setStatus("offline");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-xs font-medium text-muted-foreground border border-border/50">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            status === "healthy"
              ? "bg-emerald-400"
              : status === "offline"
              ? "bg-rose-400"
              : "bg-amber-400"
          }`}
        ></span>
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status === "healthy"
              ? "bg-emerald-500"
              : status === "offline"
              ? "bg-rose-500"
              : "bg-amber-500"
          }`}
        ></span>
      </span>
      <span className="font-mono text-[11px] font-medium text-foreground/80">
        {status === "healthy"
          ? "API Live"
          : status === "offline"
          ? "API Offline"
          : "Checking..."}
      </span>
    </div>
  );
}
