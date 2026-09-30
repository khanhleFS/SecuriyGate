# 🛡️ PROJECT CONTEXT: SECURITY GATE (SEP490)

> **Tài liệu Context Dự Án Toàn Diện**  
> *Được khởi tạo và cập nhật từ phân tích toàn bộ mã nguồn, cấu trúc kho lưu trữ, hạ tầng Docker và CI/CD.*  
> *Cập nhật:* 30/09/2026 | *Repository:* `khanhleFS/SecuriyGate` | *Branch mặc định:* `dev` / `main`

---

## 1. 📌 TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

- **Tên dự án:** Security Gate System (`SecuriyGate` - SEP490 Capstone Project).
- **Mục tiêu hệ thống:** Xây dựng giải pháp phần mềm quản lý kiểm soát an ninh cổng ra/vào (Security Gate / Access Control & Monitoring System), hỗ trợ xác thực danh tính, quản lý lượt ra vào, kiểm soát quyền truy cập và giám sát bảo mật.
- **Mô hình kiến trúc tổng thể:** Hệ thống đa nền tảng (Multi-platform Monorepo) gồm:
  - **Backend API Server (`backend/`):** Cung cấp RESTful API, quản lý nghiệp vụ, xác thực (Authentication/Authorization) và kết nối CSDL.
  - **Frontend Web (`frontend/web/`):** Ứng dụng Web dành cho Quản trị viên (Admin) / Nhân viên an ninh (Security Guard / Operator) giám sát và quản lý.
  - **Frontend Mobile (`frontend/mobile/`):** Ứng dụng di động dành cho người dùng cuối (Nhân viên, Cư dân, Khách) hoặc Bảo vệ tuần tra/quét mã tại chốt trực.
  - **Hạ tầng Container & CI/CD:** Đồng bộ hóa quy trình đóng gói qua Docker Compose và tự động hóa kiểm thử/build qua GitHub Actions.
  - **Triển khai Production (`deploy/`):** Chứa các cấu hình Nginx, SSL, và Kubernetes cho production.

---

## 2. 🏗️ KIẾN TRÚC & CÔNG NGHỆ (TECH STACK)

### 2.1. Backend Service (`backend/`)
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

### 2.2. Frontend Web Application (`frontend/web/`)
- **Framework định hướng:** Next.js (Node.js 22 LTS).
- **Môi trường & Đóng gói:** Multi-stage Dockerfile (`deps` -> `builder` -> `runner` standalone).
- **Cấu hình Web Server:** Chạy Node server độc lập qua output standalone (`node server.js`), cổng `3000`.
- **Giao tiếp API:** Tương tác RESTful với Backend thông qua biến môi trường `NEXT_PUBLIC_API_URL`.

### 2.3. Frontend Mobile Application (`frontend/mobile/`)
- **Framework định hướng:** Flutter 3.24.0 (Dart SDK).
- **Môi trường Build & Android Target:** Android SDK Platform 34 (Android 14), Build-tools 34.0.0, OpenJDK 17.
- **Đóng gói Docker:** 
  - `frontend/mobile/Dockerfile`: Ubuntu 22.04 base tích hợp Android SDK Tools và Flutter SDK dùng để build release APK (`--split-per-abi`).
  - `frontend/mobile/Dockerfile.web`: Hỗ trợ đóng gói Flutter Web đa tầng và chạy bằng máy chủ Nginx Alpine siêu nhẹ (port 80).

### 2.4. DevOps, Hạ tầng & CI/CD
- **Container Orchestration:** Docker Compose (`docker-compose.yml`) liên kết 3 dịch vụ cơ sở:
  - `postgres` (`sep-postgres`): Database PostgreSQL 16, healthcheck tự động, port `5432`.
  - `redis` (`sep-redis`): Redis 7 server, port `6379`.
  - `backend` (`sep-backend`): Spring Boot App kết nối tới PostgreSQL, port `8080`.
- **GitHub Actions Automation (`.github/workflows/`):**
  - `backend.yml`: Kích hoạt khi thay đổi `backend/**`, thực thi `mvnw clean test`, build JAR artifact, đóng gói Docker Image.
  - `frontend.yml`: Kích hoạt khi thay đổi `frontend/web/**`, setup Node 22, cache dependencies, thực thi `npm ci`, `npm run lint`, và build Next.js.
  - `mobile.yml`: Kích hoạt khi thay đổi `frontend/mobile/**`, setup Java 17 + Flutter SDK stable, `flutter pub get`, `flutter analyze`, `flutter test`, tự động build Release APKs và upload Artifact khi merge vào `main`.
  - `dependabot.yml`: Tự động quét cập nhật hàng tuần cho Maven, npm, Pub, GitHub Actions, Docker.

---

## 3. 📂 CẤU TRÚC THƯ MỤC MONOREPO (REPOSITORY TREE)

