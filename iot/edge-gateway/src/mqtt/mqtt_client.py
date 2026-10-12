import json
from typing import Callable, Optional
import paho.mqtt.client as mqtt


class GatewayMQTTClient:
    """Client giao tiếp MQTT giữa Edge Gateway và Backend Server."""

    def __init__(self, broker: str = "localhost", port: int = 1883, gate_id: str = "GATE_LANE_01"):
        self.broker = broker
        self.port = port
        self.gate_id = gate_id
        self.client = mqtt.Client(client_id=f"gate_{gate_id}")
        self.on_command_callback: Optional[Callable[[dict], None]] = None

        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message

    def _on_connect(self, client, userdata, flags, rc):
        print(f"[MQTT] Đã kết nối Broker {self.broker}:{self.port} (RC={rc})")
        # Lắng nghe lệnh điều khiển từ backend
        topic = f"gate/{self.gate_id}/command/barrier"
        self.client.subscribe(topic)
        print(f"[MQTT] Đã đăng ký lắng nghe topic: {topic}")

    def _on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode("utf-8"))
            print(f"[MQTT] Nhận tin nhắn từ {msg.topic}: {payload}")
            if self.on_command_callback:
                self.on_command_callback(payload)
        except Exception as e:
            print(f"[MQTT] [ERROR] Lỗi giải mã tin nhắn: {e}")

    def register_command_callback(self, callback: Callable[[dict], None]):
        self.on_command_callback = callback

    def publish_access_request(self, card_uid: str, plate_number: Optional[str] = None):
        """Gửi yêu cầu quẹt thẻ / phát hiện biển số tới Backend."""
        topic = f"gate/{self.gate_id}/access_request"
        payload = {
            "gateId": self.gate_id,
            "cardUid": card_uid,
            "plateNumber": plate_number,
            "timestamp": int(1000 * time.time()) if 'time' in globals() else 0,
        }
        self.client.publish(topic, json.dumps(payload))
        print(f"[MQTT] Đã gửi Access Request tới {topic}: {payload}")

    def start(self):
        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
        except Exception as e:
            print(f"[MQTT] [WARN] Chưa thể kết nối MQTT Broker ({self.broker}:{self.port}): {e}")

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
