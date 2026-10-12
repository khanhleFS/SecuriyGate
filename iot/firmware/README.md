# 🔌 Firmware Vi Điều Khiển Phụ Trợ (ESP32 / Microcontrollers)

Thư mục lưu trữ mã nguồn nhúng dành cho vi điều khiển (ESP32 / Arduino / STM32) trong trường hợp hệ thống phân bổ các tác vụ phần cứng ngoại vi:

---

## 🎯 Các Kịch Bản Sử Dụng Firmware Phụ Trợ

1. **Giao tiếp đầu đọc chuẩn công nghiệp Wiegand 26 / Wiegand 34:**
   - ESP32 nhận xung ngắt Data0 / Data1 từ đầu đọc Wiegand.
   - Giải mã chuỗi bit thẻ RFID và truyền về Raspberry Pi qua Serial UART hoặc MQTT qua WiFi.
2. **Bộ điều khiển rơ-le cách ly quang an toàn (Isolated Relay Module):**
   - Đảm bảo cách ly điện áp cao 220V/24V của motor barie với bo mạch xử lý biên Raspberry Pi.
3. **Màn hình LED ma trận / LCD hiển thị hướng dẫn:**
   - Điều khiển màn hình hiển thị biển số, hướng dẫn "MỜI QUA" / "THẺ KHÔNG HỢP LỆ".
