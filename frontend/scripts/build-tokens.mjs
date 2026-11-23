import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendRoot = path.resolve(__dirname, "..");
const tokensDir = path.join(frontendRoot, "tokens");
const assetsDir = path.join(frontendRoot, "assets");
const generatedDir = path.join(frontendRoot, "apps", "web", "src", "generated");
const outputCssFile = path.join(generatedDir, "tokens.css");
const outputDataFile = path.join(generatedDir, "tokens-data.ts");
const fontSrc = path.join(assetsDir, "fonts", "Extenda-30-Deca.otf");

function readJson(relPath) {
  const fullPath = path.join(tokensDir, relPath);
  return JSON.parse(fs.readFileSync(fullPath, "utf8"));
}

const colorsPrim = readJson("primitives/colors.json");
const typographyPrim = readJson("primitives/typography.json");
const spacingsPrim = readJson("primitives/spacings.json");
const borderRadiusPrim = readJson("primitives/border-radius.json");
const borderWidthsPrim = readJson("primitives/border-widths.json");
const breakpointsPrim = readJson("primitives/breakpoints.json");

const colorsSem = readJson("semantic/colors.json");
const typographySem = readJson("semantic/typography.json");
const spacingsSem = readJson("semantic/spacings.json");

const COMPONENT_GROUP_ORDER = ["button", "badge", "input", "card", "table", "expand-card"];

function loadComponentTokens() {
  const componentsDir = path.join(tokensDir, "components");
  const files = fs
    .readdirSync(componentsDir)
    .filter((file) => file.endsWith(".json"))
    .sort((a, b) => a.localeCompare(b));

  const groupMap = new Map();
  for (const file of files) {
    const relPath = `components/${file}`;
    const parsed = readJson(relPath);
    for (const [group, entries] of Object.entries(parsed)) {
      if (groupMap.has(group)) {
        const prevSource = groupMap.get(group).sourceFile;
        throw new Error(
          `Duplicate component token group "${group}" found in ${relPath} (already defined in ${prevSource})`
        );
      }
      groupMap.set(group, { sourceFile: relPath, entries });
    }
  }

  const orderedGroups = [];
  for (const preferred of COMPONENT_GROUP_ORDER) {
    if (groupMap.has(preferred)) {
      orderedGroups.push([preferred, groupMap.get(preferred)]);
      groupMap.delete(preferred);
    }
  }
  const extraGroups = [...groupMap.entries()].sort(([a], [b]) => a.localeCompare(b));
  return [...orderedGroups, ...extraGroups];
}

const componentGroupEntries = loadComponentTokens();

const fontFallbacks = {
  display: "'Extenda 30 Deca', Impact, sans-serif",
  serif: "'Times New Roman', Times, Georgia, serif",
  sans: "'Arial', Helvetica, system-ui, sans-serif",
};

const refToCssVar = new Map();
const refToResolved = new Map();
const refToPrimitiveRef = new Map();
const rootLines = [];

function resolveToCssVar(rawValue, context) {
  if (typeof rawValue !== "string") {
    throw new Error(`Expected string token value at ${context}`);
  }
  const resolved = rawValue.replace(/\{([^}]+)\}/g, (_, refKey) => {
    const cssRef = refToCssVar.get(refKey);
    if (!cssRef) {
      throw new Error(`Unresolved CSS var token reference {${refKey}} at ${context}`);
    }
    return cssRef;
  });
  if (resolved.includes("{") || resolved.includes("}")) {
    throw new Error(`Unresolved braces remaining in "${resolved}" at ${context}`);
  }
  return resolved;
}

function resolveToLiteral(rawValue, context, seen = new Set()) {
  if (typeof rawValue !== "string") {
    throw new Error(`Expected string token value at ${context}`);
  }
  const resolved = rawValue.replace(/\{([^}]+)\}/g, (_, refKey) => {
    if (seen.has(refKey)) {
      throw new Error(`Circular token reference {${refKey}} at ${context}`);
    }
    const target = refToResolved.get(refKey);
    if (target === undefined) {
      throw new Error(`Unresolved literal token reference {${refKey}} at ${context}`);
    }
    const nextSeen = new Set(seen);
    nextSeen.add(refKey);
    return resolveToLiteral(target, `${context} -> ${refKey}`, nextSeen);
  });
  if (resolved.includes("{") || resolved.includes("}")) {
    throw new Error(`Unresolved braces remaining in "${resolved}" at ${context}`);
  }
  return resolved;
}

