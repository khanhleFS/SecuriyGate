import React from "react";
import Image from "next/image";

export type StatusIllustrationVariant = "status-code" | "desktop-only";
export type StatusIllustrationSize = "sm" | "md" | "lg";

export interface StatusIllustrationProps {
  code?: string | number;
  variant?: StatusIllustrationVariant;
  size?: StatusIllustrationSize;
  className?: string;
}

export function StatusIllustration({
  code = 404,
  variant = "status-code",
  size = "lg",
  className = "",
}: StatusIllustrationProps) {
  const displayCode = String(code ?? "404").trim() || "404";
  const altText =
    variant === "desktop-only"
      ? "Minh họa thiết bị thông báo chỉ hỗ trợ màn hình Desktop"
      : `Minh họa trạng thái HTTP ${displayCode}`;

  return (
    <div
      className={`status-visual status-visual--${size} status-visual--${variant} ${className}`.trim()}
    >
      <div className="status-visual-watermark" aria-hidden="true">
        {variant === "desktop-only" ? (
          <>
            <span>DESKTOP</span>
            <span>ONLY</span>
          </>
        ) : (
          <span>{displayCode}</span>
        )}
      </div>

      <div className="status-visual-phone-wrap">
        <Image
          src="/illustrations/status-phone.png"
          width={1111}
          height={1730}
          alt={altText}
          unoptimized
          className="status-visual-phone"
        />
      </div>
    </div>
  );
}