```text
SEP/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml           # Pipeline CI/CD cho Backend (Java 21/Maven/Docker)
│   │   ├── frontend.yml          # Pipeline CI/CD cho Frontend Web (Node 22/Next.js)
│   │   └── mobile.yml            # Pipeline CI/CD cho Frontend Mobile (Flutter 3.24/Android APK)
│   └── dependabot.yml            # Tự động quét cập nhật bảo mật hằng tuần
├── backend/                      # Source code và tài nguyên Backend (Spring Boot)
│   ├── .dockerignore             # Loại trừ file thừa khi build Docker Backend
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
├── frontend/
│   ├── web/                      # Nền tảng Web Frontend (Next.js)
│   │   ├── .dockerignore         # Loại trừ file rác khi build Docker Web
│   │   └── Dockerfile            # Multi-stage Dockerfile cho Next.js standalone runner
│   └── mobile/                   # Nền tảng Mobile App (Flutter)
│       ├── .dockerignore         # Loại trừ file rác khi build Docker Mobile
│       ├── Dockerfile            # Môi trường build APK Android tách ABI
│       └── Dockerfile.web        # Dockerfile build Flutter Web phục vụ qua Nginx
├── deploy/
│   └── .gitkeep                  # Thư mục chuẩn bị cho triển khai Production (Nginx, SSL, K8s)
├── .editorconfig                 # Quy chuẩn format code nhất quán giữa các IDE
├── .env.example                  # File mẫu biến môi trường an toàn (không chứa bí mật)
├── .gitattributes                # Chuẩn hóa line endings (LF cho Linux, CRLF cho bat)
├── .gitignore                    # Loại trừ các file bí mật, private keys, build artifacts
├── docker-compose.yml            # Điều phối các container (Postgres, Redis, Backend)
├── PROJECT_CONTEXT.md            # Tài liệu tổng quan ngữ cảnh dự án (file này)
└── README.md                     # Hướng dẫn phát triển và onboarding
```

---

## 4. 🔍 HIỆN TRẠNG TRIỂN KHAI & PHÂN TÍCH KỸ THUẬT (AUDIT & CURRENT STATE)

| Hạng mục | Trạng thái hiện tại | Đánh giá & Lưu ý kỹ thuật |
| :--- | :--- | :--- |
| **Cấu trúc Monorepo** | ✅ Chuẩn hóa hoàn tất | Phân chia ranh giới rõ ràng: `backend/`, `frontend/web/`, `frontend/mobile/`, `deploy/`. |
| **Hạ tầng CI/CD** | ✅ Đã cấu hình hoàn chỉnh | Đã có sẵn 3 workflow chuẩn GitHub Actions cho cả 3 nền tảng với Path Filtering chính xác. |
| **Tự động hóa bảo mật** | ✅ Dependabot cấu hình xong | Quét định kỳ hằng tuần cho Maven, npm, Pub, Actions và Docker. |
| **Hạ tầng Docker** | ✅ Đã có Dockerfiles & Compose | Đã viết Dockerfile multi-stage tối ưu dung lượng cho từng service. |
| **Mã nguồn Backend** | 🔄 Giai đoạn khởi tạo (Inception) | Đã có `BackendApplication`, dependencies JPA/Security/PostgreSQL. Đang có skeleton `AuthenService`. |
| **Mã nguồn Web** | ⏳ Chưa có source code Next.js | Mới có cấu hình `.dockerignore` và `Dockerfile`. Cần khởi tạo source app (`npx create-next-app`). |
| **Mã nguồn Mobile** | ⏳ Chưa có source code Flutter | Mới có cấu hình `Dockerfile` và `Dockerfile.web`. Cần khởi tạo source app (`flutter create`). |

### ⚠️ Các điểm kỹ thuật cần chú ý tiếp theo:
1. **Quy ước đặt tên package Java (`com.sep490.backend`):**
   - Lớp chính `BackendApplication` nằm ở `com.sep490.backend`.
   - Lớp `AuthenService` và `AuthenServiceImpl` hiện đang đặt trực tiếp ở root package `service` (thay vì `com.sep490.backend.service`). Khuyến nghị: Chuyển toàn bộ vào `com.sep490.backend.service`.
2. **Cấu hình DataSource trong `application.properties`:**
   - File `application.properties` hiện mới chỉ có `spring.application.name=Backend`. Khi chạy trực tiếp ngoài Docker (Local run), cần bổ sung cấu hình kết nối DB (hoặc profile `dev` dùng H2 in-memory, `prod` dùng PostgreSQL).
3. **Dependency PostgreSQL JDBC:**
   - Trong `pom.xml`, hệ thống đã có `spring-boot-starter-data-jpa` và `h2`, nhưng chưa khai báo driver PostgreSQL (`org.postgresql:postgresql`). Khi kết nối Postgres thực tế trong Docker Compose, Spring Boot sẽ cần dependency này.