function resolvePrimitiveRef(rawValue, context) {
  const match = /^\{([^}]+)\}$/.exec(rawValue);
  if (!match) return rawValue;
  const key = match[1];
  const mapped = refToPrimitiveRef.get(key);
  if (!mapped) {
    throw new Error(`Unresolved primitive chain for {${key}} at ${context}`);
  }
  return mapped;
}

/* =========================================================
 * TIER 1: PRIMITIVES
 * ========================================================= */
const primitiveColorsData = [];
rootLines.push("  /* Primitive Colors (Tier 1) */");
for (const [palette, shades] of Object.entries(colorsPrim)) {
  const shadeList = [];
  for (const [shade, token] of Object.entries(shades)) {
    const varName = `--color-${palette}-${shade}`;
    const refKey = `${palette}.${shade}`;
    refToCssVar.set(refKey, `var(${varName})`);
    refToResolved.set(refKey, token.value);
    refToPrimitiveRef.set(refKey, `{${refKey}}`);
    rootLines.push(`  ${varName}: ${token.value};`);
    shadeList.push({
      shade,
      token: refKey,
      cssVar: varName,
      value: token.value,
    });
  }
  primitiveColorsData.push({ palette, shades: shadeList });
}

rootLines.push("");
rootLines.push("  /* Primitive Typography (Tier 1) */");
const primitiveTypographyData = {
  fontFamilies: [],
  fontSizes: [],
  fontWeights: [],
  lineHeights: [],
  letterSpacings: [],
};

for (const [key, token] of Object.entries(typographyPrim.fontFamilies)) {
  const varName = `--font-${key}`;
  const refKey = `fontFamilies.${key}`;
  const cssValue = fontFallbacks[key] || `'${token.value}', sans-serif`;
  refToCssVar.set(refKey, `var(${varName})`);
  refToResolved.set(refKey, token.value);
  refToPrimitiveRef.set(refKey, `{${refKey}}`);
  rootLines.push(`  ${varName}: ${cssValue};`);
  primitiveTypographyData.fontFamilies.push({
    key,
    token: refKey,
    cssVar: varName,
    value: token.value,
  });
}

const typographyScales = [
  ["fontSizes", "font-size", typographyPrim.fontSizes],
  ["fontWeights", "font-weight", typographyPrim.fontWeights],
  ["lineHeights", "line-height", typographyPrim.lineHeights],
  ["letterSpacings", "letter-spacing", typographyPrim.letterSpacings],
];

for (const [groupKey, cssPrefix, entries] of typographyScales) {
  for (const [key, token] of Object.entries(entries)) {
    const varName = `--${cssPrefix}-${key}`;
    const refKey = `${groupKey}.${key}`;
    refToCssVar.set(refKey, `var(${varName})`);
    refToResolved.set(refKey, token.value);
    refToPrimitiveRef.set(refKey, `{${refKey}}`);
    rootLines.push(`  ${varName}: ${token.value};`);
    primitiveTypographyData[groupKey].push({
      key,
      token: refKey,
      cssVar: varName,
      value: token.value,
    });
  }
}

rootLines.push("");
rootLines.push("  /* Primitive Spacings, Radii & Border Widths (Tier 1) */");
const primitiveSpacingsData = [];
for (const [key, token] of Object.entries(spacingsPrim.space)) {
  const varName = `--space-${key}`;
  const refKey = `space.${key}`;
  refToCssVar.set(refKey, `var(${varName})`);
  refToResolved.set(refKey, token.value);
  refToPrimitiveRef.set(refKey, `{${refKey}}`);
  rootLines.push(`  ${varName}: ${token.value};`);
  primitiveSpacingsData.push({ key, token: refKey, cssVar: varName, value: token.value });
}

const primitiveBorderRadiusData = [];
for (const [key, token] of Object.entries(borderRadiusPrim.borderRadius)) {
  const varName = `--radius-${key}`;
  const refKey = `borderRadius.${key}`;
  refToCssVar.set(refKey, `var(${varName})`);
  refToResolved.set(refKey, token.value);
  refToPrimitiveRef.set(refKey, `{${refKey}}`);
  rootLines.push(`  ${varName}: ${token.value};`);
  primitiveBorderRadiusData.push({ key, token: refKey, cssVar: varName, value: token.value });
}

