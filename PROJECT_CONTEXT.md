# 🛡️ PROJECT CONTEXT: SECURITY GATE (SEP490)

> **Tài liệu Context Dự Án Toàn Diện**  
> *Được khởi tạo và cập nhật từ phân tích toàn bộ mã nguồn, cấu trúc kho lưu trữ, hạ tầng Docker và CI/CD.*  
> *Ngày phân tích:* 30/09/2026 | *Repository:* `khanhleFS/SecuriyGate` | *Branch mặc định:* `dev` / `main`

---

## 1. 📌 TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

- **Tên dự án:** Security Gate System (`SecuriyGate` - SEP490 Capstone Project).
- **Mục tiêu hệ thống:** Xây dựng giải pháp phần mềm quản lý kiểm soát an ninh cổng ra/vào (Security Gate / Access Control & Monitoring System), hỗ trợ xác thực danh tính, quản lý lượt ra vào, kiểm soát quyền truy cập và giám sát bảo mật.
- **Mô hình kiến trúc tổng thể:** Hệ thống đa nền tảng (Multi-platform Monorepo/Multi-service) gồm:
  - **Backend API Server:** Cung cấp RESTful API, quản lý nghiệp vụ, xác thực (Authentication/Authorization) và kết nối CSDL.
  - **Frontend Web:** Ứng dụng Web dành cho Quản trị viên (Admin) / Nhân viên an ninh (Security Guard / Operator) giám sát và quản lý.
  - **Mobile App:** Ứng dụng di động dành cho người dùng cuối (Nhân viên, Cư dân, Khách) hoặc Bảo vệ tuần tra/quét mã tại chốt trực.
  - **Hạ tầng Container & CI/CD:** Đồng bộ hóa quy trình đóng gói qua Docker Compose và tự động hóa kiểm thử/build qua GitHub Actions.

---

## 2. 🏗️ KIẾN TRÚC & CÔNG NGHỆ (TECH STACK)

### 2.1. Backend Service (`Backend/`)
- **Ngôn ngữ & Runtime:** Java 21 (Eclipse Temurin 21).
- **Framework:** Spring Boot (phiên bản `4.1.1` starter parent).
- **Các thành phần Starter chính (`pom.xml`):**
  - `spring-boot-starter-webmvc`: Xây dựng RESTful Web APIs.
  - `spring-boot-starter-security`: Cơ chế bảo mật, phân quyền và xác thực người dùng.
  - `spring-boot-starter-data-jpa`: Tương tác CSDL theo chuẩn ORM (Hibernate).
  - `spring-boot-starter-thymeleaf`: Hỗ trợ template engine (kết hợp `thymeleaf-extras-springsecurity6`).
  - `org.projectlombok:lombok`: Tối giản boilerplate code (Getter, Setter, Builder, Constructor).
  - `spring-boot-h2console` & `com.h2database:h2`: CSDL in-memory phục vụ development/testing nhanh.
  - `spring-boot-devtools`: Hot reload phục vụ phát triển.
- **Hệ cơ sở dữ liệu chính:** PostgreSQL 16 (cấu hình qua Docker Compose: `securitygate_db`).
- **Bộ nhớ đệm / Cache:** Redis 7 (dự kiến dùng cho Blacklist JWT Tokens, Caching, Session).
- **Đóng gói Docker:** Multi-stage build (`eclipse-temurin:21-jdk-alpine` -> `eclipse-temurin:21-jre-alpine`), chạy user non-root `spring:spring`, mở cổng `8080`.

### 2.2. Frontend Web Application (`frontend/`)
- **Framework định hướng:** Next.js (Node.js 20).
- **Môi trường & Đóng gói:** Multi-stage Dockerfile (`deps` -> `builder` -> `runner` standalone).
- **Cấu hình Web Server:** Chạy Node server độc lập qua output standalone (`node server.js`), cổng `3000`.
- **Giao tiếp API:** Tương tác RESTful với Backend thông qua biến môi trường `NEXT_PUBLIC_API_URL`.

### 2.3. Mobile Application (`mobile/`)
- **Framework định hướng:** Flutter 3.24.0 (Dart SDK).
- **Môi trường Build & Android Target:** Android SDK Platform 34 (Android 14), Build-tools 34.0.0, OpenJDK 17.
- **Đóng gói Docker:** 
  - `mobile/Dockerfile`: Ubuntu 22.04 base tích hợp Android SDK Tools và Flutter SDK dùng để build release APK (`--split-per-abi`).
  - `mobile/Dockerfile.web`: Hỗ trợ đóng gói Flutter Web đa tầng và chạy bằng máy chủ Nginx Alpine siêu nhẹ (port 80).

