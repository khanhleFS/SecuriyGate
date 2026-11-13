# Tài liệu tham khảo trọng tâm: Thu thập, Đồng bộ & Hiệu chuẩn dữ liệu Multimodal IoT (Camera + Microphone + Radar/IoT)

Thư mục này lưu trữ **8 bài báo nền tảng quan trọng nhất** (tổng hợp qua 3 đợt tìm kiếm) phục vụ trực tiếp cho giai đoạn **thiết kế kiến trúc phần cứng node cảm biến, quy trình thu thập dữ liệu (data collection), đồng bộ hóa thời gian (synchronization), hiệu chuẩn không gian chéo (cross-sensor calibration) và gán nhãn (annotation)** của mảng **Camera và Microphone**, đặt trong bối cảnh tích hợp cùng **mmWave Radar** và các cảm biến IoT khác.

---

## Danh sách 8 bài báo trong thư mục

| STT | File PDF | Tên bài báo & Xuất bản | Vai trò chính cho khâu Data Collection |
| :-: | :--- | :--- | :--- |
| 1 | [`SHDFM_SmartHome_SensorNetwork_2023_arXiv_2312.16697.pdf`](./docs/papers/SHDFM_SmartHome_SensorNetwork_2023_arXiv_2312.16697.pdf) | *Multi-channel Sensor Network Construction, Data Fusion and Challenges for Smart Home* (Zhang et al., ACM Chinese CHI 2023 / `arXiv:2312.16697`) | **Kiến trúc tổng thể IoT + Đồng bộ trục thời gian** (lấy Camera & Micro làm chuẩn Level 0 cho các cảm biến tần số thấp) |
| 2 | [`Guided-MELD_2024_arXiv_2404.08264.pdf`](./docs/papers/Guided-MELD_2024_arXiv_2404.08264.pdf) | *Guided Masked Self-Distillation Modeling for Distributed Multimedia Sensor Event Analysis* (Yasuda et al., 2024 / `arXiv:2404.08264`) | **Bố trí nhiều Camera & Micro phân tán** trong không gian có vật cản + thiết kế kịch bản mất cảm biến (sensor dropout) |
| 3 | [`MultiSensor-Home_2025_arXiv_2504.02287.pdf`](./docs/papers/MultiSensor-Home_2025_arXiv_2504.02287.pdf) | *MultiSensor-Home: A Wide-area Multi-modal Multi-view Dataset for Action Recognition and Transformer-based Sensor Fusion* (Nguyen et al., IEEE FG 2025 / `arXiv:2504.02287`) | **Thu thập đa góc nhìn trong nhà ở thực tế + gán nhãn Frame-level** và mẹo dùng YOLOv10 lọc/tạo pseudo-label |
| 4 | [`MISP_Challenge_2022_ICASSP.pdf`](./docs/papers/MISP_Challenge_2022_ICASSP.pdf) | *The First Multimodal Information Based Speech Processing (MISP) Challenge: Data, Tasks, Baselines and Results* (Chen et al., IEEE ICASSP 2022) | **Kỹ thuật đồng bộ đa thiết bị thực chiến** (Vicando + Soundcard + gõ nắp cốc làm mốc đồng bộ) và phân tầng Far/Mid/Near-field |
| 5 | [`STARSS23_2023_NeurIPS.pdf`](./docs/papers/STARSS23_2023_NeurIPS.pdf) | *STARSS23: An Audio-Visual Dataset of Spatial Recordings of Real Scenes with Spatiotemporal Annotations of Sound Events* (Shimada et al., NeurIPS 2023) | **Đồng bộ bằng Clapper sound + Quy đổi tọa độ không gian 3D** `(azimuth, elevation, distance)` giữa Camera 360° và Mic Array |
| 6 | [`Fang_2022_ACM_DATA_MultiModal_Platform.pdf`](./docs/papers/Fang_2022_ACM_DATA_MultiModal_Platform.pdf) | *Design and Deployment of a Multi-Modal Multi-Node Sensor Data Collection Platform* (Fang et al., ACM DATA '22 / SenSys '22) | **Thiết kế phần cứng & phần mềm node IoT tái sử dụng** (Jetson Xavier NX + Docker/ROS + ReSpeaker + RealSense/ZED + mmWave) |
| 7 | [`RAV4D_2024_IEEE_RadarConf.pdf`](./docs/papers/RAV4D_2024_IEEE_RadarConf.pdf) | *RAV4D: A Radar-Audio-Visual Dataset for Indoor Multi-Person Tracking* (Zhou et al., IEEE RadarConf 2024) | **Hiệu chuẩn không gian 3-trong-1 (Stereo Cam + Mic Array + 4D mmWave)**, lọc clutter radar và gán nhãn bán tự động |
| 8 | [`GDTM_2024_arXiv_2402.14136.pdf`](./docs/papers/GDTM_2024_arXiv_2402.14136.pdf) | *GDTM: An Indoor Geospatial Tracking Dataset with Distributed Multimodal Sensors* (Jeong et al., `arXiv:2402.14136`, *Under Submission*) | **Triển khai thực tế đa node phân tán (3 Nodes + Command Node)**, chuẩn nén lưu trữ và bằng chứng định lượng khi thiếu sáng/góc nhìn lạ |

