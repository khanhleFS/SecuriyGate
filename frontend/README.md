# ⚡ Frontend Turborepo Monorepo

Frontend monorepo quản lý toàn bộ các ứng dụng giao diện (Web Admin, Mobile App) và các thư viện dùng chung (Shared Packages) của hệ thống **SecurityGate (SEP490)** bằng **Turborepo**.

---

## 📂 Cấu Trúc Thư Mục

```text
frontend/
├── package.json          # Root npm workspace & script Turborepo
├── turbo.json            # Pipeline tasks orchestration (build, lint, test, dev)
├── .gitignore            # Bỏ qua node_modules, .turbo, .next, build/
├── apps/
│   ├── web/              # Ứng dụng Web Quản trị / Giám sát cổng an ninh (Next.js 14)
│   │   ├── Dockerfile    # Đóng gói standalone container phục vụ triển khai
│   │   ├── package.json
│   │   └── src/          # App router, giao diện giám sát & quản lý
│   └── mobile/           # Ứng dụng Di động Client & Bảo vệ trực chốt (Flutter 3.24)
│       ├── Dockerfile    # Build release APK
│       ├── Dockerfile.web# Build Flutter Web phục vụ qua Nginx
│       └── package.json  # Script wrapper tích hợp luồng lệnh Turborepo
└── packages/
    ├── ui/               # Thư viện React UI Component dùng chung (@repo/ui)
    ├── eslint-config/    # Bộ cấu hình ESLint chuẩn hóa (@repo/eslint-config)
    └── typescript-config/# Bộ cấu hình TypeScript kế thừa (@repo/typescript-config)
```

---

## 🛠️ Hướng Dẫn Phát Triển

### 1. Cài đặt Dependencies
Từ thư mục `frontend/`:
```bash
npm install
```

### 2. Chạy Môi Trường Dev Toàn Bộ Ứng Dụng
```bash
npm run dev
```
Hoặc chỉ chạy riêng ứng dụng Web:
```bash
npm run dev --filter=web
```

### 3. Build Toàn Bộ
```bash
npm run build
```

### 4. Kiểm Tra Linter & Tests
```bash
npm run lint
npm run test
```