### 2.4. DevOps, Hạ tầng & CI/CD
- **Container Orchestration:** Docker Compose (`docker-compose.yml`) liên kết 3 dịch vụ cơ sở:
  - `postgres` (`sep-postgres`): Database PostgreSQL 16, healthcheck tự động, port `5432`.
  - `redis` (`sep-redis`): Redis 7 server, port `6379`.
  - `backend` (`sep-backend`): Spring Boot App kết nối tới PostgreSQL, port `8080`.
- **GitHub Actions Automation (`.github/workflows/`):**
  - `backend.yml`: Chạy trên nhánh `main`, thực thi `mvnw clean test`, build JAR artifact, đóng gói Docker Image.
  - `frontend.yml`: Setup Node 20, cache dependencies, thực thi `npm ci`, `npm run lint`, và build Next.js.
  - `mobile.yml`: Setup Java 17 + Flutter SDK stable, `flutter pub get`, `flutter analyze`, `flutter test`, tự động build Release APKs và upload Artifact khi merge vào `main`.

---

## 3. 📂 CẤU TRÚC THƯ MỤC DỰ ÁN (PROJECT DIRECTORY TREE)

```text
SEP/
├── .github/
│   └── workflows/
│       ├── backend.yml           # Pipeline CI/CD cho Backend (Java 21/Maven/Docker)
│       ├── frontend.yml          # Pipeline CI/CD cho Frontend (Node 20/Next.js)
│       └── mobile.yml            # Pipeline CI/CD cho Mobile (Flutter 3.24/Android APK)
├── Backend/                      # Source code và tài nguyên Backend (Spring Boot)
│   ├── .mvn/wrapper/             # Maven Wrapper cấu hình binary
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── com/sep490/backend/
│   │   │   │   │   └── BackendApplication.java   # Spring Boot Main Entry Point
│   │   │   │   └── service/
│   │   │   │       ├── AuthenService.java         # Interface xác thực (khởi tạo sơ khai)
│   │   │   │       └── serviceImpl/
│   │   │   │           └── AuthenServiceImpl.java # Implementation xác thực (placeholder)
│   │   │   └── resources/
│   │   │       └── application.properties        # Cấu hình runtime Spring Boot
│   │   └── test/
│   │       └── java/com/sep490/backend/
│   │           └── BackendApplicationTests.java  # Smoke test khởi tạo ApplicationContext
│   ├── Dockerfile                # Dockerfile multi-stage đóng gói JRE 21 Alpine
│   ├── HELP.md                   # Spring Boot default help guide
│   ├── mvnw / mvnw.cmd           # Scripts chạy Maven Wrapper trên Linux/Windows
│   └── pom.xml                   # Cấu hình dependency & plugins Maven
├── frontend/                     # Nền tảng Web Frontend (Next.js)
│   ├── .dockerignore             # Loại trừ file rác khi build Docker Frontend
│   └── Dockerfile                # Multi-stage Dockerfile cho Next.js standalone runner
├── mobile/                       # Nền tảng Mobile App (Flutter)
│   ├── .dockerignore             # Loại trừ file rác khi build Docker Mobile
│   ├── Dockerfile                # Môi trường build APK Android tách ABI
│   └── Dockerfile.web            # Dockerfile build Flutter Web phục vụ qua Nginx
├── .gitignore                    # Root gitignore quy định file loại trừ
├── docker-compose.yml            # Điều phối các container (Postgres, Redis, Backend)
└── PROJECT_CONTEXT.md            # Tài liệu tổng quan ngữ cảnh dự án (file này)
```

---

## 4. 🔍 HIỆN TRẠNG TRIỂN KHAI & PHÂN TÍCH KỸ THUẬT (AUDIT & CURRENT STATE)

| Hạng mục | Trạng thái hiện tại | Đánh giá & Lưu ý kỹ thuật |
| :--- | :--- | :--- |
| **Khung dự án (Scaffolding)** | ✅ Đã hoàn tất khung cơ sở | Đã phân chia rõ ranh giới giữa Backend, Frontend và Mobile. |
| **Hạ tầng CI/CD** | ✅ Đã cấu hình hoàn chỉnh | Đã có sẵn 3 workflow chuẩn GitHub Actions cho cả 3 nền tảng. |
| **Hạ tầng Docker** | ✅ Đã có Dockerfiles & Compose | Đã viết Dockerfile multi-stage tối ưu dung lượng cho từng service. |
| **Mã nguồn Backend** | 🔄 Giai đoạn khởi tạo (Inception) | Đã có `BackendApplication`, dependencies JPA/Security/PostgreSQL. Đang có skeleton `AuthenService`. |
| **Mã nguồn Frontend** | ⏳ Chưa có source code Next.js | Mới có cấu hình `.dockerignore` và `Dockerfile`. Cần khởi tạo source app (`npx create-next-app`). |
| **Mã nguồn Mobile** | ⏳ Chưa có source code Flutter | Mới có cấu hình `Dockerfile` và `Dockerfile.web`. Cần khởi tạo source app (`flutter create`). |

