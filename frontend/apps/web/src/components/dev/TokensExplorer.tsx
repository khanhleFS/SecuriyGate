"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Copy,
  Folder,
  Layers,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  COMPONENT_TOKENS,
  PRIMITIVE_BORDER_RADIUS,
  PRIMITIVE_BORDER_WIDTHS,
  PRIMITIVE_BREAKPOINTS,
  PRIMITIVE_COLORS,
  PRIMITIVE_SPACINGS,
  PRIMITIVE_TYPOGRAPHY,
  SEMANTIC_COLORS,
  SEMANTIC_SPACINGS,
  SEMANTIC_TYPOGRAPHY,
  type ComponentToken,
  type SemanticColorGroup,
  type SemanticColorToken,
  type SemanticSpacingGroup,
  type SemanticSpacingToken,
  type SemanticTypographyGroup,
} from "@/generated/tokens-data";
import { BrandFooter, BrandLogo, BrandLogoText } from "@/components/brand";
import {
  StatusScreen,
  type StatusIllustrationVariant,
} from "@/components/status";
import {
  ThemeToggle,
  THEME_CHANGE_EVENT,
  type ThemeMode,
} from "@/components/theme";
import { AccordionCard, type AccordionTone } from "./AccordionCard";

type ActiveTier = "primitives" | "semantic" | "components";

const TIER_TABS: ReadonlyArray<{ id: ActiveTier; label: string }> = [
  { id: "primitives", label: "Primitives" },
  { id: "semantic", label: "Semantic" },
  { id: "components", label: "Components" },
];

const TIER_CARD_IDS: Record<ActiveTier, readonly string[]> = {
  primitives: [
    "prim-colors",
    "prim-typo",
    "prim-space",
    "prim-radius",
    "prim-border",
    "prim-breakpoints",
  ],
  semantic: [
    "sem-brand",
    "sem-surface",
    "sem-text",
    "sem-border",
    "sem-status",
    "sem-spacings",
    "sem-typo",
  ],
  components: [
    "comp-brand",
    "comp-button",
    "comp-badge",
    "comp-input",
    "comp-card-table",
    "comp-expand-card",
    "comp-status-visual",
  ],
};

const SEMANTIC_COLOR_CARDS: ReadonlyArray<{
  id: string;
  group: SemanticColorGroup;
  badge: string;
  title: string;
}> = [
  {
    id: "sem-brand",
    group: "brand",
    badge: "BRAND",
    title: "Brand",
  },
  {
    id: "sem-surface",
    group: "surface",
    badge: "SURFACE",
    title: "Surface",
  },
  {
    id: "sem-text",
    group: "text",
    badge: "TEXT",
    title: "Text",
  },
  {
    id: "sem-border",
    group: "border",
    badge: "BORDER",
    title: "Border",
  },
  {
    id: "sem-status",
    group: "status",
    badge: "STATUS",
    title: "Status",
  },
];

const SEMANTIC_TYPO_GROUP_LABELS: Record<SemanticTypographyGroup, string> = {
  display: "Display (Extenda 30 Deca)",
  heading: "Heading (Times New Roman Bold)",
  body: "Body (Arial Regular)",
  label: "Label & Caption (Arial)",
};

const SEMANTIC_SPACING_GROUP_LABELS: Record<SemanticSpacingGroup, string> = {
  proximity: "Proximity (Khoảng cách theo độ gắn kết chữ & nhóm)",
  layout: "Layout (Khoảng đệm trang, section, card & lưới)",
};

const SEMANTIC_TEXT_PREVIEWS: Record<
  string,
  { bgCssVar: string; bgLabel: string }
> = {
  primary: { bgCssVar: "--surface-default", bgLabel: "surface.default" },
  body: { bgCssVar: "--surface-default", bgLabel: "surface.default" },
  muted: { bgCssVar: "--surface-default", bgLabel: "surface.default" },
  inverse: { bgCssVar: "--surface-inverse", bgLabel: "surface.inverse" },
  "on-brand": { bgCssVar: "--brand-primary", bgLabel: "brand.primary" },
  "on-accent": { bgCssVar: "--brand-accent", bgLabel: "brand.accent" },
  brand: {
    bgCssVar: "--brand-primary-subtle",
    bgLabel: "brand.primary-subtle",
  },
};

const SEMANTIC_BORDER_PREVIEWS: Record<
  string,
  { sampleLabel: string; styleTag: string; isFocus?: boolean }
> = {
  subtle: { sampleLabel: "Khung thẻ / Đường phân cách", styleTag: "1px solid" },
  default: { sampleLabel: "Khung ô nhập / Nút viền", styleTag: "1px solid" },
  focus: {
    sampleLabel: "Trạng thái đang chọn / Focus",
    styleTag: "2px focus",
    isFocus: true,
  },
};

const DEMO_SAMPLE_LOGS = [
  {
    plate: "51H-829.41",
    lane: "Cổng A - Làn vào",
    method: "RFID + ALPR 99.4%",
    status: "Cho phép",
    badgeClass: "badge-success",
  },
  {
    plate: "29A-603.77",
    lane: "Cổng A - Làn vào",
    method: "OCR 71.2% • Xác minh",
    status: "Chờ duyệt",
    badgeClass: "badge-warning",
  },
  {
    plate: "59X3-991.24",
    lane: "Cổng B - Xe máy",
    method: "RFID Hết hạn",
    status: "Từ chối",
    badgeClass: "badge-danger",
  },
];

function matchesSearch(
  normalizedQuery: string,
  ...fields: Array<string | undefined>
): boolean {
  if (!normalizedQuery) return true;
  return fields.some(
    (field) =>
      typeof field === "string" &&
      field.toLowerCase().includes(normalizedQuery)
  );
}

