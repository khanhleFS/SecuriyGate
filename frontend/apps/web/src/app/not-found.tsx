import React from "react";
import { StatusScreen } from "@/components/status";

export default function NotFound() {
  return (
    <main className="status-screen-page">
      <StatusScreen code={404} actionHref="/" actionLabel="Về trang chủ" />
    </main>
  );
}
