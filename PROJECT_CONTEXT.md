# 🛡️ PROJECT CONTEXT: SECURITY GATE (SEP490)

> **Tài liệu Context Dự Án Toàn Diện**  
> *Được khởi tạo và cập nhật từ phân tích toàn bộ mã nguồn, cấu trúc kho lưu trữ, hạ tầng Docker và CI/CD.*  
> *Cập nhật:* 30/09/2026 | *Repository:* `khanhleFS/SecuriyGate` | *Branch mặc định:* `dev` / `main`

---

## 1. 📌 TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

- **Tên dự án:** Security Gate System (`SecuriyGate` - SEP490 Capstone Project).
- **Mục tiêu hệ thống:** Xây dựng giải pháp phần mềm quản lý kiểm soát an ninh cổng ra/vào (Security Gate / Access Control & Monitoring System), hỗ trợ xác thực danh tính, quản lý lượt ra vào, kiểm soát quyền truy cập và giám sát bảo mật.
- **Mô hình kiến trúc tổng thể:** Hệ thống đa nền tảng (Multi-platform Monorepo) gồm:
  - **Backend API Server (`backend/`):** Cung cấp RESTful API, quản lý nghiệp vụ, xác thực (Authentication/Authorization) và kết nối CSDL PostgreSQL/Redis.
  - **Frontend Turborepo Monorepo (`frontend/`):** Quản lý tập trung các client apps và shared packages qua Turborepo:
    - `frontend/apps/web/`: Ứng dụng Web Quản trị / Giám sát cổng an ninh (Next.js 14).
    - `frontend/apps/mobile/`: Ứng dụng Di động dành cho Người dùng cuối & Bảo vệ tuần tra (Flutter 3.24).
    - `frontend/packages/`: Thư viện dùng chung (`ui`, `eslint-config`, `typescript-config`).
  - **Hệ thống IoT & Edge Gateway (`iot/`):** Điều khiển thiết bị biên tại cổng (Barrier gate, camera RTSP, cảm biến loop/quang, đầu đọc thẻ RFID, MQTT client).
  - **Nghiên cứu AI & Tối ưu hóa Biên (`research/`):** Nghiên cứu các mô hình Computer Vision (ALPR nhận diện biển số xe, nhận diện khuôn mặt), tối ưu hóa ONNX/INT8 và benchmark hiệu năng trên Edge Device (RPi4/Jetson).
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

### 2.2. Frontend Monorepo (`frontend/` - Turborepo)
- **Công cụ điều phối Monorepo:** Turborepo 2.x kết hợp npm workspaces (`apps/*`, `packages/*`).
- **Ứng dụng Web (`frontend/apps/web/`):** Next.js 14 App Router (Node.js 22 LTS), output standalone, cổng `3000`.
- **Ứng dụng Mobile (`frontend/apps/mobile/`):** Flutter 3.24 (Dart SDK), Android SDK 34, script wrapper npm tích hợp luồng lệnh Turborepo.
- **Shared Packages (`frontend/packages/`):**
  - `@repo/ui`: Component UI React/Tailwind dùng chung.
  - `@repo/eslint-config`: Cấu hình linting chuẩn hóa.
  - `@repo/typescript-config`: Cấu hình tsconfig nền tảng kế thừa.

### 2.3. Hệ Thống IoT & Edge Gateway (`iot/`)
- **Runtime:** Python 3.11 trên nền tảng Edge (Raspberry Pi 4 / NVIDIA Jetson).
- **Kết nối ngoại vi:** Rơ-le điều khiển barrier (GPIO Active-Low), cảm biến an toàn chống va đập, đầu đọc RFID (Serial/Wiegand), Camera IP (RTSP snapshot).
- **Giao thức truyền thông:** MQTT (Mosquitto Broker) và RESTful API đồng bộ dữ liệu với Backend.
- **Containerization:** `docker-compose.edge.yml` hỗ trợ privileged mode tương tác phần cứng `/dev`.

