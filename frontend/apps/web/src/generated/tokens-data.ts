// AUTO-GENERATED FROM frontend/tokens/**/*.json — DO NOT EDIT MANUALLY
// Run `npm run tokens:build` in frontend/ to regenerate.

export interface PrimitiveColorShade {
  shade: string;
  token: string;
  cssVar: string;
  value: string;
}

export interface PrimitiveColorGroup {
  palette: string;
  shades: PrimitiveColorShade[];
}

export interface PrimitiveToken {
  key: string;
  token: string;
  cssVar: string;
  value: string;
}

export interface PrimitiveTypographyMap {
  fontFamilies: PrimitiveToken[];
  fontSizes: PrimitiveToken[];
  fontWeights: PrimitiveToken[];
  lineHeights: PrimitiveToken[];
  letterSpacings: PrimitiveToken[];
}

export interface PrimitiveBreakpointToken {
  key: string;
  token: string;
  cssVar: string;
  value: string;
  description: string;
}

export type SemanticColorGroup = "brand" | "surface" | "text" | "border" | "status";

export interface SemanticColorToken {
  group: string;
  name: string;
  token: string;
  cssVar: string;
  reference: string;
  resolvedValue: string;
  darkReference: string;
  darkResolvedValue: string;
  description: string;
}

export type SemanticSpacingGroup = "proximity" | "layout";

export interface SemanticSpacingToken {
  group: string;
  name: string;
  token: string;
  cssVar: string;
  reference: string;
  resolvedValue: string;
  mobileReference?: string;
  mobileResolvedValue?: string;
  description: string;
}

export interface SemanticTypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type SemanticTypographyGroup = "display" | "heading" | "body" | "label";

export interface SemanticTypographyToken {
  group: string;
  name: string;
  token: string;
  className: string;
  value: SemanticTypographyStyle;
  resolved: SemanticTypographyStyle;
  mobileResolved?: Partial<SemanticTypographyStyle>;
  description: string;
}

export type ComponentTokenGroup = "button" | "badge" | "input" | "card" | "table" | "expand-card";

export interface ComponentToken {
  group: string;
  name: string;
  token: string;
  cssVar: string;
  reference: string;
  primitiveRef: string;
  resolvedValue: string;
  type: string;
  description: string;
}

export const PRIMITIVE_COLORS: PrimitiveColorGroup[] = [
  {
    "palette": "neutral",
    "shades": [
      {
        "shade": "0",
        "token": "neutral.0",
        "cssVar": "--color-neutral-0",
        "value": "#FFFFFF"
      },
      {
        "shade": "50",
        "token": "neutral.50",
        "cssVar": "--color-neutral-50",
        "value": "#F8F7FA"
      },
      {
        "shade": "100",
        "token": "neutral.100",
        "cssVar": "--color-neutral-100",
        "value": "#F1F0F4"
      },
      {
        "shade": "200",
        "token": "neutral.200",
        "cssVar": "--color-neutral-200",
        "value": "#E4E2E8"
      },
      {
        "shade": "300",
        "token": "neutral.300",
        "cssVar": "--color-neutral-300",
        "value": "#D1CFD7"
      },
      {
        "shade": "400",
        "token": "neutral.400",
        "cssVar": "--color-neutral-400",
        "value": "#A3A0A8"
      },
      {
        "shade": "500",
        "token": "neutral.500",
        "cssVar": "--color-neutral-500",
        "value": "#6E6B73"
      },
      {
        "shade": "600",
        "token": "neutral.600",
        "cssVar": "--color-neutral-600",
        "value": "#57545A"
      },
      {
        "shade": "700",
        "token": "neutral.700",
        "cssVar": "--color-neutral-700",
        "value": "#403E42"
      },
      {
        "shade": "800",
        "token": "neutral.800",
        "cssVar": "--color-neutral-800",
        "value": "#333133"
      },
      {
        "shade": "900",
        "token": "neutral.900",
        "cssVar": "--color-neutral-900",
        "value": "#292727"
      },
      {
        "shade": "950",
        "token": "neutral.950",
        "cssVar": "--color-neutral-950",
        "value": "#1A191B"
      },
      {
        "shade": "1000",
        "token": "neutral.1000",
        "cssVar": "--color-neutral-1000",
        "value": "#000000"
      }
    ]
  },
  {
    "palette": "teal",
    "shades": [
      {
        "shade": "100",
        "token": "teal.100",
        "cssVar": "--color-teal-100",
        "value": "#D9F2ED"
      },
      {
        "shade": "300",
        "token": "teal.300",
        "cssVar": "--color-teal-300",
        "value": "#4FD1BD"
      },
      {
        "shade": "400",
        "token": "teal.400",
        "cssVar": "--color-teal-400",
        "value": "#22B39B"
      },
      {
        "shade": "500",
        "token": "teal.500",
        "cssVar": "--color-teal-500",
        "value": "#0E7C6B"
      },
      {
        "shade": "700",
        "token": "teal.700",
        "cssVar": "--color-teal-700",
        "value": "#095A4E"
      },
      {
        "shade": "900",
        "token": "teal.900",
        "cssVar": "--color-teal-900",
        "value": "#0E352F"
      }
    ]
  },
  {
    "palette": "amber",
    "shades": [
      {
        "shade": "100",
        "token": "amber.100",
        "cssVar": "--color-amber-100",
        "value": "#FDF1DC"
      },
      {
        "shade": "300",
        "token": "amber.300",
        "cssVar": "--color-amber-300",
        "value": "#F5C469"
      },
      {
        "shade": "500",
        "token": "amber.500",
        "cssVar": "--color-amber-500",
        "value": "#E8A33D"
      },
      {
        "shade": "600",
        "token": "amber.600",
        "cssVar": "--color-amber-600",
        "value": "#CF8A23"
      },
      {
        "shade": "700",
        "token": "amber.700",
        "cssVar": "--color-amber-700",
        "value": "#965C0C"
      },
      {
        "shade": "900",
        "token": "amber.900",
        "cssVar": "--color-amber-900",
        "value": "#3D2B0D"
      }
    ]
  },
  {
    "palette": "green",
    "shades": [
      {
        "shade": "100",
        "token": "green.100",
        "cssVar": "--color-green-100",
        "value": "#DCFCE7"
      },
      {
        "shade": "300",
        "token": "green.300",
        "cssVar": "--color-green-300",
        "value": "#4ADE80"
      },
      {
        "shade": "500",
        "token": "green.500",
        "cssVar": "--color-green-500",
        "value": "#16A34A"
      },
      {
        "shade": "700",
        "token": "green.700",
        "cssVar": "--color-green-700",
        "value": "#146C34"
      },
      {
        "shade": "900",
        "token": "green.900",
        "cssVar": "--color-green-900",
        "value": "#123522"
      }
    ]
  },
  {
    "palette": "red",
    "shades": [
      {
        "shade": "100",
        "token": "red.100",
        "cssVar": "--color-red-100",
        "value": "#FEE2E2"
      },
      {
        "shade": "300",
        "token": "red.300",
        "cssVar": "--color-red-300",
        "value": "#F87171"
      },
      {
        "shade": "500",
        "token": "red.500",
        "cssVar": "--color-red-500",
        "value": "#DC2626"
      },
      {
        "shade": "700",
        "token": "red.700",
        "cssVar": "--color-red-700",
        "value": "#B91C1C"
      },
      {
        "shade": "900",
        "token": "red.900",
        "cssVar": "--color-red-900",
        "value": "#3B1518"
      }
    ]
  },
  {
    "palette": "blue",
    "shades": [
      {
        "shade": "100",
        "token": "blue.100",
        "cssVar": "--color-blue-100",
        "value": "#E0F2FE"
      },
      {
        "shade": "300",
        "token": "blue.300",
        "cssVar": "--color-blue-300",
        "value": "#38BDF8"
      },
      {
        "shade": "500",
        "token": "blue.500",
        "cssVar": "--color-blue-500",
        "value": "#0284C7"
      },
      {
        "shade": "700",
        "token": "blue.700",
        "cssVar": "--color-blue-700",
        "value": "#0369A1"
      },
      {
        "shade": "900",
        "token": "blue.900",
        "cssVar": "--color-blue-900",
        "value": "#0F2D42"
      }
    ]
  }
];