---

## Phân tích chi tiết giá trị ứng dụng của từng bài

### 1. `SHDFM_SmartHome_SensorNetwork_2023_arXiv_2312.16697.pdf` — Kiến trúc mạng cảm biến IoT & Đồng bộ trục thời gian
- **Điểm cốt lõi cần đọc:** Mục 2.1, Mục 3.1 và Mục 4 (Level 0 & Level 1).
- **Áp dụng vào thiết kế của bạn:**
  - **Cảnh báo về NTP (Mục 2.1):** Network Time Protocol thông thường chỉ đạt độ chính xác 1–50 ms và phụ thuộc tải mạng, dễ gây lệch khung hình với hệ thống đa camera tần số cao.
  - **4 phân hệ mạng cảm biến (Mục 3.1):** Hardware system → Interprocess communication (IPC) → Synchronization control → Robustness & NAS (trong thử nghiệm ~60 m² với đa camera FLIR qua mạng 10 GigE, hệ thống sinh ~6.7 TB/ngày — cần tính toán kỹ băng thông và lưu trữ).
  - **Level 0 (Data Sources Alignment):** Chọn luồng tần số cao giàu ngữ nghĩa (**đa camera + microphone**) làm **phương thức chính (primary modality)** để làm trục thời gian gốc; các cảm biến môi trường/IoT tần số thấp căn chỉnh timestamp bám theo trục này.
  - **Level 1 (Data Cleaning & Feature Extraction):** Dùng thuật toán phát hiện người trên camera loại khung hình rỗng, đối chiếu chéo với giọng nói để lọc nhiễu và giảm dung lượng dữ liệu dư thừa.

---

### 2. `Guided-MELD_2024_arXiv_2404.08264.pdf` — Bố trí Camera/Micro phân tán & Kịch bản che khuất/mất cảm biến
- **Điểm cốt lõi cần đọc:** Mục III-B, Mục V (MM-Store & MM-Office), Bảng I, Bảng II, Hình 1 & Hình 5.
- **Áp dụng vào thiết kế của bạn:**
  - **Thông số & Bố trí tham khảo (Bảng I):**
    - *MM-Store:* 6 camera (`ARUCOM RD-CI502`, `3840 × 2160`, `20 FPS`) + 12 micro đa hướng (`HOSIDEN KUB4225`, `32-bit`, `48 kHz`) trong không gian có kệ hàng che khuất.
    - *MM-Office:* 4 camera (`GoPro Hero8`, `2560 × 1440`, `30 FPS`) + 8 micro đa hướng (`32-bit`, `48 kHz`) trong phòng `6.34 m × 5.03 m`.
  - **Nguyên tắc phủ không gian:** Bố trí cảm biến phân tán có **vùng giao thoa (overlapping coverage)** để bù trừ khi 1 camera bị che (ví dụ Hình 1: Camera 3 khuất tay người nhưng Mic 4 thu rõ âm thanh sự kiện).
  - **Đóng gói dữ liệu đầu vào (Bảng II & Hình 6):** Thu ở độ phân giải cao (`48 kHz` audio), khi huấn luyện mới downsample về `16 kHz` (Log-Mel 64 bins) và video `1.25 FPS` (`224 × 224`) để khớp `T = 32` đoạn thời gian trong `25.6 s`.
  - **Tránh bẫy Weak Labels:** Bài báo chỉ gán nhãn yếu (không có mốc onset/offset) cho tập train/val nên tự nhận đây là hạn chế lớn. Bạn nên thu thập kèm **strong labels** (mốc bắt đầu – kết thúc).