### 2.4. Nghiên Cứu AI & Tối Ưu Hóa Mô Hình (`research/`)
- **Mô hình AI:** YOLOv8/v11 (Phát hiện xe & biển số), CRNN/PaddleOCR (Nhận diện ký tự biển số), ArcFace/MobileFaceNet (Nhận diện khuôn mặt).
- **Kỹ thuật tối ưu hóa:** ONNX Export, Graph Simplification (`onnxsim`), Lượng tử hóa FP16 / INT8 Calibration.
- **Benchmark & Đánh giá:** Đo đạc độ trễ suy luận (Latency p50/p95/p99), Throughput (FPS), và RAM/CPU utilization trên thiết bị biên.

### 2.5. DevOps, Hạ tầng & CI/CD
- **Container Orchestration:** Docker Compose (`docker-compose.yml`) điều phối PostgreSQL 16, Redis 7, Backend Spring Boot, và Next.js Web Runner.
- **GitHub Actions Automation (`.github/workflows/`):**
  - `backend.yml`: Kích hoạt khi thay đổi `backend/**`, build JAR, test và đóng gói Docker Image.
  - `frontend.yml`: Kích hoạt khi thay đổi `frontend/**` (trừ mobile), chạy linter monorepo và build Next.js.
  - `mobile.yml`: Kích hoạt khi thay đổi `frontend/apps/mobile/**`, phân tích tĩnh, chạy test và tự động build Release APK.
  - `dependabot.yml`: Tự động quét cập nhật bảo mật hàng tuần cho Maven, npm, Pub, Docker, Actions.

---

## 3. 📂 CẤU TRÚC THƯ MỤC MONOREPO (REPOSITORY TREE)

```text
SEP/
├── .github/
│   ├── workflows/
│   │   ├── backend.yml           # CI/CD cho Backend (Java 21/Maven/Docker)
│   │   ├── frontend.yml          # CI/CD cho Frontend Monorepo (Node 22/Turborepo/Next.js)
│   │   └── mobile.yml            # CI/CD cho Mobile (Flutter 3.24/Android APK)
│   └── dependabot.yml            # Tự động quét cập nhật bảo mật hằng tuần
├── backend/                      # Source code và tài nguyên Backend (Spring Boot)
│   ├── Dockerfile                # Dockerfile multi-stage đóng gói JRE 21 Alpine
│   ├── pom.xml                   # Cấu hình dependency & plugins Maven
│   └── src/                      # Mã nguồn Java Spring Boot
├── frontend/                     # Frontend Monorepo quản lý bởi Turborepo
│   ├── package.json              # Root npm workspaces & scripts Turborepo
│   ├── turbo.json                # Pipeline tasks (build, lint, test, dev)
│   ├── apps/
│   │   ├── web/                  # Nền tảng Web Quản trị (Next.js 14)
│   │   │   ├── Dockerfile        # Multi-stage Dockerfile cho Next.js runner
│   │   │   └── src/              # App router & pages
│   │   └── mobile/               # Nền tảng Mobile App (Flutter 3.24)
│   │       ├── Dockerfile        # Build release APK
│   │       ├── Dockerfile.web    # Build Flutter Web qua Nginx
│   │       └── package.json      # NPM script wrapper cho Turborepo
│   └── packages/
│       ├── ui/                   # Shared React UI components (@repo/ui)
│       ├── eslint-config/        # Shared ESLint config (@repo/eslint-config)
│       └── typescript-config/    # Shared TypeScript config (@repo/typescript-config)
├── iot/                          # Hệ thống IoT & Edge Gateway Controller
│   ├── README.md                 # Tài liệu kiến trúc IoT & quy trình quẹt thẻ
│   ├── docker-compose.edge.yml   # Docker compose chạy trên Edge Device
│   ├── edge-gateway/             # Dịch vụ điều phối trung tâm tại cổng (Python)
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── config/config.example.yaml
│   │   └── src/                  # Mã nguồn camera, rfid, barrier, mqtt
│   ├── firmware/                 # Firmware vi điều khiển phụ trợ (ESP32/Arduino)
│   └── docs/hardware_spec.md     # Sơ đồ kết nối phần cứng & GPIO Pinout
├── research/                     # Nghiên cứu AI & Tối ưu hóa mô hình Edge
│   ├── README.md                 # Tài liệu mục tiêu nghiên cứu & pipeline
│   ├── requirements.txt          # Thư viện Deep Learning, ONNX, OpenCV
│   ├── models/                   # Cấu hình kiến trúc mô hình & weights guide
│   ├── optimization/             # Scripts tối ưu hóa (export_onnx.py, Quantization)
│   ├── evaluation/               # Công cụ đo đạc benchmark (benchmark_edge.py)
│   ├── datasets/                 # Hướng dẫn cấu trúc tập dữ liệu biển số xe
│   └── notebooks/                # Jupyter Notebooks thử nghiệm
├── deploy/
│   └── .gitkeep                  # Thư mục chuẩn bị cho triển khai Production (Nginx, SSL, K8s)
├── .editorconfig                 # Quy chuẩn format code nhất quán giữa các IDE
├── .env.example                  # File mẫu biến môi trường an toàn
├── .gitattributes                # Chuẩn hóa line endings
├── .gitignore                    # Loại trừ file rác, weights nặng, private keys
├── docker-compose.yml            # Điều phối các container (Postgres, Redis, Backend, Web)
├── PROJECT_CONTEXT.md            # Tài liệu tổng quan ngữ cảnh dự án (file này)
└── README.md                     # Hướng dẫn phát triển và onboarding
```