export const PRIMITIVE_TYPOGRAPHY: PrimitiveTypographyMap = {
  "fontFamilies": [
    {
      "key": "display",
      "token": "fontFamilies.display",
      "cssVar": "--font-display",
      "value": "Extenda 30 Deca"
    },
    {
      "key": "serif",
      "token": "fontFamilies.serif",
      "cssVar": "--font-serif",
      "value": "Times New Roman"
    },
    {
      "key": "sans",
      "token": "fontFamilies.sans",
      "cssVar": "--font-sans",
      "value": "Arial"
    }
  ],
  "fontSizes": [
    {
      "key": "xs",
      "token": "fontSizes.xs",
      "cssVar": "--font-size-xs",
      "value": "12px"
    },
    {
      "key": "sm",
      "token": "fontSizes.sm",
      "cssVar": "--font-size-sm",
      "value": "14px"
    },
    {
      "key": "base",
      "token": "fontSizes.base",
      "cssVar": "--font-size-base",
      "value": "16px"
    },
    {
      "key": "lg",
      "token": "fontSizes.lg",
      "cssVar": "--font-size-lg",
      "value": "20px"
    },
    {
      "key": "xl",
      "token": "fontSizes.xl",
      "cssVar": "--font-size-xl",
      "value": "24px"
    },
    {
      "key": "2xl",
      "token": "fontSizes.2xl",
      "cssVar": "--font-size-2xl",
      "value": "32px"
    },
    {
      "key": "3xl",
      "token": "fontSizes.3xl",
      "cssVar": "--font-size-3xl",
      "value": "40px"
    },
    {
      "key": "4xl",
      "token": "fontSizes.4xl",
      "cssVar": "--font-size-4xl",
      "value": "48px"
    },
    {
      "key": "5xl",
      "token": "fontSizes.5xl",
      "cssVar": "--font-size-5xl",
      "value": "64px"
    }
  ],
  "fontWeights": [
    {
      "key": "regular",
      "token": "fontWeights.regular",
      "cssVar": "--font-weight-regular",
      "value": "400"
    },
    {
      "key": "bold",
      "token": "fontWeights.bold",
      "cssVar": "--font-weight-bold",
      "value": "700"
    }
  ],
  "lineHeights": [
    {
      "key": "none",
      "token": "lineHeights.none",
      "cssVar": "--line-height-none",
      "value": "100%"
    },
    {
      "key": "tight",
      "token": "lineHeights.tight",
      "cssVar": "--line-height-tight",
      "value": "120%"
    },
    {
      "key": "normal",
      "token": "lineHeights.normal",
      "cssVar": "--line-height-normal",
      "value": "150%"
    }
  ],
  "letterSpacings": [
    {
      "key": "tight",
      "token": "letterSpacings.tight",
      "cssVar": "--letter-spacing-tight",
      "value": "-0.02em"
    },
    {
      "key": "normal",
      "token": "letterSpacings.normal",
      "cssVar": "--letter-spacing-normal",
      "value": "0em"
    },
    {
      "key": "wide",
      "token": "letterSpacings.wide",
      "cssVar": "--letter-spacing-wide",
      "value": "0.04em"
    },
    {
      "key": "widest",
      "token": "letterSpacings.widest",
      "cssVar": "--letter-spacing-widest",
      "value": "0.35em"
    }
  ]
};

export const PRIMITIVE_SPACINGS: PrimitiveToken[] = [
  {
    "key": "0",
    "token": "space.0",
    "cssVar": "--space-0",
    "value": "0px"
  },
  {
    "key": "1",
    "token": "space.1",
    "cssVar": "--space-1",
    "value": "4px"
  },
  {
    "key": "2",
    "token": "space.2",
    "cssVar": "--space-2",
    "value": "8px"
  },
  {
    "key": "3",
    "token": "space.3",
    "cssVar": "--space-3",
    "value": "12px"
  },
  {
    "key": "4",
    "token": "space.4",
    "cssVar": "--space-4",
    "value": "16px"
  },
  {
    "key": "5",
    "token": "space.5",
    "cssVar": "--space-5",
    "value": "20px"
  },
  {
    "key": "6",
    "token": "space.6",
    "cssVar": "--space-6",
    "value": "24px"
  },
  {
    "key": "8",
    "token": "space.8",
    "cssVar": "--space-8",
    "value": "32px"
  },
  {
    "key": "10",
    "token": "space.10",
    "cssVar": "--space-10",
    "value": "40px"
  },
  {
    "key": "12",
    "token": "space.12",
    "cssVar": "--space-12",
    "value": "48px"
  },
  {
    "key": "16",
    "token": "space.16",
    "cssVar": "--space-16",
    "value": "64px"
  }
];

export const PRIMITIVE_BORDER_RADIUS: PrimitiveToken[] = [
  {
    "key": "none",
    "token": "borderRadius.none",
    "cssVar": "--radius-none",
    "value": "0px"
  },
  {
    "key": "sm",
    "token": "borderRadius.sm",
    "cssVar": "--radius-sm",
    "value": "2px"
  },
  {
    "key": "md",
    "token": "borderRadius.md",
    "cssVar": "--radius-md",
    "value": "4px"
  },
  {
    "key": "lg",
    "token": "borderRadius.lg",
    "cssVar": "--radius-lg",
    "value": "6px"
  },
  {
    "key": "xl",
    "token": "borderRadius.xl",
    "cssVar": "--radius-xl",
    "value": "8px"
  },
  {
    "key": "2xl",
    "token": "borderRadius.2xl",
    "cssVar": "--radius-2xl",
    "value": "12px"
  },
  {
    "key": "full",
    "token": "borderRadius.full",
    "cssVar": "--radius-full",
    "value": "9999px"
  }
];

export const PRIMITIVE_BORDER_WIDTHS: PrimitiveToken[] = [
  {
    "key": "0",
    "token": "borderWidth.0",
    "cssVar": "--border-width-0",
    "value": "0px"
  },
  {
    "key": "1",
    "token": "borderWidth.1",
    "cssVar": "--border-width-1",
    "value": "1px"
  },
  {
    "key": "2",
    "token": "borderWidth.2",
    "cssVar": "--border-width-2",
    "value": "2px"
  },
  {
    "key": "4",
    "token": "borderWidth.4",
    "cssVar": "--border-width-4",
    "value": "4px"
  }
];

export const PRIMITIVE_BREAKPOINTS: PrimitiveBreakpointToken[] = [
  {
    "key": "mobile",
    "token": "breakpoint.mobile",
    "cssVar": "--breakpoint-mobile",
    "value": "0px",
    "description": "Màn hình điện thoại (< 768px)"
  },
  {
    "key": "tablet",
    "token": "breakpoint.tablet",
    "cssVar": "--breakpoint-tablet",
    "value": "768px",
    "description": "Màn hình máy tính bảng (768px – 1023px)"
  },
  {
    "key": "desktop",
    "token": "breakpoint.desktop",
    "cssVar": "--breakpoint-desktop",
    "value": "1024px",
    "description": "Màn hình máy tính để bàn (>= 1024px, ngưỡng mở DesktopOnlyGate)"
  },
  {
    "key": "wide",
    "token": "breakpoint.wide",
    "cssVar": "--breakpoint-wide",
    "value": "1280px",
    "description": "Độ rộng khung chứa rộng tối đa"
  }
];