---

### 3. `MultiSensor-Home_2025_arXiv_2504.02287.pdf` — Thu thập đa góc nhìn nhà ở thực tế & Gán nhãn Frame-level
- **Điểm cốt lõi cần đọc:** Mục I, Bảng I, Mục III (Hình 2 & Bảng II), Mục IV-C (Human Detection Module) và Mục V-A.
- **Mã nguồn tham khảo:** `https://github.com/thanhhff/MultiTSF` / `https://github.com/thanhhff/MultiSensorHome`
- **Áp dụng vào thiết kế của bạn:**
  - **Khắc phục điểm yếu của MM-Store/MM-Office:** Cung cấp **2,555 video chưa cắt (untrimmed)**, thời lượng trung bình `80 giây`, quay từ **5 góc camera đồng bộ (`4000 × 3000`, `30 FPS`) + audio** trên **16 lớp hành động sinh hoạt trong nhà** (bật/tắt đèn, mở/đóng rèm, điều chỉnh điều hòa, dùng laptop/điện thoại, ngồi/đứng...) với **nhãn chi tiết tới từng frame (frame-level)**, bao gồm các điều kiện sáng–trưa–tối khác nhau.
  - **Kỹ thuật giảm tải gán nhãn & lọc khung hình (Mục IV-C):** Tích hợp **YOLOv10** phát hiện người để sinh nhãn nhị phân giả (`human_presence ∈ {0, 1}`) cho từng frame nhằm ép mô hình tập trung vào những khung hình có hoạt động con người thay vì nền rỗng.
  - **Lưu ý hạn chế của bài:** Bài báo không công bố chi tiết phần cứng microphone vật lý, sample rate gốc và cơ chế đồng bộ phần cứng $\rightarrow$ cần kết hợp đọc cùng **Bài 4 (MISP)** và **Bài 5 (STARSS23)** để thiết kế khâu sync.

---

### 4. `MISP_Challenge_2022_ICASSP.pdf` — Quy trình đồng bộ đa đồng hồ (Multi-clock Sync) thực chiến
- **Điểm cốt lõi cần đọc:** Mục 2.1 – 2.5 (Hình 1: Schematic overview of the recording scene).
- **Áp dụng vào thiết kế của bạn:**
  - **Mô hình phân tầng cự ly đặt thiết bị (Hình 1):**
    - *Far-field (3–5 m):* 1 camera góc rộng (`1080p`, góc `2π/3`) gắn cùng 1 mảng 6 micro tuyến tính (khoảng cách các mic `35 mm`).
    - *Middle-field (1–1.5 m):* Camera HD (`720p`, góc `π/2`) hướng vào từng người/khu vực + mảng 2 micro (`92 mm`).
    - *Near-field (nếu thu hội thoại/giọng nói):* Micro cài trên người để hỗ trợ gán nhãn và gỡ băng (transcription) chính xác.
  - **Quy trình đồng bộ 2 bước cực kỳ thực tế (Mục 2.4):**
    1. *Đồng bộ nội bộ theo nhóm thiết bị:* Các camera đồng bộ clock bằng phần mềm (**Vicando**); các micro nối qua cùng **sound card** tự đồng bộ với nhau.
    2. *Đồng bộ chéo giữa các nhóm clock độc lập (Video – Soundcard – Far mic array):* Thực hiện hành động tạo **mốc sự kiện âm-hình rõ ràng** (trong bài là **gõ nắp cốc lên miệng cốc**), sau đó khớp thủ công đúng frame hình ảnh lúc chạm với đỉnh xung trên waveform âm thanh.

