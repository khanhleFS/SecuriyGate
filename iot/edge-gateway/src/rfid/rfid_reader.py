import time
from typing import Callable, Optional


class RFIDReader:
    """Quản lý kết nối đầu đọc thẻ RFID/NFC qua Serial/USB hoặc Wiegand protocol."""

    def __init__(self, port: str = "/dev/ttyUSB0", baud_rate: int = 9600):
        self.port = port
        self.baud_rate = baud_rate
        self.callback: Optional[Callable[[str], None]] = None
        self.running = False

    def register_callback(self, callback: Callable[[str], None]):
        """Đăng ký hàm xử lý khi có sự kiện quẹt thẻ thành công."""
        self.callback = callback

    def simulate_card_scan(self, card_uid: str):
        """Giả lập sự kiện quẹt thẻ (dùng trong thử nghiệm và testing)."""
        print(f"[RFID] Phát hiện quẹt thẻ: UID={card_uid}")
        if self.callback:
            self.callback(card_uid)