const primitiveBorderWidthsData = [];
for (const [key, token] of Object.entries(borderWidthsPrim.borderWidth)) {
  const varName = `--border-width-${key}`;
  const refKey = `borderWidth.${key}`;
  refToCssVar.set(refKey, `var(${varName})`);
  refToResolved.set(refKey, token.value);
  refToPrimitiveRef.set(refKey, `{${refKey}}`);
  rootLines.push(`  ${varName}: ${token.value};`);
  primitiveBorderWidthsData.push({ key, token: refKey, cssVar: varName, value: token.value });
}

rootLines.push("");
rootLines.push("  /* Primitive Breakpoints (Tier 1) */");
const primitiveBreakpointsData = [];
for (const [key, token] of Object.entries(breakpointsPrim.breakpoint)) {
  const varName = `--breakpoint-${key}`;
  const refKey = `breakpoint.${key}`;
  rootLines.push(`  ${varName}: ${token.value};`);
  primitiveBreakpointsData.push({
    key,
    token: refKey,
    cssVar: varName,
    value: token.value,
    description: token.description || "",
  });
}

/* =========================================================
 * TIER 2: SEMANTIC
 * ========================================================= */
rootLines.push("");
rootLines.push("  /* Semantic Colors (Tier 2 — Light & Dark Overrides) */");
const darkColorLines = [];
const semanticColorsData = {
  brand: [],
  surface: [],
  text: [],
  border: [],
  status: [],
};

for (const [group, entries] of Object.entries(colorsSem)) {
  if (!semanticColorsData[group]) semanticColorsData[group] = [];
  for (const [name, token] of Object.entries(entries)) {
    const varName = `--${group}-${name}`;
    const refKey = `${group}.${name}`;
    const ctx = `semantic/colors.${refKey}`;
    const cssRef = resolveToCssVar(token.value, ctx);
    const literalVal = resolveToLiteral(token.value, ctx);
    const primRef = resolvePrimitiveRef(token.value, ctx);

    const darkVal = token.dark || token.value;
    const darkCssRef = resolveToCssVar(darkVal, `${ctx}.dark`);
    const darkLiteralVal = resolveToLiteral(darkVal, `${ctx}.dark`);

    refToCssVar.set(refKey, `var(${varName})`);
    refToResolved.set(refKey, literalVal);
    refToPrimitiveRef.set(refKey, primRef);

    rootLines.push(`  ${varName}: ${cssRef};`);
    darkColorLines.push(`  ${varName}: ${darkCssRef};`);
    semanticColorsData[group].push({
      group,
      name,
      token: refKey,
      cssVar: varName,
      reference: token.value,
      resolvedValue: literalVal,
      darkReference: darkVal,
      darkResolvedValue: darkLiteralVal,
      description: token.description || "",
    });
  }
}

rootLines.push("");
rootLines.push("  /* Semantic Spacings — Proximity & Layout (Tier 2) */");
const mobileSpacingRootLines = [];
const semanticSpacingsData = {
  proximity: [],
  layout: [],
};

for (const [group, entries] of Object.entries(spacingsSem)) {
  if (!semanticSpacingsData[group]) semanticSpacingsData[group] = [];
  for (const [name, token] of Object.entries(entries)) {
    const varName = `--space-${group}-${name}`;
    const refKey = `${group}.${name}`;
    const ctx = `semantic/spacings.${refKey}`;
    const cssRef = resolveToCssVar(token.value, ctx);
    const literalVal = resolveToLiteral(token.value, ctx);

    refToCssVar.set(refKey, `var(${varName})`);
    refToResolved.set(refKey, literalVal);

    rootLines.push(`  ${varName}: ${cssRef};`);

    let mobileReference;
    let mobileResolvedValue;
    if (token.mobile) {
      mobileReference = token.mobile;
      const mobileCssRef = resolveToCssVar(token.mobile, `${ctx}.mobile`);
      mobileResolvedValue = resolveToLiteral(token.mobile, `${ctx}.mobile`);
      mobileSpacingRootLines.push(`    ${varName}: ${mobileCssRef};`);
    }

    semanticSpacingsData[group].push({
      group,
      name,
      token: refKey,
      cssVar: varName,
      reference: token.value,
      resolvedValue: literalVal,
      ...(mobileReference ? { mobileReference, mobileResolvedValue } : {}),
      description: token.description || "",
    });
  }
}

