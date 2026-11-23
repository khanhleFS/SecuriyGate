"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export type ThemeMode = "light" | "dark";
export const THEME_STORAGE_KEY = "then-chot-theme";
export const THEME_CHANGE_EVENT = "then-chot-theme-change";

function readDocumentTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("light");

  useEffect(() => {
    setMounted(true);
    setTheme(readDocumentTheme());

    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<ThemeMode>).detail;
      if (detail === "light" || detail === "dark") {
        setTheme(detail);
      } else {
        setTheme(readDocumentTheme());
      }
    };

    window.addEventListener(THEME_CHANGE_EVENT, handleSync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleSync);
  }, []);

  const handleToggle = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Storage may be unavailable in restricted contexts
    }
    window.dispatchEvent(
      new CustomEvent<ThemeMode>(THEME_CHANGE_EVENT, { detail: nextTheme })
    );
  };

  if (!mounted) {
    return (
      <button
        type="button"
        className={`btn btn-outline btn-sm theme-toggle-btn ${className}`.trim()}
        aria-label="Chuyển đổi chế độ sáng hoặc tối"
      >
        <Sun size={15} aria-hidden="true" />
        <span>Giao diện</span>
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={`btn btn-outline btn-sm theme-toggle-btn ${className}`.trim()}
      onClick={handleToggle}
      aria-pressed={isDark}
      aria-label={
        isDark
          ? "Đang bật chế độ tối — bấm để chuyển sang chế độ sáng"
          : "Đang bật chế độ sáng — bấm để chuyển sang chế độ tối"
      }
      title={isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
    >
      {isDark ? (
        <>
          <Moon size={15} aria-hidden="true" />
          <span>Tối</span>
        </>
      ) : (
        <>
          <Sun size={15} aria-hidden="true" />
          <span>Sáng</span>
        </>
      )}
    </button>
  );
}
