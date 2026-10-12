# 📐 Thông Số Kỹ Thuật Phần Cứng & Sơ Đồ Chân GPIO (Hardware Pinout)

Tài liệu chi tiết đấu nối các module phần cứng ngoại vi với bo mạch điều khiển biên **Raspberry Pi 4 Model B**.

---

## 📌 Bảng Phân Bổ Chân GPIO (Raspberry Pi 4 Pinout)

| Thiết Bị | Chân Kết Nối Module | Chân Raspberry Pi 4 | Chuẩn Tín Hiệu | Chức Năng |
| :--- | :--- | :--- | :--- | :--- |
| **Relay Mở Barie** | IN1 (Kích mức thấp Active-Low) | **GPIO 17** (Pin 11) | Digital Output 3.3V | Kích xung 500ms mở thanh chắn |
| **Relay Đóng Barie** | IN2 | **GPIO 27** (Pin 13) | Digital Output 3.3V | Kích xung 500ms đóng thanh chắn |
| **Cảm Biến Quang An Toàn** | DO / Relay OUT | **GPIO 22** (Pin 15) | Digital Input (Kèm Trở Kéo) | Phát hiện vật cản dưới thanh chắn |
| **Vòng Từ Loop Vào** | Output Relay | **GPIO 23** (Pin 16) | Digital Input | Nhận diện phương tiện tiến vào làn |
| **Đầu Đọc RFID USB/Serial**| D+, D-, VCC, GND | Cổng USB 2.0 / 3.0 | USB Virtual COM (`/dev/ttyUSB0`)| Nhận mã thẻ UID RFID 13.56MHz |
| **Camera IP Giám Sát** | RJ45 Ethernet | Cổng Gigabit Ethernet / Switch | Chuẩn mạng RTSP TCP/UDP | Truyền tải luồng video 1080p |
| **Nguồn Cấp Hệ Thống** | 5V / 3A Type-C | Cổng Nguồn RPi 4 | DC 5V 3A | Cấp nguồn bo mạch xử lý biên |

---

## ⚠️ Lưu Ý An Toàn Vận Hành Điện
- Các tiếp điểm điều khiển motor barie phải qua rơ-le cách ly quang (Optocoupler isolation) để triệt tiêu dòng điện cảm ứng từ cuộn dây motor dội ngược về bo mạch.
- Luôn kiểm tra cảm biến an toàn chống va đập (Safety Loop / Photoelectric Beam) trước khi xuất xung đóng rơ-le.
