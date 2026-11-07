# TỔNG QUAN TÀI LIỆU (LITERATURE REVIEW)
## Audio-Visual & Ambient Context Fusion: Ghép nối Dữ liệu Tần số Thấp (SHT31, BH1750) và Tần số Cao (Mic INMP441, Video) trong Hệ thống Cảm biến Đa phương thức

---

### TỔNG QUAN BỐI CẢNH VÀ THÁCH THỨC KHOA HỌC

Trong các hệ thống nhận thức ngữ cảnh thông minh (Context-Aware Systems), giám sát môi trường sống (Smart Home / Ambient Assisted Living - AAL) và biên mạng IoT (Edge AI), việc tích hợp đa phương thức (Multimodal Fusion) đóng vai trò quyết định độ chính xác và tính toàn vẹn của mô hình. 

Tuy nhiên, một rào cản kỹ thuật cốt lõi là **sự bất đối xứng nghiêm trọng về tần số lấy mẫu (Asymmetric / Heterogeneous Sampling Rates)**:
1. **Dữ liệu tần số cao (High-Frequency Streams):**
   - **Tín hiệu âm thanh (Acoustic Stream - Mic INMP441):** Giao tiếp I2S, tần số lấy mẫu từ $16\,\text{kHz}$ đến $44.1\,\text{kHz}$ hoặc $48\,\text{kHz}$ (hàng chục nghìn điểm dữ liệu/giây).
   - **Tín hiệu hình ảnh/video (Visual Stream - Camera RGB/Depth):** Tần số khung hình $15 - 30\,\text{fps}$ (khối tensor không gian - thời gian lớn).
2. **Dữ liệu ngữ cảnh môi trường tần số thấp (Low-Frequency Ambient Context):**
   - **Cảm biến nhiệt độ - độ ẩm (Sensirion SHT31):** Giao tiếp I2C, chu kỳ trích xuất chuẩn $0.1\,\text{Hz} - 1\,\text{Hz}$ do quán tính nhiệt chậm.
   - **Cảm biến cường độ ánh sáng (ROHM BH1750):** Giao tiếp I2C, độ phân giải cao cần thời gian tích phân quang học $120\,\text{ms} - 180\,\text{ms}$, tần số cập nhật hiệu quả $1\,\text{Hz} - 8\,\text{Hz}$.

Các phương pháp ghép nối truyền thống như nội suy tuyến tính (Linear Interpolation), Zero-Order Hold (ZOH) hoặc làm phẳng/đồng nhất tần số (Downsampling/Upsampling) thường dẫn đến hai hệ lụy nghiêm trọng: làm biến dạng pha tín hiệu, tích lũy nhiễu ảo (hallucinated artifacts) ở luồng chậm, hoặc làm suy giảm nghiêm trọng độ phân giải thời gian ở luồng nhanh.

Dưới đây là tổng hợp 5 công trình nghiên cứu khoa học chất lượng cao (thuộc danh mục Scopus/Web of Science Q1/Q2, IEEE Xplore, ScienceDirect - Elsevier, Springer Nature, ACM) xuất bản trong giai đoạn 2021–2024, giải quyết trực tiếp bài toán ghép nối đa tần số (Multi-rate Fusion), cấu trúc đồ thị/chú ý chéo (Cross-Attention/GNN), và các bộ dữ liệu thực nghiệm tiêu chuẩn.

---

## 1. Multirate-Former: Kiến trúc Transformer phân cấp xử lý dữ liệu cảm biến đa tần số lấy mẫu