export const SEMANTIC_COLORS: Record<SemanticColorGroup, SemanticColorToken[]> = {
  "brand": [
    {
      "group": "brand",
      "name": "primary",
      "token": "brand.primary",
      "cssVar": "--brand-primary",
      "reference": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "darkReference": "{teal.400}",
      "darkResolvedValue": "#22B39B",
      "description": "Màu thương hiệu chính THEN-CHOT (#0E7C6B - CTA button, thanh điều hướng, logo, điểm nhấn chủ đạo)"
    },
    {
      "group": "brand",
      "name": "primary-hover",
      "token": "brand.primary-hover",
      "cssVar": "--brand-primary-hover",
      "reference": "{teal.700}",
      "resolvedValue": "#095A4E",
      "darkReference": "{teal.300}",
      "darkResolvedValue": "#4FD1BD",
      "description": "Trạng thái hover/active của nút hoặc liên kết chính"
    },
    {
      "group": "brand",
      "name": "primary-subtle",
      "token": "brand.primary-subtle",
      "cssVar": "--brand-primary-subtle",
      "reference": "{teal.100}",
      "resolvedValue": "#D9F2ED",
      "darkReference": "{teal.900}",
      "darkResolvedValue": "#0E352F",
      "description": "Nền nhấn nhẹ theo màu thương hiệu chính (badge, trạng thái active, highlight)"
    },
    {
      "group": "brand",
      "name": "accent",
      "token": "brand.accent",
      "cssVar": "--brand-accent",
      "reference": "{amber.500}",
      "resolvedValue": "#E8A33D",
      "darkReference": "{amber.500}",
      "darkResolvedValue": "#E8A33D",
      "description": "Màu nhấn phụ (#E8A33D - thanh chắn cổng, secondary badge, icon trang trí, highlight)"
    },
    {
      "group": "brand",
      "name": "accent-hover",
      "token": "brand.accent-hover",
      "cssVar": "--brand-accent-hover",
      "reference": "{amber.600}",
      "resolvedValue": "#CF8A23",
      "darkReference": "{amber.300}",
      "darkResolvedValue": "#F5C469",
      "description": "Trạng thái hover/active của thành phần dùng màu accent (đảm bảo contrast >5.1:1 với text.on-accent)"
    },
    {
      "group": "brand",
      "name": "accent-subtle",
      "token": "brand.accent-subtle",
      "cssVar": "--brand-accent-subtle",
      "reference": "{amber.100}",
      "resolvedValue": "#FDF1DC",
      "darkReference": "{amber.900}",
      "darkResolvedValue": "#3D2B0D",
      "description": "Nền nhấn nhẹ theo màu vàng hổ phách phụ (callout, note box)"
    }
  ],
  "surface": [
    {
      "group": "surface",
      "name": "canvas",
      "token": "surface.canvas",
      "cssVar": "--surface-canvas",
      "reference": "{neutral.50}",
      "resolvedValue": "#F8F7FA",
      "darkReference": "{neutral.950}",
      "darkResolvedValue": "#1A191B",
      "description": "Nền tổng thể của trang (#F8F7FA ở chế độ sáng, #1A191B ở chế độ tối)"
    },
    {
      "group": "surface",
      "name": "default",
      "token": "surface.default",
      "cssVar": "--surface-default",
      "reference": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "darkReference": "{neutral.900}",
      "darkResolvedValue": "#292727",
      "description": "Nền mặc định của các khối nổi trên trang (card, modal, dropdown)"
    },
    {
      "group": "surface",
      "name": "muted",
      "token": "surface.muted",
      "cssVar": "--surface-muted",
      "reference": "{neutral.100}",
      "resolvedValue": "#F1F0F4",
      "darkReference": "{neutral.800}",
      "darkResolvedValue": "#333133",
      "description": "Nền phụ hoặc trạng thái hover nhẹ (sidebar, code block, table row hover)"
    },
    {
      "group": "surface",
      "name": "inverse",
      "token": "surface.inverse",
      "cssVar": "--surface-inverse",
      "reference": "{neutral.900}",
      "resolvedValue": "#292727",
      "darkReference": "{neutral.50}",
      "darkResolvedValue": "#F8F7FA",
      "description": "Nền đảo ngược tương phản cao (tooltip, khối tối/sáng đảo chiều)"
    }
  ],
  "text": [
    {
      "group": "text",
      "name": "primary",
      "token": "text.primary",
      "cssVar": "--text-primary",
      "reference": "{neutral.900}",
      "resolvedValue": "#292727",
      "darkReference": "{neutral.50}",
      "darkResolvedValue": "#F8F7FA",
      "description": "Chữ tiêu đề và nội dung quan trọng nhất"
    },
    {
      "group": "text",
      "name": "body",
      "token": "text.body",
      "cssVar": "--text-body",
      "reference": "{neutral.700}",
      "resolvedValue": "#403E42",
      "darkReference": "{neutral.300}",
      "darkResolvedValue": "#D1CFD7",
      "description": "Chữ đoạn văn đọc chính (paragraphs, nội dung mô tả)"
    },
    {
      "group": "text",
      "name": "muted",
      "token": "text.muted",
      "cssVar": "--text-muted",
      "reference": "{neutral.500}",
      "resolvedValue": "#6E6B73",
      "darkReference": "{neutral.400}",
      "darkResolvedValue": "#A3A0A8",
      "description": "Chữ phụ (caption, ngày tháng, placeholder, thông tin bổ trợ)"
    },
    {
      "group": "text",
      "name": "inverse",
      "token": "text.inverse",
      "cssVar": "--text-inverse",
      "reference": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "darkReference": "{neutral.900}",
      "darkResolvedValue": "#292727",
      "description": "Chữ đảo ngược đặt trên nền surface.inverse"
    },
    {
      "group": "text",
      "name": "on-brand",
      "token": "text.on-brand",
      "cssVar": "--text-on-brand",
      "reference": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "darkReference": "{neutral.950}",
      "darkResolvedValue": "#1A191B",
      "description": "Chữ/icon đặt trên nền brand.primary hoặc brand.primary-hover (đạt chuẩn WCAG AA)"
    },
    {
      "group": "text",
      "name": "on-accent",
      "token": "text.on-accent",
      "cssVar": "--text-on-accent",
      "reference": "{neutral.900}",
      "resolvedValue": "#292727",
      "darkReference": "{neutral.950}",
      "darkResolvedValue": "#1A191B",
      "description": "Chữ/icon tối đặt trên nền brand.accent hoặc brand.accent-hover (đạt chuẩn WCAG AA)"
    },
    {
      "group": "text",
      "name": "brand",
      "token": "text.brand",
      "cssVar": "--text-brand",
      "reference": "{teal.700}",
      "resolvedValue": "#095A4E",
      "darkReference": "{teal.300}",
      "darkResolvedValue": "#4FD1BD",
      "description": "Chữ nhấn màu thương hiệu trên nền sáng/tối hoặc brand.primary-subtle"
    }
  ],
  "border": [
    {
      "group": "border",
      "name": "subtle",
      "token": "border.subtle",
      "cssVar": "--border-subtle",
      "reference": "{neutral.200}",
      "resolvedValue": "#E4E2E8",
      "darkReference": "{neutral.800}",
      "darkResolvedValue": "#333133",
      "description": "Viền mảnh phân tách nhẹ (card border, divider)"
    },
    {
      "group": "border",
      "name": "default",
      "token": "border.default",
      "cssVar": "--border-default",
      "reference": "{neutral.300}",
      "resolvedValue": "#D1CFD7",
      "darkReference": "{neutral.700}",
      "darkResolvedValue": "#403E42",
      "description": "Viền thành phần tương tác (input, select, button outline)"
    },
    {
      "group": "border",
      "name": "focus",
      "token": "border.focus",
      "cssVar": "--border-focus",
      "reference": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "darkReference": "{teal.300}",
      "darkResolvedValue": "#4FD1BD",
      "description": "Viền khi đang focus hoặc trạng thái được chọn (active/focus ring)"
    }
  ],
  "status": [
    {
      "group": "status",
      "name": "success-bg",
      "token": "status.success-bg",
      "cssVar": "--status-success-bg",
      "reference": "{green.100}",
      "resolvedValue": "#DCFCE7",
      "darkReference": "{green.900}",
      "darkResolvedValue": "#123522",
      "description": "Nền tag/alert trạng thái thành công hoặc đang hoạt động"
    },
    {
      "group": "status",
      "name": "success-fg",
      "token": "status.success-fg",
      "cssVar": "--status-success-fg",
      "reference": "{green.700}",
      "resolvedValue": "#146C34",
      "darkReference": "{green.300}",
      "darkResolvedValue": "#4ADE80",
      "description": "Chữ và icon trạng thái thành công"
    },
    {
      "group": "status",
      "name": "danger-bg",
      "token": "status.danger-bg",
      "cssVar": "--status-danger-bg",
      "reference": "{red.100}",
      "resolvedValue": "#FEE2E2",
      "darkReference": "{red.900}",
      "darkResolvedValue": "#3B1518",
      "description": "Nền tag/alert trạng thái lỗi, nguy hiểm hoặc từ chối truy cập"
    },
    {
      "group": "status",
      "name": "danger-fg",
      "token": "status.danger-fg",
      "cssVar": "--status-danger-fg",
      "reference": "{red.700}",
      "resolvedValue": "#B91C1C",
      "darkReference": "{red.300}",
      "darkResolvedValue": "#F87171",
      "description": "Chữ và icon trạng thái lỗi hoặc cảnh báo đỏ"
    },
    {
      "group": "status",
      "name": "info-bg",
      "token": "status.info-bg",
      "cssVar": "--status-info-bg",
      "reference": "{blue.100}",
      "resolvedValue": "#E0F2FE",
      "darkReference": "{blue.900}",
      "darkResolvedValue": "#0F2D42",
      "description": "Nền tag/alert thông tin hướng dẫn hoặc ghi chú"
    },
    {
      "group": "status",
      "name": "info-fg",
      "token": "status.info-fg",
      "cssVar": "--status-info-fg",
      "reference": "{blue.700}",
      "resolvedValue": "#0369A1",
      "darkReference": "{blue.300}",
      "darkResolvedValue": "#38BDF8",
      "description": "Chữ và icon trạng thái thông tin"
    },
    {
      "group": "status",
      "name": "warning-bg",
      "token": "status.warning-bg",
      "cssVar": "--status-warning-bg",
      "reference": "{amber.100}",
      "resolvedValue": "#FDF1DC",
      "darkReference": "{amber.900}",
      "darkResolvedValue": "#3D2B0D",
      "description": "Nền tag/alert cảnh báo nhẹ hoặc chờ xử lý (pending)"
    },
    {
      "group": "status",
      "name": "warning-fg",
      "token": "status.warning-fg",
      "cssVar": "--status-warning-fg",
      "reference": "{amber.700}",
      "resolvedValue": "#965C0C",
      "darkReference": "{amber.300}",
      "darkResolvedValue": "#F5C469",
      "description": "Chữ và icon trạng thái cảnh báo hoặc chờ xử lý (đạt chuẩn WCAG AA trên warning-bg)"
    }
  ]
};

