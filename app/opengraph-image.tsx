import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Otellio — Doluluk Tahmini ve Fiyat Önerisi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Stok fotoğraf yok — düz renkli, markalı bir kapak (PRD Bölüm 10).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0F2A43",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: -2,
          }}
        >
          Otellio
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#E86A33",
            marginTop: 24,
            textAlign: "center",
            padding: "0 80px",
          }}
        >
          Odanız boş kalmadan önce bilin.
        </div>
      </div>
    ),
    { ...size }
  );
}