### Thông tin xuất bản
- **Tên bài báo:** Multirate-Former: An Efficient Transformer-Based Hierarchical Network for Multistep Prediction of Multirate Industrial Processes
- **Tác giả:** Diju Liu, Yalin Wang, Chenliang Liu, Xiaofeng Yuan, Chunhua Yang
- **Năm xuất bản:** 2024 (Online: Tháng 11/2023)
- **Tạp chí/Hội nghị:** *IEEE Transactions on Instrumentation and Measurement* (IEEE TIM), Tập 73, Mã bài báo: 2502313, Trang 1–13.
- **Xếp hạng:** Web of Science Q1 / Scopus Q1 (Impact Factor: ~5.6)
- **DOI / Link:** [10.1109/TIM.2023.3335508](https://doi.org/10.1109/TIM.2023.3335508)

### Vấn đề cốt lõi (Problem Statement)
Trong các hệ thống cảm biến vật lý và IoT công nghiệp, các biến số vật lý (nhiệt độ, áp suất, độ ẩm) luôn có chu kỳ lấy mẫu chậm hơn rất nhiều so với các thông số dao động nhanh. Khi thực hiện dự báo hoặc nhận dạng đa bước (multistep prediction/recognition), việc dữ liệu bị khuyết tạm thời do tần số lấy mẫu không đồng đều (multirate characteristics) khiến các mô hình chuỗi thời gian kinh điển (LSTM, Transformer chuẩn) bị mất mát thông tin hoặc tạo ra độ lệch lớn do phép nội suy thô.

### Phương pháp đề xuất (Methodology)
Tác giả đề xuất kiến trúc phân cấp mang tên **Multirate-Former**:
1. **Phân đoạn dữ liệu theo tần số (Data Chunking):** Tách biệt các biến đo lường thành các nhóm độc lập dựa theo tần số lấy mẫu tự nhiên của phần cứng trước khi đưa vào mạng.
2. **Bù khuyết phân cấp (Hierarchical Complementation):** Kết hợp các khối tích chập nhiều lớp (Multilayer CNNs) để bắt đặc trưng thô (coarse-grained) và các khối Transformer để bắt đặc trưng ngữ cảnh mịn (fine-grained), tự động suy diễn và bù lấp các khoảng trống dữ liệu tần số thấp.
3. **Mã hóa kiểu lấy mẫu (Sampling-Type Coding):** Thiết kế cơ chế biểu diễn vị trí thời gian mới, gắn nhãn trực tiếp đặc tính tần số lấy mẫu của từng cảm biến vào không gian nhúng (embedding), giúp cơ chế Self-Attention phân biệt được đâu là bước đo thực tế và đâu là bước nội suy ngữ cảnh.
4. **Tiền huấn luyện và tinh chỉnh đa bước (Pretraining & Fine-tuning):** Tối ưu hóa trọng số ban đầu trên các mảng dữ liệu hoàn chỉnh, sau đó tinh chỉnh qua hàm mất mát đa bước (multistep prediction loss).

### Kết quả nổi bật (Results)
- Thử nghiệm trên 2 hệ thống dữ liệu thực tế quy mô lớn (Debutanizer Column và Hydrocracking Process).
- Multirate-Former vượt trội hoàn toàn so với LSTM, GRU, Temporal Convolutional Network (TCN) và Vanilla Transformer.
- Giảm sai số bình phương trung bình (RMSE) và sai số tuyệt đối trung bình (MAE) từ **15% đến 28%** trong các dự báo dài hạn (từ 5 đến 15 bước thời gian tiếp theo) so với các phương pháp bù khuyết bằng nội suy tuyến tính truyền thống.

### Khoảng trống nghiên cứu (Research Gap)
- Mô hình tập trung vào chuỗi thời gian 1D (1-D time-series); chưa mở rộng trực tiếp sang việc kết hợp đồng thời với dữ liệu 2D/3D giàu chiều không gian như phổ âm thanh (Audio Spectrogram) hoặc khung hình video (Video Frames).
- Đòi hỏi tài nguyên tính toán khá lớn cho cơ chế Attention phân cấp, cần kỹ thuật lượng hóa (Quantization) nếu muốn triển khai trực tiếp trên vi điều khiển biên (Edge MCU như ESP32 hoặc Raspberry Pi Zero).

---

## 2. SPHERE Dataset: Bộ dữ liệu đa cảm biến môi trường, video và chuyển động trong không gian sống thực tế

### Thông tin xuất bản
- **Tên bài báo:** A multi-sensor dataset with annotated activities of daily living recorded in a residential setting
- **Tác giả:** Emma L. Tonkin, Michael Holmes, Hao Song, Niall Twomey, Tom Diethe, Meelis Kull, Miquel Perello Nieto, Massimo Camplani, Sion Hannuna, Xenofon Fafoutis, Ni Zhu, Przemysław R. Woznowski, Gregory J. L. Tourte, Raúl Santos-Rodríguez, Peter A. Flach, Ian Craddock
- **Năm xuất bản:** 2023
- **Tạp chí/Hội nghị:** *Scientific Data* (Springer Nature Portfolio), Tập 10, Mã bài báo: 162.
- **Xếp hạng:** Web of Science Q1 / Scopus Q1 (Impact Factor: ~9.8)
- **DOI / Link:** [10.1038/s41597-023-02017-1](https://doi.org/10.1038/s41597-023-02017-1)

### Vấn đề cốt lõi (Problem Statement)
Thiếu hụt các bộ dữ liệu chuẩn mực (benchmark datasets) thu thập trong môi trường sống gia đình thực tế (Domestic Living Environments) có sự đồng bộ thời gian chuẩn xác giữa các luồng video tần số cao và các cảm biến môi trường tần số thấp (nhiệt độ, độ ẩm, độ rọi quang học, cảm biến chuyển động thụ động PIR). Hầu hết các tập dữ liệu trước đây chỉ thu thập đơn lẻ trong phòng thí nghiệm hoặc thiếu nhãn hoạt động chi tiết ở nhiều tầng mức.

### Phương pháp đề xuất (Methodology)
Tác giả công bố bộ dữ liệu toàn diện thu thập từ "Ngôi nhà SPHERE" (SPHERE House, Đại học Bristol):
1. **Hệ thống cảm biến phân tầng đa tần số:**
   - **Tần số cao:** Camera video được hiệu chuẩn, trích xuất tọa độ 2D/3D Bounding Box và tư thế chuyển động (bảo vệ quyền riêng tư người dùng).
   - **Tần số trung bình:** Cảm biến gia tốc 3 trục đeo tay ($50\,\text{Hz}$).
   - **Tần số thấp:** Các cụm cảm biến môi trường đặt cố định trên tường đo cường độ ánh sáng môi trường (Lux), nhiệt độ, độ ẩm tương đối, cảm biến PIR và chất lượng không khí (lấy mẫu ở chu kỳ $0.1\,\text{Hz} - 1\,\text{Hz}$).
2. **Giao thức đồng bộ và gán nhãn:** Dữ liệu được đồng bộ hóa thời gian tuyệt đối qua giao thức mạng NTP/ZigBee timestamping; gán nhãn thủ công qua 4 phân tầng ngữ cảnh: Tư thế (Posture), Di chuyển (Ambulation), Hành động chi tiết (Action), và Vị trí phòng (Room Location).

### Kết quả nổi bật (Results)
- Cung cấp hàng trăm giờ dữ liệu thực tế từ các tình nguyện viên thực hiện cả hoạt động có kịch bản (scripted) và hoạt động tự nhiên (unscripted ADLs).
- Chứng minh bằng thực nghiệm: Khi kết hợp luồng ngữ cảnh môi trường tần số thấp (nhiệt độ phòng, ánh sáng, PIR) với luồng hình ảnh/chuyển động, không gian tìm kiếm trạng thái hoạt động (state space) được thu hẹp đáng kể, giúp giảm tỷ lệ dương tính giả (false positive rate) của các mô hình thị giác máy tính tới **18.4%**, đặc biệt trong các trường hợp góc camera bị che khuất (occlusion).

### Khoảng trống nghiên cứu (Research Gap)
- Nhằm tuân thủ nghiêm ngặt quy định bảo mật riêng tư của cư dân (GDPR), dữ liệu âm thanh (Microphone stream) đã bị loại bỏ khỏi bộ phát hành công khai; luồng video chỉ cung cấp tọa độ Bounding Box và Skeleton chứ không cung cấp khung hình RGB thô.
- Khoảng cách tần số lớn giữa cảm biến môi trường ($0.1\,\text{Hz}$) và cảm biến đeo ($50\,\text{Hz}$) tạo ra độ thưa thớt (sparsity) cao trong ma trận dữ liệu tổng thể, đòi hỏi các thuật toán suy luận trạng thái trễ.

---

## 3. Bộ dữ liệu hoạt động đa kênh: Âm thanh môi trường, Rung chấn và Ngữ cảnh Khí hậu

### Thông tin xuất bản
- **Tên bài báo:** Multi-Modal Dataset of Human Activities of Daily Living with Ambient Audio, Vibration, and Environmental Data
- **Tác giả:** Thomas Pfitzinger, Marcel Koch, Fabian Schlenke, Hendrik Wöhrle
- **Năm xuất bản:** 2024
- **Tạp chí/Hội nghị:** *Data* (MDPI), Tập 9, Số 12, Mã bài báo: 144.
- **Xếp hạng:** Scopus / ESCI Indexed (Web of Science)
- **DOI / Link:** [10.3390/data9120144](https://doi.org/10.3390/data9120144) (Mã kho dữ liệu Zenodo: [10.5281/zenodo.7937591](https://doi.org/10.5281/zenodo.7937591))

### Vấn đề cốt lõi (Problem Statement)
Hầu hết các nghiên cứu nhận thức ngữ cảnh trong nhà hiện nay gặp thế tiến thoái lưỡng nan: Camera thị giác thì xâm phạm đời tư nghiêm trọng, còn thiết bị đeo (wearables) thì gây khó chịu và phụ thuộc vào sự tuân thủ đeo thiết bị của người dùng. Cần một bộ dữ liệu hoàn toàn không xâm lấn (non-intrusive ambient sensing), kết hợp giữa âm thanh môi trường tần số cao, dao động cơ học và các chỉ số vi khí hậu tần số thấp tại các vị trí phân tán.

### Phương pháp đề xuất (Methodology)
1. **Thiết lập phần cứng cảm biến biên phân tán:** Sử dụng 5 nút cảm biến đa năng (Multisensor Devices) đặt tại các vị trí chiến lược trong không gian sinh hoạt.
2. **Cấu trúc đa kênh kết hợp tần số cao và tần số thấp:**
   - **Âm thanh môi trường (Ambient Audio):** Ghi nhận âm thanh nền và âm thanh tương tác của người dùng.
   - **Dao động cơ học (Vibration):** Cảm biến gia tốc/áp điện gắn trên bề mặt đồ vật/tường.
   - **Ngữ cảnh nhiệt độ & quang học:** Ma trận cảm biến hồng ngoại nhiệt phân giải thấp ($8 \times 8$ IR thermal array), cảm biến màu ánh sáng (Light color/lux) và các thông số khí hậu môi trường (nhiệt độ, áp suất, độ ẩm).
3. **Quy mô dữ liệu:** Thu thập 8.615 phiên ghi nhận cho 25 hoạt động thường nhật khác nhau (ADLs) từ 14 đối tượng tham gia, đạt tổng thời lượng xấp xỉ 17.5 giờ. Dữ liệu được cung cấp ở định dạng thô (raw synchronized signals) để giữ nguyên vẹn đặc tính tần số ban đầu.

### Kết quả nổi bật (Results)
- Đóng góp bộ dữ liệu mở hoàn chỉnh đầu tiên tích hợp đồng bộ âm thanh đa vị trí với cảm biến nhiệt/ánh sáng môi trường không xâm lấn.
- Thực nghiệm phân loại cơ sở (baseline classification) chỉ ra rằng việc kết hợp âm thanh môi trường với thông số ánh sáng và nhiệt độ nhiệt giúp cải thiện F1-score tổng thể thêm **11.2%** so với việc chỉ sử dụng âm thanh đơn lẻ, đặc biệt hiệu quả trong việc phân biệt các hoạt động tĩnh nhưng có phát sinh nhiệt/ánh sáng (ví dụ: nấu ăn bằng bếp điện, bật đèn đọc sách, mở tủ lạnh).

### Khoảng trống nghiên cứu (Research Gap)
- Tác giả cung cấp dữ liệu ở dạng thô được phân mảnh theo sự kiện (event-based chunks) nhưng chưa xây dựng một kiến trúc mạng nơ-ron sâu chuyên dụng để tự động cân bằng trọng số giữa chuỗi âm thanh dày đặc và chuỗi khí hậu môi trường thưa thớt.
- Không có dữ liệu video tham chiếu song song do thiết kế ban đầu loại bỏ hoàn toàn camera để ưu tiên quyền riêng tư.

---

## 4. Ghép nối Thông tin Audio-Visual bằng Mạng Đồ thị Tương quan Chuẩn tắc (CCA-GNN)

### Thông tin xuất bản
- **Tên bài báo:** Multimodal audio-visual information fusion using canonical-correlated Graph Neural Network for energy-efficient speech enhancement
- **Tác giả:** Leandro A. Passos, João Paulo Papa, Javier Del Ser, Amir Hussain, Ahsan Adeel
- **Năm xuất bản:** 2023 (Online: Tháng 9/2022)
- **Tạp chí/Hội nghị:** *Information Fusion* (Elsevier), Tập 90, Trang 1–11.
- **Xếp hạng:** Web of Science Q1 / Scopus Q1 (Top 1% Tạp chí AI & Xử lý thông tin, Impact Factor: ~14.7)
- **DOI / Link:** [10.1016/j.inffus.2022.09.006](https://doi.org/10.1016/j.inffus.2022.09.006)

### Vấn đề cốt lõi (Problem Statement)
Ghép nối tín hiệu âm thanh tần số cao (hàng chục kHz) và luồng video tần số thấp hơn (25–30 fps) thường vấp phải sự mất cân đối kích thước biểu diễn và độ trễ thời gian. Các mô hình Cross-Attention hoặc Transformer đa phương thức truyền thống tiêu tốn tài nguyên tính toán cực kỳ lớn, không thể triển khai trên các thiết bị biên IoT hoặc thiết bị trợ thính thông minh vốn bị giới hạn ngặt nghèo về năng lượng (Energy-constrained edge devices).

### Phương pháp đề xuất (Methodology)
Tác giả đề xuất mô hình **CCA-GNN** kết hợp giữa Mạng nơ-ron đồ thị (Graph Neural Network) và Phân tích tương quan chuẩn tắc (Canonical Correlation Analysis) học tự giám sát (Self-supervised):
1. **Biểu diễn đồ thị không-thời gian:** Mô hình hóa các khung âm thanh và khung hình ảnh thành các nút (nodes) trên đồ thị.
2. **Mã hóa vị trí qua khoảng cách chuỗi khung trước (Prior-Frame Sequence Distance - PFSD):** Thay vì dùng ma trận kề cố định theo không gian đặc trưng, PFSD mã hóa khoảng cách thời gian giữa các khung liên tiếp để duy trì tính liên tục và bắt kịp động lực học thời gian đa tốc độ.
3. **Tối ưu hóa tương quan trực giao (CCA Objective):** Thay thế hàm mất mát tương phản nặng nề (Contrastive Loss đòi hỏi negative samples) bằng hàm mục tiêu CCA, tối đa hóa tương quan giữa các biểu diễn hình ảnh - âm thanh trong khi khử tương quan giữa các chiều đặc trưng dư thừa.

### Kết quả nổi bật (Results)
- Đánh giá trên bộ dữ liệu chuẩn CHiME-3 và GRID dưới nhiều mức tỷ số tín hiệu trên tạp âm (SNR từ $-12\,\text{dB}$ đến $+12\,\text{dB}$).
- Đạt điểm số chất lượng âm thanh vượt trội: Chỉ số PESQ (Perceptual Evaluation of Speech Quality) và STOI (Short-Time Objective Intelligibility) tương đương hoặc vượt qua các kiến trúc Transformer nặng.
- **Tiết kiệm năng lượng và tính toán:** Giảm hơn **35% độ phức tạp tính toán (FLOPs)** và tăng độ thưa của kích hoạt nơ-ron (neuron activation sparsity), chứng minh khả năng vận hành thời gian thực trên phần cứng nhúng.

### Khoảng trống nghiên cứu (Research Gap)
- Nghiên cứu chỉ tập trung vào cặp phương thức Audio - Visual; chưa mở rộng sang việc tiếp nhận thêm phương thức thứ ba là ngữ cảnh môi trường tần số siêu thấp (nhiệt độ, ánh sáng lux).
- Giả định rằng luồng âm thanh và hình ảnh có thể chia khung (framing) khớp nối tương đối theo tỷ lệ cố định (ví dụ 1 frame hình ảnh ứng với $N$ mẫu âm thanh), chưa xử lý trường hợp cảm biến môi trường truyền bất đồng bộ ngẫu nhiên (event-driven asynchronous packets).

---

## 5. Tăng cường Phương thức Lũy tiến (PMR) cho Chuỗi Đa phương thức Bất đồng bộ

### Thông tin xuất bản
- **Tên bài báo:** Progressive Modality Reinforcement for Human Multimodal Emotion Recognition From Unaligned Multimodal Sequences
- **Tác giả:** Fengmao Lv, Xiang Chen, Yanyong Huang, Lixin Duan, Guosheng Lin
- **Năm xuất bản:** 2021
- **Tạp chí/Hội nghị:** *IEEE/CVF Conference on Computer Vision and Pattern Recognition* (CVPR 2021), Trang 2556–2564.
- **Xếp hạng:** Hội nghị hàng đầu thế giới về Thị giác máy tính & AI (H-index: >400, CORE Rank A*)
- **DOI / Link:** [10.1109/CVPR46437.2021.00258](https://doi.org/10.1109/CVPR46437.2021.00258)

### Vấn đề cốt lõi (Problem Statement)
Trong các chuỗi dữ liệu đa cảm biến từ thế giới thực, mỗi luồng tín hiệu (âm thanh, cử chỉ hình ảnh, thông điệp ngôn ngữ) đều có tốc độ lấy mẫu và chiều dài chuỗi không tương đồng (Unaligned Sequences). Phương pháp ép đồng bộ (Forced Temporal Alignment) qua nén/giãn chuỗi làm sai lệch nghiêm trọng đặc tính vật lý nội tại, trong khi việc tính toán cơ chế Cross-Attention đôi một giữa tất cả các cặp cảm biến làm bùng nổ độ phức tạp tính toán lên bậc $O(M^2 \cdot L^2)$ và gây ra hiện tượng phương thức có tần số dày đặc làm áp đảo (dominate/suppress) phương thức tần số thưa.

### Phương pháp đề xuất (Methodology)
Tác giả phát triển kiến trúc **Progressive Modality Reinforcement (PMR)**:
1. **Trung tâm điều phối thông điệp (Message Hub):** Thiết lập một không gian trạng thái trung gian nhỏ gọn đóng vai trò cầu nối thông tin tập trung, thay vì cho các phương thức giao tiếp trực tiếp đôi một.
2. **Cơ chế tăng cường hai chiều lặp vòng (Cyclic Bidirectional Reinforcement):**
   - **Giai đoạn Phát tán (Broadcast Step):** Message Hub phát thông điệp ngữ cảnh chung đến từng nhánh cảm biến độc lập. Tại đây, cơ chế Cross-Attention cục bộ sẽ dùng thông điệp chung để tăng cường đặc trưng cho từng phương thức mà không quan tâm đến tần số lấy mẫu của phương thức đó.
   - **Giai đoạn Thu nạp (Aggregation Step):** Các đặc trưng sau khi được tăng cường từ từng nhánh sẽ được tổng hợp ngược lại để cập nhật trạng thái của Message Hub.
3. **Căn chỉnh tiệm tiến (Progressive Alignment):** Quá trình phát tán - thu nạp lặp lại qua nhiều tầng giúp các luồng tín hiệu có độ dài và tốc độ khác nhau dần thẩm thấu ngữ cảnh của nhau mà không cần nội suy phá hủy dữ liệu.

### Kết quả nổi bật (Results)
- Thử nghiệm trên hai tập dữ liệu benchmark unaligned nổi tiếng: CMU-MOSEI và CMU-MOSI.
- Đạt độ chính xác nhị phân (Binary Accuracy) **84.1%** và F1-score **84.2%** trên CMU-MOSEI unaligned; vượt qua mô hình Multimodal Transformer (MulT) kinh điển **1.8%** độ chính xác.
- Giảm hơn **40% dung lượng bộ nhớ GPU** và thời gian huấn luyện trong quá trình lan truyền ngược nhờ loại bỏ ma trận Attention đôi một giữa các chuỗi có độ dài không bằng nhau.

### Khoảng trống nghiên cứu (Research Gap)
- Đối tượng thử nghiệm chủ yếu là chuỗi âm thanh và video đã được cắt thành đoạn ngắn (segmented clips); chưa được kiểm thử trong điều kiện luồng dữ liệu trôi liên tục (streaming time-series) của các cảm biến IoT đo đạc 24/7.
- Kiến trúc chưa tích hợp cơ chế tự thích ứng khi một cảm biến môi trường bị ngắt kết nối tạm thời hoặc chu kỳ gửi gói tin dao động thất thường (jitter/packet drop).

---

## BẢNG SO SÁNH TỔNG HỢP CÁC CÔNG TRÌNH NGHIÊN CỨU

| Tiêu chí | Multirate-Former (IEEE TIM 2024) | SPHERE Dataset (Sci Data 2023) | ADL Ambient Dataset (MDPI Data 2024) | CCA-GNN (Inf. Fusion 2023) | PMR Network (CVPR 2021) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phân hạng / CSDL** | WoS Q1 / IEEE Xplore | WoS Q1 / Nature Portfolio | Scopus / MDPI Open Access | WoS Q1 / ScienceDirect | CORE A* / IEEE Xplore |
| **Phương thức xử lý** | Chuỗi thời gian đa tần số (Công nghiệp/IoT) | Video (Bounding Box), Môi trường (Temp, Lux, PIR), Gia tốc | Âm thanh (Audio), Rung chấn, Mảng nhiệt IR, Ánh sáng, Khí hậu | Âm thanh (Audio kHz) + Hình ảnh (Video fps) | Âm thanh + Video + Văn bản (Chuỗi unaligned) |
| **Giải pháp ghép nối** | Phân đoạn theo tần số + Bù khuyết CNN-Transformer + Sampling-Type Coding | Thu thập thực tế đa tầng + Đồng bộ tem thời gian chuẩn NTP | 5 Nút cảm biến phân tán + Thu thập đồng bộ dữ liệu thô | Mạng đồ thị GNN + Mã hóa PFSD + Hàm tương quan CCA | Message Hub trung gian + Tăng cường ngữ cảnh 2 chiều |
| **Khả năng triển khai Biên** | Trung bình (Cần lượng hóa) | Benchmark dữ liệu (Offline) | Cảm biến biên chi phí thấp, phân tán | Rất cao (Tối ưu năng lượng, ít tham số) | Tốt (Giảm chi phí ma trận Attention) |
| **Điểm hạn chế chính** | Chưa thử nghiệm với tín hiệu hình ảnh/âm thanh thô | Không có dữ liệu âm thanh; video bị ẩn danh hóa | Chưa có mã nguồn kiến trúc mạng nơ-ron học sâu đi kèm | Chưa ghép nối cảm biến khí hậu tần số thấp ($<1\,\text{Hz}$) | Dành cho chuỗi cắt ngắn, chưa tối ưu cho IoT truyền liên tục |

---

## KHUYẾN NGHỊ THIẾT KẾ KIẾN TRÚC CHO BÀI TOÁN CỤ THỂ
*(Ghép nối SHT31, BH1750 với Mic INMP441 và Camera Video)*

Dựa trên các bằng chứng thực nghiệm từ 5 công trình nghiên cứu trên, kiến trúc tối ưu để giải quyết bài toán ghép nối dữ liệu giữa các cảm biến **SHT31 ($0.1 - 1\,\text{Hz}$)**, **BH1750 ($1 - 8\,\text{Hz}$)** với **Microphone INMP441 ($16 - 44.1\,\text{kHz}$)** và **Camera Video ($15 - 30\,\text{fps}$)** bao gồm 3 khối chức năng cốt lõi:

```
[Camera (15-30 fps)]    ---> 2D/3D CNN hoặc ViT Backbone  ---+ 
[INMP441 (16-44.1 kHz)] ---> Mel-Spectrogram + 1D-CNN/AST  ---+---> [Message Hub / Hierarchical Cross-Attention] ---> [Đầu ra Nhận thức]
[BH1750 (1-8 Hz)]       ---> Linear Projection + Type Code ---+      (Cập nhật bất đồng bộ theo khung trượt)
[SHT31 (0.1-1 Hz)]      ---> Zero-Hold Embedding + Type Code -+
```

1. **Cơ chế Tiền xử lý & Căn chỉnh Khung thời gian trượt (Sliding Temporal Window):**
   - Thiết lập cửa sổ phân tích cơ sở (ví dụ: $W = 1.0\,\text{giây}$).
   - Trong $1.0\,\text{s}$: Luồng Microphone INMP441 cung cấp $16.000$ mẫu (chuyển đổi thành biểu đồ phổ Mel-Spectrogram kích thước $T \times F$), Video cung cấp $20 - 30$ khung hình, BH1750 cung cấp khoảng $2 - 5$ giá trị độ rọi Lux, và SHT31 cung cấp $1$ cặp giá trị [Nhiệt độ, Độ ẩm].
2. **Kỹ thuật Mã hóa Kiểu lấy mẫu (Sampling-Type Coding theo nguyên lý Multirate-Former):**
   - Không thực hiện nội suy cưỡng bức luồng SHT31/BH1750 lên tần số kHz của âm thanh.
   - Sử dụng một mạng MLP/Linear Projection đưa các giá trị scalar [Nhiệt độ, Độ ẩm, Lux] vào cùng số chiều không gian ẩn ($D_{embed}$) và cộng thêm một vector nhúng tần số `Sampling_Rate_Embedding` để mô hình tự học độ tin cậy và quán tính trễ của các biến môi trường.
3. **Mô hình Hợp nhất tập trung dạng Message Hub (theo nguyên lý PMR và CCA-GNN):**
   - Tránh dùng Attention trực tiếp giữa mảng Mel-Spectrogram/Video với giá trị đơn lẻ của SHT31/BH1750 để tránh hiện tượng luồng tần số cao áp đảo hoàn toàn ngữ cảnh môi trường.
   - Dữ liệu môi trường tần số thấp đóng vai trò **Bộ điều biến ngữ cảnh (Contextual Gate / FiLM Layer - Feature-wise Linear Modulation)**: Cường độ ánh sáng từ BH1750 sẽ điều biến trọng số các kênh đặc trưng của Camera (giúp mô hình biết môi trường đang tối hay sáng để bù sáng cho hình ảnh), trong khi nhiệt độ/độ ẩm từ SHT31 sẽ hiệu chỉnh trọng số phân loại các hoạt động sinh hoạt gia đình có phát sinh nhiệt/hơi nước (tắm rửa, đun nước, nấu ăn).