export const SEMANTIC_SPACINGS: Record<SemanticSpacingGroup, SemanticSpacingToken[]> = {
  "proximity": [
    {
      "group": "proximity",
      "name": "inline",
      "token": "proximity.inline",
      "cssVar": "--space-proximity-inline",
      "reference": "{space.2}",
      "resolvedValue": "8px",
      "description": "Khoảng cách ngang giữa icon và chữ hoặc các nút/pill cạnh nhau trong cùng một cụm"
    },
    {
      "group": "proximity",
      "name": "eyebrow-to-title",
      "token": "proximity.eyebrow-to-title",
      "cssVar": "--space-proximity-eyebrow-to-title",
      "reference": "{space.2}",
      "resolvedValue": "8px",
      "description": "Khoảng cách rất gần giữa nhãn eyebrow/badge trạng thái và tiêu đề ngay bên dưới"
    },
    {
      "group": "proximity",
      "name": "title-to-subtitle",
      "token": "proximity.title-to-subtitle",
      "cssVar": "--space-proximity-title-to-subtitle",
      "reference": "{space.3}",
      "resolvedValue": "12px",
      "description": "Khoảng cách gần giữa tiêu đề chính (h1/h2) và phụ đề/đoạn mô tả đi kèm"
    },
    {
      "group": "proximity",
      "name": "stack-sm",
      "token": "proximity.stack-sm",
      "cssVar": "--space-proximity-stack-sm",
      "reference": "{space.3}",
      "resolvedValue": "12px",
      "description": "Khoảng cách dọc chặt giữa các thành phần con liên quan trực tiếp trong một thẻ"
    },
    {
      "group": "proximity",
      "name": "stack-md",
      "token": "proximity.stack-md",
      "cssVar": "--space-proximity-stack-md",
      "reference": "{space.4}",
      "resolvedValue": "16px",
      "description": "Khoảng cách trung bình giữa các nhóm nội dung trong cùng một khối/panel"
    },
    {
      "group": "proximity",
      "name": "visual-to-copy",
      "token": "proximity.visual-to-copy",
      "cssVar": "--space-proximity-visual-to-copy",
      "reference": "{space.6}",
      "resolvedValue": "24px",
      "mobileReference": "{space.5}",
      "mobileResolvedValue": "20px",
      "description": "Khoảng cách phân nhóm vừa giữa hình minh họa/media và cụm tiêu đề + mô tả"
    },
    {
      "group": "proximity",
      "name": "copy-to-action",
      "token": "proximity.copy-to-action",
      "cssVar": "--space-proximity-copy-to-action",
      "reference": "{space.8}",
      "resolvedValue": "32px",
      "mobileReference": "{space.6}",
      "mobileResolvedValue": "24px",
      "description": "Khoảng cách tách rõ giữa khối nội dung chữ và cụm nút hành động chính (CTA)"
    }
  ],
  "layout": [
    {
      "group": "layout",
      "name": "page-x",
      "token": "layout.page-x",
      "cssVar": "--space-layout-page-x",
      "reference": "{space.6}",
      "resolvedValue": "24px",
      "mobileReference": "{space.4}",
      "mobileResolvedValue": "16px",
      "description": "Khoảng đệm lề ngang hai bên của khung chứa toàn trang"
    },
    {
      "group": "layout",
      "name": "section-gap",
      "token": "layout.section-gap",
      "cssVar": "--space-layout-section-gap",
      "reference": "{space.8}",
      "resolvedValue": "32px",
      "mobileReference": "{space.6}",
      "mobileResolvedValue": "24px",
      "description": "Khoảng cách tách biệt giữa các vùng/section độc lập trên cùng trang"
    },
    {
      "group": "layout",
      "name": "card-padding",
      "token": "layout.card-padding",
      "cssVar": "--space-layout-card-padding",
      "reference": "{space.6}",
      "resolvedValue": "24px",
      "mobileReference": "{space.4}",
      "mobileResolvedValue": "16px",
      "description": "Khoảng đệm bên trong các khối card/panel chuẩn"
    },
    {
      "group": "layout",
      "name": "grid-gap",
      "token": "layout.grid-gap",
      "cssVar": "--space-layout-grid-gap",
      "reference": "{space.4}",
      "resolvedValue": "16px",
      "mobileReference": "{space.3}",
      "mobileResolvedValue": "12px",
      "description": "Khoảng cách giữa các ô trong lưới KPI, lưới thẻ token hoặc danh sách card"
    }
  ]
};

