"""
Main Entry Point cho SecurityGate IoT Edge Gateway Controller.
Điều phối đầu đọc thẻ RFID, Camera RTSP, Rơ-le Barrier Gate và kết nối MQTT.
"""

import os
import signal
import sys
import time
from pathlib import Path
import yaml

from src.barrier import BarrierController
from src.camera import CameraStream
from src.mqtt import GatewayMQTTClient
from src.rfid import RFIDReader


def load_config() -> dict:
    config_path = Path("config/config.yaml")
    if not config_path.exists():
        config_path = Path("config/config.example.yaml")

    if config_path.exists():
        with open(config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)
    return {
        "gate": {"id": "GATE_LANE_01"},
        "mqtt": {"broker": "localhost", "port": 1883},
    }


def main():
    print("=" * 65)
    print(" 🚪 SECURITY GATE - IOT EDGE GATEWAY CONTROLLER")
    print("=" * 65)

    config = load_config()
    gate_id = os.getenv("GATE_ID", config.get("gate", {}).get("id", "GATE_LANE_01"))
    mqtt_broker = os.getenv("MQTT_BROKER", config.get("mqtt", {}).get("broker", "localhost"))
    mqtt_port = int(os.getenv("MQTT_PORT", config.get("mqtt", {}).get("port", 1883)))

    print(f"[*] Cổng kiểm soát:    {gate_id}")
    print(f"[*] MQTT Broker:        {mqtt_broker}:{mqtt_port}")

    barrier = BarrierController()
    rfid = RFIDReader()
    camera = CameraStream(config.get("camera", {}).get("front_plate_rtsp", ""))
    mqtt_client = GatewayMQTTClient(broker=mqtt_broker, port=mqtt_port, gate_id=gate_id)

    # Xử lý khi Backend gửi lệnh điều khiển barrier qua MQTT
    def handle_barrier_command(data: dict):
        action = data.get("action")
        if action == "OPEN":
            barrier.open_gate()
        elif action == "CLOSE":
            barrier.close_gate()

    # Xử lý khi có sự kiện quẹt thẻ RFID
    def handle_card_scanned(card_uid: str):
        print(f"[*] Sự kiện quẹt thẻ: {card_uid} -> Đang kích hoạt camera chụp biển số...")
        frame = camera.capture_frame()
        plate_number = "29A-123.45" if frame is None else "UNKNOWN"
        mqtt_client.publish_access_request(card_uid=card_uid, plate_number=plate_number)

    mqtt_client.register_command_callback(handle_barrier_command)
    rfid.register_callback(handle_card_scanned)

    mqtt_client.start()

    print("[*] Edge Gateway Controller đã sẵn sàng lắng nghe sự kiện!")

    def shutdown(signum, frame):
        print("\n[*] Đang tắt Edge Gateway Controller...")
        mqtt_client.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    # Giữ tiến trình hoạt động
    while True:
        time.sleep(1)


if __name__ == "__main__":
    main()
