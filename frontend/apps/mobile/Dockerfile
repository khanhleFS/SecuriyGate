# ==============================================================================
# Dockerfile cho Mobile (Flutter Android Build Environment)
# Dùng để: Build APK / App Bundle hoặc chạy Test trong môi trường Docker đồng nhất
# ==============================================================================
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 1. Cài đặt các công cụ cơ bản, Git, Curl, Unzip, OpenJDK 17
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    curl \
    file \
    git \
    unzip \
    xz-utils \
    zip \
    libglu1-mesa \
    openjdk-17-jdk \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Cấu hình biến môi trường
ENV ANDROID_SDK_ROOT=/opt/android-sdk \
    ANDROID_HOME=/opt/android-sdk \
    FLUTTER_HOME=/opt/flutter \
    PATH=$PATH:/opt/android-sdk/cmdline-tools/latest/bin:/opt/android-sdk/platform-tools:/opt/flutter/bin \
    GRADLE_OPTS="-Dorg.gradle.jvmargs='-Xmx2560m -XX:MaxMetaspaceSize=512m' -Dorg.gradle.daemon=false"

# 2. Cài đặt Android Command Line Tools & SDK
ARG ANDROID_CMD_TOOLS_VERSION=11076708
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    curl -o /tmp/cmdline-tools.zip -L "https://dl.google.com/android/repository/commandlinetools-linux-${ANDROID_CMD_TOOLS_VERSION}_latest.zip" && \
    unzip -q /tmp/cmdline-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest && \
    rm /tmp/cmdline-tools.zip

# Chấp nhận tất cả licenses của Android SDK và cài đặt build tools
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

# 3. Cài đặt Flutter SDK (Stable Channel)
ARG FLUTTER_VERSION=3.24.0
RUN git clone -b stable https://github.com/flutter/flutter.git $FLUTTER_HOME && \
    cd $FLUTTER_HOME && \
    git checkout tags/$FLUTTER_VERSION && \
    flutter precache --android && \
    yes | flutter doctor --android-licenses && \
    flutter doctor -v

WORKDIR /workspace

# Sao chép mã nguồn vào container
COPY . .

# Lệnh mặc định: Tải dependencies và build release APK
CMD ["sh", "-c", "flutter pub get && flutter build apk --release --split-per-abi"]
