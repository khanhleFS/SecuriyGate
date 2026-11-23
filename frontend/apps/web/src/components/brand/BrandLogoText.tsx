import React from "react";
import Image from "next/image";

export interface BrandLogoTextProps {
  height?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}

export function BrandLogoText({
  height = 40,
  className = "",
  alt = "THEN-CHOT — Hệ thống cổng an ninh thông minh",
  priority = false,
}: BrandLogoTextProps) {
  const width = Math.round((height * 382) / 100);

  return (
    <Image
      src="/brand/logo-text.svg"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized
      className={`brand-logo-text-img ${className}`.trim()}
    />
  );
}
