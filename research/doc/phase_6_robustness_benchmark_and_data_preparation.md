# 🛡️ Phase 6: Khung Đánh Giá Độ Bền Bỉ (Robustness Benchmark) & Chuẩn Bị Dữ Liệu Kiểm Thử

---

## 1. 🎯 Mục Tiêu & Bối Cảnh (Context & Objectives)

Sau khi hoàn tất **Phase 1 đến Phase 5**, hệ thống ALPR đã đạt được bước nhảy vọt về tốc độ suy luận và tối ưu tài nguyên trên thiết bị nhúng:
* Kích thước mô hình giảm **72.6%** (11.7MB $\rightarrow$ 3.2MB nhờ Dynamic INT8).
* Tiêu thụ RAM giảm **83.8%** (~53MB).
* Thời gian xử lý End-to-End giảm từ **4.18s xuống ~668ms (~1.5 FPS)** trên Raspberry Pi 4.

Tuy nhiên, toàn bộ các đo đạc trước đây chủ yếu tập trung vào **tốc độ (Latency) và tài nguyên (Compute/RAM)** trên tập mẫu chuẩn (`samples/`). **Phase 6** được thiết kế nhằm chuẩn bị hạ tầng kiểm thử toàn diện về **độ chính xác (Accuracy) và độ bền bỉ (Robustness)** trước các điều kiện môi trường bất lợi thực tế tại cổng an ninh (trời tối, đèn pha chói, trời mưa, biển mờ bẩn, xe chạy nghiêng góc).

---

## 2. 📂 Chiến Lược Dữ Liệu 2 Nguồn (Two-Tier Test Dataset Strategy)

Trong nghiên cứu thị giác máy tính, việc chỉ dựa vào ảnh chụp ngoài đời sẽ gặp hạn chế: khó thu thập đủ mọi biến thể thời tiết trên cùng một góc máy và không thể kiểm soát định lượng mức độ nhiễu. Do đó, Phase 6 chuẩn hóa phương pháp tiếp cận gồm **2 nguồn dữ liệu độc lập**:

```mermaid
graph LR
    subgraph Dữ Liệu Đầu Vào
        SA[Source A: Clean & Diverse<br>200-300 ảnh sạch chuẩn]
        SB[Source B: Real-world Challenging<br>50-80 ảnh thực tế điều kiện khó]
    end

    subgraph Sinh Nhiễu Nhân Tạo
        CP[Bộ sinh nhiễu Corruptions<br>Light / Blur / Noise / Weather / Skew]
    end

    subgraph Đánh Giá Đối Chứng
        MA[Đo đạc suy giảm theo từng cấp độ nhiễu]
        MB[Đối chiếu thực tế Sanity Check]
    end

    SA --> CP --> MA
    SB --> MB
```

### A. Source A: Tập Dữ Liệu Gốc Đa Dạng (Clean & Diverse Baseline)
* **Quy mô:** ~200 – 300 ảnh.
* **Đặc tính:** Chụp rõ nét ở điều kiện ánh sáng chuẩn, đa dạng về phân loại:
  - Tỉ lệ phương tiện: Xe máy vs Ô tô (~50/50).
  - Định dạng biển: Biển 1 dòng (dài) vs Biển 2 dòng (vuông).
  - Màu sắc biển số: Biển trắng dân sự, biển vàng thương mại/dịch vụ.
