import time
from enum import Enum


class BarrierState(Enum):
    CLOSED = "CLOSED"
    OPENING = "OPENING"
    OPEN = "OPEN"
    CLOSING = "CLOSING"


class BarrierController:
    """Điều khiển thanh chắn barie tự động và cơ chế an toàn qua Relay GPIO."""

    def __init__(self, open_pin: int = 17, close_pin: int = 27, safety_sensor_pin: int = 22):
        self.open_pin = open_pin
        self.close_pin = close_pin
        self.safety_sensor_pin = safety_sensor_pin
        self.state = BarrierState.CLOSED

    def open_gate(self, auto_close_delay: float = 5.0):
        """Kích hoạt xung rơ-le mở barie."""
        print(f"[BARRIER] >>> KÍCH HOẠT LỆNH MỞ CỔNG (Relay Pin {self.open_pin})")
        self.state = BarrierState.OPEN
        print(f"[BARRIER] Trạng thái hiện tại: {self.state.value}")

    def close_gate(self):
        """Kích hoạt xung rơ-le đóng barie (kèm kiểm tra an toàn cảm biến quang/loop)."""
        if self.is_vehicle_under_barrier():
            print("[BARRIER] [CẢNH BÁO AN TOÀN] Có vật cản dưới thanh chắn! Hủy lệnh đóng barie.")
            return False

        print(f"[BARRIER] >>> KÍCH HOẠT LỆNH ĐÓNG CỔNG (Relay Pin {self.close_pin})")
        self.state = BarrierState.CLOSED
        print(f"[BARRIER] Trạng thái hiện tại: {self.state.value}")
        return True

    def is_vehicle_under_barrier(self) -> bool:
        """Đọc trạng thái cảm biến quang / loop detector an toàn chống va đập."""
        # Giả lập an toàn: Không có vật cản
        return False
