import React from "react";
import { StatusScreen } from "./StatusScreen";

export interface DesktopOnlyGateProps {
  children: React.ReactNode;
  actionHref?: string;
  actionLabel?: string;
}

export function DesktopOnlyGate({
  children,
  actionHref = "/",
  actionLabel = "Về trang chủ",
}: DesktopOnlyGateProps) {
  return (
    <>
      <div className="desktop-only-content">{children}</div>
      <div className="desktop-only-fallback">
        <main className="status-screen-page">
          <StatusScreen
            variant="desktop-only"
            actionHref={actionHref}
            actionLabel={actionLabel}
          />
        </main>
      </div>
    </>
  );
}