export function TokensExplorer() {
  const [activeTier, setActiveTier] = useState<ActiveTier>("primitives");
  const [openTiers, setOpenTiers] = useState<Record<ActiveTier, boolean>>({
    primitives: true,
    semantic: true,
    components: true,
  });
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedVar, setCopiedVar] = useState<string>("");
  const [demoPlateInput, setDemoPlateInput] = useState<string>("51H-829.41");
  const [demoGateSelect, setDemoGateSelect] = useState<string>(
    "Cổng A - Làn xe vào"
  );
  const [demoFilterState, setDemoFilterState] = useState<string>("Tất cả");
  const [demoActionMessage, setDemoActionMessage] = useState<string>(
    "Chưa có thao tác — thử bấm một nút bên trên"
  );
  const [demoExpandCards, setDemoExpandCards] = useState<
    Record<string, boolean>
  >({
    "demo-exp-100": false,
    "demo-exp-500": true,
    "demo-exp-700": false,
  });

  const toggleDemoExpandCard = (id: string) => {
    setDemoExpandCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const [demoStatusVariant, setDemoStatusVariant] =
    useState<StatusIllustrationVariant>("status-code");
  const [demoStatusCode, setDemoStatusCode] = useState<string>("404");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const syncTheme = (event?: Event) => {
      const detail = (event as CustomEvent<ThemeMode> | undefined)?.detail;
      if (detail === "light" || detail === "dark") {
        setThemeMode(detail);
      } else {
        setThemeMode(
          document.documentElement.dataset.theme === "dark" ? "dark" : "light"
        );
      }
    };
    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
  }, []);

  const toggleTier = (tier: ActiveTier) => {
    setOpenTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  const toggleCard = (id: string) => {
    setOpenCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExpandAll = () => {
    setOpenTiers((prev) => ({ ...prev, [activeTier]: true }));
    setOpenCards((prev) => {
      const next = { ...prev };
      for (const id of TIER_CARD_IDS[activeTier]) {
        next[id] = true;
      }
      return next;
    });
  };

  const handleCollapseAll = () => {
    setOpenCards((prev) => {
      const next = { ...prev };
      for (const id of TIER_CARD_IDS[activeTier]) {
        delete next[id];
      }
      return next;
    });
  };

  const handleCopyToken = async (cssVarOrClass: string) => {
    setCopiedVar(cssVarOrClass);
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cssVarOrClass);
      }
    } catch {
      // Clipboard API may be unavailable on non-HTTPS origins or restricted contexts
    }
  };

  const primitiveColorCount = PRIMITIVE_COLORS.reduce(
    (sum, g) => sum + g.shades.length,
    0
  );
  const primitiveTypoCount =
    PRIMITIVE_TYPOGRAPHY.fontFamilies.length +
    PRIMITIVE_TYPOGRAPHY.fontSizes.length +
    PRIMITIVE_TYPOGRAPHY.fontWeights.length +
    PRIMITIVE_TYPOGRAPHY.lineHeights.length +
    PRIMITIVE_TYPOGRAPHY.letterSpacings.length;
  const totalPrimitivesCount =
    primitiveColorCount +
    primitiveTypoCount +
    PRIMITIVE_SPACINGS.length +
    PRIMITIVE_BORDER_RADIUS.length +
    PRIMITIVE_BORDER_WIDTHS.length +
    PRIMITIVE_BREAKPOINTS.length;

  const semanticColorCount = (
    Object.values(SEMANTIC_COLORS) as SemanticColorToken[][]
  ).reduce((sum, list) => sum + list.length, 0);
  const semanticSpacingCount = (
    Object.values(SEMANTIC_SPACINGS) as SemanticSpacingToken[][]
  ).reduce((sum, list) => sum + list.length, 0);
  const semanticTypoCount = Object.values(SEMANTIC_TYPOGRAPHY).reduce(
    (sum, list) => sum + list.length,
    0
  );
  const totalSemanticCount =
    semanticColorCount + semanticSpacingCount + semanticTypoCount;

  const totalComponentCount = Object.values(COMPONENT_TOKENS).reduce(
    (sum, list) => sum + list.length,
    0
  );

  const tierConfig: Record<
    ActiveTier,
    { label: string; folderPath: string; countLabel: string; tone: AccordionTone }
  > = {
    primitives: {
      label: "Primitives",
      folderPath: "frontend/tokens/primitives/*.json",
      countLabel: `${totalPrimitivesCount} tokens`,
      tone: "teal-100",
    },
    semantic: {
      label: "Semantic",
      folderPath: "frontend/tokens/semantic/*.json",
      countLabel: `${totalSemanticCount} tokens`,
      tone: "teal-500",
    },
    components: {
      label: "Components",
      folderPath: "frontend/tokens/components/*.json",
      countLabel: `${totalComponentCount} tokens + 4 assets`,
      tone: "teal-700",
    },
  };

  const currentTierMeta = tierConfig[activeTier];

  const renderSemanticColorGrid = (items: SemanticColorToken[]) => (
    <div className="semantic-group-grid">
      {items.map((item) => {
        const isTextGroup = item.group === "text";
        const isBorderGroup = item.group === "border";
        const textPreview = SEMANTIC_TEXT_PREVIEWS[item.name] ?? {
          bgCssVar: "--surface-default",
          bgLabel: "surface.default",
        };
        const borderPreview = SEMANTIC_BORDER_PREVIEWS[item.name] ?? {
          sampleLabel: "Khung viền mẫu",
          styleTag: "1px solid",
        };

        const activeRef =
          themeMode === "dark" ? item.darkReference : item.reference;
        const activeVal =
          themeMode === "dark" ? item.darkResolvedValue : item.resolvedValue;
        const altLabel = themeMode === "dark" ? "Light" : "Dark";
        const altRef =
          themeMode === "dark" ? item.reference : item.darkReference;
        const altVal =
          themeMode === "dark" ? item.resolvedValue : item.darkResolvedValue;

        return (
          <div key={item.token} className="semantic-color-card">
            <div className="semantic-card-head">
              {isTextGroup ? (
                <div
                  className="semantic-chip semantic-chip--text"
                  style={{
                    backgroundColor: `var(${textPreview.bgCssVar})`,
                    color: `var(${item.cssVar})`,
                  }}
                  aria-hidden="true"
                >
                  Aa
                </div>
              ) : isBorderGroup ? (
                <div
                  className={`semantic-chip semantic-chip--border ${
                    borderPreview.isFocus ? "semantic-chip--border-focus" : ""
                  }`}
                  style={{ borderColor: `var(${item.cssVar})` }}
                  aria-hidden="true"
                />
              ) : (
                <div
                  className="semantic-chip"
                  style={{ backgroundColor: `var(${item.cssVar})` }}
                />
              )}

              <div className="semantic-card-title-group">
                <div className="semantic-card-title-row">
                  <span className="type-label-base">{item.token}</span>
                  {isTextGroup && (
                    <span className="semantic-title-context">
                      • {textPreview.bgLabel}
                    </span>
                  )}
                </div>
                <div className="chain-row">
                  <span className="chain-pill">{activeRef}</span>
                  <ArrowRight size={13} aria-hidden="true" />
                  <span className="chain-pill">{activeVal}</span>
                </div>
                <div className="theme-mode-hint type-label-caption">
                  {altLabel}: {altRef} • {altVal}
                </div>
              </div>
            </div>

            {isBorderGroup && (
              <div
                className={`semantic-border-stage ${
                  borderPreview.isFocus ? "semantic-border-stage--focus" : ""
                }`}
                style={{
                  borderColor: `var(${item.cssVar})`,
                  borderWidth: borderPreview.isFocus
                    ? "var(--border-width-2)"
                    : "var(--border-width-1)",
                }}
              >
                <span className="type-body-sm semantic-border-sample-label">
                  {borderPreview.sampleLabel}
                </span>
                <span className="semantic-surface-tag">
                  {borderPreview.styleTag}
                </span>
              </div>
            )}

            <p className="semantic-card-desc type-label-caption">
              {item.description}
            </p>

            <div className="semantic-card-footer">
              <button
                type="button"
                className="token-copy-btn"
                onClick={() => handleCopyToken(`var(${item.cssVar})`)}
              >
                <Copy size={11} aria-hidden="true" />
                {item.cssVar}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderMappingTable = (tokens: ComponentToken[]) => (
    <div className="comp-table-scroll">
      <table className="comp-mapping-table">
        <thead>
          <tr className="type-label-base">
            <th>Component CSS Var</th>
            <th>Semantic Ref</th>
            <th>Primitive Ref</th>
            <th>Resolved</th>
            <th>Mô tả</th>
          </tr>
        </thead>
        <tbody className="type-body-sm">
          {tokens.map((item) => (
            <tr key={item.token}>
              <td>
                <button
                  type="button"
                  className="token-copy-btn"
                  onClick={() => handleCopyToken(`var(${item.cssVar})`)}
                  title="Sao chép CSS var"
                >
                  <Copy size={12} aria-hidden="true" />
                  {item.cssVar}
                </button>
              </td>
              <td>
                <span className="chain-pill">{item.reference}</span>
              </td>
              <td>
                <span className="chain-pill">{item.primitiveRef}</span>
              </td>
              <td>
                <span className="mono-code">{item.resolvedValue}</span>
              </td>
              <td>{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const hasQuery = normalizedQuery.length > 0;
  const isCardOpen = (id: string) => hasQuery || Boolean(openCards[id]);

  // Tier 1 filtered datasets
  const filteredPrimitiveColors = PRIMITIVE_COLORS.map((group) => ({
    ...group,
    shades: group.shades.filter((item) =>
      matchesSearch(
        normalizedQuery,
        group.palette,
        item.shade,
        item.token,
        item.cssVar,
        item.value
      )
    ),
  })).filter((group) => group.shades.length > 0);
  const matchedPrimColorCount = filteredPrimitiveColors.reduce(
    (sum, g) => sum + g.shades.length,
    0
  );

  const filteredPrimTypoGroups = (
    [
      ["Font Families", PRIMITIVE_TYPOGRAPHY.fontFamilies],
      ["Font Sizes", PRIMITIVE_TYPOGRAPHY.fontSizes],
      ["Font Weights", PRIMITIVE_TYPOGRAPHY.fontWeights],
      ["Line Heights", PRIMITIVE_TYPOGRAPHY.lineHeights],
      ["Letter Spacings", PRIMITIVE_TYPOGRAPHY.letterSpacings],
    ] as const
  )
    .map(([title, items]) => ({
      title,
      items: items.filter((item) =>
        matchesSearch(
          normalizedQuery,
          title,
          item.key,
          item.token,
          item.cssVar,
          item.value
        )
      ),
    }))
    .filter((group) => group.items.length > 0);
  const matchedPrimTypoCount = filteredPrimTypoGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  const filteredPrimSpacings = PRIMITIVE_SPACINGS.filter((sp) =>
    matchesSearch(
      normalizedQuery,
      "spacings",
      sp.key,
      sp.token,
      sp.cssVar,
      sp.value
    )
  );

  const filteredPrimRadius = PRIMITIVE_BORDER_RADIUS.filter((rad) =>
    matchesSearch(
      normalizedQuery,
      "border radius",
      rad.key,
      rad.token,
      rad.cssVar,
      rad.value
    )
  );

  const filteredPrimBorders = PRIMITIVE_BORDER_WIDTHS.filter((bw) =>
    matchesSearch(
      normalizedQuery,
      "border widths",
      bw.key,
      bw.token,
      bw.cssVar,
      bw.value
    )
  );

  const filteredPrimBreakpoints = PRIMITIVE_BREAKPOINTS.filter((bp) =>
    matchesSearch(
      normalizedQuery,
      "breakpoint",
      "breakpoints",
      "responsive",
      bp.key,
      bp.token,
      bp.cssVar,
      bp.value,
      bp.description
    )
  );

  const primitivesHasMatches =
    filteredPrimitiveColors.length > 0 ||
    filteredPrimTypoGroups.length > 0 ||
    filteredPrimSpacings.length > 0 ||
    filteredPrimRadius.length > 0 ||
    filteredPrimBorders.length > 0 ||
    filteredPrimBreakpoints.length > 0;

  // Tier 2 filtered datasets
  const filteredSemanticCards = SEMANTIC_COLOR_CARDS.map((card) => {
    const allItems = SEMANTIC_COLORS[card.group];
    const items = allItems.filter((item) =>
      matchesSearch(
        normalizedQuery,
        card.title,
        card.group,
        item.name,
        item.token,
        item.cssVar,
        item.reference,
        item.resolvedValue,
        item.darkReference,
        item.darkResolvedValue,
        item.description
      )
    );
    return {
      card,
      totalCount: allItems.length,
      items,
    };
  }).filter((entry) => entry.items.length > 0);

  const filteredSemSpacingsGroups = (
    Object.keys(SEMANTIC_SPACING_GROUP_LABELS) as SemanticSpacingGroup[]
  )
    .map((groupKey) => {
      const groupLabel = SEMANTIC_SPACING_GROUP_LABELS[groupKey];
      const items = SEMANTIC_SPACINGS[groupKey].filter((item) =>
        matchesSearch(
          normalizedQuery,
          "spacing",
          "spacings",
          groupKey,
          groupLabel,
          item.name,
          item.token,
          item.cssVar,
          item.reference,
          item.resolvedValue,
          item.mobileReference,
          item.mobileResolvedValue,
          item.description
        )
      );
      return { groupKey, groupLabel, items };
    })
    .filter((entry) => entry.items.length > 0);
  const matchedSemSpacingCount = filteredSemSpacingsGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  const filteredSemTypoGroups = (
    Object.keys(SEMANTIC_TYPO_GROUP_LABELS) as SemanticTypographyGroup[]
  )
    .map((groupKey) => {
      const groupLabel = SEMANTIC_TYPO_GROUP_LABELS[groupKey];
      const items = SEMANTIC_TYPOGRAPHY[groupKey].filter((item) =>
        matchesSearch(
          normalizedQuery,
          groupLabel,
          item.name,
          item.token,
          `.${item.className}`,
          item.resolved.fontFamily,
          item.resolved.fontSize,
          item.resolved.fontWeight,
          item.mobileResolved?.fontSize,
          item.description
        )
      );
      return { groupKey, groupLabel, items };
    })
    .filter((entry) => entry.items.length > 0);
  const matchedSemTypoCount = filteredSemTypoGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  const semanticHasMatches =
    filteredSemanticCards.length > 0 ||
    filteredSemSpacingsGroups.length > 0 ||
    filteredSemTypoGroups.length > 0;

  // Tier 3 filtered datasets
  const showBrandCard = matchesSearch(
    normalizedQuery,
    "brand",
    "svg",
    "BrandLogo",
    "BrandLogoText",
    "BrandFooter",
    "logo.svg",
    "logo-text.svg",
    "footer.svg",
    "--brand-primary",
    "--brand-accent"
  );

  const filterComponentTokens = (
    tokens: ComponentToken[],
    ...categoryKeywords: string[]
  ) =>
    tokens.filter((item) =>
      matchesSearch(
        normalizedQuery,
        ...categoryKeywords,
        item.name,
        item.token,
        item.cssVar,
        item.reference,
        item.primitiveRef,
        item.resolvedValue,
        item.description
      )
    );

  const filteredButtonTokens = filterComponentTokens(
    COMPONENT_TOKENS.button,
    "button",
    "buttons"
  );
  const filteredBadgeTokens = filterComponentTokens(
    COMPONENT_TOKENS.badge,
    "badge",
    "badges"
  );
  const filteredInputTokens = filterComponentTokens(
    COMPONENT_TOKENS.input,
    "input",
    "inputs"
  );
  const allCardTableTokens = [
    ...COMPONENT_TOKENS.card,
    ...COMPONENT_TOKENS.table,
  ];
  const filteredCardTableTokens = filterComponentTokens(
    allCardTableTokens,
    "card",
    "cards",
    "table"
  );
  const filteredExpandCardTokens = filterComponentTokens(
    COMPONENT_TOKENS["expand-card"],
    "expand",
    "expand-card",
    "expand card",
    "accordion",
    "collapsible",
    "swagger"
  );
  const showStatusVisualCard = matchesSearch(
    normalizedQuery,
    "status",
    "error",
    "404",
    "403",
    "500",
    "503",
    "desktop",
    "desktop-only",
    "exception",
    "phone",
    "status-phone.png",
    "StatusIllustration",
    "StatusScreen"
  );

  const componentsHasMatches =
    showBrandCard ||
    filteredButtonTokens.length > 0 ||
    filteredBadgeTokens.length > 0 ||
    filteredInputTokens.length > 0 ||
    filteredCardTableTokens.length > 0 ||
    filteredExpandCardTokens.length > 0 ||
    showStatusVisualCard;

  const activeHasMatches =
    activeTier === "primitives"
      ? primitivesHasMatches
      : activeTier === "semantic"
      ? semanticHasMatches
      : componentsHasMatches;

  return (
    <div className="portal-shell">
      <header className="tokens-topbar">
        <div className="tokens-topbar-inner">
          <BrandLogoText priority />
          <div className="tokens-topbar-right">
            <ThemeToggle />
            <Link href="/" className="btn btn-outline btn-sm">
              <ArrowLeft size={15} aria-hidden="true" />
              Về trang chủ
            </Link>
          </div>
        </div>
      </header>

      <nav className="tokens-sticky-bar" aria-label="Chọn tầng Design Tokens">
        <div className="tokens-sticky-inner">
          <div
            className="tier-grid-nav"
            role="tablist"
            aria-label="3 tầng Design Tokens"
          >
            {TIER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTier === tab.id}
                className={`tier-tab-btn tier-tab-btn--${tierConfig[tab.id].tone} type-label-base ${
                  activeTier === tab.id ? "tier-tab-btn--active" : ""
                }`}
                onClick={() => setActiveTier(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="tokens-main">
        <section
          className={`swagger-tag-card swagger-tag-card--${currentTierMeta.tone}`}
          aria-label={currentTierMeta.label}
        >
          <button
            type="button"
            className="swagger-tag-header"
            aria-expanded={openTiers[activeTier]}
            onClick={() => toggleTier(activeTier)}
          >
            <span className="swagger-tag-header-left">
              <h1 className="swagger-tag-title type-heading-h2">
                {currentTierMeta.label}
              </h1>
              <span className="folder-source">
                <Folder size={14} aria-hidden="true" />
                {currentTierMeta.folderPath}
              </span>
            </span>

            <span className="swagger-tag-right">
              <span
                className={`badge tier-count-badge--${currentTierMeta.tone} type-label-base`}
              >
                {currentTierMeta.countLabel}
              </span>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className={`swagger-chevron ${
                  openTiers[activeTier] ? "swagger-chevron--open" : ""
                }`}
              />
            </span>
          </button>

          {openTiers[activeTier] && (
            <div className="swagger-tag-body">
              <div className="swagger-tag-toolbar">
                <div className="swagger-toolbar-left">
                  {copiedVar ? (
                    <span className="copy-toast type-label-caption" role="status">
                      <Check size={14} aria-hidden="true" />
                      Đã sao chép: <code>{copiedVar}</code>
                    </span>
                  ) : (
                    <span className="copy-hint type-label-caption">
                      Bấm vào tên biến để sao chép
                    </span>
                  )}
                </div>

                <div className="toolbar-actions-group">
                  <div className="token-search-wrap">
                    <Search
                      size={14}
                      aria-hidden="true"
                      className="token-search-icon"
                    />
                    <input
                      id="token-search-input"
                      type="text"
                      className="token-search-input"
                      placeholder={`Tìm token ${currentTierMeta.label.toLowerCase()}...`}
                      aria-label={`Tìm token trong ${currentTierMeta.label}`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="token-search-clear"
                        onClick={() => setSearchQuery("")}
                        aria-label="Xóa từ khóa tìm kiếm"
                        title="Xóa tìm kiếm"
                      >
                        <X size={13} aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleExpandAll}
                  >
                    <ChevronsUpDown size={15} aria-hidden="true" />
                    Mở tất cả
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleCollapseAll}
                  >
                    <ChevronsDownUp size={15} aria-hidden="true" />
                    Thu gọn tất cả
                  </button>
                </div>
              </div>

              <div className="swagger-cards-stack">
                {hasQuery && !activeHasMatches && (
                  <div className="tokens-empty-state" role="status">
                    <p className="type-body-sm">
                      Không tìm thấy token khớp với{" "}
                      <strong>&ldquo;{searchQuery.trim()}&rdquo;</strong> trong{" "}
                      {currentTierMeta.label}.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => setSearchQuery("")}
                    >
                      <X size={14} aria-hidden="true" />
                      Xóa tìm kiếm
                    </button>
                  </div>
                )}
                {activeTier === "primitives" && (
                  <>
                    {filteredPrimitiveColors.length > 0 && (
                      <AccordionCard
                        badge="COLORS"
                        tone="teal-100"
                        title="Colors"
                        pathHint="primitives/colors.json"
                        countLabel={
                          hasQuery
                            ? `${filteredPrimitiveColors.length} palettes • ${matchedPrimColorCount}/${primitiveColorCount} tokens`
                            : `${PRIMITIVE_COLORS.length} palettes • ${primitiveColorCount} tokens`
                        }
                        previewColors={[
                          "--color-teal-500",
                          "--color-amber-500",
                          "--color-green-500",
                          "--color-red-500",
                          "--color-blue-500",
                          "--color-neutral-900",
                        ]}
                        isOpen={isCardOpen("prim-colors")}
                        onToggle={() => toggleCard("prim-colors")}
                      >
                        <div className="palette-groups">
                          {filteredPrimitiveColors.map((group) => (
                            <div key={group.palette} className="palette-row">
                              <div className="palette-label type-label-base">
                                {group.palette}
                              </div>
                              <div className="palette-swatches-grid">
                                {group.shades.map((item) => {
                                  const cssVarCall = `var(${item.cssVar})`;
                                  const isCopied = copiedVar === cssVarCall;
                                  return (
                                    <div
                                      key={item.token}
                                      className="prim-swatch-card"
                                    >
                                      <div
                                        className="prim-swatch-color"
                                        style={{
                                          backgroundColor: `var(${item.cssVar})`,
                                        }}
                                      >
                                        <button
                                          type="button"
                                          className={`prim-swatch-copy-btn ${
                                            isCopied ? "is-copied" : ""
                                          }`}
                                          onClick={() =>
                                            handleCopyToken(cssVarCall)
                                          }
                                          aria-label={`Sao chép ${item.cssVar}`}
                                          title={`Sao chép ${cssVarCall}`}
                                        >
                                          {isCopied ? (
                                            <Check
                                              size={12}
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <Copy
                                              size={12}
                                              aria-hidden="true"
                                            />
                                          )}
                                        </button>
                                      </div>
                                      <div className="prim-swatch-info">
                                        <span className="type-label-base">
                                          {item.token}
                                        </span>
                                        <span className="mono-code">
                                          {item.value}
                                        </span>
                                        <span className="prim-var-name">
                                          {item.cssVar}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}

                    {filteredPrimTypoGroups.length > 0 && (
                      <AccordionCard
                        badge="TYPO"
                        tone="teal-100"
                        title="Typography"
                        pathHint="primitives/typography.json"
                        countLabel={
                          hasQuery
                            ? `${matchedPrimTypoCount}/${primitiveTypoCount} tokens`
                            : `${primitiveTypoCount} tokens`
                        }
                        isOpen={isCardOpen("prim-typo")}
                        onToggle={() => toggleCard("prim-typo")}
                      >
                        <div className="prim-typo-grid">
                          {filteredPrimTypoGroups.map(({ title, items }) => (
                            <div key={title} className="prim-typo-card">
                              <h2 className="type-label-base">{title}</h2>
                              <div>
                                {items.map((item) => (
                                  <div
                                    key={item.token}
                                    className="prim-token-row"
                                  >
                                    <button
                                      type="button"
                                      className="token-copy-btn"
                                      onClick={() =>
                                        handleCopyToken(`var(${item.cssVar})`)
                                      }
                                    >
                                      {item.key}
                                    </button>
                                    <span className="mono-code">
                                      {item.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}

                    {filteredPrimSpacings.length > 0 && (
                      <AccordionCard
                        badge="SPACE"
                        tone="teal-100"
                        title="Spacings"
                        pathHint="primitives/spacings.json"
                        countLabel={
                          hasQuery
                            ? `${filteredPrimSpacings.length}/${PRIMITIVE_SPACINGS.length} tokens`
                            : `${PRIMITIVE_SPACINGS.length} tokens`
                        }
                        isOpen={isCardOpen("prim-space")}
                        onToggle={() => toggleCard("prim-space")}
                      >
                        <div className="spacing-list">
                          {filteredPrimSpacings.map((sp) => (
                            <div key={sp.token} className="spacing-row">
                              <button
                                type="button"
                                className="token-copy-btn"
                                onClick={() =>
                                  handleCopyToken(`var(${sp.cssVar})`)
                                }
                              >
                                <Copy size={11} aria-hidden="true" />
                                {sp.cssVar}
                              </button>
                              <span className="mono-code">{sp.value}</span>
                              <div className="spacing-bar-track">
                                <div
                                  className="spacing-bar-fill"
                                  style={{ width: `var(${sp.cssVar})` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}

                    {filteredPrimRadius.length > 0 && (
                      <AccordionCard
                        badge="RADIUS"
                        tone="teal-100"
                        title="Border Radius"
                        pathHint="primitives/border-radius.json"
                        countLabel={
                          hasQuery
                            ? `${filteredPrimRadius.length}/${PRIMITIVE_BORDER_RADIUS.length} tokens`
                            : `${PRIMITIVE_BORDER_RADIUS.length} tokens`
                        }
                        isOpen={isCardOpen("prim-radius")}
                        onToggle={() => toggleCard("prim-radius")}
                      >
                        <div className="radius-grid">
                          {filteredPrimRadius.map((rad) => (
                            <div key={rad.token} className="radius-card">
                              <div
                                className="radius-box"
                                style={{ borderRadius: `var(${rad.cssVar})` }}
                              />
                              <div>
                                <div className="type-label-base">
                                  {rad.token}
                                </div>
                                <div className="mono-code">{rad.value}</div>
                              </div>
                              <button
                                type="button"
                                className="token-copy-btn"
                                onClick={() =>
                                  handleCopyToken(`var(${rad.cssVar})`)
                                }
                              >
                                {rad.cssVar}
                              </button>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}

                    {filteredPrimBorders.length > 0 && (
                      <AccordionCard
                        badge="BORDER"
                        tone="teal-100"
                        title="Border Widths"
                        pathHint="primitives/border-widths.json"
                        countLabel={
                          hasQuery
                            ? `${filteredPrimBorders.length}/${PRIMITIVE_BORDER_WIDTHS.length} tokens`
                            : `${PRIMITIVE_BORDER_WIDTHS.length} tokens`
                        }
                        isOpen={isCardOpen("prim-border")}
                        onToggle={() => toggleCard("prim-border")}
                      >
                        <div className="border-width-grid">
                          {filteredPrimBorders.map((bw) => (
                            <div key={bw.token} className="border-width-card">
                              <div
                                className="border-width-sample"
                                style={{ borderWidth: `var(${bw.cssVar})` }}
                              />
                              <div className="type-label-base">
                                {bw.token} ({bw.value})
                              </div>
                              <button
                                type="button"
                                className="token-copy-btn"
                                onClick={() =>
                                  handleCopyToken(`var(${bw.cssVar})`)
                                }
                              >
                                {bw.cssVar}
                              </button>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}

                    {filteredPrimBreakpoints.length > 0 && (
                      <AccordionCard
                        badge="BREAKPT"
                        tone="teal-100"
                        title="Breakpoints"
                        pathHint="primitives/breakpoints.json"
                        countLabel={
                          hasQuery
                            ? `${filteredPrimBreakpoints.length}/${PRIMITIVE_BREAKPOINTS.length} tokens`
                            : `${PRIMITIVE_BREAKPOINTS.length} tokens`
                        }
                        isOpen={isCardOpen("prim-breakpoints")}
                        onToggle={() => toggleCard("prim-breakpoints")}
                      >
                        <div className="breakpoint-grid">
                          {filteredPrimBreakpoints.map((bp) => (
                            <div key={bp.token} className="breakpoint-card">
                              <div className="breakpoint-head">
                                <span className="type-label-base">
                                  {bp.token}
                                </span>
                                <span className="chain-pill">{bp.value}</span>
                              </div>
                              <p className="semantic-card-desc type-label-caption">
                                {bp.description}
                              </p>
                              <div className="semantic-card-footer">
                                <button
                                  type="button"
                                  className="token-copy-btn"
                                  onClick={() =>
                                    handleCopyToken(`var(${bp.cssVar})`)
                                  }
                                >
                                  <Copy size={11} aria-hidden="true" />
                                  {bp.cssVar}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </AccordionCard>
                    )}
                  </>
                )}

                {activeTier === "semantic" && (
                  <>
                    {filteredSemanticCards.map(({ card, totalCount, items }) => (
                      <AccordionCard
                        key={card.id}
                        badge={card.badge}
                        tone="teal-500"
                        title={card.title}
                        pathHint={`semantic/colors.json • ${card.group}.*`}
                        countLabel={
                          hasQuery
                            ? `${items.length}/${totalCount} tokens`
                            : `${items.length} tokens`
                        }
                        previewColors={items.map((c) => c.cssVar)}
                        isOpen={isCardOpen(card.id)}
                        onToggle={() => toggleCard(card.id)}
                      >
                        {renderSemanticColorGrid(items)}
                      </AccordionCard>
                    ))}

                    {filteredSemSpacingsGroups.length > 0 && (
                      <AccordionCard
                        badge="SPACE"
                        tone="teal-500"
                        title="Spacings (Proximity & Layout)"
                        pathHint="semantic/spacings.json"
                        countLabel={
                          hasQuery
                            ? `${matchedSemSpacingCount}/${semanticSpacingCount} tokens`
                            : `${semanticSpacingCount} tokens`
                        }
                        isOpen={isCardOpen("sem-spacings")}
                        onToggle={() => toggleCard("sem-spacings")}
                      >
                        {filteredSemSpacingsGroups.map(
                          ({ groupKey, groupLabel, items }) => (
                            <div key={groupKey} className="palette-row">
                              <h2 className="palette-label type-label-base">
                                {groupLabel}
                              </h2>
                              <div className="sem-spacing-grid">
                                {items.map((sp) => (
                                  <div
                                    key={sp.token}
                                    className="semantic-color-card"
                                  >
                                    <div className="semantic-card-title-group">
                                      <div className="semantic-card-title-row">
                                        <span className="type-label-base">
                                          {sp.token}
                                        </span>
                                        <span className="semantic-title-context">
                                          • {sp.resolvedValue}
                                          {sp.mobileResolvedValue
                                            ? ` → ${sp.mobileResolvedValue} mobile`
                                            : ""}
                                        </span>
                                      </div>
                                      <div className="chain-row">
                                        <span className="chain-pill">
                                          {sp.reference}
                                        </span>
                                        {sp.mobileReference && (
                                          <span className="chain-pill">
                                            mobile: {sp.mobileReference}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="sem-spacing-bar-wrap">
                                      <div
                                        className="spacing-bar-fill"
                                        style={{ width: `var(${sp.cssVar})` }}
                                      />
                                      <span className="mono-code">
                                        {sp.resolvedValue}
                                      </span>
                                    </div>

                                    <p className="semantic-card-desc type-label-caption">
                                      {sp.description}
                                    </p>

                                    <div className="semantic-card-footer">
                                      <button
                                        type="button"
                                        className="token-copy-btn"
                                        onClick={() =>
                                          handleCopyToken(`var(${sp.cssVar})`)
                                        }
                                      >
                                        <Copy size={11} aria-hidden="true" />
                                        {sp.cssVar}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </AccordionCard>
                    )}

                    {filteredSemTypoGroups.length > 0 && (
                      <AccordionCard
                        badge="TYPO"
                        tone="teal-500"
                        title="Typography"
                        pathHint="semantic/typography.json"
                        countLabel={
                          hasQuery
                            ? `${matchedSemTypoCount}/${semanticTypoCount} styles`
                            : `${semanticTypoCount} styles`
                        }
                        isOpen={isCardOpen("sem-typo")}
                        onToggle={() => toggleCard("sem-typo")}
                      >
                        {filteredSemTypoGroups.map(
                          ({ groupKey, groupLabel, items }) => (
                            <div key={groupKey} className="palette-row">
                              <h2 className="palette-label type-label-base">
                                {groupLabel}
                              </h2>
                              <div className="type-specimen-list">
                                {items.map((item) => (
                                  <div
                                    key={item.token}
                                    className="type-specimen-row"
                                  >
                                    <div className="type-specimen-meta">
                                      <span className="type-label-base">
                                        {item.token}
                                      </span>
                                      <span className="mono-code">
                                        {item.resolved.fontFamily} /{" "}
                                        {item.resolved.fontSize} /{" "}
                                        {item.resolved.fontWeight}
                                        {item.mobileResolved?.fontSize
                                          ? ` • mobile: ${item.mobileResolved.fontSize}`
                                          : ""}
                                      </span>
                                      <span className="type-label-caption">
                                        {item.description}
                                      </span>
                                      <div className="type-specimen-footer">
                                        <button
                                          type="button"
                                          className="token-copy-btn"
                                          onClick={() =>
                                            handleCopyToken(
                                              `.${item.className}`
                                            )
                                          }
                                        >
                                          <Copy size={11} aria-hidden="true" />.
                                          {item.className}
                                        </button>
                                      </div>
                                    </div>
                                    <div className={item.className}>
                                      {item.token === "display.brand"
                                        ? "THEN-CHOT"
                                        : item.token === "display.tagline"
                                        ? "THEN CÀI XÓM ẤP"
                                        : "Cổng An Ninh Thông Minh — 51H-829.41"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </AccordionCard>
                    )}
                  </>
                )}

                {activeTier === "components" && (
                  <>
                    {showBrandCard && (
                      <AccordionCard
                        badge="BRAND"
                        tone="teal-700"
                        title="Brand SVG"
                        pathHint="components/brand/*"
                        countLabel="3 SVG"
                        previewColors={["--brand-primary", "--brand-accent"]}
                        isOpen={isCardOpen("comp-brand")}
                        onToggle={() => toggleCard("comp-brand")}
                      >
                        <div className="brand-assets-grid">
                          <div className="brand-asset-card">
                            <div className="brand-asset-stage">
                              <BrandLogo size="sm" />
                              <BrandLogo size="md" />
                              <BrandLogo size="lg" />
                            </div>
                            <div>
                              <div className="type-label-base">
                                &lt;BrandLogo size=&quot;sm | md | lg&quot; /&gt;
                              </div>
                              <div className="mono-code">/brand/logo.svg</div>
                            </div>
                          </div>

                          <div className="brand-asset-card">
                            <div className="brand-asset-stage">
                              <BrandLogoText />
                            </div>
                            <div>
                              <div className="type-label-base">
                                &lt;BrandLogoText /&gt;
                              </div>
                              <div className="mono-code">
                                /brand/logo-text.svg
                              </div>
                            </div>
                          </div>

                          <div className="brand-asset-card brand-asset-card--wide">
                            <div className="brand-asset-stage">
                              <Image
                                src="/brand/footer.svg"
                                width={1030}
                                height={262}
                                alt="Xem trước footer.svg"
                                unoptimized
                                className="brand-footer-artwork"
                              />
                            </div>
                            <div>
                              <div className="type-label-base">
                                &lt;BrandFooter /&gt;
                              </div>
                              <div className="mono-code">/brand/footer.svg</div>
                            </div>
                          </div>
                        </div>
                      </AccordionCard>
                    )}

                    {filteredButtonTokens.length > 0 && (
                      <AccordionCard
                        badge="BUTTON"
                        tone="teal-700"
                        title="Buttons"
                        pathHint="--comp-button-*"
                        countLabel={
                          hasQuery
                            ? `${filteredButtonTokens.length}/${COMPONENT_TOKENS.button.length} tokens`
                            : `${COMPONENT_TOKENS.button.length} tokens`
                        }
                        previewColors={[
                          "--comp-button-primary-bg",
                          "--comp-button-accent-bg",
                          "--comp-button-danger-bg",
                        ]}
                        isOpen={isCardOpen("comp-button")}
                        onToggle={() => toggleCard("comp-button")}
                      >
                        <div className="component-stage">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                              setDemoActionMessage(
                                "Đã bấm Primary Button (Mở barie)"
                              )
                            }
                          >
                            Primary Button
                          </button>
                          <button
                            type="button"
                            className="btn btn-accent"
                            onClick={() =>
                              setDemoActionMessage(
                                "Đã bấm Accent Button (Chế độ kiểm tra)"
                              )
                            }
                          >
                            Accent Button
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline"
                            onClick={() =>
                              setDemoActionMessage(
                                "Đã bấm Outline Button (Tác vụ phụ)"
                              )
                            }
                          >
                            Outline Button
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() =>
                              setDemoActionMessage(
                                "Đã bấm Danger Button (Khóa cổng)"
                              )
                            }
                          >
                            Danger Button
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                              setDemoActionMessage("Đã bấm Small Primary")
                            }
                          >
                            Small Button
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline demo-btn-disabled"
                            disabled
                          >
                            Disabled
                          </button>
                          <span className="badge badge-brand type-label-caption">
                            {demoActionMessage}
                          </span>
                        </div>
                        {renderMappingTable(filteredButtonTokens)}
                      </AccordionCard>
                    )}

                    {filteredBadgeTokens.length > 0 && (
                      <AccordionCard
                        badge="BADGE"
                        tone="teal-700"
                        title="Badges"
                        pathHint="--comp-badge-*"
                        countLabel={
                          hasQuery
                            ? `${filteredBadgeTokens.length}/${COMPONENT_TOKENS.badge.length} tokens`
                            : `${COMPONENT_TOKENS.badge.length} tokens`
                        }
                        previewColors={[
                          "--comp-badge-success-bg",
                          "--comp-badge-warning-bg",
                          "--comp-badge-danger-bg",
                          "--comp-badge-info-bg",
                        ]}
                        isOpen={isCardOpen("comp-badge")}
                        onToggle={() => toggleCard("comp-badge")}
                      >
                        <div className="component-stage">
                          <span className="badge badge-success type-label-base">
                            Cho phép
                          </span>
                          <span className="badge badge-warning type-label-base">
                            Chờ duyệt
                          </span>
                          <span className="badge badge-danger type-label-base">
                            Từ chối
                          </span>
                          <span className="badge badge-info type-label-base">
                            Khách
                          </span>
                          <span className="badge badge-brand type-label-base">
                            Thương hiệu THEN-CHOT
                          </span>
                        </div>

                        <div className="component-stage component-stage--col">
                          <div className="demo-callout demo-callout--success type-body-sm">
                            <span>
                              <strong>Success:</strong> Barie đã mở hợp lệ qua thẻ
                              RFID + biển số 51H-829.41.
                            </span>
                            <span className="mono-code">status.success-*</span>
                          </div>
                          <div className="demo-callout demo-callout--warning type-body-sm">
                            <span>
                              <strong>Warning:</strong> Độ tin cậy OCR 71.2% — chờ
                              bảo vệ trực chốt xác nhận.
                            </span>
                            <span className="mono-code">status.warning-*</span>
                          </div>
                          <div className="demo-callout demo-callout--danger type-body-sm">
                            <span>
                              <strong>Danger:</strong> Thẻ RFID không hợp lệ hoặc
                              bị khóa quyền truy cập.
                            </span>
                            <span className="mono-code">status.danger-*</span>
                          </div>
                          <div className="demo-callout demo-callout--info type-body-sm">
                            <span>
                              <strong>Info:</strong> Lượt xe khách đăng ký trước
                              qua mã QR tạm thời.
                            </span>
                            <span className="mono-code">status.info-*</span>
                          </div>
                        </div>
                        {renderMappingTable(filteredBadgeTokens)}
                      </AccordionCard>
                    )}

                    {filteredInputTokens.length > 0 && (
                      <AccordionCard
                        badge="INPUT"
                        tone="teal-700"
                        title="Inputs"
                        pathHint="--comp-input-*"
                        countLabel={
                          hasQuery
                            ? `${filteredInputTokens.length}/${COMPONENT_TOKENS.input.length} tokens`
                            : `${COMPONENT_TOKENS.input.length} tokens`
                        }
                        isOpen={isCardOpen("comp-input")}
                        onToggle={() => toggleCard("comp-input")}
                      >
                        <div className="component-stage component-stage--col">
                          <div className="demo-form-grid">
                            <div className="demo-field">
                              <label
                                htmlFor="demo-plate-input"
                                className="type-label-base"
                              >
                                Biển số xe kiểm tra
                              </label>
                              <input
                                id="demo-plate-input"
                                type="text"
                                className="demo-input"
                                placeholder="Nhập biển số (VD: 51H-829.41)"
                                value={demoPlateInput}
                                onChange={(e) =>
                                  setDemoPlateInput(e.target.value)
                                }
                              />
                            </div>

                            <div className="demo-field">
                              <label
                                htmlFor="demo-gate-select"
                                className="type-label-base"
                              >
                                Cổng áp dụng
                              </label>
                              <select
                                id="demo-gate-select"
                                className="demo-input"
                                value={demoGateSelect}
                                onChange={(e) =>
                                  setDemoGateSelect(e.target.value)
                                }
                              >
                                <option value="Cổng A - Làn xe vào">
                                  Cổng A - Làn xe vào
                                </option>
                                <option value="Cổng A - Làn khách">
                                  Cổng A - Làn khách
                                </option>
                                <option value="Cổng B - Làn xe máy">
                                  Cổng B - Làn xe máy
                                </option>
                              </select>
                            </div>

                            <div className="demo-field">
                              <span className="type-label-base">Bộ lọc nhanh</span>
                              <div className="filter-group">
                                {["Tất cả", "Cho phép", "Chờ duyệt"].map(
                                  (opt) => (
                                    <button
                                      key={opt}
                                      type="button"
                                      className={`filter-pill type-label-base ${
                                        demoFilterState === opt
                                          ? "filter-pill--active"
                                          : ""
                                      }`}
                                      onClick={() => setDemoFilterState(opt)}
                                    >
                                      {opt}
                                    </button>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <p className="type-label-caption">
                            Giá trị đang thử:{" "}
                            <strong>{demoPlateInput || "(trống)"}</strong> •{" "}
                            <strong>{demoGateSelect}</strong> • Bộ lọc:{" "}
                            <strong>{demoFilterState}</strong>
                          </p>
                        </div>
                        {renderMappingTable(filteredInputTokens)}
                      </AccordionCard>
                    )}

                    {filteredCardTableTokens.length > 0 && (
                      <AccordionCard
                        badge="CARD+TBL"
                        tone="teal-700"
                        title="Cards & Table"
                        pathHint="--comp-card-* • --comp-table-*"
                        countLabel={
                          hasQuery
                            ? `${filteredCardTableTokens.length}/${allCardTableTokens.length} tokens`
                            : `${allCardTableTokens.length} tokens`
                        }
                        isOpen={isCardOpen("comp-card-table")}
                        onToggle={() => toggleCard("comp-card-table")}
                      >
                        <div className="component-stage component-stage--col">
                          <div className="demo-cards-pair">
                            <article className="kpi-card">
                              <div className="kpi-header">
                                <span className="type-label-base">
                                  CARD MẶC ĐỊNH
                                </span>
                                <ShieldCheck size={16} aria-hidden="true" />
                              </div>
                              <div className="kpi-value type-heading-h3">
                                surface.default + border.subtle
                              </div>
                              <p className="type-body-sm">
                                Dùng cho thẻ KPI, bảng nhật ký và khối nội dung
                                chính.
                              </p>
                            </article>

                            <article className="kpi-card kpi-card--highlight">
                              <div className="kpi-header">
                                <span className="type-label-base">
                                  CARD NHẤN ACCENT
                                </span>
                                <Layers size={16} aria-hidden="true" />
                              </div>
                              <div className="kpi-value type-heading-h3">
                                card.accent-top (#E8A33D)
                              </div>
                              <p className="type-body-sm">
                                Thanh viền trên 4px bằng brand.accent để làm nổi
                                bật thẻ trạng thái cổng.
                              </p>
                            </article>
                          </div>

                          <div className="table-wrapper">
                            <table className="log-table">
                              <thead>
                                <tr className="type-label-base">
                                  <th>Biển số</th>
                                  <th>Vị trí</th>
                                  <th>Xác thực</th>
                                  <th>Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody className="type-body-sm">
                                {DEMO_SAMPLE_LOGS.map((row) => (
                                  <tr key={row.plate}>
                                    <td>
                                      <span className="plate-chip">
                                        {row.plate}
                                      </span>
                                    </td>
                                    <td>{row.lane}</td>
                                    <td>{row.method}</td>
                                    <td>
                                      <span
                                        className={`badge ${row.badgeClass} type-label-base`}
                                      >
                                        {row.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {renderMappingTable(filteredCardTableTokens)}
                      </AccordionCard>
                    )}

                    {filteredExpandCardTokens.length > 0 && (
                      <AccordionCard
                        badge="EXPAND"
                        tone="teal-700"
                        title="Expand Card"
                        pathHint="--comp-expand-card-*"
                        countLabel={
                          hasQuery
                            ? `${filteredExpandCardTokens.length}/${COMPONENT_TOKENS["expand-card"].length} tokens`
                            : `${COMPONENT_TOKENS["expand-card"].length} tokens`
                        }
                        previewColors={[
                          "--comp-expand-card-accent-subtle",
                          "--comp-expand-card-accent-primary",
                          "--comp-expand-card-accent-strong",
                        ]}
                        isOpen={isCardOpen("comp-expand-card")}
                        onToggle={() => toggleCard("comp-expand-card")}
                      >
                        <div className="component-stage component-stage--col">
                          <div className="demo-expand-stack">
                            <AccordionCard
                              tone="teal-100"
                              badge="TEAL-100"
                              title="Cấp độ nhẹ (Primitives)"
                              pathHint="tone='teal-100' • --comp-expand-card-accent-subtle"
                              countLabel="3 mục"
                              previewColors={[
                                "--color-teal-100",
                                "--color-teal-500",
                              ]}
                              isOpen={Boolean(demoExpandCards["demo-exp-100"])}
                              onToggle={() =>
                                toggleDemoExpandCard("demo-exp-100")
                              }
                            >
                              <p className="type-body-sm">
                                Dùng cho nhóm dữ liệu nền tảng (Primitives): nền
                                header sáng <code>--comp-expand-card-bg</code>,
                                hover chuyển sang{" "}
                                <code>--comp-expand-card-header-bg</code>.
                              </p>
                            </AccordionCard>

                            <AccordionCard
                              tone="teal-500"
                              badge="TEAL-500"
                              title="Cấp độ chuẩn (Semantic)"
                              pathHint="tone='teal-500' • --comp-expand-card-accent-primary"
                              countLabel="5 mục"
                              previewColors={[
                                "--brand-primary",
                                "--brand-accent",
                              ]}
                              isOpen={Boolean(demoExpandCards["demo-exp-500"])}
                              onToggle={() =>
                                toggleDemoExpandCard("demo-exp-500")
                              }
                            >
                              <div className="demo-expand-row">
                                <div className="demo-expand-row">
                                  <span className="plate-chip">51H-829.41</span>
                                  <span className="type-body-sm">
                                    Cổng A - Làn vào • RFID + ALPR 99.4%
                                  </span>
                                </div>
                                <span className="badge badge-success type-label-base">
                                  Cho phép
                                </span>
                              </div>
                            </AccordionCard>

                            <AccordionCard
                              tone="teal-700"
                              badge="TEAL-700"
                              title="Cấp độ nhấn mạnh (Components)"
                              pathHint="tone='teal-700' • --comp-expand-card-accent-strong"
                              countLabel="2 mục"
                              previewColors={["--brand-primary-hover"]}
                              isOpen={Boolean(demoExpandCards["demo-exp-700"])}
                              onToggle={() =>
                                toggleDemoExpandCard("demo-exp-700")
                              }
                            >
                              <p className="type-body-sm">
                                Dùng cho thẻ cấp độ Components: thanh viền trái
                                đậm <code>--comp-expand-card-accent-strong</code>{" "}
                                và badge tương phản cao.
                              </p>
                            </AccordionCard>
                          </div>
                        </div>
                        {renderMappingTable(filteredExpandCardTokens)}
                      </AccordionCard>
                    )}

                    {showStatusVisualCard && (
                      <AccordionCard
                        badge="STATUS"
                        tone="teal-700"
                        title="Status & Error Visual"
                        pathHint="components/status/* • /illustrations/status-phone.png"
                        countLabel="status-code + desktop-only"
                        previewColors={[
                          "--brand-primary",
                          "--brand-accent",
                          "--surface-default",
                        ]}
                        isOpen={isCardOpen("comp-status-visual")}
                        onToggle={() => toggleCard("comp-status-visual")}
                      >
                        <div className="status-demo-controls">
                          <div className="filter-group">
                            {["404", "403", "500", "503"].map((codePreset) => (
                              <button
                                key={codePreset}
                                type="button"
                                className={`filter-pill type-label-base ${
                                  demoStatusVariant === "status-code" &&
                                  demoStatusCode === codePreset
                                    ? "filter-pill--active"
                                    : ""
                                }`}
                                onClick={() => {
                                  setDemoStatusVariant("status-code");
                                  setDemoStatusCode(codePreset);
                                }}
                              >
                                {codePreset}
                              </button>
                            ))}
                            <button
                              type="button"
                              className={`filter-pill type-label-base ${
                                demoStatusVariant === "desktop-only"
                                  ? "filter-pill--active"
                                  : ""
                              }`}
                              onClick={() =>
                                setDemoStatusVariant("desktop-only")
                              }
                            >
                              Desktop Only (Dev Exception)
                            </button>
                          </div>

                          <div className="toolbar-actions-group">
                            {demoStatusVariant === "status-code" && (
                              <input
                                id="demo-status-code-input"
                                type="text"
                                maxLength={6}
                                className="demo-input status-demo-code-input"
                                aria-label="Nhập mã trạng thái tùy chỉnh"
                                placeholder="VD: 401"
                                value={demoStatusCode}
                                onChange={(e) =>
                                  setDemoStatusCode(e.target.value)
                                }
                              />
                            )}
                            <Link
                              href="/khong-ton-tai"
                              className="btn btn-outline btn-sm"
                            >
                              Xem trang 404 thật
                            </Link>
                          </div>
                        </div>

                        <div className="component-stage component-stage--col status-demo-stage">
                          <StatusScreen
                            variant={demoStatusVariant}
                            code={demoStatusCode}
                            size="md"
                            compact
                          />
                        </div>

                        <div className="status-demo-meta">
                          <div className="status-demo-asset-preview">
                            <Image
                              src="/illustrations/status-phone.png"
                              width={1111}
                              height={1730}
                              alt="Asset điện thoại tách rời có nền trắng lót dưới dấu chấm than vàng"
                              unoptimized
                              className="status-demo-asset-thumb"
                            />
                            <div>
                              <div className="type-label-base">
                                /illustrations/status-phone.png
                              </div>
                              <div className="mono-code">
                                1111×1730 • nền trắng lót dưới dấu ! vàng
                              </div>
                            </div>
                          </div>

                          <code className="mono-code">
                            {demoStatusVariant === "desktop-only"
                              ? '<StatusIllustration variant="desktop-only" />'
                              : `<StatusIllustration code="${
                                  demoStatusCode.trim() || "404"
                                }" />`}
                          </code>
                        </div>
                      </AccordionCard>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}