export const SEMANTIC_TYPOGRAPHY: Record<SemanticTypographyGroup, SemanticTypographyToken[]> = {
  "display": [
    {
      "group": "display",
      "name": "brand",
      "token": "display.brand",
      "className": "type-display-brand",
      "value": {
        "fontFamily": "{fontFamilies.display}",
        "fontSize": "{fontSizes.5xl}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.none}",
        "letterSpacing": "{letterSpacings.wide}"
      },
      "resolved": {
        "fontFamily": "Extenda 30 Deca",
        "fontSize": "64px",
        "fontWeight": "400",
        "lineHeight": "100%",
        "letterSpacing": "0.04em"
      },
      "mobileResolved": {
        "fontSize": "40px"
      },
      "description": "Wordmark thương hiệu (THEN-CHOT) hoặc tiêu đề nhận diện siêu hẹp viết in hoa"
    },
    {
      "group": "display",
      "name": "hero",
      "token": "display.hero",
      "className": "type-display-hero",
      "value": {
        "fontFamily": "{fontFamilies.display}",
        "fontSize": "{fontSizes.4xl}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.none}",
        "letterSpacing": "{letterSpacings.wide}"
      },
      "resolved": {
        "fontFamily": "Extenda 30 Deca",
        "fontSize": "48px",
        "fontWeight": "400",
        "lineHeight": "100%",
        "letterSpacing": "0.04em"
      },
      "mobileResolved": {
        "fontSize": "32px"
      },
      "description": "Tiêu đề lớn nhất trên Hero banner, màn hình mở đầu hoặc bảng hiển thị cổng an ninh"
    },
    {
      "group": "display",
      "name": "tagline",
      "token": "display.tagline",
      "className": "type-display-tagline",
      "value": {
        "fontFamily": "{fontFamilies.display}",
        "fontSize": "{fontSizes.xs}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.none}",
        "letterSpacing": "{letterSpacings.widest}"
      },
      "resolved": {
        "fontFamily": "Extenda 30 Deca",
        "fontSize": "12px",
        "fontWeight": "400",
        "lineHeight": "100%",
        "letterSpacing": "0.35em"
      },
      "description": "Khẩu hiệu thương hiệu giãn chữ rộng (ví dụ: THEN CÀI XÓM ẤP đặt trên thanh ngang brand.primary)"
    }
  ],
  "heading": [
    {
      "group": "heading",
      "name": "h1",
      "token": "heading.h1",
      "className": "type-heading-h1",
      "value": {
        "fontFamily": "{fontFamilies.serif}",
        "fontSize": "{fontSizes.3xl}",
        "fontWeight": "{fontWeights.bold}",
        "lineHeight": "{lineHeights.tight}",
        "letterSpacing": "{letterSpacings.tight}"
      },
      "resolved": {
        "fontFamily": "Times New Roman",
        "fontSize": "40px",
        "fontWeight": "700",
        "lineHeight": "120%",
        "letterSpacing": "-0.02em"
      },
      "mobileResolved": {
        "fontSize": "32px"
      },
      "description": "Tiêu đề chính của trang hoặc màn hình (Page title)"
    },
    {
      "group": "heading",
      "name": "h2",
      "token": "heading.h2",
      "className": "type-heading-h2",
      "value": {
        "fontFamily": "{fontFamilies.serif}",
        "fontSize": "{fontSizes.2xl}",
        "fontWeight": "{fontWeights.bold}",
        "lineHeight": "{lineHeights.tight}",
        "letterSpacing": "{letterSpacings.tight}"
      },
      "resolved": {
        "fontFamily": "Times New Roman",
        "fontSize": "32px",
        "fontWeight": "700",
        "lineHeight": "120%",
        "letterSpacing": "-0.02em"
      },
      "mobileResolved": {
        "fontSize": "24px"
      },
      "description": "Tiêu đề phân đoạn lớn trong trang (Section heading)"
    },
    {
      "group": "heading",
      "name": "h3",
      "token": "heading.h3",
      "className": "type-heading-h3",
      "value": {
        "fontFamily": "{fontFamilies.serif}",
        "fontSize": "{fontSizes.xl}",
        "fontWeight": "{fontWeights.bold}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Times New Roman",
        "fontSize": "24px",
        "fontWeight": "700",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "mobileResolved": {
        "fontSize": "20px"
      },
      "description": "Tiêu đề nhóm con hoặc tiêu đề thẻ (Card title, Subsection)"
    },
    {
      "group": "heading",
      "name": "subtitle",
      "token": "heading.subtitle",
      "className": "type-heading-subtitle",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.base}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "16px",
        "fontWeight": "400",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "mobileResolved": {
        "fontSize": "14px"
      },
      "description": "Phụ đề hoặc mô tả giải thích đi ngay bên dưới tiêu đề (co giãn 16px desktop -> 14px mobile)"
    }
  ],
  "body": [
    {
      "group": "body",
      "name": "lg",
      "token": "body.lg",
      "className": "type-body-lg",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.lg}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "20px",
        "fontWeight": "400",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "mobileResolved": {
        "fontSize": "16px"
      },
      "description": "Đoạn mở đầu (Lead paragraph) hoặc nội dung tóm tắt nổi bật"
    },
    {
      "group": "body",
      "name": "base",
      "token": "body.base",
      "className": "type-body-base",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.base}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "16px",
        "fontWeight": "400",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "description": "Văn bản đọc mặc định cho nội dung giao diện và mô tả"
    },
    {
      "group": "body",
      "name": "sm",
      "token": "body.sm",
      "className": "type-body-sm",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.sm}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "14px",
        "fontWeight": "400",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "description": "Văn bản nội dung phụ trong card nhỏ, bảng nhật ký ra/vào hoặc mô tả ngắn"
    }
  ],
  "label": [
    {
      "group": "label",
      "name": "eyebrow",
      "token": "label.eyebrow",
      "className": "type-label-eyebrow",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.xs}",
        "fontWeight": "{fontWeights.bold}",
        "lineHeight": "{lineHeights.none}",
        "letterSpacing": "{letterSpacings.wide}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "12px",
        "fontWeight": "700",
        "lineHeight": "100%",
        "letterSpacing": "0.04em"
      },
      "description": "Nhãn phân loại hoặc chỉ dẫn nhỏ đặt sát phía trên tiêu đề (eyebrow label)"
    },
    {
      "group": "label",
      "name": "base",
      "token": "label.base",
      "className": "type-label-base",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.sm}",
        "fontWeight": "{fontWeights.bold}",
        "lineHeight": "{lineHeights.none}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "14px",
        "fontWeight": "700",
        "lineHeight": "100%",
        "letterSpacing": "0em"
      },
      "description": "Chữ trong nút bấm (Button), nhãn form (Input label), tab, badge"
    },
    {
      "group": "label",
      "name": "caption",
      "token": "label.caption",
      "className": "type-label-caption",
      "value": {
        "fontFamily": "{fontFamilies.sans}",
        "fontSize": "{fontSizes.xs}",
        "fontWeight": "{fontWeights.regular}",
        "lineHeight": "{lineHeights.normal}",
        "letterSpacing": "{letterSpacings.normal}"
      },
      "resolved": {
        "fontFamily": "Arial",
        "fontSize": "12px",
        "fontWeight": "400",
        "lineHeight": "150%",
        "letterSpacing": "0em"
      },
      "description": "Chú thích ảnh, thời gian quẹt thẻ, metadata, dòng bản quyền footer"
    }
  ]
};

