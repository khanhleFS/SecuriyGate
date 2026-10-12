import time
from typing import Optional
import cv2
import numpy as np


class CameraStream:
    """Quản lý kết nối RTSP và chụp ảnh từ Camera giám sát cổng an ninh."""

    def __init__(self, rtsp_url: str, name: str = "GateCamera"):
        self.rtsp_url = rtsp_url
        self.name = name

    def capture_frame(self) -> Optional[np.ndarray]:
        """Chụp 1 khung hình thời gian thực từ RTSP stream."""
        cap = cv2.VideoCapture(self.rtsp_url)
        if not cap.isOpened():
            print(f"[{self.name}] [WARN] Không thể mở kết nối RTSP: {self.rtsp_url}")
            return None

        ret, frame = cap.read()
        cap.release()

        if ret and frame is not None:
            return frame
        return None
