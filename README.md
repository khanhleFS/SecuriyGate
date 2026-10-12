# 🛡️ SecurityGate Monorepo

Hệ thống quản lý và kiểm soát cổng an ninh ra/vào (Security Gate System) đa nền tảng, phục vụ dự án đồ án tốt nghiệp / đồ án kỹ thuật phần mềm (SEP490).

---

## 🏗️ Cấu Trúc Dự Án (Repository Structure)

```text
SEP/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml       # CI/CD cho Java Spring Boot
│   │   ├── frontend.yml      # CI/CD cho Frontend Monorepo (Turborepo/Next.js)
│   │   └── mobile.yml        # CI/CD cho Flutter (apps/mobile)
│   └── dependabot.yml        # Tự động quét cập nhật bảo mật hằng tuần
├── backend/                  # API Server (Java 21, Spring Boot, PostgreSQL, Redis)
├── frontend/                 # Frontend Monorepo (Turborepo)
│   ├── package.json          # Root npm workspaces
│   ├── turbo.json            # Cấu hình pipeline Turborepo
│   ├── apps/
│   │   ├── web/              # Ứng dụng Web quản trị (Next.js 14, Node.js 22)
│   │   └── mobile/           # Ứng dụng di động (Flutter 3.24)
│   └── packages/             # Shared packages (@repo/ui, @repo/eslint-config, @repo/typescript-config)
├── iot/                      # Hệ thống IoT & Edge Gateway Controller (Python, MQTT, RTSP, Relay)
├── research/                 # Nghiên cứu AI & Tối ưu hóa mô hình biên (ALPR, YOLO, ONNX, INT8 Benchmark)
├── deploy/                   # Chứa cấu hình triển khai Production (Nginx, SSL, K8s)
├── .editorconfig             # Quy chuẩn định dạng mã nguồn nhất quán
├── .env.example              # Mẫu biến môi trường an toàn (không chứa secret)
├── .gitattributes            # Chuẩn hóa ký tự kết thúc dòng (LF/CRLF)
├── .gitignore                # Danh sách loại trừ tệp nhạy cảm và build artifact
├── docker-compose.yml        # Cấu hình cụm dịch vụ Local / Testing (DB, Redis, Backend, Web)
└── README.md                 # Tài liệu hướng dẫn phát triển
```

---

## 💻 Yêu Cầu Cài Đặt (Prerequisites)

- **Java Development Kit (JDK):** Version 21 (Temurin hoặc OpenJDK)
- **Node.js & npm:** Node.js 22 LTS (kèm npm 10+)
- **Python:** Version 3.10 / 3.11 (phục vụ `research/` và `iot/`)
- **Flutter SDK:** Version 3.24.x (kèm Android SDK 34 / Java 17)
- **Docker & Docker Compose:** Docker Desktop hoặc Docker Engine 24+

---

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local Development)

### 1. Khởi động hạ tầng CSDL & Cache với Docker Compose
Chạy PostgreSQL và Redis trên nền background:
```bash
docker compose up -d postgres redis
```
- PostgreSQL: `localhost:5432` (DB: `securitygate_db`, User: `postgres`, Password: `password123`)
- Redis: `localhost:6379`

Hoặc chạy toàn bộ bao gồm cả container Backend & Web:
```bash
docker compose up -d --build
```

---

### 2. Chạy Backend (Spring Boot)
Tạo tệp cấu hình môi trường từ mẫu:
```bash
cp .env.example .env
```
Khởi chạy dịch vụ Backend:
```bash
cd backend

# Trên Windows
.\mvnw.cmd spring-boot:run

# Trên Linux / macOS
./mvnw spring-boot:run
```
- API Base URL: `http://localhost:8080`

---

### 3. Chạy Frontend Monorepo (Turborepo)
```bash
cd frontend

# Cài đặt toàn bộ dependencies trong monorepo
npm install

# Chạy dev server cho toàn bộ hoặc riêng Web:
npm run dev --filter=web
```
- Web Application: `http://localhost:3000`

---

### 4. Chạy Frontend Mobile (Flutter)
```bash
cd frontend/apps/mobile
flutter pub get
flutter run
```

---

### 5. Chạy IoT Edge Gateway & Nghiên Cứu AI
```bash
# Khởi chạy Edge Gateway
cd iot
docker compose -f docker-compose.edge.yml up -d

# Chạy benchmark mô hình AI trên edge
cd ../research/evaluation
python benchmark_edge.py --model ../models/plate_detect.onnx
```

---

## 🌿 Quy Trình Nhánh & Pull Request (Git Flow & PR Conventions)

1. **Nhánh chính (Branching Strategy):**
   - `main`: Nhánh Production. Code trên `main` luôn ở trạng thái sẵn sàng phát hành.
   - `dev`: Nhánh tích hợp chính trong quá trình phát triển tính năng.
   - Nhánh tính năng: `feature/<ten-tinh-nang>`, `bugfix/<loi-can-sua>`, `chore/<task>`.
2. **Quy tắc tạo Pull Request (PR):**
   - Mọi đóng góp phải thông qua Pull Request vào `dev` hoặc `main`.
   - Tiêu đề commit / PR theo chuẩn Conventional Commits:
     - `feat: thêm chức năng quét thẻ RFID`
     - `fix: sửa lỗi phân quyền JWT guard`
     - `chore: cập nhật cấu hình CI/CD`
   - Bắt buộc tất cả các automated check của GitHub Actions phải **Pass (Xanh)** trước khi hợp nhất (merge).

---

## ⚙️ Danh Sách CI/CD Workflows

Hệ thống tự động hóa kích hoạt kiểm thử dựa trên đường dẫn thay đổi (Path Filtering):

| Workflow | File Cấu Hình | Điều Kiện Kích Hoạt | Công Việc Thực Hiện |
| :--- | :--- | :--- | :--- |
| **Backend CI/CD** | `.github/workflows/backend.yml` | Đổi file trong `backend/**` | Test (`mvn test`), Package JAR, Build Docker Image |
| **Frontend CI/CD** | `.github/workflows/frontend.yml` | Đổi file trong `frontend/**` (trừ mobile) | Cài đặt npm monorepo, Lint Turborepo, Build Next.js |
| **Mobile CI/CD** | `.github/workflows/mobile.yml` | Đổi file trong `frontend/apps/mobile/**` | Static analyze, Unit Test, Build Release APK |
| **Dependabot** | `.github/dependabot.yml` | Lịch trình hằng tuần | Tự động quét và đề xuất cập nhật bảo mật thư viện |