---

## 4. 🔍 HIỆN TRẠNG TRIỂN KHAI & PHÂN TÍCH KỸ THUẬT (AUDIT & CURRENT STATE)

| Hạng mục | Trạng thái hiện tại | Đánh giá & Lưu ý kỹ thuật |
| :--- | :--- | :--- |
| **Cấu trúc Monorepo** | ✅ Chuẩn hóa hoàn tất | Phân chia ranh giới rõ ràng: `backend/`, `frontend/` (Turborepo), `iot/`, `research/`, `deploy/`. |
| **Frontend Monorepo** | ✅ Turborepo sẵn sàng | Đã cấu hình `turbo.json`, npm workspaces (`apps/*`, `packages/*`), shared packages `@repo/ui`, `@repo/eslint-config`, `@repo/typescript-config`. |
| **Hệ thống IoT Edge** | ✅ Khung điều khiển hoàn thiện | Đã có `edge-gateway` (Camera, RFID, Barrier, MQTT), `docker-compose.edge.yml` và tài liệu GPIO Pinout. |
| **Module Research AI**| ✅ Sẵn sàng thực nghiệm | Đã có script `export_onnx.py`, `benchmark_edge.py`, cấu trúc `models/`, `evaluation/`, `datasets/`. |
| **Hạ tầng CI/CD** | ✅ Đã đồng bộ đường dẫn | Cập nhật GitHub Actions workflows cho `backend.yml`, `frontend.yml` (Turborepo), `mobile.yml` (apps/mobile) và `dependabot.yml`. |
| **Hạ tầng Docker** | ✅ Đã cấu hình | Multi-stage Dockerfile cho Backend, Web Standalone, Mobile APK/Web, IoT Gateway. |
| **Mã nguồn Backend** | 🔄 Giai đoạn khởi tạo | Đã có `BackendApplication`, dependencies JPA/Security/PostgreSQL, `AuthenService`. |
| **Mã nguồn Web** | ✅ Khung ứng dụng Next.js | Cấu hình App router Next.js 14, UI components, Tailwind/CSS variables. |
| **Mã nguồn Mobile** | ⏳ Chưa có source Flutter | Đã có cấu hình Dockerfiles, package.json wrapper cho Turborepo. Cần khởi tạo source app (`flutter create`). |
