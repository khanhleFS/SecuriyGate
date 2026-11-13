# Khanh — Audio-visual & Ambient Context Fusion: tìm kiếm mới

**Ngày kiểm chứng:** 13/11/2026.  
**Mục tiêu:** tham khảo thiết kế thu thập, đồng bộ và hợp nhất camera–microphone với cảm biến môi trường tốc độ thấp, hướng tới SHT31, BH1750, INMP441 và video.

## 1. Phạm vi và kết quả chọn lọc

Chọn **5 bài từ 2021–2025**, không trùng **17 bài trong danh sách bỏ qua** của yêu cầu mới và không lặp 7 bài trong file Khanh trước. Tất cả đều đọc được toàn văn hoặc toàn văn kèm phụ lục; không có mục nào chỉ dựa trên abstract. Nguồn xuất bản gồm IEEE/CVF, IEEE ICRA, Springer/IJCV và NeurIPS. Với các hội nghị, không gán quartile như tạp chí.

**Phát hiện sát đề tài nhất là HOMAGE:** có cả audio, video, nhiệt độ/độ ẩm và ánh sáng với tốc độ khác nhau. Tuy nhiên, bài báo mô tả thu nhận nhiều loại dữ liệu không đồng nghĩa mọi loại đã được phát hành. [Bài gốc và phụ lục](https://arxiv.org/pdf/2105.05226), [trạng thái tải do nhóm tác giả công bố](https://homeactiongenome.org/download.html).

Không bài nào dưới đây được xác nhận dùng đúng đồng thời **SHT31 + BH1750 + INMP441**. Bốn bài còn lại cung cấp bằng chứng về đồng bộ, đa góc nhìn, gán nhãn hoặc audio–visual fusion; mức liên quan đến ambient context được ghi riêng. Đây là tổng quan có chọn lọc, không phải khẳng định đã tìm hết mọi nghiên cứu.

**Quy ước:** “Tác giả nêu” là nội dung trong nguồn; “Nhận định” là suy luận phục vụ đề tài. Sai số vị trí (mm/cm), sai số thời gian (ms), FPS thu gốc và tốc độ đầu vào mô hình được phân biệt. Danh sách tác giả dài được rút gọn bằng “và cộng sự”, có liên kết danh sách đầy đủ.

## 2. Tổng hợp từng bài theo 6 mục

### [1] HOMAGE — Home Action Genome: Cooperative Compositional Action Understanding

1. **Thông tin xuất bản:** Nishant Rai, Haofeng Chen, Jingwei Ji, Rishi Desai, Kazuki Kozuka, Shun Ishizaka, Ehsan Adeli, Juan Carlos Niebles; **2021**, *IEEE/CVF CVPR*. [Hồ sơ kỷ yếu](https://openaccess.thecvf.com/content/CVPR2021/html/Rai_Home_Action_Genome_Cooperative_Compositional_Action_Understanding_CVPR_2021_paper.html), [toàn văn và phụ lục](https://arxiv.org/pdf/2105.05226).

2. **Vấn đề cốt lõi:** Nhận dạng hoạt động phức hợp cần thông tin hành động thành phần, tương tác đồ vật và nhiều góc nhìn để giảm tác động che khuất.

3. **Phần cứng, dữ liệu & đồng bộ:** 27 người, hai nhà; kit đặt trong phòng và trên đầu, trung bình trên ba góc/chuỗi. OV5647 **30 FPS**, SPH0645LM4H **48 kHz**, TSL2591 **2 Hz**, BME680 **5 Hz**. Scheduler I²C **60 Hz** điều chỉnh drift; tone đầu/cuối căn chỉnh giữa kit. Nhãn gồm hoạt động, đoạn hành động thành phần và scene graph. Số kit/micro cố định cho mọi phiên: **Không công bố chi tiết**. [Mục 3; Phụ lục A, Bảng A.1](https://arxiv.org/pdf/2105.05226#page=12).

4. **Phương pháp:** CCAU đồng huấn luyện các encoder đa phương thức/đa góc nhìn và học nhãn phân cấp; suy luận từng phương thức riêng.

5. **Kết quả:** Trên HOMAGE, accuracy ego-view **37,7%**, so với **31,3%** khi huấn luyện đơn phương thức. Đây không phải accuracy fusion tất cả cảm biến lúc suy luận. [Bảng 2](https://arxiv.org/pdf/2105.05226#page=6).

6. **Khoảng trống:** Tác giả chưa thực nghiệm fusion nhiệt độ/độ ẩm/ánh sáng. Trang tải chỉ xác nhận video/audio đã có, còn phương thức khác dự kiến phát hành. **Nhận định:** rất phù hợp thiết kế thu thập, nhưng chưa xác nhận tải được đầy đủ ambient streams. [Mục 3](https://arxiv.org/pdf/2105.05226#page=4), [trang tải](https://homeactiongenome.org/download.html).

### [2] Ego-Exo4D: Understanding Skilled Human Activity from First- and Third-Person Perspectives

1. **Thông tin xuất bản:** Kristen Grauman, Andrew Westbury, Lorenzo Torresani, Kris Kitani, Jitendra Malik và cộng sự; **2025**, *International Journal of Computer Vision*, 133, 8356–8435, Springer. [DOI: 10.1007/s11263-025-02557-6](https://doi.org/10.1007/s11263-025-02557-6). Mục này dùng bản tạp chí mở rộng; bản CVPR 2024 cùng công trình không tính thêm một bài.

2. **Vấn đề cốt lõi:** Thiếu dữ liệu tự nhiên đồng thời từ góc nhìn người thực hiện và camera ngoài, cùng benchmark hoạt động có xét giới hạn năng lượng.

3. **Phần cứng, dữ liệu & đồng bộ:** Một Aria: RGB **30 FPS**, hai camera SLAM, bảy micro, IMU; thêm **4–5 GoPro 4K/60 FPS**, audio stereo **48 kHz**. Bố trí GoPro quanh vùng hoạt động; QR đầu/cuối phiên căn chỉnh camera; nhãn keystep theo thời gian. Khoảng **70%** capture đồng bộ tự động ở mức frame; phần còn lại căn chỉnh thủ công. [Mục 3.1, 6 và Phụ lục A.1](https://link.springer.com/article/10.1007/s11263-025-02557-6).

4. **Phương pháp:** AV-LF kết hợp đặc trưng video và Light-ASDNet bằng lớp tuyến tính; thử các chính sách lấy mẫu dưới ngân sách năng lượng.

5. **Kết quả:** Benchmark online keystep: AV-LF/X3D-XS, stride 15 đạt **mcAP 77,89%**, công suất **ước tính 19,70 mW**; X3D-XS đơn thị giác, stride 10: **76,85%**, **19,14 mW**. Các stride khác nhau; không phải ablation giữ nguyên lịch lấy mẫu. [Bảng 7a, bản tại kho KAUST](https://repository.kaust.edu.sa/bitstreams/48ae53d0-a0c0-49f9-a926-30d0859755f1/download).

6. **Khoảng trống:** Tác giả ghi nhận AV-LF kém thị giác đơn ở cấu hình hiệu năng cao. **Nhận định:** chưa kiểm chứng fusion SHT31/BH1750; công suất trên là kết quả mô hình hóa, không phải số đo toàn hệ IoT thực tế. [Mục 5.2.2](https://link.springer.com/article/10.1007/s11263-025-02557-6).

### [3] The LuViRA Dataset: Synchronized Vision, Radio, and Audio Sensors for Indoor Localization

1. **Thông tin xuất bản:** Ilayda Yaman, Guoda Tian, Martin Larsson, Patrik Persson và cộng sự; **2024**, *IEEE ICRA*, 11920–11926. [DOI: 10.1109/ICRA57147.2024.10610237](https://doi.org/10.1109/ICRA57147.2024.10610237), [toàn văn](https://arxiv.org/pdf/2302.05309). Preprint xuất hiện năm 2023; năm hội nghị là 2024, được xác nhận trong [kho tác giả](https://github.com/ilaydayaman/LuViRA_Dataset).

2. **Vấn đề cốt lõi:** Các dataset thị giác, radio và âm thanh thu riêng không thể dùng làm dữ liệu fusion đồng thời trong cùng môi trường.

3. **Phần cứng, dữ liệu & đồng bộ:** Một RealSense D435i, **12 micro** (11 cố định, một trên robot), massive MIMO; **18 camera mocap/100 Hz** làm ground truth. RGB **30 FPS**, depth **15 FPS**, audio **96 kHz**; vùng **4,2×2,5 m**. NTP trên Raspberry Pi; TTL từ Qualisys đi vào kênh audio Sync riêng; clapperboard kiểm chứng chéo. [Mục II–IV](https://arxiv.org/pdf/2302.05309); [tốc độ và cấu trúc dữ liệu](https://github.com/ilaydayaman/LuViRA_Dataset).

4. **Phương pháp:** Hiệu chuẩn camera/IMU bằng Kalibr, đối chiếu timestamp; đánh giá ORB-SLAM3, định vị radio bằng ML và SFS2 riêng biệt, chưa đề xuất mô hình fusion chung.

5. **Kết quả:** Quỹ đạo **Grid2**, ORB-SLAM3 có sai số vị trí trung bình **4,3 cm**, SD **2,2 cm**. Kiểm chứng thời gian thị giác ở mức **33 ms**, không phải độ chính xác vị trí. [Mục IV-B và VI](https://arxiv.org/pdf/2302.05309#page=4).

6. **Khoảng trống:** Tác giả nêu dây cáp hạn chế chuyển động, nhiệt độ phòng tăng nhưng chỉ đo gần mỗi giờ ở phần sau của grid data. **Nhận định:** gợi ý cần thu nhiệt độ liên tục khi nghiên cứu định vị âm thanh; không có đủ chuỗi RH/lux. [Mục VII](https://arxiv.org/pdf/2302.05309#page=6).

### [4] RealMAN: A Real-Recorded and Annotated Microphone Array Dataset for Dynamic Speech Enhancement and Localization

1. **Thông tin xuất bản:** Bing Yang, Changsheng Quan, Yabo Wang, Pengyu Wang, Yujie Yang, Ying Fang, Nian Shao, Hui Bu, Xin Xu, Xiaofei Li; **2024**, *NeurIPS 2024, Datasets and Benchmarks Track*. [Kỷ yếu chính thức](https://proceedings.neurips.cc/paper_files/paper/2024/file/bf8f6f5b017dc60d0c4e28a7a9a4ee7b-Paper-Datasets_and_Benchmarks_Track.pdf), [toàn văn arXiv v2](https://arxiv.org/pdf/2406.19959v2).

2. **Vấn đề cốt lõi:** Dữ liệu âm thanh mô phỏng chưa tái hiện đầy đủ nhiễu và truyền âm thực, làm giảm khả năng tổng quát của mô hình.

3. **Phần cứng, dữ liệu & đồng bộ:** **32 micro BP899/48 kHz**; bốn preamp tám kênh đồng bộ clock. Một camera fisheye đặt trên array, **100 ms/ảnh**; LED trên loa di động hỗ trợ gán nhãn vị trí. Array cao **1,4 m**. Mục 3.1 không công bố chi tiết giao thức đồng bộ camera–audio hay sai số thời gian. [Mục 3.1–3.4](https://arxiv.org/pdf/2406.19959v2#page=4).

4. **Phương pháp:** Camera/LED tạo nhãn nguồn; ước lượng clean direct-path speech; benchmark SpatialNet, FaSNet-TAC, CRNN/IPDnet. Camera phục vụ gán nhãn, không phải đầu vào fusion của các baseline này.

5. **Kết quả:** RealMAN test, nguồn đứng yên, sub-array **chín kênh**: SpatialNet huấn luyện speech+noise thực đạt **WB-PESQ 2,16; CER 14,5%**, so với **1,37; 17,9%** khi cả hai được mô phỏng. [Bảng 4, mục 4.2](https://arxiv.org/pdf/2406.19959v2#page=9).

6. **Khoảng trống:** Tác giả nêu nguồn âm là loa phát lại và chỉ dùng tiếng Quan thoại; nhãn clean speech ước lượng có thể gây thiên lệch đánh giá. **Nhận định:** không có ambient temperature/RH/lux và chưa chứng minh dropout đa thiết bị. [Mục 4.2 và checklist](https://arxiv.org/pdf/2406.19959v2), [dataset/code](https://github.com/Audio-WestlakeU/RealMAN).

### [5] HoloAssist: an Egocentric Human Interaction Dataset for Interactive AI Assistants in the Real World

1. **Thông tin xuất bản:** Xin Wang, Taein Kwon, Mahdi Rad, Bowen Pan, Ishani Chakraborty, Sean Andrist, Dan Bohus, Ashley Feniello, Bugra Tekin, Felipe Vieira Frujeri, Neel Joshi, Marc Pollefeys; **2023**, *IEEE/CVF ICCV*. [Hồ sơ kỷ yếu](https://openaccess.thecvf.com/content/ICCV2023/html/Wang_HoloAssist_an_Egocentric_Human_Interaction_Dataset_for_Interactive_AI_Assistants_ICCV_2023_paper.html), [toàn văn và phụ lục](https://arxiv.org/pdf/2309.17024).

2. **Vấn đề cốt lõi:** Trợ lý tương tác cần hiểu thao tác, sai sót và thời điểm can thiệp, vượt quá nhận dạng video độc lập.

3. **Phần cứng, dữ liệu & đồng bộ:** Một HoloLens 2: RGB **896×504/~29,5 Hz**, depth **504×504/~32,4 Hz**, audio **mono 48 kHz**, thêm hand/head pose, gaze, IMU. Số capsule micro: **Không công bố chi tiết trong bảng cấu hình**. PSI thu dữ liệu; tệp `_synced` căn theo RGB. Nhãn có start/end, hành động, hội thoại và lỗi. [Bảng S2](https://arxiv.org/pdf/2309.17024#page=15), [đặc tả dữ liệu](https://holoassist.github.io/data_links/README.html).

4. **Phương pháp:** Mở rộng TimeSformer bằng token cho các phương thức; benchmark nhận dạng hành động và phát hiện lỗi.

5. **Kết quả:** HoloAssist fine-grained action test, **train từ đầu**: RGB+hands+eye gaze đạt **Top-1 29,58%**, RGB đơn **18,78%**. Kết quả này không bao gồm audio. [Bảng 5](https://arxiv.org/pdf/2309.17024#page=8).

6. **Khoảng trống:** Tác giả chỉ ra thêm nhiều phương thức không bảo đảm cải thiện. **Nhận định:** hữu ích cho tổ chức timestamp/nhãn đa tốc độ, nhưng không có nhiệt độ/RH/lux; chưa phải mạng camera–micro phân tán. Sai số đồng bộ đầu cuối: **Không công bố chi tiết trong mô tả đã đối chiếu**.

## 3. Bảng so sánh tổng hợp

Các số liệu và cách đánh giá được dẫn tại mục tương ứng; các dòng không đại diện cùng một task hay cùng một baseline.

| Bài báo (Năm) | Loại cảm biến & Số lượng | Cơ chế đồng bộ / Gán nhãn | Phương pháp Fusion | Dataset & Kết quả chính | Hạn chế chính |
|---|---|---|---|---|---|
| [1] HOMAGE (2021) | Kit RGB + micro + ambient; số góc thay đổi | Scheduler I²C; tone đầu/cuối; nhãn phân cấp | CCAU đồng huấn luyện; inference từng luồng | HOMAGE: ego 37,7% so với 31,3% | Ambient chưa được đánh giá; phát hành chưa xác nhận đầy đủ |
| [2] Ego-Exo4D (2025) | Aria bảy micro, nhiều camera + 4–5 GoPro | QR; rà thủ công; nhãn keystep | AV-LF, lấy mẫu theo ngân sách | Online keystep: mcAP 77,89% | Fusion không luôn có lợi; chưa có RH/lux |
| [3] LuViRA (2024) | Một RGB-D; 12 micro; MIMO; 18 mocap camera | NTP + TTL/audio Sync; mocap | Benchmark từng phương thức | Grid2/ORB-SLAM3: 4,3 cm | Dây cáp; nhiệt độ thiếu và thưa |
| [4] RealMAN (2024) | 32 micro; một fisheye, một loa | Clock chung cho audio; LED/vision tạo nhãn | Đa kênh audio; không fusion ảnh đầu vào | SpatialNet: PESQ 2,16; CER 14,5%, nguồn tĩnh | Loa phát lại; thiếu ambient context |
| [5] HoloAssist (2023) | Một headset RGB/depth/micro/IMU/gaze | PSI; căn RGB; nhãn đoạn thao tác/lỗi | TimeSformer đa phương thức | RGB+hands+gaze: 29,58% Top-1, từ đầu | Wearable; kết quả nêu không sử dụng audio |

## 4. Ba bài nên ưu tiên cho thiết kế Data Collection

**Ưu tiên 1 — HOMAGE:** tham khảo kiến trúc kit thu đồng thời video–audio–I²C và cách dùng mốc đầu/cuối phiên. Đây là bài gần nhất với ba loại đại lượng cần thu: nhiệt độ/độ ẩm, độ rọi và âm thanh. Cần xác nhận khả năng tiếp cận ambient streams trước khi chọn làm benchmark tải sẵn. [Phụ lục A](https://arxiv.org/pdf/2105.05226#page=12), [trang tải](https://homeactiongenome.org/download.html).

**Ưu tiên 2 — LuViRA:** tham khảo việc kết hợp đồng hồ mạng với tín hiệu vật lý, kênh sync riêng và phép kiểm chứng chéo. Bài này còn chỉ ra lý do khoa học để lưu nhiệt độ phòng khi khai thác thông tin truyền âm. Không chuyển số đo cm/mm thành độ chính xác timestamp. [Mục IV, VII](https://arxiv.org/pdf/2302.05309).

**Ưu tiên 3 — Ego-Exo4D:** tham khảo cách bố trí nhiều camera quanh vùng hoạt động, mốc QR đầu/cuối, phân đoạn phiên và kiểm tra thủ công những lần đồng bộ lỗi. Có thể học quy trình này khi thiết bị không hỗ trợ cùng một trigger; không cần sao chép toàn bộ cấu hình Aria/GoPro. [Phụ lục Camera setup](https://link.springer.com/article/10.1007/s11263-025-02557-6).

RealMAN phù hợp bổ sung khi ưu tiên gán nhãn vị trí nguồn âm bằng camera; HoloAssist phù hợp khi cần định dạng nhãn start/end và tổ chức luồng khác tốc độ. Đây là đánh giá mức phù hợp của người tổng hợp.

## 5. Khoảng trống và gợi ý áp dụng cho SHT31–BH1750–INMP441

**Khoảng trống từ tập bài đã chọn:** HOMAGE có thiết kế thu ambient phù hợp nhưng chưa chứng minh lợi ích của luồng đó trong baseline; các bài còn lại giải quyết từng phần về đồng bộ, đa góc nhìn hoặc âm học. Chưa có bằng chứng từ năm bài này về một hệ hoàn chỉnh dùng đúng phần cứng mục tiêu, tổng quát đa phòng và chịu được mất cảm biến.

Các gợi ý dưới đây là **đề xuất thiết kế**, không phải thông số hay kết quả của các bài:

1. **Ghi riêng thời gian đo và nhận dữ liệu:** lưu timestamp nguồn, timestamp máy thu, sequence number, sensor ID, sample rate/FPS, đơn vị và cờ lỗi. Giữ giá trị đo gốc; nội suy lên tốc độ audio không tạo thêm thông tin vật lý.
2. **Đặt mốc kiểm chứng ở đầu và cuối phiên:** dùng sự kiện dễ xác định cả bằng âm thanh lẫn hình ảnh; đo lại độ lệch sau phiên để phát hiện drift. Với MCU, ghi thêm biến cố GPIO nếu kiến trúc cho phép. Chưa đặt yêu cầu sai số ms khi chưa đo thực tế.
3. **Gán nhãn theo sự kiện:** lưu onset/offset, loại sự kiện, người/phòng/phiên và mức chắc chắn; đối chiếu nhiều góc khi có che khuất. Nhãn từ mô hình cần phân biệt với nhãn đã kiểm tra thủ công.
4. **Đánh giá đóng góp ambient:** so sánh audio, video, audio–video và audio–video–ambient trên cùng cách chia dữ liệu; bổ sung kịch bản thiếu sáng, nhiễu nền, mất một luồng và dữ liệu cảm biến quá cũ. Tách train/test theo phiên, người hoặc phòng để hạn chế rò rỉ.
5. **Đo toàn hệ:** báo cáo macro-F1/mAP theo task cùng độ trễ, tỷ lệ mất gói và sai lệch đồng bộ. Nếu đánh giá năng lượng, phân biệt số đo phần cứng với công suất mô hình hóa như benchmark Ego-Exo4D.

Không diễn giải CCAU suy luận một phương thức, sub-array của RealMAN hoặc chính sách bỏ mẫu của Ego-Exo4D thành bằng chứng trực tiếp rằng hệ đã chịu được sensor dropout bất kỳ. Muốn kết luận điều đó cần có phép thử riêng.

## 6. Ghi chú kiểm chứng và truy cập

- **HOMAGE:** đã đọc toàn văn gồm Appendix A; tần suất bộ lập lịch 60 Hz khác tần suất từng cảm biến. Mô tả độ chính xác trung bình dưới millisecond của scheduler không phải chứng minh sai số đồng bộ đầu cuối giữa mọi kit. [Nguồn](https://arxiv.org/pdf/2105.05226#page=13).
- **Ego-Exo4D:** phép rà camera được mô tả ở mức một frame, khoảng ±16,66 ms; các con số dưới millisecond của phương pháp QR là phân tích lý thuyết trong điều kiện nêu tại phụ lục. Không dùng chúng thay số đo đầu cuối. Dataset yêu cầu chấp nhận điều khoản truy cập. [Phụ lục A.1](https://link.springer.com/article/10.1007/s11263-025-02557-6), [hướng dẫn tải](https://ego-exo4d-data.org/).
- **LuViRA:** mocap dưới 0,5 mm là sai số định vị ground truth trong vùng hiệu chuẩn, không phải độ lệch thời gian. Kho tác giả mô tả rõ kênh Sync và những quỹ đạo có vấn đề. [Dataset](https://github.com/ilaydayaman/LuViRA_Dataset).
- **RealMAN:** thông số thu là 32 kênh/48 kHz; benchmark được trích dùng sub-array chín kênh. Kho tác giả có cập nhật ngày 12/10/2024, cần cố định phiên bản khi tái lập. [Dataset và lịch sử cập nhật](https://github.com/Audio-WestlakeU/RealMAN).
- **HoloAssist:** số liệu kết quả thuộc bài ICCV 2023; không ghép với số phiên của các bản đóng gói lại sau này. Tệp đồng bộ, nhãn và bản video cần kiểm tra đúng phiên bản phát hành. [Đặc tả gốc](https://holoassist.github.io/data_links/README.html).

Chỉ tạo bản tổng hợp Markdown; chưa tải toàn bộ dataset hoặc chạy lại mô hình. Các liên kết dẫn tới bài gốc, kho tác giả hoặc tài liệu chính thức; không chèn ảnh từ nguồn khác.
