# ⚡ Frontend Turborepo Monorepo

Frontend monorepo quản lý toàn bộ các ứng dụng giao diện (Web Admin, Mobile App) và các thư viện dùng chung (Shared Packages) của hệ thống **SecurityGate (SEP490)** bằng **Turborepo**.

---

## 📂 Cấu Trúc Thư Mục

```text
frontend/
├── package.json              # Root npm workspace & script Turborepo + Design System
├── turbo.json                # Pipeline tasks orchestration (build, lint, test, dev)
├── .gitignore                # Bỏ qua node_modules, .turbo, .next, build/
├── assets/                   # Nguồn tài nguyên thiết kế dùng chung (Brand, Fonts, Illustrations)
│   ├── brand/                # SVG thương hiệu gốc (logo.svg, logo-text.svg, footer.svg)
│   ├── fonts/                # Font chữ gốc (Extenda-30-Deca.otf)
│   ├── illustrations/        # Nguồn SVG minh họa trích xuất runtime (404.svg)
│   └── references/           # File mockup/spec tham khảo nội bộ (không deploy runtime)
├── tokens/                   # Pure JSON Design Tokens 3 tầng (Single Source of Truth)
│   ├── primitives/           # Tầng 1: màu sắc, typography, spacing, radius, border, breakpoints
│   ├── semantic/             # Tầng 2: biến ngữ nghĩa Light/Dark & Responsive
│   └── components/           # Tầng 3: 1 file JSON/component (button, badge, input, card, table, expand-card)
├── scripts/                  # Công cụ biên dịch tokens & đồng bộ assets
│   ├── build-tokens.mjs      # Biên dịch JSON tokens -> src/generated/tokens.css & tokens-data.ts
│   └── sync-assets.mjs       # Đồng bộ fonts, brand SVG & trích xuất status-phone.png -> public/
├── apps/
│   ├── web/                  # Ứng dụng Web Quản trị / Giám sát cổng an ninh (Next.js 14)
│   │   ├── Dockerfile        # Đóng gói standalone container phục vụ triển khai
│   │   ├── vercel.json       # Cấu hình build/install/ignore monorepo khi deploy Vercel
│   │   ├── package.json
│   │   ├── public/           # Static assets phục vụ qua HTTP (/brand, /fonts, /illustrations)
│   │   └── src/
│   │       ├── app/          # Next.js App Router (/, /dev/tokens, error, not-found)
│   │       ├── components/   # Component theo domain (brand, dev, status, theme)
│   │       ├── generated/    # File auto-generated từ tokens/ (tokens.css, tokens-data.ts)
│   │       └── styles/       # Custom CSS thủ công (dev-tokens.css)
│   └── mobile/               # Ứng dụng Di động Client & Bảo vệ trực chốt (Flutter 3.24)
│       ├── Dockerfile        # Build release APK
│       ├── Dockerfile.web    # Build Flutter Web phục vụ qua Nginx
│       └── package.json      # Script wrapper tích hợp luồng lệnh Turborepo
└── packages/
    ├── ui/                   # Thư viện React UI Component dùng chung (@repo/ui)
    ├── eslint-config/        # Bộ cấu hình ESLint chuẩn hóa (@repo/eslint-config)
    └── typescript-config/    # Bộ cấu hình TypeScript kế thừa (@repo/typescript-config)
```

---

## 🛠️ Hướng Dẫn Phát Triển

### 1. Cài đặt Dependencies
Từ thư mục `frontend/`:
```bash
npm install
```

### 2. Đồng Bộ Design Tokens & Assets
Khi chỉnh sửa JSON trong `tokens/` hoặc file gốc trong `assets/`, chạy từ thư mục `frontend/`:
```bash
# Biên dịch Design Tokens + đồng bộ toàn bộ assets
npm run design:sync

# Hoặc chạy riêng lẻ từng bước:
npm run tokens:build   # Chỉ biên dịch tokens/*.json -> apps/web/src/generated/
npm run assets:sync    # Chỉ đồng bộ assets/ -> apps/web/public/
```

### 3. Chạy Môi Trường Dev Toàn Bộ Ứng Dụng
```bash
npm run dev
```
Hoặc chỉ chạy riêng ứng dụng Web:
```bash
npm run dev --filter=web
```

### 4. Build Toàn Bộ
```bash
npm run build
```

### 5. Kiểm Tra Linter & Tests
```bash
npm run lint
npm run test
```

---

## 🚀 Deploy Lên Vercel

Cấu hình monorepo (`framework`, `installCommand`, `buildCommand`, `ignoreCommand`) đã được khai báo sẵn trong `apps/web/vercel.json`.

Trên **Vercel Project Settings**, chỉ cần thiết lập thêm:
- **Root Directory**: `frontend/apps/web`
- **Include source files outside the Root Directory in the Build Step**: **Enabled** *(Settings → General → Root Directory)*
- **Node.js Version**: `22.x` *(hoặc `20.x`)*
- **Environment Variables**: `NEXT_PUBLIC_API_URL` *(URL backend khi kết nối API)*