const classLines = [];
const mobileTypoLines = [];
const semanticTypographyData = {
  display: [],
  heading: [],
  body: [],
  label: [],
};

for (const [group, entries] of Object.entries(typographySem)) {
  if (!semanticTypographyData[group]) semanticTypographyData[group] = [];
  for (const [name, token] of Object.entries(entries)) {
    const val = token.value;
    const ctx = `semantic/typography.${group}.${name}`;
    const className = `type-${group}-${name}`;

    const fontFamilyCss = resolveToCssVar(val.fontFamily, `${ctx}.fontFamily`);
    const fontSizeCss = resolveToCssVar(val.fontSize, `${ctx}.fontSize`);
    const fontWeightCss = resolveToCssVar(val.fontWeight, `${ctx}.fontWeight`);
    const lineHeightCss = resolveToCssVar(val.lineHeight, `${ctx}.lineHeight`);
    const letterSpacingCss = resolveToCssVar(val.letterSpacing, `${ctx}.letterSpacing`);

    const resolvedStyle = {
      fontFamily: resolveToLiteral(val.fontFamily, `${ctx}.fontFamily`),
      fontSize: resolveToLiteral(val.fontSize, `${ctx}.fontSize`),
      fontWeight: resolveToLiteral(val.fontWeight, `${ctx}.fontWeight`),
      lineHeight: resolveToLiteral(val.lineHeight, `${ctx}.lineHeight`),
      letterSpacing: resolveToLiteral(val.letterSpacing, `${ctx}.letterSpacing`),
    };

    classLines.push(`.${className} {`);
    classLines.push(`  font-family: ${fontFamilyCss};`);
    classLines.push(`  font-size: ${fontSizeCss};`);
    classLines.push(`  font-weight: ${fontWeightCss};`);
    classLines.push(`  line-height: ${lineHeightCss};`);
    classLines.push(`  letter-spacing: ${letterSpacingCss};`);
    classLines.push("}");
    classLines.push("");

    let mobileResolved;
    if (token.mobile) {
      mobileResolved = {};
      mobileTypoLines.push(`  .${className} {`);
      const scaleProps = [
        ["fontFamily", "font-family"],
        ["fontSize", "font-size"],
        ["fontWeight", "font-weight"],
        ["lineHeight", "line-height"],
        ["letterSpacing", "letter-spacing"],
      ];
      for (const [propKey, cssProp] of scaleProps) {
        if (token.mobile[propKey]) {
          mobileResolved[propKey] = resolveToLiteral(
            token.mobile[propKey],
            `${ctx}.mobile.${propKey}`
          );
          const propCss = resolveToCssVar(
            token.mobile[propKey],
            `${ctx}.mobile.${propKey}`
          );
          mobileTypoLines.push(`    ${cssProp}: ${propCss};`);
        }
      }
      mobileTypoLines.push("  }");
      mobileTypoLines.push("");
    }

    semanticTypographyData[group].push({
      group,
      name,
      token: `${group}.${name}`,
      className,
      value: val,
      resolved: resolvedStyle,
      ...(mobileResolved ? { mobileResolved } : {}),
      description: token.description || "",
    });
  }
}

/* =========================================================
 * TIER 3: COMPONENTS
 * ========================================================= */
rootLines.push("");
rootLines.push("  /* Component Tokens (Tier 3) */");
const componentTokensData = {};

for (const [group, { sourceFile, entries }] of componentGroupEntries) {
  componentTokensData[group] = [];
  for (const [name, token] of Object.entries(entries)) {
    const varName = `--comp-${group}-${name}`;
    const refKey = `${group}.${name}`;
    const ctx = `${sourceFile}:${refKey}`;
    const cssRef = resolveToCssVar(token.value, ctx);
    const literalVal = resolveToLiteral(token.value, ctx);
    const primRef = resolvePrimitiveRef(token.value, ctx);

    rootLines.push(`  ${varName}: ${cssRef};`);
    componentTokensData[group].push({
      group,
      name,
      token: refKey,
      cssVar: varName,
      reference: token.value,
      primitiveRef: primRef,
      resolvedValue: literalVal,
      type: token.type || "unknown",
      description: token.description || "",
    });
  }
}

/* =========================================================
 * FONT & CSS OUTPUT
 * ========================================================= */
