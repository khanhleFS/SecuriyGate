# 🐳 BỘ CÂU LỆNH DOCKER CHO DỰ ÁN SECURITY GATE (SEP490)

> **Tài liệu tổng hợp các lệnh Docker & Docker Compose chuẩn hóa cho dự án.**  
> Hỗ trợ đầy đủ các kịch bản: Chạy Full-stack, chỉ chạy Hạ tầng (Database/Redis) để Dev máy thật, Build lại mã nguồn, xem Logs và thao tác trực tiếp với Database.

---

## ⚡ 1. CHEAT SHEET - LỆNH THƯỜNG DÙNG NHẤT

| Thao tác | Câu lệnh | Mô tả |
| :--- | :--- | :--- |
| **Bật chỉ DB + Redis** | `docker compose up -d postgres redis` | Dành cho chạy Backend/Frontend trực tiếp trên IDE máy thật |
| **Bật toàn bộ hệ thống** | `docker compose up -d` | Khởi chạy 4 container (Postgres, Redis, Backend, Web) chạy ngầm |
| **Build lại & Chạy** | `docker compose up -d --build` | Biên dịch lại image khi bạn vừa sửa code Backend/Frontend |
| **Xem trạng thái** | `docker compose ps` | Kiểm tra container nào đang sống, cổng map tương ứng |
| **Xem log tất cả** | `docker compose logs -f` | Theo dõi log thời gian thực của toàn bộ hệ thống |
| **Xem log Backend** | `docker compose logs -f backend` | Theo dõi log Spring Boot |
| **Tắt toàn bộ** | `docker compose down` | Dừng và xóa container, giữ nguyên dữ liệu trong Volume |
| **Tắt và xóa sạch DB** | `docker compose down -v` | Xóa sạch toàn bộ container và dữ liệu DB/Redis (Reset trắng) |

---

## 🛠️ 2. CHI TIẾT CÁC KỊCH BẢN CHẠY DỰ ÁN

### 🟢 Kịch bản 1: Dev Local trên IDE (Chỉ bật PostgreSQL + Redis qua Docker)
> **Khuyên dùng khi bạn đang code Backend trên IntelliJ/Eclipse hoặc code Web trên VS Code.**  
> Máy bạn không cần cài PostgreSQL hay Redis thủ công, chỉ cần bật 2 container này:

```powershell
# 1. Bật Postgres (5432) và Redis (6379) chạy ngầm
docker compose up -d postgres redis

# 2. Kiểm tra 2 container đã 'healthy' chưa
docker compose ps

# 3. Khi code xong, muốn tắt đi
docker compose stop postgres redis
```

---

### 🚀 Kịch bản 2: Chạy Full-stack trọn gói bằng Docker
> Chạy đồng thời 4 dịch vụ khép kín:
> - **PostgreSQL 16**: `localhost:5432` (User: `postgres`, Pass: `password123`, DB: `securitygate_db`)
> - **Redis 7**: `localhost:6379`
> - **Backend Spring Boot**: `http://localhost:8080` (Swagger UI: `http://localhost:8080/swagger-ui.html`)
> - **Frontend Next.js**: `http://localhost:3000`

```powershell
# Khởi động toàn bộ lần đầu hoặc sau khi sửa code
docker compose up -d --build

# Khởi động bình thường (không build lại)
docker compose up -d

# Tắt toàn bộ
docker compose down
```

---

### 🔄 Kịch bản 3: Build lại riêng từng dịch vụ khi sửa mã nguồn

Khi bạn chỉ sửa code của **Backend** hoặc **Frontend**, không cần build lại cả hệ thống:

```powershell
# 1. Chỉ build lại và khởi động lại Backend Spring Boot:
docker compose up -d --build backend

# 2. Chỉ build lại và khởi động lại Frontend Next.js Web:
docker compose up -d --build web

# 3. Khởi động lại một service mà không build lại:
docker compose restart backend
```

---

## 📊 3. THEO DÕI & XỬ LÝ LỖI (LOGS & MONITORING)

```powershell
# Xem log trực tiếp của tất cả container (Ctrl + C để thoát)
docker compose logs -f

# Xem 100 dòng log gần nhất của Backend
docker compose logs --tail=100 -f backend

# Xem log của Database PostgreSQL
docker compose logs -f postgres

# Xem log của Redis
docker compose logs -f redis

# Xem tài nguyên CPU / RAM mà các container đang tiêu thụ
docker stats
```

---

## 💻 4. TRUY CẬP VÀO BÊN TRONG CONTAINER (TERMINAL / CLI)

### 4.1. Mở giao diện dòng lệnh PostgreSQL (psql CLI)
Truy cập trực tiếp vào DB để query SQL, xem bảng:
```powershell
docker exec -it sep-postgres psql -U postgres -d securitygate_db
```
*Các lệnh psql cơ bản khi đã vào bên trong:*
- `\dt` : Liệt kê tất cả các bảng.
- `\d users` : Xem cấu trúc bảng users.
- `SELECT * FROM users;` : Truy vấn dữ liệu.
- `\q` : Thoát khỏi psql.

### 4.2. Mở giao diện dòng lệnh Redis (redis-cli)
Kiểm tra token blacklist, refresh token hoặc cache:
```powershell
docker exec -it sep-redis redis-cli
```
*Các lệnh redis-cli cơ bản:*
- `PING` -> Trả về `PONG`.
- `KEYS *` -> Xem toàn bộ các key đang lưu trong Redis.
- `GET <key>` -> Xem giá trị của key.
- `FLUSHALL` -> Xóa sạch toàn bộ key trong Redis.
- `exit` -> Thoát khỏi redis-cli.

### 4.3. Mở Terminal (Bash / Sh) của Backend hoặc Web
```powershell
# Vào trong container Backend
docker exec -it sep-backend sh

# Vào trong container Web
docker exec -it sep-web sh
```

---

## 💾 5. SAO LƯU & PHỤC HỒI DATABASE (BACKUP & RESTORE)

### 5.1. Backup Database PostgreSQL ra file .sql trên máy thật:
```powershell
docker exec -t sep-postgres pg_dump -U postgres securitygate_db > backup_securitygate.sql
```

### 5.2. Restore Database từ file .sql vào container:
```powershell
Get-Content backup_securitygate.sql | docker exec -i sep-postgres psql -U postgres -d securitygate_db
```

---

## 🧹 6. DỌN DẸP HỆ THỐNG & RESET DỮ LIỆU (CLEANUP)

```powershell
# Dừng và xóa toàn bộ container + volume (Xóa sạch dữ liệu DB làm lại từ đầu)
docker compose down -v

# Xóa các image cũ, không còn dùng (dangling images) để giải phóng ổ đĩa
docker image prune -f

# Dọn dẹp triệt để toàn bộ cache Docker build thừa
docker system prune -a --volumes -f
```
