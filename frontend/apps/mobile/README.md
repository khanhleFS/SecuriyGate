# 📱 SecurityGate Mobile Application

Ứng dụng di động dành cho người dùng cuối (Cư dân / Nhân viên / Khách) và Nhân viên an ninh tuần tra / trực chốt.

## 🛠️ Công Nghệ & Môi Trường
- **Framework:** Flutter 3.24.x (Dart SDK)
- **Hệ điều hành hỗ trợ:** Android (SDK 34), iOS, Flutter Web
- **Kiến trúc:** BLoC / Provider / Riverpod

## 🚀 Khởi Chạy
```bash
# Lấy dependencies
flutter pub get

# Chạy trên thiết bị giả lập / thật
flutter run
```

## 📦 Đóng Gói Release APK
```bash
flutter build apk --release --split-per-abi
```
Hoặc thông qua Turborepo tại thư mục `frontend/`:
```bash
npm run build --filter=mobile
```
