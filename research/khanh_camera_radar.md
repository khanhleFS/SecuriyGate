# Khanh — Tổng quan tài liệu về Camera–Radar và thiết kế dataset

Ngày rà soát: **13/11/2026**. Phạm vi: cảm nhận hành vi, tư thế và hình thể con người trong nhà; ưu tiên thu thập, đồng bộ, gán nhãn và fusion camera–radar.

## Phạm vi và cách đọc

Chọn **6 bài, xuất bản 2022–2026**, không trùng 17 bài trong danh sách loại trừ. Nguồn công bố gồm ACM Multimedia, IEEE/CVF WACV, IEEE Transactions on Multimedia, IEEE/CVF CVPR và NeurIPS Datasets and Benchmarks. Thông tin xuất bản được đối chiếu với nhà xuất bản/kỷ yếu; chi tiết kỹ thuật lấy từ toàn văn và kho dữ liệu của tác giả. Không tự gán quartile cho hội nghị hoặc tạp chí khi chưa kiểm chứng theo năm và ngành.

**Đã tiếp cận toàn văn cả 6 bài**, gồm PDF hoặc bản HTML chuyển đổi từ arXiv. Với AdaptiveFusion, dùng arXiv:2409.04851v3; với M4Human, dùng arXiv:2512.12378v2 cho chi tiết và số liệu. Năm ghi theo nơi công bố chính thức.

Ba vai trò camera cần phân biệt: **đầu vào fusion khi suy luận**; **tạo nhãn/giám sát khi huấn luyện**; và **phương thức đối chứng trong benchmark**. Chênh lệch timestamp sau căn chỉnh cũng khác độ trễ thu nhận thực tế. Các chỉ số AP/mAP càng cao càng tốt; MPJPE/MJE là sai số khớp, MPVE/MVE là sai số đỉnh lưới, càng thấp càng tốt. Không xếp hạng trực tiếp các mô hình chạy trên dataset, split hoặc hệ tọa độ khác nhau.

## 1. mRI — NeurIPS 2022