export const COMPONENT_TOKENS: Record<ComponentTokenGroup, ComponentToken[]> = {
  "button": [
    {
      "group": "button",
      "name": "primary-bg",
      "token": "button.primary-bg",
      "cssVar": "--comp-button-primary-bg",
      "reference": "{brand.primary}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Nền nút hành động chính (Ví dụ: Mở barie)"
    },
    {
      "group": "button",
      "name": "primary-bg-hover",
      "token": "button.primary-bg-hover",
      "cssVar": "--comp-button-primary-bg-hover",
      "reference": "{brand.primary-hover}",
      "primitiveRef": "{teal.700}",
      "resolvedValue": "#095A4E",
      "type": "color",
      "description": "Nền nút chính khi di chuột hoặc nhấn giữ"
    },
    {
      "group": "button",
      "name": "primary-fg",
      "token": "button.primary-fg",
      "cssVar": "--comp-button-primary-fg",
      "reference": "{text.on-brand}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Chữ và icon trên nút chính"
    },
    {
      "group": "button",
      "name": "accent-bg",
      "token": "button.accent-bg",
      "cssVar": "--comp-button-accent-bg",
      "reference": "{brand.accent}",
      "primitiveRef": "{amber.500}",
      "resolvedValue": "#E8A33D",
      "type": "color",
      "description": "Nền nút nhấn phụ (Ví dụ: Chế độ kiểm tra)"
    },
    {
      "group": "button",
      "name": "accent-bg-hover",
      "token": "button.accent-bg-hover",
      "cssVar": "--comp-button-accent-bg-hover",
      "reference": "{brand.accent-hover}",
      "primitiveRef": "{amber.600}",
      "resolvedValue": "#CF8A23",
      "type": "color",
      "description": "Nền nút nhấn phụ khi di chuột"
    },
    {
      "group": "button",
      "name": "accent-fg",
      "token": "button.accent-fg",
      "cssVar": "--comp-button-accent-fg",
      "reference": "{text.on-accent}",
      "primitiveRef": "{neutral.900}",
      "resolvedValue": "#292727",
      "type": "color",
      "description": "Chữ và icon trên nút nhấn phụ"
    },
    {
      "group": "button",
      "name": "outline-bg",
      "token": "button.outline-bg",
      "cssVar": "--comp-button-outline-bg",
      "reference": "{surface.default}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Nền nút viền mặc định"
    },
    {
      "group": "button",
      "name": "outline-fg",
      "token": "button.outline-fg",
      "cssVar": "--comp-button-outline-fg",
      "reference": "{text.primary}",
      "primitiveRef": "{neutral.900}",
      "resolvedValue": "#292727",
      "type": "color",
      "description": "Chữ trên nút viền mặc định"
    },
    {
      "group": "button",
      "name": "outline-border",
      "token": "button.outline-border",
      "cssVar": "--comp-button-outline-border",
      "reference": "{border.default}",
      "primitiveRef": "{neutral.300}",
      "resolvedValue": "#D1CFD7",
      "type": "color",
      "description": "Viền nút phụ dạng outline"
    },
    {
      "group": "button",
      "name": "danger-bg",
      "token": "button.danger-bg",
      "cssVar": "--comp-button-danger-bg",
      "reference": "{status.danger-bg}",
      "primitiveRef": "{red.100}",
      "resolvedValue": "#FEE2E2",
      "type": "color",
      "description": "Nền nút cảnh báo / khóa cổng khẩn"
    },
    {
      "group": "button",
      "name": "danger-fg",
      "token": "button.danger-fg",
      "cssVar": "--comp-button-danger-fg",
      "reference": "{status.danger-fg}",
      "primitiveRef": "{red.700}",
      "resolvedValue": "#B91C1C",
      "type": "color",
      "description": "Chữ và icon trên nút cảnh báo"
    },
    {
      "group": "button",
      "name": "radius",
      "token": "button.radius",
      "cssVar": "--comp-button-radius",
      "reference": "{borderRadius.md}",
      "primitiveRef": "{borderRadius.md}",
      "resolvedValue": "4px",
      "type": "borderRadius",
      "description": "Bo góc chuẩn của nút bấm"
    },
    {
      "group": "button",
      "name": "padding-x",
      "token": "button.padding-x",
      "cssVar": "--comp-button-padding-x",
      "reference": "{space.4}",
      "primitiveRef": "{space.4}",
      "resolvedValue": "16px",
      "type": "space",
      "description": "Khoảng đệm ngang bên trong nút"
    },
    {
      "group": "button",
      "name": "padding-y",
      "token": "button.padding-y",
      "cssVar": "--comp-button-padding-y",
      "reference": "{space.3}",
      "primitiveRef": "{space.3}",
      "resolvedValue": "12px",
      "type": "space",
      "description": "Khoảng đệm dọc bên trong nút"
    },
    {
      "group": "button",
      "name": "focus-ring",
      "token": "button.focus-ring",
      "cssVar": "--comp-button-focus-ring",
      "reference": "{border.focus}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Viền focus truy cập bàn phím cho nút bấm"
    }
  ],
  "badge": [
    {
      "group": "badge",
      "name": "success-bg",
      "token": "badge.success-bg",
      "cssVar": "--comp-badge-success-bg",
      "reference": "{status.success-bg}",
      "primitiveRef": "{green.100}",
      "resolvedValue": "#DCFCE7",
      "type": "color",
      "description": "Nền nhãn trạng thái cho phép / hoạt động"
    },
    {
      "group": "badge",
      "name": "success-fg",
      "token": "badge.success-fg",
      "cssVar": "--comp-badge-success-fg",
      "reference": "{status.success-fg}",
      "primitiveRef": "{green.700}",
      "resolvedValue": "#146C34",
      "type": "color",
      "description": "Chữ nhãn trạng thái cho phép / hoạt động"
    },
    {
      "group": "badge",
      "name": "warning-bg",
      "token": "badge.warning-bg",
      "cssVar": "--comp-badge-warning-bg",
      "reference": "{status.warning-bg}",
      "primitiveRef": "{amber.100}",
      "resolvedValue": "#FDF1DC",
      "type": "color",
      "description": "Nền nhãn trạng thái chờ duyệt / cảnh báo nhẹ"
    },
    {
      "group": "badge",
      "name": "warning-fg",
      "token": "badge.warning-fg",
      "cssVar": "--comp-badge-warning-fg",
      "reference": "{status.warning-fg}",
      "primitiveRef": "{amber.700}",
      "resolvedValue": "#965C0C",
      "type": "color",
      "description": "Chữ nhãn trạng thái chờ duyệt / cảnh báo nhẹ"
    },
    {
      "group": "badge",
      "name": "danger-bg",
      "token": "badge.danger-bg",
      "cssVar": "--comp-badge-danger-bg",
      "reference": "{status.danger-bg}",
      "primitiveRef": "{red.100}",
      "resolvedValue": "#FEE2E2",
      "type": "color",
      "description": "Nền nhãn trạng thái từ chối / lỗi"
    },
    {
      "group": "badge",
      "name": "danger-fg",
      "token": "badge.danger-fg",
      "cssVar": "--comp-badge-danger-fg",
      "reference": "{status.danger-fg}",
      "primitiveRef": "{red.700}",
      "resolvedValue": "#B91C1C",
      "type": "color",
      "description": "Chữ nhãn trạng thái từ chối / lỗi"
    },
    {
      "group": "badge",
      "name": "info-bg",
      "token": "badge.info-bg",
      "cssVar": "--comp-badge-info-bg",
      "reference": "{status.info-bg}",
      "primitiveRef": "{blue.100}",
      "resolvedValue": "#E0F2FE",
      "type": "color",
      "description": "Nền nhãn trạng thái khách / thông tin"
    },
    {
      "group": "badge",
      "name": "info-fg",
      "token": "badge.info-fg",
      "cssVar": "--comp-badge-info-fg",
      "reference": "{status.info-fg}",
      "primitiveRef": "{blue.700}",
      "resolvedValue": "#0369A1",
      "type": "color",
      "description": "Chữ nhãn trạng thái khách / thông tin"
    },
    {
      "group": "badge",
      "name": "brand-bg",
      "token": "badge.brand-bg",
      "cssVar": "--comp-badge-brand-bg",
      "reference": "{brand.primary-subtle}",
      "primitiveRef": "{teal.100}",
      "resolvedValue": "#D9F2ED",
      "type": "color",
      "description": "Nền nhãn thương hiệu nhẹ"
    },
    {
      "group": "badge",
      "name": "brand-fg",
      "token": "badge.brand-fg",
      "cssVar": "--comp-badge-brand-fg",
      "reference": "{text.brand}",
      "primitiveRef": "{teal.700}",
      "resolvedValue": "#095A4E",
      "type": "color",
      "description": "Chữ nhãn thương hiệu"
    },
    {
      "group": "badge",
      "name": "radius",
      "token": "badge.radius",
      "cssVar": "--comp-badge-radius",
      "reference": "{borderRadius.sm}",
      "primitiveRef": "{borderRadius.sm}",
      "resolvedValue": "2px",
      "type": "borderRadius",
      "description": "Bo góc sắc cạnh cho nhãn trạng thái"
    }
  ],
  "input": [
    {
      "group": "input",
      "name": "bg",
      "token": "input.bg",
      "cssVar": "--comp-input-bg",
      "reference": "{surface.default}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Nền ô nhập liệu và select"
    },
    {
      "group": "input",
      "name": "fg",
      "token": "input.fg",
      "cssVar": "--comp-input-fg",
      "reference": "{text.primary}",
      "primitiveRef": "{neutral.900}",
      "resolvedValue": "#292727",
      "type": "color",
      "description": "Chữ nhập trong ô form"
    },
    {
      "group": "input",
      "name": "placeholder",
      "token": "input.placeholder",
      "cssVar": "--comp-input-placeholder",
      "reference": "{text.muted}",
      "primitiveRef": "{neutral.500}",
      "resolvedValue": "#6E6B73",
      "type": "color",
      "description": "Chữ gợi ý placeholder khi chưa nhập"
    },
    {
      "group": "input",
      "name": "border",
      "token": "input.border",
      "cssVar": "--comp-input-border",
      "reference": "{border.default}",
      "primitiveRef": "{neutral.300}",
      "resolvedValue": "#D1CFD7",
      "type": "color",
      "description": "Viền mặc định của ô nhập liệu"
    },
    {
      "group": "input",
      "name": "border-focus",
      "token": "input.border-focus",
      "cssVar": "--comp-input-border-focus",
      "reference": "{border.focus}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Viền khi ô nhập liệu đang được focus"
    },
    {
      "group": "input",
      "name": "radius",
      "token": "input.radius",
      "cssVar": "--comp-input-radius",
      "reference": "{borderRadius.md}",
      "primitiveRef": "{borderRadius.md}",
      "resolvedValue": "4px",
      "type": "borderRadius",
      "description": "Bo góc ô nhập liệu"
    },
    {
      "group": "input",
      "name": "padding-x",
      "token": "input.padding-x",
      "cssVar": "--comp-input-padding-x",
      "reference": "{space.3}",
      "primitiveRef": "{space.3}",
      "resolvedValue": "12px",
      "type": "space",
      "description": "Khoảng đệm ngang trong ô nhập liệu"
    },
    {
      "group": "input",
      "name": "padding-y",
      "token": "input.padding-y",
      "cssVar": "--comp-input-padding-y",
      "reference": "{space.2}",
      "primitiveRef": "{space.2}",
      "resolvedValue": "8px",
      "type": "space",
      "description": "Khoảng đệm dọc trong ô nhập liệu"
    }
  ],
  "card": [
    {
      "group": "card",
      "name": "bg",
      "token": "card.bg",
      "cssVar": "--comp-card-bg",
      "reference": "{surface.default}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Nền khối card chính"
    },
    {
      "group": "card",
      "name": "bg-subtle",
      "token": "card.bg-subtle",
      "cssVar": "--comp-card-bg-subtle",
      "reference": "{surface.canvas}",
      "primitiveRef": "{neutral.50}",
      "resolvedValue": "#F8F7FA",
      "type": "color",
      "description": "Nền card lồng hoặc hộp điều khiển phụ"
    },
    {
      "group": "card",
      "name": "border",
      "token": "card.border",
      "cssVar": "--comp-card-border",
      "reference": "{border.subtle}",
      "primitiveRef": "{neutral.200}",
      "resolvedValue": "#E4E2E8",
      "type": "color",
      "description": "Viền mảnh phân tách card"
    },
    {
      "group": "card",
      "name": "accent-top",
      "token": "card.accent-top",
      "cssVar": "--comp-card-accent-top",
      "reference": "{brand.accent}",
      "primitiveRef": "{amber.500}",
      "resolvedValue": "#E8A33D",
      "type": "color",
      "description": "Thanh nhấn màu vàng hổ phách cho card nổi bật"
    },
    {
      "group": "card",
      "name": "accent-primary",
      "token": "card.accent-primary",
      "cssVar": "--comp-card-accent-primary",
      "reference": "{brand.primary}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Thanh nhấn màu thương hiệu chính cho panel chính"
    },
    {
      "group": "card",
      "name": "radius",
      "token": "card.radius",
      "cssVar": "--comp-card-radius",
      "reference": "{borderRadius.md}",
      "primitiveRef": "{borderRadius.md}",
      "resolvedValue": "4px",
      "type": "borderRadius",
      "description": "Bo góc chuẩn của card"
    },
    {
      "group": "card",
      "name": "padding",
      "token": "card.padding",
      "cssVar": "--comp-card-padding",
      "reference": "{space.6}",
      "primitiveRef": "{space.6}",
      "resolvedValue": "24px",
      "type": "space",
      "description": "Khoảng đệm nội dung trong card"
    }
  ],
  "table": [
    {
      "group": "table",
      "name": "header-bg",
      "token": "table.header-bg",
      "cssVar": "--comp-table-header-bg",
      "reference": "{surface.muted}",
      "primitiveRef": "{neutral.100}",
      "resolvedValue": "#F1F0F4",
      "type": "color",
      "description": "Nền tiêu đề cột bảng dữ liệu"
    },
    {
      "group": "table",
      "name": "header-fg",
      "token": "table.header-fg",
      "cssVar": "--comp-table-header-fg",
      "reference": "{text.primary}",
      "primitiveRef": "{neutral.900}",
      "resolvedValue": "#292727",
      "type": "color",
      "description": "Chữ tiêu đề cột bảng dữ liệu"
    },
    {
      "group": "table",
      "name": "row-bg",
      "token": "table.row-bg",
      "cssVar": "--comp-table-row-bg",
      "reference": "{surface.default}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Nền mặc định của từng dòng dữ liệu"
    },
    {
      "group": "table",
      "name": "row-hover-bg",
      "token": "table.row-hover-bg",
      "cssVar": "--comp-table-row-hover-bg",
      "reference": "{surface.canvas}",
      "primitiveRef": "{neutral.50}",
      "resolvedValue": "#F8F7FA",
      "type": "color",
      "description": "Nền dòng bảng khi di chuột qua"
    },
    {
      "group": "table",
      "name": "border",
      "token": "table.border",
      "cssVar": "--comp-table-border",
      "reference": "{border.subtle}",
      "primitiveRef": "{neutral.200}",
      "resolvedValue": "#E4E2E8",
      "type": "color",
      "description": "Đường kẻ phân tách giữa các dòng bảng"
    },
    {
      "group": "table",
      "name": "radius",
      "token": "table.radius",
      "cssVar": "--comp-table-radius",
      "reference": "{borderRadius.sm}",
      "primitiveRef": "{borderRadius.sm}",
      "resolvedValue": "2px",
      "type": "borderRadius",
      "description": "Bo góc khung bao bảng"
    }
  ],
  "expand-card": [
    {
      "group": "expand-card",
      "name": "bg",
      "token": "expand-card.bg",
      "cssVar": "--comp-expand-card-bg",
      "reference": "{surface.default}",
      "primitiveRef": "{neutral.0}",
      "resolvedValue": "#FFFFFF",
      "type": "color",
      "description": "Nền khung tổng thể và phần nội dung khi mở rộng của Expand Card"
    },
    {
      "group": "expand-card",
      "name": "header-bg",
      "token": "expand-card.header-bg",
      "cssVar": "--comp-expand-card-header-bg",
      "reference": "{brand.primary-subtle}",
      "primitiveRef": "{teal.100}",
      "resolvedValue": "#D9F2ED",
      "type": "color",
      "description": "Nền thanh tiêu đề nhấn nhẹ (teal-100) của Expand Card"
    },
    {
      "group": "expand-card",
      "name": "header-fg",
      "token": "expand-card.header-fg",
      "cssVar": "--comp-expand-card-header-fg",
      "reference": "{text.primary}",
      "primitiveRef": "{neutral.900}",
      "resolvedValue": "#292727",
      "type": "color",
      "description": "Màu tiêu đề chính và icon mũi tên đóng/mở"
    },
    {
      "group": "expand-card",
      "name": "header-meta-fg",
      "token": "expand-card.header-meta-fg",
      "cssVar": "--comp-expand-card-header-meta-fg",
      "reference": "{text.body}",
      "primitiveRef": "{neutral.700}",
      "resolvedValue": "#403E42",
      "type": "color",
      "description": "Màu đường dẫn gợi ý và số lượng mục trên thanh tiêu đề"
    },
    {
      "group": "expand-card",
      "name": "border",
      "token": "expand-card.border",
      "cssVar": "--comp-expand-card-border",
      "reference": "{border.default}",
      "primitiveRef": "{neutral.300}",
      "resolvedValue": "#D1CFD7",
      "type": "color",
      "description": "Viền ngoài bao quanh toàn bộ Expand Card"
    },
    {
      "group": "expand-card",
      "name": "divider",
      "token": "expand-card.divider",
      "cssVar": "--comp-expand-card-divider",
      "reference": "{border.subtle}",
      "primitiveRef": "{neutral.200}",
      "resolvedValue": "#E4E2E8",
      "type": "color",
      "description": "Đường phân cách giữa thanh tiêu đề và phần nội dung mở rộng"
    },
    {
      "group": "expand-card",
      "name": "accent-subtle",
      "token": "expand-card.accent-subtle",
      "cssVar": "--comp-expand-card-accent-subtle",
      "reference": "{brand.primary-subtle}",
      "primitiveRef": "{teal.100}",
      "resolvedValue": "#D9F2ED",
      "type": "color",
      "description": "Thanh nhấn trái và badge cấp độ nhẹ (tone teal-100 — Primitives)"
    },
    {
      "group": "expand-card",
      "name": "accent-primary",
      "token": "expand-card.accent-primary",
      "cssVar": "--comp-expand-card-accent-primary",
      "reference": "{brand.primary}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Thanh nhấn trái và badge cấp độ trung bình (tone teal-500 — Semantic)"
    },
    {
      "group": "expand-card",
      "name": "accent-strong",
      "token": "expand-card.accent-strong",
      "cssVar": "--comp-expand-card-accent-strong",
      "reference": "{brand.primary-hover}",
      "primitiveRef": "{teal.700}",
      "resolvedValue": "#095A4E",
      "type": "color",
      "description": "Thanh nhấn trái và badge cấp độ đậm (tone teal-700 — Components)"
    },
    {
      "group": "expand-card",
      "name": "accent-width",
      "token": "expand-card.accent-width",
      "cssVar": "--comp-expand-card-accent-width",
      "reference": "{borderWidth.4}",
      "primitiveRef": "{borderWidth.4}",
      "resolvedValue": "4px",
      "type": "borderWidth",
      "description": "Độ dày thanh nhấn dọc bên trái Expand Card"
    },
    {
      "group": "expand-card",
      "name": "focus-ring",
      "token": "expand-card.focus-ring",
      "cssVar": "--comp-expand-card-focus-ring",
      "reference": "{border.focus}",
      "primitiveRef": "{teal.500}",
      "resolvedValue": "#0E7C6B",
      "type": "color",
      "description": "Viền focus truy cập bàn phím cho nút đóng/mở Expand Card"
    },
    {
      "group": "expand-card",
      "name": "radius",
      "token": "expand-card.radius",
      "cssVar": "--comp-expand-card-radius",
      "reference": "{borderRadius.md}",
      "primitiveRef": "{borderRadius.md}",
      "resolvedValue": "4px",
      "type": "borderRadius",
      "description": "Bo góc chuẩn của Expand Card"
    },
    {
      "group": "expand-card",
      "name": "header-padding-y",
      "token": "expand-card.header-padding-y",
      "cssVar": "--comp-expand-card-header-padding-y",
      "reference": "{space.3}",
      "primitiveRef": "{space.3}",
      "resolvedValue": "12px",
      "type": "space",
      "description": "Khoảng đệm dọc bên trong thanh tiêu đề Expand Card"
    },
    {
      "group": "expand-card",
      "name": "header-padding-x",
      "token": "expand-card.header-padding-x",
      "cssVar": "--comp-expand-card-header-padding-x",
      "reference": "{space.4}",
      "primitiveRef": "{space.4}",
      "resolvedValue": "16px",
      "type": "space",
      "description": "Khoảng đệm ngang bên trong thanh tiêu đề Expand Card"
    },
    {
      "group": "expand-card",
      "name": "body-padding",
      "token": "expand-card.body-padding",
      "cssVar": "--comp-expand-card-body-padding",
      "reference": "{space.5}",
      "primitiveRef": "{space.5}",
      "resolvedValue": "20px",
      "type": "space",
      "description": "Khoảng đệm nội dung bên trong phần thân khi mở rộng"
    }
  ]
};