---

### 5. `STARSS23_2023_NeurIPS.pdf` — Clapper Sync & Hệ tọa độ không gian 3D cho Audio-Visual
- **Điểm cốt lõi cần đọc:** Mục 3.2 (Hình 2), Phụ lục A.1 – A.3 và Phụ lục G (Datasheet).
- **Mã nguồn & Dataset:** `https://zenodo.org/record/7880637` | `https://github.com/sony/audio-visual-seld-dcase2023`
- **Áp dụng vào thiết kế của bạn:**
  - **Bố trí cụm trung tâm (Mục 3.2):** Đặt camera 360° (`Ricoh Theta V`, `3840 × 1920` @ `29.97 FPS`, sau giảm về `1920 × 960`) ngay phía trên mảng 32 micro cầu (`Eigenmike em32`, cao `1.5 m`, khoảng cách giữa tâm camera và mic là `10 cm`) để chia sẻ cùng gốc tọa độ phòng.
  - **Đồng bộ bằng Clapper sound (Mục 3.2):** Bật toàn bộ thiết bị trước, dùng tiếng **clapper** (bảng đập/vỗ tay tạo xung sắc nét) ngay đầu phiên thu để căn chỉnh thủ công tất cả luồng ghi (kể cả hệ mocap có kênh audio phụ) rồi mới cắt đoạn lưu trữ.
  - **Chuẩn hóa định dạng nhãn không gian-thời gian (Phụ lục A.3):**
    - Độ phân giải thời gian nhãn: `100 ms` / frame.
    - Định dạng `.csv`: `frame_number, active_class_index, source_number_index, azimuth, elevation, distance` (độ và cm).
    - **Gợi ý cho hệ thống của bạn:** Nếu bạn có **mmWave Radar**, chuẩn tọa độ `(azimuth, elevation, distance)` của STARSS23 là cầu nối rất tốt để ánh xạ vị trí từ **Radar** $\leftrightarrow$ **Camera** $\leftrightarrow$ **Microphone Array**.

---

