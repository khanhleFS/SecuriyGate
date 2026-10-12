FROM python:3.11-slim

WORKDIR /app

# Cài đặt các gói hệ thống cần thiết cho OpenCV và GPIO
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libgl1 \
    libglib2.0-0 \
    libgpiod2 \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY config/ ./config/

ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "src.main"]
