import React from "react";
import Image from "next/image";

const SIZE_PRESETS = {
  sm: 40,
  md: 64,
  lg: 112,
} as const;

export interface BrandLogoProps {
  size?: keyof typeof SIZE_PRESETS | number;
  className?: string;
  alt?: string;
}

export function BrandLogo({
  size = "md",
  className = "",
  alt = "Logo THEN-CHOT",
}: BrandLogoProps) {
  const width = typeof size === "number" ? size : SIZE_PRESETS[size];
  const height = Math.round((width * 93.75) / 144.75);

  return (
    <Image
      src="/brand/logo.svg"
      alt={alt}
      width={width}
      height={height}
      unoptimized
      className={`brand-logo-img ${className}`.trim()}
    />
  );
}