let fontFaceBlock = "";
if (fs.existsSync(fontSrc)) {
  fontFaceBlock = [
    "@font-face {",
    "  font-family: 'Extenda 30 Deca';",
    "  src: url('/fonts/Extenda-30-Deca.otf') format('opentype');",
    "  font-weight: 400;",
    "  font-style: normal;",
    "  font-display: swap;",
    "}",
    "",
    "",
  ].join("\n");
}

const banner = [
  "/* AUTO-GENERATED FROM frontend/tokens (primitives, semantic, components) — DO NOT EDIT MANUALLY */",
  "/* Run `npm run tokens:build` in frontend/ to regenerate. */",
  "",
].join("\n");

const darkThemeBlock = `[data-theme="dark"] {\n  color-scheme: dark;\n${darkColorLines.join("\n")}\n}\n\n`;
const mobileResponsiveBlock =
  `@media (max-width: 767px) {\n  :root {\n${mobileSpacingRootLines.join("\n")}\n  }\n\n${mobileTypoLines.join("\n")}\n}\n`;

const cssOutput = `${banner}${fontFaceBlock}:root {\n  color-scheme: light;\n${rootLines.join("\n")}\n}\n\n${darkThemeBlock}${classLines.join("\n")}${mobileResponsiveBlock}`;

fs.mkdirSync(path.dirname(outputCssFile), { recursive: true });
fs.writeFileSync(outputCssFile, cssOutput, "utf8");
console.log(`Generated ${path.relative(frontendRoot, outputCssFile)} (${cssOutput.length} bytes)`);

/* =========================================================
 * TYPED TOKENS DATA MODULE (tokens-data.ts)
 * ========================================================= */
const tsBanner = [
  "// AUTO-GENERATED FROM frontend/tokens/**/*.json — DO NOT EDIT MANUALLY",
  "// Run `npm run tokens:build` in frontend/ to regenerate.",
  "",
].join("\n");

const componentGroupUnion =
  Object.keys(componentTokensData)
    .map((group) => JSON.stringify(group))
    .join(" | ") || "never";

const tsTypes = `export interface PrimitiveColorShade {
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

export type ComponentTokenGroup = ${componentGroupUnion};

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
`;

const tsOutput = [
  tsBanner,
  tsTypes,
  `export const PRIMITIVE_COLORS: PrimitiveColorGroup[] = ${JSON.stringify(primitiveColorsData, null, 2)};\n`,
  `export const PRIMITIVE_TYPOGRAPHY: PrimitiveTypographyMap = ${JSON.stringify(primitiveTypographyData, null, 2)};\n`,
  `export const PRIMITIVE_SPACINGS: PrimitiveToken[] = ${JSON.stringify(primitiveSpacingsData, null, 2)};\n`,
  `export const PRIMITIVE_BORDER_RADIUS: PrimitiveToken[] = ${JSON.stringify(primitiveBorderRadiusData, null, 2)};\n`,
  `export const PRIMITIVE_BORDER_WIDTHS: PrimitiveToken[] = ${JSON.stringify(primitiveBorderWidthsData, null, 2)};\n`,
  `export const PRIMITIVE_BREAKPOINTS: PrimitiveBreakpointToken[] = ${JSON.stringify(primitiveBreakpointsData, null, 2)};\n`,
  `export const SEMANTIC_COLORS: Record<SemanticColorGroup, SemanticColorToken[]> = ${JSON.stringify(semanticColorsData, null, 2)};\n`,
  `export const SEMANTIC_SPACINGS: Record<SemanticSpacingGroup, SemanticSpacingToken[]> = ${JSON.stringify(semanticSpacingsData, null, 2)};\n`,
  `export const SEMANTIC_TYPOGRAPHY: Record<SemanticTypographyGroup, SemanticTypographyToken[]> = ${JSON.stringify(semanticTypographyData, null, 2)};\n`,
  `export const COMPONENT_TOKENS: Record<ComponentTokenGroup, ComponentToken[]> = ${JSON.stringify(componentTokensData, null, 2)};\n`,
].join("\n");

fs.mkdirSync(path.dirname(outputDataFile), { recursive: true });
fs.writeFileSync(outputDataFile, tsOutput, "utf8");
console.log(`Generated ${path.relative(frontendRoot, outputDataFile)} (${tsOutput.length} bytes)`);