* **Mục đích:** Đóng vai trò là **Ground Truth chuẩn** để áp dụng các thuật toán sinh nhiễu tự động với các cấp độ kiểm soát được từ nhẹ đến nặng.
* **Đường dẫn dự kiến:** [datasets/source_a/](file:///d:/project-coding-files/github/261002_SEP490_SecurityGate/research/datasets/source_a/)

### B. Source B: Tập Ảnh Thực Tế Điều Kiện Bất Lợi (Real-World Challenging Set)
* **Quy mô:** ~50 – 80 ảnh.
* **Đặc tính:** Ảnh chụp thực tế tại hiện trường các tình huống khó khăn:
  - Ánh sáng ban đêm, thiếu sáng hầm gửi xe, bóng cây loang lổ.
  - Ngược sáng mạnh hoặc chói lóa do đèn pha chiếu thẳng vào camera.
  - Biển số bị xước, bám bùn đất, ốc vít che chữ số.
  - Xe dừng chéo góc làn hoặc góc camera lắp cao nghiêng.
* **Mục đích:** Dùng làm **tập thẩm định đối chiếu (Sanity Check)**: kiểm chứng xem xu hướng sụt giảm độ chính xác trên ảnh mô phỏng (Source A + Noise) có phản ánh đúng thực tế ở Source B hay không.
* **Đường dẫn dự kiến:** [datasets/source_b/](file:///d:/project-coding-files/github/261002_SEP490_SecurityGate/research/datasets/source_b/)

---

## 3. 🧪 Bộ Kịch Bản Sinh Nhiễu Nhân Tạo (Synthetic Perturbations Matrix)

Các hàm biến đổi ảnh tự động được chia làm 4 nhóm chính, mỗi nhóm hỗ trợ 3 mức độ nghiêm trọng (**Level 1: Nhẹ | Level 2: Vừa | Level 3: Nặng**):

| Nhóm Nhiễu | Tên Kịch Bản | Mô Phỏng Thực Tế | Phương Pháp Thực Hiện (OpenCV/Albumentations) |
| :--- | :--- | :--- | :--- |
| **Quang Học & Ánh Sáng** | `Low-Light` | Ban đêm, hầm xe thiếu sáng | Giảm giá trị kênh V trong HSV, giảm hệ số Gamma ($\gamma < 0.6$). |
| | `Overexposure / Glare` | Đèn pha rọi thẳng, chói nắng | Tạo điểm sáng cực đại cục bộ (Gaussian glare blob) trên vùng biển số. |
| | `Uneven Shadows` | Mái che, cành cây đổ bóng | Áp mặt nạ alpha giảm sáng 40-60% trên nửa diện tích biển. |
| **Mờ & Chuyển Động** | `Motion Blur` | Xe chưa dừng hẳn trước barrier | Áp kernel tích chập chuyển động theo hướng ngang/chéo ($k=7, 15, 25$). |
| | `Defocus Blur` | Camera lệch tiêu cự | Áp làm mờ Gaussian diện rộng ($k=5, 9, 15$). |
| **Môi Trường & Truyền Dẫn** | `Rain Streaks` | Trời mưa rào hắt vào ống kính | Vẽ các vệt mưa ngẫu nhiên nghiêng $60^\circ-80^\circ$ với độ mờ trong suốt. |
| | `Sensor Noise` | Camera đẩy ISO cao lúc trời tối | Thêm nhiễu Gauss ($\sigma = 15, 30, 50$). |
| | `JPEG Compression` | Luồng RTSP nén bitrate thấp | Nén và giải nén lại ảnh ở chất lượng JPEG thấp ($Q = 30, 15, 5$). |
| **Hình Học & Vật Lý** | `Perspective Tilt` | Xe vào lệch làn, camera đặt lệch | Biến đổi phối cảnh (Perspective Transform) góc nghiêng $15^\circ, 30^\circ, 45^\circ$. |
| | `Partial Occlusion` | Đốm bùn, ốc vít đè chữ số | Vẽ ngẫu nhiên đốm đen hoặc vết xước che lấp 5% – 15% diện tích ký tự. |

---

## 4. 📊 Hệ Thống Chỉ Số Đo Lường Định Lượng (Evaluation Metrics)

Hệ thống đánh giá được tách biệt rõ ràng theo 2 tầng của Pipeline:

### A. Tầng 1: Đánh Giá Phát Hiện Biển Số (Detection Stage)
* **Precision / Recall / mAP@50:** Đo tỷ lệ bắt đúng vị trí biển số xe.
* **IoU Drop Rate:** Mức độ sai lệch tọa độ Bounding Box so với ảnh gốc khi có nhiễu:
  $$\Delta \text{IoU} = 1.0 - \text{IoU}(\text{Box}_{\text{clean}}, \text{Box}_{\text{corrupted}})$$

### B. Tầng 2: Đánh Giá Đọc Ký Tự (Recognition / OCR Stage)
* **Exact Match (EM %):** Biển số phải được đọc đúng **chính xác 100% từng ký tự**. Đây là chỉ số quan trọng nhất cho bài toán kiểm soát an ninh ra vào cổng.
* **Character Error Rate (CER / Levenshtein Distance):** Khoảng cách chỉnh sửa tối thiểu giữa chuỗi ký tự nhận diện và chuỗi Ground Truth, chia cho độ dài chuỗi:
  $$\text{CER} = \frac{\text{Levenshtein}(\text{Pred}, \text{GT})}{\text{Length}(\text{GT})}$$
* **Phân tách theo loại biển:** Đo lường độc lập cho biển 1 dòng (dài) và biển 2 dòng (vuông).

### C. Chỉ Số Độ Chống Chịu (Robustness Metric)
* Đo mức độ suy giảm độ chính xác tương đối giữa ảnh sạch và ảnh xấu:
  $$\text{Robustness Degradation} = \frac{\text{EM}_{\text{clean}} - \text{EM}_{\text{corrupted}}}{\text{EM}_{\text{clean}}} \times 100\%$$
* So sánh đối đầu giữa mô hình gốc **FP32** (`best.onnx`) và mô hình nén **INT8** (`best_int8.onnx`) để kết luận: *Lượng tử hóa INT8 có làm mô hình nhạy cảm hơn trước các điều kiện môi trường xấu hay không?*

---

## 5. 👥 Kế Hoạch Phân Công Công Việc Nhóm 5 Người (Task Breakdown)

Kế hoạch phân bổ cho nhóm 5 người tập trung vào khâu **chuẩn bị dữ liệu và xây dựng công cụ benchmark** (chưa tính thời gian bấm máy chạy và phân tích kết quả):

```text
[Thành viên 1: Source A (Data Sạch)] ──> [Thành viên 3: Bộ Sinh Nhiễu] ──┐
                                                                          ├──> [Thành viên 5: Runner Điều Phối] <── [Thành viên 4: Bộ Tính Metrics]
[Thành viên 2: Source B (Data Thật)] ────────────────────────────────────┘              │
                                                                                         └──> Báo cáo JSON/CSV hoàn chỉnh
```

| Thành Viên | Vai Trò (Role) | Nhiệm Vụ Chi Tiết (Tasks) | Sản Phẩm Bàn Giao (Deliverables) |
| :--- | :--- | :--- | :--- |
| **Thành viên 1** | **Data Engineer**<br>*(Source A Baseline)* | • Thu thập 200 – 300 ảnh sạch, đa dạng xe máy/ô tô, biển 1 dòng/2 dòng.<br>• Chuẩn hóa cấu trúc thư mục `datasets/source_a/`.<br>• Gắn nhãn Ground Truth (BBox + Text). | 📁 `datasets/source_a/`<br>📄 `ground_truth_source_a.json` |
| **Thành viên 2** | **Field Data & QA**<br>*(Source B Real-world)* | • Thu thập/chụp 50 – 80 ảnh thực tế điều kiện khó (tối, mưa, chói đèn, bẩn, nghiêng).<br>• Gắn nhãn Ground Truth chuẩn 100%.<br>• Tạo metadata phân loại điều kiện môi trường cho từng ảnh. | 📁 `datasets/source_b/`<br>📄 `ground_truth_source_b.json` |
| **Thành viên 3** | **Perturbation Engineer**<br>*(Bộ Sinh Nhiễu Nhân Tạo)* | • Lập trình module sinh 4 nhóm nhiễu (Ánh sáng, Mờ, Thời tiết, Hình học).<br>• Hỗ trợ tham số hóa 3 mức độ (Level 1 $\rightarrow$ 3).<br>• Viết CLI tự động sinh tập ảnh xấu từ Source A. | 🐍 `evaluation/corruptions.py` |
| **Thành viên 4** | **Metrics Developer**<br>*(Bộ Đo Lường Chỉ Số)* | • Xây dựng module tính toán IoU, Precision, Recall, mAP@50.<br>• Xây dựng hàm tính Exact Match (EM) và CER (Levenshtein Distance).<br>• Xử lý format cho cả biển 1 dòng và 2 dòng.<br>• Xuất báo cáo ra định dạng JSON/CSV. | 🐍 `evaluation/metrics.py` |
| **Thành viên 5** | **Test Harness Orchestrator**<br>*(Khung Điều Phối Runner)* | • Viết script điều phối chính chạy đánh giá theo batch trên toàn bộ dataset.<br>• Cho phép hoán đổi linh hoạt giữa FP32/INT8 và kích thước ảnh 640/480/320.<br>• Đo đạc thời gian từng stage (Det, OCR, Total) và Peak RAM.<br>• Đóng gói tương thích chạy trong Docker RPi4 simulation. | 🐍 `evaluation/run_benchmark.py`<br>🐳 Cấu hình Docker execution |

---

## 6. 🏁 Tiêu Chí Hoàn Thành (Definition of Done cho Phase 6 Setup)
1. Thư mục `datasets/source_a/` và `datasets/source_b/` có đầy đủ ảnh và file nhãn JSON hợp lệ.
2. Script `corruptions.py` chạy độc lập, sinh ra được các bộ ảnh nhiễu theo đúng từng kịch bản.
3. Module `metrics.py` vượt qua các bài kiểm thử đơn vị (Unit Test) về tính toán mAP và CER.
4. Script `run_benchmark.py` có thể nạp bất kỳ tập ảnh nào, chạy qua `ALPRPipeline` và xuất kết quả ra file tổng hợp một cách tự động trên cả máy phát triển và Docker Raspberry Pi 4.