### 6. `Fang_2022_ACM_DATA_MultiModal_Platform.pdf` — Thiết kế Node IoT đa cảm biến tái sử dụng (Hardware + Docker/ROS)
- **Điểm cốt lõi cần đọc:** Mục 2 (Hình 1 & Hình 2), Mục 3.1 – 3.8 và Mục 4 (Lessons Along the Way).
- **Áp dụng vào thiết kế của bạn:**
  - **Kiến trúc phần cứng trên 1 node chuẩn (Mục 2.1, Bảng 1 & Mục 3.7–3.8):**
    - Máy tính nhúng: **NVIDIA Jetson Xavier NX** (chạy OS trên microSD, lắp **SSD riêng** cho dữ liệu; mạnh hơn Jetson Nano và hỗ trợ SSD, giá hợp lý hơn AGX; công suất ~29 W không tính LiDAR).
    - Cảm biến tích hợp: **Intel RealSense L515** (active IR depth `0.25–9 m`, chạy tốt trong tối nhưng hỏng trong ánh sáng gắt), **Stereolabs ZED 2i** (stereo depth `0.2–20 m` + IMU, bù trừ khi tắt đèn/nhiễu IR), **TI IWR1443 mmWave Radar** (~3–4 FPS qua USB, độ phân giải góc `15°`), **ReSpeaker Mic Array v2.0** (4 mic cách nhau `90°` + DOA onboard), **Ouster OS-1-32 LiDAR** (trên 1 node chính) và **ZED-F9P GPS-RTK** (cho kịch bản ngoài trời).
  - **Mẹo cơ khí & chống nhiễu cảm biến cực đắt giá (Mục 3.1, 3.4, 3.6, 3.8):**
    - **Đặt ReSpeaker trên trụ nâng (standoff) bên ngoài vỏ hộp mica:** Tránh vật liệu acrylic chắn sóng âm làm suy hao và méo hướng (DOA).
    - **Cảnh báo xung đột IR (Hình 3):** RealSense L515 (active IR) bị sọc đen nặng khi hoạt động cùng hệ thống motion capture dùng hồng ngoại (Qualisys) — đó là lý do tác giả phải bổ sung ZED 2i.
    - **Gắn LiDAR qua đệm cao su nâng cao:** Giảm rung và tiếng ồn cơ khí quay truyền vào ReSpeaker đồng thời tránh tỏa nhiệt xuống các mạch bên dưới. Dùng quạt vỏ **Noctua NF-S12A ULN + L.N.A.** để chỉ phát ~6.8 dB tiếng ồn.
  - **Kiến trúc phần mềm cô lập bằng Docker + ROS & Tối ưu lưu trữ (Mục 2.2 & Mục 3):**
    - Mỗi cảm biến chạy trong **1 Docker container riêng** (ROS subscriber/publisher + sensor API + encoder) kèm 1 container `Node Status` thu thập CPU, RAM, ổ cứng, nhiệt độ và **trạng thái NTP** theo thời gian thực.
    - **Giảm dung lượng 10 lần ngay lúc thu:** Thay vì dump mảng ảnh/depth thô vào ROS bag (`1–2 GB/phút`), nén RealSense RGB & depth colormap qua GStreamer `H.264` (`100–200 MB/phút`), lưu ZED 2i dạng file `.svo` gốc (~100 MB/phút @ 15 FPS, không tốn GPU tính depth lúc thu) và lưu ReSpeaker dạng **FLAC** kèm timestamp từng lần poll DOA để cắt đoạn khớp với frame camera.
    - **Cảnh báo I/O & USB buffer:** Radar TI IWR1443 qua USB dễ rớt/hỏng frame heatmap do tràn buffer (cần lọc bỏ lúc hậu kỳ hoặc nâng cấp dùng board thu thô `DCA1000EVM`); lúc giải mã hậu kỳ `.svo` ra từng ảnh PNG/numpy sẽ bị nghẽn I/O đĩa dù dùng SSD.

---

