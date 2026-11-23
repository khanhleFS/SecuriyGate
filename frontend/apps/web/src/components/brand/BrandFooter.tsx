import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogoText } from "./BrandLogoText";

export interface BrandFooterProps {
  className?: string;
}

export function BrandFooter({ className = "" }: BrandFooterProps) {
  return (
    <footer className={`brand-footer ${className}`.trim()}>
      <div className="brand-footer-top">
        <BrandLogoText />
        <nav className="brand-footer-nav" aria-label="Liên kết chân trang">
          <Link href="/" className="brand-footer-link type-body-sm">
            Trang chủ
          </Link>
          <Link href="/dev/tokens" className="brand-footer-link type-body-sm">
            Design Tokens
          </Link>
          <span className="brand-footer-meta type-label-caption">
            © 2026 THEN-CHOT
          </span>
        </nav>
      </div>

      <div className="brand-footer-monument">
        <Image
          src="/brand/footer.svg"
          width={1030}
          height={262}
          alt="THEN-CHOT — THEN CÀI XÓM ẤP"
          unoptimized
          className="brand-footer-artwork"
        />
      </div>
    </footer>
  );
}
