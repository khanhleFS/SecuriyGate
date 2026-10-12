import React from "react";

export default function HomePage() {
  return (
    <main style={{ padding: "2.5rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem" }}>
        <div style={{ display: "inline-block", padding: "0.35rem 0.85rem", borderRadius: "9999px", background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.75rem" }}>
          SEP490 Capstone Project
        </div>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.025em", background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Security Gate Management Portal
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Hệ thống giám sát và điều khiển cổng an ninh thông minh đa nền tảng
        </p>
      </header>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ color: "#38bdf8", fontSize: "0.9rem", fontWeight: 600 }}>TRẠNG THÁI HỆ THỐNG</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, margin: "0.5rem 0", color: "#10b981" }}>Hoạt động bình thường</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Kết nối Backend API, IoT Gateway & Dịch vụ nhận diện biển số</p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ color: "#a855f7", fontSize: "0.9rem", fontWeight: 600 }}>CỔNG TRỰC THỜI GIAN THỰC</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, margin: "0.5rem 0" }}>Cổng A - Làn xe vào</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Camera RTSP online • RFID Reader sẵn sàng • Barie đóng</p>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <div style={{ color: "#f59e0b", fontSize: "0.9rem", fontWeight: 600 }}>LƯỢT RA/VÀO HÔM NAY</div>
          <div style={{ fontSize: "1.85rem", fontWeight: 700, margin: "0.5rem 0" }}>1,248</div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>99.2% xác thực tự động hợp lệ qua thẻ RFID & OCR biển số</p>
        </div>
      </section>

      <section className="glass-panel" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>Kiến Trúc Monorepo (Turborepo)</h2>
        <ul style={{ listStyle: "none", display: "grid", gap: "0.75rem", color: "var(--text-muted)" }}>
          <li>🌐 <strong>apps/web:</strong> Ứng dụng Quản trị Web (Next.js 14 App Router)</li>
          <li>📱 <strong>apps/mobile:</strong> Ứng dụng Di động Client & Bảo vệ tuần tra (Flutter)</li>
          <li>🎨 <strong>packages/ui:</strong> Thư viện UI Components tái sử dụng (@repo/ui)</li>
          <li>⚡ <strong>packages/typescript-config:</strong> Cấu hình TypeScript tập trung (@repo/typescript-config)</li>
          <li>🔍 <strong>packages/eslint-config:</strong> Quy chuẩn Linter đồng bộ (@repo/eslint-config)</li>
        </ul>
      </section>
    </main>
  );
}
