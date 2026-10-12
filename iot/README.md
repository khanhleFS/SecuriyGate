# 🌐 Hệ Thống IoT Kiểm Soát Cổng An Ninh (SecurityGate IoT)

Thư mục quản lý toàn bộ cấu hình phần cứng, dịch vụ điều khiển biên (Edge Gateway Controller) và giao thức truyền thông IoT cho hệ thống kiểm soát barrier tự động **SecurityGate (SEP490)**.

---

## 🏗️ Kiến Trúc Hệ Thống Phần Cứng & IoT (System Architecture)

```mermaid
graph TD
    subgraph NgoaiVi [Thiết Bị Ngoại Vi Tại Cổng]
        CAM[Camera IP RTSP Biển Số/Mặt]
        RFID[Đầu Đọc Thẻ RFID / NFC]
        BARRIER[Thanh Chắn Barie Tự Động]
        SENSOR[Cảm Biến Vòng Từ Loop / Cảm Biến Quang]
        LED[Màn Hình LED / Còi Báo Động]
    end

    subgraph EdgeDevice [Thiết Bị Điều Khiển Biên - Raspberry Pi 4 / Jetson]
        GW[Edge Gateway Service (Python)]
        AI[Dịch Vụ Suy Luận AI Biên (ALPR/Face)]
        MQTT_LOCAL[Local MQTT Broker / Cache]
    end

    subgraph Server [Hệ Thống Trung Tâm - Cloud / Server]
        BACKEND[Backend Spring Boot REST / WebSocket]
        DB[(PostgreSQL / Redis)]
    end

    RFID -->|Wiegand / USB / Serial| GW
    CAM -->|RTSP Stream / Snapshot| GW
    SENSOR -->|GPIO Tín Hiệu Số| GW
    GW -->|Kích hoạt Relay GPIO| BARRIER
    GW -->|Điều khiển I2C/RS485| LED

    GW <-->|ONNX Runtime Inference| AI
    GW <-->|MQTT / WebSocket / REST API| BACKEND
    BACKEND <--> DB
```

---

## 🔄 Luồng Vận Hành Chuẩn (Access Control Workflow)

1. **Phát hiện phương tiện:** Xe di chuyển vào vị trí -> Vòng từ (Loop detector) phát hiện xe có mặt.
2. **Kích hoạt nhận diện:**
   - Người điều khiển quẹt thẻ RFID/NFC lên đầu đọc.
   - Camera IP lập tức chụp ảnh biển số trước/sau của phương tiện và chân dung tài xế.
3. **Xác thực dữ liệu:**
   - Edge Gateway gửi gói tin xác thực (kèm mã thẻ UID, ảnh chụp hoặc kết quả OCR biển số) về Backend qua MQTT hoặc REST API.
4. **Quyết định ra/vào:**
   - Nếu thông tin hợp lệ: Backend phản hồi xác nhận -> Edge Gateway kích hoạt rơ-le mở thanh chắn barie và hiển thị đèn xanh trên màn hình LED.
   - Nếu không hợp lệ: Cảnh báo âm thanh / màn hình đỏ, giữ đóng barie.
5. **Đóng barie an toàn:**
   - Sau khi xe đã vượt qua hoàn toàn vùng cảm biến quang/vòng từ an toàn, rơ-le kích hoạt đóng barie tự động, bảo đảm không va chạm vào phương tiện.

---

## 📂 Cấu Trúc Thư Mục IoT

```text
iot/
├── README.md                 # Tài liệu kiến trúc IoT (file này)
├── docker-compose.edge.yml   # Khởi chạy các dịch vụ IoT container trên Edge Device
├── edge-gateway/             # Mã nguồn dịch vụ điều phối trung tâm tại chốt cổng
│   ├── Dockerfile            # Container hóa dịch vụ Gateway cho kiến trúc ARM/AMD
│   ├── requirements.txt      # Thư viện Python (paho-mqtt, opencv, pyserial, pyyaml)
│   ├── config/
│   │   └── config.example.yaml# Cấu hình chân GPIO, MQTT Broker, Camera URLs
│   └── src/
│       ├── main.py           # Vòng lặp sự kiện chính & điều phối thiết bị
│       ├── camera/           # Quản lý RTSP stream và trích xuất khung hình
│       ├── rfid/             # Giao tiếp đầu đọc thẻ RFID (RC522, Wiegand)
│       ├── barrier/          # Điều khiển relay đóng/mở barie & cảm biến an toàn
│       └── mqtt/             # Giao thức truyền thông MQTT với Backend Server
├── firmware/                 # Firmware cho vi điều khiển phụ trợ (ESP32 / Arduino)
│   └── README.md
└── docs/                     # Sơ đồ đấu nối dây, thông số kỹ thuật chân GPIO
    └── hardware_spec.md
```

---

## 🚀 Khởi Chạy Nhanh Trên Thiết Bị Biên (Edge Device)

1. Sao chép file cấu hình:
```bash
cd iot/edge-gateway
cp config/config.example.yaml config/config.yaml
```

2. Chạy với Docker Compose trên Raspberry Pi / Edge:
```bash
cd iot
docker compose -f docker-compose.edge.yml up -d
```