### 7. `RAV4D_2024_IEEE_RadarConf.pdf` — Hiệu chuẩn không gian 3-trong-1 (Camera + Mic Array + 4D Radar)
- **Điểm cốt lõi cần đọc:** Mục II (Hệ thu thập & Calibration), Mục III (Tiền xử lý Radar/Audio & Gán nhãn bán tự động) và Mục IV (Thực nghiệm theo dõi đa người).
- **Dataset & Mã nguồn:** `https://zenodo.org/records/10208199`
- **Áp dụng vào thiết kế của bạn:**
  - **Cấu hình cụm cảm biến đồng vị trí (Mục II-A):** Stereo camera (`960 × 540`, `30 FPS`, FOV `110° × 70°`, tầm đo sâu tới `20 m`) + **Radar 4D FMCW 77 GHz** (băng thông `750 MHz`, mảng ảo `12TX × 16RX = 192` kênh, phân giải `0.22 m` cự ly / `1°` azimuth / `2°` elevation, `20 FPS`) + **Mảng 6 micro tròn** (đường kính `7 cm`, `16 kHz`, phân giải DOA ~`5°`, tầm `10 m`).
  - **Thiết kế Mục tiêu hiệu chuẩn 3-trong-1 (Mục II-B):**
    - Chế tạo bảng hiệu chuẩn tích hợp: **Corner reflector** (phản xạ mạnh cho Radar) + **Bảng caro (checkerboard)** (cho Stereo Camera) dán trực tiếp lên **bảng đập Clapperboard** (tạo mốc đồng bộ âm-hình).
    - Đặt bảng tại **7 vị trí** dựa theo lưới gạch lát sàn và đo cao độ Z bằng thước, đạt sai số tái chiếu (L2 reprojection error) `0.05 m` cho Radar, `0.01 m` cho ảnh và `8.6 pixel` khi chiếu điểm Radar lên ảnh.
  - **Đồng bộ thời gian & Tiền xử lý tín hiệu (Mục II-B & III-A/B):**
    - Tối ưu hóa lặp (iterative optimization) đồng thời độ lệch thời gian (`time offset`) và hệ số tỉ lệ độ sâu (`depth scaling`) giữa Stereo Camera và Radar, kết hợp nội suy góc quay **Slerp trên $SE(3)$**.
    - Radar: Cắt 3D ROI → dùng **Occupancy Grid Map (OGM) ô `0.1 m`** loại bỏ điểm phản xạ tĩnh (tường, bàn ghế) → phân cụm **DBSCAN**. Audio: Tính phổ DOA bằng **SRP-PHAT** trên lưới góc `1°`.
  - **Hiệu quả thực chiến khi thiếu sáng & giao thoa (Bảng I):** Khi có 3 người di chuyển cắt chéo nhau (hard crossing) trong phòng **tắt đèn**, chỉ số theo dõi của Stereo Camera tụt xuống `71.412%` MOTP / `83.102%` MOTA, trong khi 4D Radar giữ vững `82.088%` MOTP / `87.274%` MOTA.

---

### 8. `GDTM_2024_arXiv_2402.14136.pdf` — Hệ đa node phân tán (3 Nodes + Command Node) & Đánh giá thiếu sáng/góc nhìn lạ
- **Điểm cốt lõi cần đọc:** Mục 3 (Thiết kế phần cứng/phần mềm & Đồng bộ), Bảng 1, và Mục 4–5 (Thử nghiệm ánh sáng yếu & Unseen viewpoint).
- **Mã nguồn & Tài liệu:** `https://github.com/nesl/GDTM` *(Lưu ý: bản `arXiv:2402.14136` ghi trạng thái Under Submission)*.
- **Áp dụng vào thiết kế của bạn:**
  - **Kiến trúc triển khai nhiều node quanh phòng (Mục 3.1):** Kế thừa node Jetson Xavier NX từ Bài 6 (Fang et al., 2022), bố trí **3 node đa cảm biến** quanh khu vực `3 m × 3.6 m` kết hợp **6 camera OptiTrack** làm chuẩn vị trí (ground truth cấp mm).
  - **Cấu hình thu thực tế của từng luồng (Mục 3.1 & Bảng 1):**
    - *RealSense L515:* RGB `1920 × 1080` @ `15 Hz`, Depth `640 × 480` @ `15 Hz`.
    - *ZED 2i:* Stereo RGB `1920 × 1080` @ `15 Hz` + depth + IMU.
    - *TI IWR1443 mmWave:* `4 Hz`.
    - *ReSpeaker Mic Array:* 4 micro vật lý xuất **6 kênh FLAC** @ `16 kHz`.
    - *Ouster OS-1-32 LiDAR:* Gắn trên 1 node.
  - **Quy trình điều phối tập trung bằng Command Node (Mục 3.1):** Dùng 1 máy chủ mini (**NUC Mini**) cùng mạng Wi-Fi đồng bộ **NTP** làm Command Node: gửi lệnh Start/Stop đồng loạt qua ROS, theo dõi sức khỏe node (health monitoring), và tự động nén + đẩy dữ liệu từ các node về máy chủ ngay sau mỗi phiên thu (~`9 giờ` dữ liệu: `610 phút` đủ sáng ở `39` góc nhìn + `180 phút` thiếu sáng ở `9` góc nhìn).
  - **Quy chuẩn làm sạch dữ liệu bằng Metadata (`valid_range`):** Gắn trường `valid_range` cho từng phiên để đánh dấu đoạn thời gian hợp lệ, loại bỏ tự động các đoạn có sự cố/rớt gói khỏi tập huấn luyện.
  - **Bằng chứng định lượng tại sao cần đa cảm biến (Bảng 2–4):**
    - Khi ánh sáng tốt: Early Fusion đạt sai số vị trí `6.25 cm` so với `16.15 cm` nếu chỉ dùng Camera.
    - Khi **thiếu sáng**: Camera-only vọt sai số lên **`116.27 cm`**, trong khi kết hợp đa cảm biến vẫn giữ mức **`16.21 cm`**.
    - Khi đổi sang **góc đặt node chưa từng thấy trong lúc train (unseen viewpoint)**: Camera-only sai số `124.30 cm`, đa cảm biến giảm còn `47.48 cm`.

