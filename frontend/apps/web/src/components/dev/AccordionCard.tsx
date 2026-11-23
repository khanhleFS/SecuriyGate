"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

export type AccordionTone = "teal-100" | "teal-500" | "teal-700";

export interface AccordionCardProps {
  badge: string;
  tone: AccordionTone;
  title: string;
  pathHint: string;
  countLabel: string;
  previewColors?: string[];
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function AccordionCard({
  badge,
  tone,
  title,
  pathHint,
  countLabel,
  previewColors,
  isOpen,
  onToggle,
  children,
}: AccordionCardProps) {
  return (
    <div
      className={`swagger-card swagger-card--${tone} ${
        isOpen ? "swagger-card--open" : ""
      }`}
    >
      <button
        type="button"
        className="swagger-card-trigger"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="swagger-trigger-left">
          <span className={`swagger-badge swagger-badge--${tone}`}>
            {badge}
          </span>
          <span className="swagger-title-wrap">
            <span className="swagger-title type-label-base">{title}</span>
            <span className="swagger-path mono-code">{pathHint}</span>
          </span>
        </span>

        <span className="swagger-trigger-right">
          {previewColors && previewColors.length > 0 && (
            <span className="swagger-preview-dots" aria-hidden="true">
              {previewColors.map((color, idx) => (
                <span
                  key={`${color}-${idx}`}
                  className="swagger-dot"
                  style={{
                    backgroundColor: color.startsWith("--")
                      ? `var(${color})`
                      : color,
                  }}
                />
              ))}
            </span>
          )}
          <span className="swagger-count mono-code">{countLabel}</span>
          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`swagger-chevron ${
              isOpen ? "swagger-chevron--open" : ""
            }`}
          />
        </span>
      </button>

      {isOpen && <div className="swagger-card-body">{children}</div>}
    </div>
  );
}