### ⚠️ Các điểm kỹ thuật cần chú ý & cải thiện ngay:
1. **Quy ước đặt tên package Java (`com.sep490.backend`):**
   - Lớp chính `BackendApplication` nằm ở `com.sep490.backend`.
   - Lớp `AuthenService` và `AuthenServiceImpl` hiện đang đặt trực tiếp ở root package `service` (thay vì `com.sep490.backend.service`). Nếu để vậy, cơ chế `@ComponentScan` mặc định của Spring Boot sẽ **không quét được** các Bean này trừ khi cấu hình thêm `@ComponentScan(basePackages = {"com.sep490.backend", "service"})`. Khuyến nghị: Chuyển toàn bộ vào `com.sep490.backend.service`.
2. **Tính phân biệt hoa - thường của tên thư mục (`Backend` vs `backend`):**
   - Trong `docker-compose.yml` và workflow CI/CD sử dụng đường dẫn `./Backend`, trong khi trên một số hệ điều hành (như Linux / Docker host) hệ thống tệp phân biệt chữ hoa - thường. Cần chuẩn hóa đồng nhất tên thư mục thành `backend` hoặc `Backend` trên toàn bộ config.
3. **Cấu hình DataSource trong `application.properties`:**
   - File `application.properties` hiện mới chỉ có `spring.application.name=Backend`. Khi chạy trực tiếp ngoài Docker (Local run), cần bổ sung cấu hình kết nối DB (hoặc profile `dev` dùng H2 in-memory, `prod` dùng PostgreSQL).
4. **Dependency PostgreSQL JDBC:**
   - Trong `pom.xml`, hệ thống đã có `spring-boot-starter-data-jpa` và `h2`, nhưng chưa khai báo driver PostgreSQL (`org.postgresql:postgresql`). Khi kết nối Postgres thực tế trong Docker Compose, Spring Boot sẽ cần dependency này.

---

## 5. 🚀 HƯỚNG DẪN CHẠY VÀ PHÁT TRIỂN (DEVELOPMENT GUIDE)

### 5.1. Khởi động nhanh hạ tầng bằng Docker Compose
Để khởi động toàn bộ cụm CSDL PostgreSQL, Redis và Backend:
```bash
# Khởi chạy cụm database và backend
docker compose up -d

# Xem log các service
docker compose logs -f backend
```
- **PostgreSQL Database:** `localhost:5432` (Database: `securitygate_db`, User: `postgres`, Password: `password123`)
- **Redis Server:** `localhost:6379`
- **Backend API:** `http://localhost:8080`

### 5.2. Chạy Backend độc lập (Local Java Dev)
Yêu cầu: JDK 21+
```bash
cd Backend
# Windows
.\mvnw.cmd clean spring-boot:run

# Linux / MacOS
./mvnw clean spring-boot:run
```

### 5.3. Khởi tạo mã nguồn cho Frontend (Next.js)
```bash
cd frontend
# Tạo Next.js project với App Router, Typescript, Tailwind CSS
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```
*Lưu ý:* Cần cấu hình `output: 'standalone'` trong `next.config.js` để tương thích hoàn toàn với `frontend/Dockerfile`.

### 5.4. Khởi tạo mã nguồn cho Mobile (Flutter)
```bash
cd mobile
# Khởi tạo project Flutter
flutter create --org com.sep490 --project-name securitygate_mobile .
```

---

## 6. 🗺️ LỘ TRÌNH ĐỀ XUẤT TIẾP THEO (NEXT MILESTONES)

1. **Chuẩn hóa kiến trúc Backend:**
   - Tổ chức package theo mô hình layered chuẩn:
     - `com.sep490.backend.controller` (REST Controllers)
     - `com.sep490.backend.service` & `service.impl` (Nghiệp vụ xác thực & an ninh)
     - `com.sep490.backend.repository` (Spring Data JPA Repositories)
     - `com.sep490.backend.entity` (Entities: User, Role, Gate, AccessLog, Card/RFID, v.v.)
     - `com.sep490.backend.dto` (Request/Response DTOs)
     - `com.sep490.backend.config` (SecurityConfig, JWT Filter, CORS, Swagger/OpenAPI)
   - Thêm `org.postgresql:postgresql` vào `pom.xml`.
   - Cấu hình JWT Authentication (Access Token + Refresh Token lưu Redis).
2. **Khởi tạo và tích hợp Frontend:**
   - Tạo bộ UI Dashboard quản lý cổng, xem log người ra vào theo thời gian thực (Server-Sent Events hoặc WebSocket).
3. **Khởi tạo ứng dụng Mobile:**
   - Xây dựng luồng xác thực, quét QR/NFC/RFID hoặc nhận diện khuôn mặt qua Camera điện thoại.
