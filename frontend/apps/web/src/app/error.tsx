"use client";

import React from "react";
import { StatusScreen } from "@/components/status";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="status-screen-page">
      <StatusScreen
        code={500}
        onAction={reset}
        actionLabel="Thử tải lại"
      />
    </main>
  );
}