---

## Checklist đề xuất cho Pipeline Thu thập dữ liệu Camera + Micro + Radar/IoT

1. **Thiết kế trục thời gian & điều phối (Bài 1 + 4 + 5 + 7 + 8):**
   - Dùng một **Command Node** (kiểu NUC Mini) điều khiển Start/Stop tập trung và giám sát tài nguyên/trạng thái NTP của từng node (kiểu Docker + `Node Status` trong Bài 6 & 8).
   - Với thiết bị khác đồng hồ (Camera rời, Soundcard, Radar độc lập), luôn thực hiện **Clapper / Visual-Audio Sync Marker** ở **đầu và cuối** mỗi phiên thu để tính cả **độ lệch ban đầu (offset)** lẫn **trôi đồng hồ (clock drift)**, hoặc chạy tối ưu lặp time-offset như Bài 7.
   - Lưu cả `device_timestamp` gốc, `unified_timestamp` đã quy đổi và metadata `valid_range` đánh dấu đoạn lỗi (Bài 8).
2. **Thiết kế mặt bằng, cơ khí & hiệu chuẩn không gian (Bài 2 + 6 + 7):**
   - Vẽ sơ đồ phòng đo đạc kích thước thực, bố trí vùng giao thoa giữa các node và kiểm tra trước **xung đột phần cứng** (ví dụ: tắt/tách active IR của RealSense nếu phòng có cảm biến IR khác; đặt micro array ra ngoài vỏ hộp trên standoff và tách xa nguồn rung/quạt ồn).
   - Nếu có **Camera + Micro Array + mmWave Radar**, chế tạo **mục tiêu hiệu chuẩn 3-trong-1** (corner reflector + checkerboard trên clapperboard) để đưa cả 3 về chung hệ tọa độ 3D `(x, y, z)` hoặc `(azimuth, elevation, distance)`.
3. **Quy chuẩn thông số thu thô & tối ưu I/O (Bài 2 + 3 + 6 + 8):**
   - Nén ngay lúc thu (H.264 / `.svo` cho video-depth; **FLAC** hoặc **WAV** không nén cho audio `16–48 kHz`) thay vì dump mảng thô vào ROS bag để tránh nghẽn I/O và tràn đĩa.
   - Kiểm tra rớt/hỏng frame ở radar USB (hoặc dùng DCA1000EVM nếu cần FPS radar cao).
   - Chủ động quay đủ cả kịch bản **che khuất (occlusion)**, **tắt/giảm ánh sáng** và **góc đặt node mới** để kiểm chứng lợi thế của Audio + Radar khi Camera suy giảm.
4. **Quy trình lọc & gán nhãn tiết kiệm công sức (Bài 1 + 3 + 5 + 7):**
   - Dùng detector nhẹ (YOLOv10/YOLOv3 head), OGM + DBSCAN (trên radar), hoặc ngưỡng năng lượng âm thanh để lọc bỏ đoạn nền trống và tạo nhãn giả hỗ trợ kiểm duyệt.
   - Ghi nhận **strong labels** (`onset`, `offset`, `event_class`, `subject_id`, tọa độ/khu vực) thay vì chỉ gắn nhãn mức clip.