**1. Thông tin xuất bản.** *mRI: Multi-modal 3D Human Pose Estimation Dataset using mmWave, RGB-D, and Inertial Sensors*. **Sizhe An, Yin Li, Umit Ogras**. NeurIPS 2022, Datasets and Benchmarks, tập 35. DOI: [10.52202/068431-1988](https://doi.org/10.52202/068431-1988). Thông tin được xác nhận tại [kỷ yếu NeurIPS](https://proceedings.neurips.cc/paper_files/paper/2022/hash/af9c9c6d2da701da5a0acf91ec217815-Abstract.html).

**2. Vấn đề cốt lõi.** Thiếu dataset đồng bộ hỗ trợ cả ước lượng tư thế và phát hiện động tác phục hồi chức năng từ camera, radar và IMU.

**3. Dataset & Setup.** Một TI IWR1443BOOST **10 Hz**, hai Kinect V2 RGB-D **30 Hz**, sáu IMU Wit-motion BWT901CL **50 Hz**. Camera/radar đặt trên bàn, cách người khoảng **2.4 m**. Cùng máy chủ gắn timestamp; chọn mẫu gần timestamp radar nhất. Tác giả báo chênh lệch **<5 ms** sau căn chỉnh. Nhãn tư thế: HRNet → triangulation hai camera → tối ưu hình học/thời gian; nhãn động tác bắt đầu–kết thúc bằng ELAN. Dataset: **20 người, 12 động tác, 300 chuỗi, hơn 160 nghìn frame đồng bộ**. Chi tiết xem §3 của [toàn văn](https://ar5iv.labs.arxiv.org/html/2210.08394).

**4. Methodology.** Ước lượng chuỗi khớp 3D từng phương thức; nối các chuỗi dự đoán làm đặc trưng cho ActionFormer phát hiện động tác theo thời gian.

**5. Results.** Trên **mRI, S2 cross-subject, P1 gồm 12 lớp**, mAP trung bình qua tIoU **0.50:0.05:0.95** đạt **94.17 ± 1.58%** với radar+RGB; RGB **91.56 ± 2.08%**, radar **87.04 ± 4.89%**. Đây là mAP phát hiện theo thời gian, không phải accuracy; xem §4.2, Bảng 4 trong [toàn văn](https://ar5iv.labs.arxiv.org/html/2210.08394).

**6. Research Gap.** *Nhận định:* nhãn tư thế vẫn phụ thuộc thị giác; thí nghiệm trong phòng với người khỏe mạnh chưa đại diện cho triển khai đa phòng hay mất cảm biến kéo dài. Con số <5 ms chưa chứng minh sai số thời điểm phơi sáng/thu radar.

**Khả năng sử dụng dataset.** Kho tác giả tách raw/aligned data, timestamp và nhãn; liên kết bản mới có RGB nằm trong [README chính thức](https://github.com/sizhean/mri). Bản dữ liệu được lưu tại [Dryad, DOI:10.5061/dryad.9ghx3ffpp](https://doi.org/10.5061/dryad.9ghx3ffpp).

## 2. mmBody — ACM Multimedia 2022

**1. Thông tin xuất bản.** *mmBody Benchmark: 3D Body Reconstruction Dataset and Analysis for Millimeter Wave Radar*. **Anjun Chen, Xiangyu Wang, Shaohao Zhu, Yanxu Li, Jiming Chen, Qi Ye**. ACM Multimedia 2022, tr. 3501–3510; nhà xuất bản ACM. DOI: [10.1145/3503161.3548262](https://doi.org/10.1145/3503161.3548262). Danh mục tác giả và công bố có tại [kho chính thức](https://github.com/Chen3110/mmBody).

**2. Vấn đề cốt lõi.** Thiếu dữ liệu camera–radar có nhãn lưới cơ thể để kiểm tra tái dựng 3D dưới thiếu sáng, khói và che khuất.

**3. Dataset & Setup.** Một radar **Arbe Phoenix khoảng 14 fps khi thu**, hai **Azure Kinect RGB-D 30 fps**, tám camera OptiTrack và **37 marker**. Camera chính dưới radar trên giàn cao **0.8 m**, người cách **3–5 m**; camera phụ nhìn bên. Kinect nối dây đồng bộ; radar chạy VM trên cùng máy với camera, MoCap ở máy khác nối LAN. Radar chỉ có **timestamp nhận point cloud**; lệch được kiểm tra/chỉnh thủ công từng chuỗi. Sai số đồng bộ cuối cùng: **Không công bố chi tiết**. Xem §3.1–3.2 trong [toàn văn](https://arxiv.org/pdf/2209.05070).

**4. Methodology.** MoSh++ khớp SMPL-X vào marker để tạo nhãn. P4Transformer xử lý point cloud; VIBE làm đối chứng RGB. Đây chủ yếu là **benchmark so sánh phương thức**, chưa phải kiến trúc fusion camera–radar mới; nhãn và ma trận hiệu chuẩn được mô tả tại [kho tác giả](https://github.com/Chen3110/mmBody).

**5. Results.** Bảng 3, **mmBody test theo môi trường**: mean joint error trong **khói** là radar **8.7 cm**, depth **24.3 cm**; trong **thiếu sáng** là radar **7.5 cm**, RGB **10.5 cm**. Các con số này so sánh phương thức riêng, không phải lợi ích của fusion; xem [toàn văn, Bảng 3](https://arxiv.org/pdf/2209.05070).

**6. Research Gap.** *Tác giả nêu:* point cloud thưa, thiếu bộ phận và không nhất quán gây lỗi tái dựng (§5.3). *Nhận định:* thiếu timestamp thu radar làm khó đánh giá đồng bộ cho chuyển động nhanh; MoCap tăng độ phức tạp khi tái lập.

**Khả năng sử dụng dataset.** Có liên kết tải, calibration và baseline trong [README mmBody](https://github.com/Chen3110/mmBody); điều khoản công bố giới hạn sử dụng cho nghiên cứu/giáo dục phi thương mại.

## 3. HuPR — IEEE/CVF WACV 2023

**1. Thông tin xuất bản.** *HuPR: A Benchmark for Human Pose Estimation Using Millimeter Wave Radar*. **Shih-Po Lee, Niraj Prakash Kini, Wen-Hsiao Peng, Ching-Wen Ma, Jenq-Neng Hwang**. IEEE/CVF WACV 2023, tr. 5715–5724. Tên và thông tin công bố có tại [CVF Open Access](https://openaccess.thecvf.com/content/WACV2023/html/Lee_HuPR_A_Benchmark_for_Human_Pose_Estimation_Using_Millimeter_Wave_WACV_2023_paper.html); đọc được [toàn văn arXiv](https://arxiv.org/pdf/2210.12564).

**2. Vấn đề cốt lõi.** Radar có độ phân giải góc hạn chế, khó suy ra khớp cơ thể; cần dữ liệu và mô hình khai thác hai hướng quan sát bổ sung.

**3. Dataset & Setup.** Hai **TI IWR1843BOOST** xoay tương đối **90°**, cách khoảng **3 cm**, cùng một camera RGB trên mặt phẳng gá. Cả ba cấu hình **10 fps**; ảnh **256×256**. Có **6 người, 235 chuỗi, 141,000 bộ camera–radar–radar**; train/val/test **193/21/21 chuỗi**. HRNet tạo nhãn 2D cả train/test. Sai số đồng bộ camera–radar định lượng: **Không công bố chi tiết** (§3, §5.1–5.2).

**4. Methodology.** VRDAEMap giữ thông tin vận tốc; CSAM kết hợp cross/self-attention hai radar; PRGCN tinh chỉnh cấu trúc khớp. **Camera tạo nhãn; suy luận chỉ dùng radar**, không fusion RGB–radar trực tiếp.

**5. Results.** Trên **HuPR test**, AP keypoint trung bình qua OKS **0.50:0.05:0.95** đạt **63.4%**, so với baseline nối đặc trưng **57.6%** và RF-Pose tái hiện **41.4%**; xem [toàn văn, Bảng 3](https://arxiv.org/pdf/2210.12564).

**6. Research Gap.** *Nhận định:* nhãn giả thị giác không phải ground truth độc lập; quy mô người và cảnh nhỏ, chưa kiểm chứng nhiều người hoặc mất radar. Thiết lập 10 fps chưa đủ để suy ra cơ chế đồng bộ chính xác tới mili giây.

**Khả năng sử dụng dataset.** Tác giả cung cấp hướng dẫn và tài nguyên tại [kho HuPR](https://github.com/robert80203/HuPR-A-Benchmark-for-Human-Pose-Estimation-Using-Millimeter-Wave-Radar).

## 4. MM-Fi — NeurIPS 2023

**1. Thông tin xuất bản.** *MM-Fi: Multi-Modal Non-Intrusive 4D Human Dataset for Versatile Wireless Sensing*. **Jianfei Yang, He Huang, Yunjiao Zhou, Xinyan Chen, Yuecong Xu, Shenghai Yuan, Han Zou, Chris Xiaoxuan Lu, Lihua Xie**. NeurIPS 2023, Datasets and Benchmarks, tập 36. DOI: [10.52202/075280-0822](https://doi.org/10.52202/075280-0822), xác nhận tại [kỷ yếu NeurIPS](https://proceedings.nips.cc/paper_files/paper/2023/hash/3baf7a39d07e9f4f1e258a412df94521-Abstract-Datasets_and_Benchmarks.html).

**2. Vấn đề cốt lõi.** Thiếu nền tảng đồng bộ để so sánh và hợp nhất nhiều phương thức cảm nhận con người không đeo thiết bị.

**3. Dataset & Setup.** Một **RealSense D435 RGB-D 30 Hz**, một **TI IWR6843 30 Hz**, một **Ouster OS1 LiDAR 20 Hz**, hai AP **TP-Link N750**. Giàn cách người **3 m**. Mini-PC chạy ROS, lưu timestamp trong bag, chọn frame gần nhất trên lưới **10 Hz**; tác giả công bố sai số trong **25 ms**. Nhãn gồm khớp 2D/3D và hành động. Xem §3–4 trong [toàn văn](https://arxiv.org/pdf/2305.10345). Kho tác giả xác nhận **40 người, 27 lớp, hơn 320 nghìn frame, 4 môi trường** và cấu trúc dữ liệu trong [README](https://github.com/ybhbingo/MMFi_dataset).

**4. Methodology.** Baseline từng phương thức; fusion tuyến tính các kết quả bằng **Least Mean Square (LMS)**.

**5. Results.** **MM-Fi, S1 random/P1 hoạt động thường ngày**: radar MPJPE **109.8 ± 2.7 mm**; fusion **radar+LiDAR+WiFi+RGB đạt 72.9 ± 1.0 mm**. Đây là fusion bốn phương thức, không phải cặp RGB–radar; xem [Bảng 3–4 của toàn văn](https://arxiv.org/pdf/2305.10345).

**6. Research Gap.** *Tác giả nêu:* nhãn dense pose ước lượng chưa được xác thực, còn dư địa cho baseline fusion (§6). *Nhận định:* 25 ms là mức tác giả suy ra từ lấy mẫu/căn chỉnh, chưa thay thế phép đo jitter toàn hệ thống.

**Khả năng sử dụng dataset.** [Kho MM-Fi](https://github.com/ybhbingo/MMFi_dataset) có toolbox và đường dẫn dữ liệu. README bổ sung liên kết RGB đã ẩn danh, đồng thời còn ghi chú cũ về hạn chế ảnh thô; khi tái lập cần xác định rõ gói ảnh hay keypoint được sử dụng.

## 5. AdaptiveFusion — IEEE Transactions on Multimedia 2025

**1. Thông tin xuất bản.** *AdaptiveFusion: Adaptive Multi-Modal Multi-View Fusion for 3D Human Body Reconstruction*. **Anjun Chen, Xiangyu Wang, Zhi Xu, Kun Shi, Yan Qin, Yuchi Huo, Jiming Chen, Qi Ye**. IEEE Transactions on Multimedia, **2025**, tập 27, tr. 9202–9213; IEEE. DOI: [10.1109/TMM.2025.3613111](https://doi.org/10.1109/TMM.2025.3613111); metadata tại [IEEE Xplore](https://ieeexplore.ieee.org/abstract/document/11183669/). Phân tích kỹ thuật dùng [toàn văn v3](https://arxiv.org/pdf/2409.04851v3).

**2. Vấn đề cốt lõi.** Fusion cố định khó thích nghi khi thay đổi tổ hợp cảm biến hoặc một phương thức bị nhiễu/che khuất.

**3. Dataset & Setup.** **Tái sử dụng mmBody**, không thu dataset độc lập: hai Azure Kinect và một Arbe Phoenix; năm luồng đầu vào gồm **2 RGB + 2 depth + 1 radar**. Đồng bộ/gán nhãn kế thừa mmBody; không công bố phép đo đồng bộ mới. Mã nguồn thể hiện các luồng và tổ hợp đầu vào tại [kho AdaptiveFusion](https://github.com/Chen3110/AdaptiveFusion).

**4. Methodology.** Transformer hợp nhất token đa góc nhìn; Global Integrated Module cân bằng đặc trưng, modality masking xử lý thông tin lỗi. Huấn luyện **31 tổ hợp không rỗng** từ năm luồng.

**5. Results.** **mmBody: train 20 chuỗi phòng lab, test 2 chuỗi/mỗi môi trường**, Bảng II: cặp **img1+radar** đạt MPJPE trung bình **5.8 cm**; img1 **6.9 cm**, radar **6.7 cm**. Cấu hình đủ năm luồng đạt **3.8 cm**; trong cảnh occlusion, camera thứ hai vẫn hoạt động. Xem [§IV và Bảng II](https://arxiv.org/pdf/2409.04851v3).

**6. Research Gap.** *Tác giả nêu:* còn lỗi do nhiễu nền, thiếu điểm, multipath, mất cân bằng dữ liệu; thử nghiệm fusion đa góc nhìn mới ở trong nhà (§IV-D). *Nhận định:* thích nghi số đầu vào chưa chứng minh chịu clock drift hay mất gói kéo dài.

**Khả năng sử dụng dataset.** Đây là nguồn tham khảo **thuật toán trên dữ liệu đã thu**; việc tái lập cần dùng dataset và quy trình hiệu chuẩn của mmBody. Khả năng nhận đầu vào không hiệu chuẩn trong mô hình không loại bỏ nhu cầu căn chỉnh thời gian dữ liệu.

## 6. M4Human — IEEE/CVF CVPR 2026

**1. Thông tin xuất bản.** *M4Human: A Large-Scale Multimodal mmWave Radar Benchmark for Human Mesh Reconstruction*. **Junqiao Fan, Yunjiao Zhou, Yizhuo Yang, Xinyuan Cui, Jiarui Zhang, Lihua Xie, Jianfei Yang, Chris Xiaoxuan Lu, Fangqiang Ding**. IEEE/CVF CVPR **2026**, tr. 42836–42846; xác nhận tại [CVF Open Access](https://openaccess.thecvf.com/content/CVPR2026/html/Fan_M4Human_A_Large-Scale_Multimodal_mmWave_Radar_Benchmark_for_Human_Mesh_CVPR_2026_paper.html). Bản tiền công bố: [arXiv:2512.12378v2](https://arxiv.org/html/2512.12378v2).

**2. Vấn đề cốt lõi.** Dataset radar còn nhỏ, nhãn thưa và ít chuyển động tự do. Công bố giới thiệu **20 người, 50 hành động, 999 chuỗi, khoảng 661 nghìn frame**; xem [trang công trình](https://fanjunqiao.github.io/M4Human-site/).

**3. Dataset & Setup.** Một **Vayyar vTrigB**, một **RealSense D435** chung giá, cách người **0.5–6 m**. Cùng PC đọc xen kẽ radar/RGB-D **12 Hz**; Vicon **100 Hz** ở PC khác. Đồng bộ bằng T-pose rồi nghiêng đầu nhanh, định vị mốc trên RGB/Vicon và ghép mẫu gần nhất. Nhãn: **37 marker → SOMA/SMPL-X → kiểm tra thủ công**. Số camera Vicon và sai số đồng bộ mili giây: **Không công bố chi tiết** (§3 của [toàn văn](https://arxiv.org/html/2512.12378v2)).

**4. Methodology.** RT-Mesh định vị BEV rồi hồi quy mesh từ vùng radar 3D; fusion benchmark **nối đặc trưng trung gian** trước đầu dự đoán. RT là tensor cường độ radar đã xử lý, khác dữ liệu ADC nguyên thủy.

**5. Results.** **M4Human, ALL/S1 random**, Bảng 3: RGB+RT đạt **MJE 71.4 mm**, RGB **87.0 mm**, RT **77.2 mm**. Đo trong hệ tọa độ thế giới, **không căn chỉnh root/Procrustes**; xem [§4.1, §5.4 và Bảng 3](https://arxiv.org/html/2512.12378v2).

**6. Research Gap.** *Tác giả nêu:* chuyển động nhanh, người/hành động chưa thấy vẫn khó (§5). *Nhận định:* cần kiểm chứng đồng bộ bằng phép đo độc lập và mở rộng nhiều người; quy trình mốc thủ công chưa chứng minh phù hợp thu liên tục dài hạn.

**Khả năng sử dụng dataset.** Tại thời điểm rà soát, [README chính thức](https://github.com/FanJunqiao/M4Human) ghi gói raw khoảng **2 TB mới tải lên một phần**, gói radar xử lý khoảng **50 GB**. Vì vậy chưa coi toàn bộ RGB-D raw là đã sẵn sàng tải đầy đủ.

## Bảng so sánh tổng hợp

Các kết quả dưới đây rút gọn từ các mục có dẫn nguồn phía trên; chỉ có ý nghĩa trong thiết lập thử nghiệm tương ứng.

| Bài báo (Năm) | Loại cảm biến & Số lượng | Cơ chế đồng bộ / Gán nhãn | Phương pháp Fusion | Dataset & Kết quả chính | Hạn chế chính |
|---|---|---|---|---|---|
| mRI (2022) | 2 Kinect RGB-D; 1 radar; 6 IMU | Host timestamp, nearest radar; tác giả báo <5 ms; triangulation + ELAN | Nối chuỗi khớp → ActionFormer | mRI S2/P1: radar+RGB mAP 94.17%; RGB 91.56% | Nhãn phụ thuộc thị giác; phòng lab |
| mmBody (2022) | 2 Azure Kinect; 1 radar; 8 camera MoCap | Dây giữa Kinect; host/LAN; chỉnh tay radar; MoSh++ | Chủ yếu đối chứng từng phương thức | Test khói: joint error radar 8.7 cm, depth 24.3 cm | Timestamp nhận; radar vẫn thiếu điểm/che khuất |
| HuPR (2023) | 1 RGB; 2 radar vuông góc | Cấu hình chung 10 fps; nhãn HRNet | Fusion hai radar; camera giám sát | HuPR test: AP 63.4%; baseline nối 57.6% | Một người/cảnh; nhãn giả; thiếu sai số đồng bộ |
| MM-Fi (2023) | 1 RGB-D; 1 radar; 1 LiDAR; 2 WiFi AP | ROS timestamp → 10 Hz; tác giả nêu 25 ms; nhãn tư thế/hành động | LMS fusion kết quả | S1/P1: bốn phương thức MPJPE 72.9 mm; radar 109.8 mm | Dense pose chưa xác thực; fusion baseline đơn giản |
| AdaptiveFusion (2025) | Kế thừa mmBody: 2 RGB-D + 1 radar | Kế thừa mmBody/MoCap | Transformer, cân bằng đặc trưng, masking | mmBody test: img1+radar MPJPE 5.8 cm; đủ năm luồng 3.8 cm | Không có dataset mới; camera thứ hai hỗ trợ khi bị che |
| M4Human (2026) | 1 RGB-D; 1 radar; Vicon | 12/100 Hz; mốc động tác + nearest; marker/SOMA | Nối đặc trưng RGB–RT; RT-Mesh | ALL/S1: RGB+RT MJE 71.4 mm; RGB 87.0 mm | Khái quát hóa/chuyển động nhanh; raw chưa tải lên đầy đủ |

## Ba bài nên tham khảo cho thiết kế thu thập dữ liệu

Các lựa chọn sau là **đề xuất thiết kế của người tổng hợp**, không phải kết luận thực nghiệm của các bài.

1. **mRI — ưu tiên khi cần nhãn sự kiện/hành vi theo thời gian.** Quy trình tách dữ liệu thô, dữ liệu đã căn chỉnh, timestamp và nhãn bắt đầu–kết thúc rõ ràng. Phù hợp tham khảo cách ghép luồng khác tần số và đánh giá cross-subject. Khi mở rộng camera + micro + IoT, có thể giữ cùng nguyên tắc quản lý timestamp; cần tự đo sai số với thiết bị thực tế.

2. **MM-Fi — ưu tiên khi xây một giàn thu nhiều loại cảm biến.** ROS bag, nhiều tốc độ đầu vào và lưới thời gian chung là mẫu tổ chức hữu ích. Nên giữ cả tốc độ gốc và ánh xạ frame vào cửa sổ fusion để có thể đổi thuật toán sau này. Mốc 10 Hz của bài là lựa chọn cho tác vụ này, không phải tốc độ bắt buộc cho audio hoặc mọi sự kiện.

3. **M4Human — ưu tiên khi cần nhãn hình học và chuyển động có chất lượng cao.** Quy trình hiệu chuẩn không gian, mốc đồng bộ quan sát được và kiểm tra nhãn bằng nhiều phương thức đáng tham khảo. Cần cân nhắc nguồn lực MoCap; một nguyên mẫu chỉ phân loại hành động có thể dùng nhãn sự kiện thủ công trước khi đầu tư nhãn mesh.

Với thí nghiệm che khuất/thiếu sáng, **mmBody** bổ sung cách tổ chức điều kiện thử; **AdaptiveFusion** phù hợp làm tham chiếu huấn luyện với các tổ hợp phương thức. **HuPR** phù hợp nếu mục tiêu cuối cùng là radar-only và camera chỉ dùng khi xây nhãn.

## Khoảng trống liên quan đến hệ thống dự kiến

Trong các cấu hình dữ liệu được phân tích, chưa có tổ hợp đồng thời **camera–radar–audio INMP441–nhiệt/ẩm SHT31–độ sáng BH1750**. Không nên viện dẫn các bài này như bằng chứng đã giải quyết fusion toàn bộ cấu hình đó. Bằng chứng gần nhất cho phát hiện hành vi theo thời gian là mRI; bằng chứng cho fusion camera–radar khi suy luận là AdaptiveFusion và M4Human.

Một hướng nghiên cứu có thể kiểm chứng là **fusion bất đồng bộ camera–radar với audio và ngữ cảnh môi trường**, đánh giá riêng tác động của lệch thời gian, mất phương thức và che khuất. Đây là suy luận từ phạm vi sáu bài, không phải khẳng định chưa từng có nghiên cứu nào trên toàn bộ lĩnh vực.

Khi thu dataset mới, nên lưu timestamp gốc, thời điểm máy chủ nhận, cấu hình cảm biến và phép biến đổi hệ tọa độ; giữ dấu hiệu missing/stale thay vì biến mẫu cũ thành mẫu mới. Audio giữ sample index/tốc độ gốc; SHT31/BH1750 giữ thời gian đo và tuổi mẫu khi đưa vào cửa sổ fusion. Các tốc độ cụ thể phải xác định từ tác vụ và thử nghiệm phần cứng, không suy ra từ tên module.

Đánh giá nên tách theo người và phiên/phòng thu; báo cáo baseline từng phương thức, camera+radar và cấu hình đầy đủ trên cùng split. Với sự kiện, dùng F1/mAP kèm độ chính xác mốc thời gian; với tư thế dùng MPJPE/MJE, ghi rõ hệ tọa độ và phép căn chỉnh. Có thể chủ động thử lệch timestamp và mất cảm biến để đo mức suy giảm thay vì chỉ báo một chỉ số tổng hợp.
