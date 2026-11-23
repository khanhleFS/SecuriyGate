"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Monitor, RefreshCw } from "lucide-react";
import {
  StatusIllustration,
  type StatusIllustrationSize,
  type StatusIllustrationVariant,
} from "./StatusIllustration";

export interface StatusPresetMeta {
  title: string;
  description: string;
}

export const STATUS_CODE_PRESETS: Record<string, StatusPresetMeta> = {
  "400": {
    title: "Yêu cầu không hợp lệ",
    description:
      "Thông tin gửi lên không đúng định dạng hoặc thiếu tham số cần thiết.",
  },
  "401": {
    title: "Chưa xác thực phiên làm việc",
    description:
      "Vui lòng đăng nhập lại để tiếp tục truy cập hệ thống cổng an ninh.",
  },
  "403": {
    title: "Không có quyền truy cập",
    description:
      "Tài khoản hiện tại không được phân quyền xem trang hoặc thao tác này.",
  },
  "404": {
    title: "Không tìm thấy trang",
    description:
      "Đường dẫn bạn yêu cầu không tồn tại hoặc đã được chuyển sang địa chỉ khác.",
  },
  "500": {
    title: "Lỗi xử lý hệ thống",
    description:
      "Đã xảy ra sự cố ngoài ý muốn khi tải dữ liệu. Vui lòng thử tải lại trang.",
  },
  "503": {
    title: "Dịch vụ tạm thời gián đoạn",
    description:
      "Hệ thống đang bảo trì hoặc quá tải tạm thời. Vui lòng quay lại sau ít phút.",
  },
};

export const DESKTOP_ONLY_PRESET: StatusPresetMeta = {
  title: "Chỉ hỗ trợ màn hình Desktop",
  description:
    "Ngoại lệ dành riêng cho dev — các trang người dùng đều hỗ trợ giao diện responsive, màn hình này chỉ dùng cho công cụ cần không gian desktop.",
};

export interface StatusScreenProps {
  code?: string | number;
  variant?: StatusIllustrationVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  size?: StatusIllustrationSize;
  compact?: boolean;
}

export function StatusScreen({
  code = 404,
  variant = "status-code",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  size = "lg",
  compact = false,
}: StatusScreenProps) {
  const normalizedCode = String(code ?? "404").trim() || "404";
  const preset =
    variant === "desktop-only"
      ? DESKTOP_ONLY_PRESET
      : STATUS_CODE_PRESETS[normalizedCode] ?? {
          title: `Mã trạng thái ${normalizedCode}`,
          description:
            "Yêu cầu hiện không thể hoàn tất. Vui lòng thử lại hoặc quay về trang chủ.",
        };

  const resolvedTitle = title ?? preset.title;
  const resolvedDesc = description ?? preset.description;

  return (
    <section
      className={`status-screen ${compact ? "status-screen--compact" : ""}`.trim()}
      aria-label={resolvedTitle}
    >
      <StatusIllustration
        code={normalizedCode}
        variant={variant}
        size={size}
      />

      <div className="status-screen-copy">
        {variant === "desktop-only" && (
          <span className="badge badge-warning type-label-caption status-exception-badge">
            <Monitor size={13} aria-hidden="true" />
            DEV ONLY • EXCEPTION
          </span>
        )}
        <h2 className="status-screen-title type-heading-h2">{resolvedTitle}</h2>
        <p className="status-screen-desc type-heading-subtitle">
          {resolvedDesc}
        </p>
      </div>

      {actionLabel && (actionHref || onAction) && (
        <div className="status-screen-actions">
          {actionHref ? (
            <Link href={actionHref} className="btn btn-primary">
              <ArrowLeft size={16} aria-hidden="true" />
              {actionLabel}
            </Link>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAction}
            >
              <RefreshCw size={16} aria-hidden="true" />
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
