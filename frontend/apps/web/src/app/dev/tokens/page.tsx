import type { Metadata } from "next";
import "@/styles/dev-tokens.css";
import { TokensExplorer } from "@/components/dev";
import { DesktopOnlyGate } from "@/components/status";

export const metadata: Metadata = {
  title: "Design Tokens (/dev/tokens) | THEN-CHOT",
  description:
    "Hệ thống Design Tokens 3 tầng (Primitives → Semantic → Components) của THEN-CHOT SecurityGate",
};

export default function DevTokensPage() {
  return (
    <DesktopOnlyGate>
      <TokensExplorer />
    </DesktopOnlyGate>
  );
}
