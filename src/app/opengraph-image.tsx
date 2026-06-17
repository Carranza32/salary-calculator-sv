import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Calculadora Salarial SV — Calcula tu salario neto en El Salvador";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "linear-gradient(135deg, #023830 0%, #006B5E 50%, #012b25 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          color: "white",
          padding: 80,
          position: "relative",
        }}
      >
        {/* Background lights decoration */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "rgba(29, 158, 117, 0.25)",
            filter: "blur(120px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -200,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(0, 107, 94, 0.4)",
            filter: "blur(100px)",
          }}
        />

        {/* Flag badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(255, 255, 255, 0.12)",
            padding: "10px 24px",
            borderRadius: 100,
            fontSize: 24,
            fontWeight: "bold",
            letterSpacing: "1.5px",
            marginBottom: 35,
            border: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <span style={{ fontSize: 28 }}>🇸🇻</span>
          <span style={{ textTransform: "uppercase", color: "#E2F1ED" }}>
            El Salvador · Actualizado 2026
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 76,
            fontWeight: 900,
            textAlign: "center",
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            color: "#ffffff",
          }}
        >
          Calculadora Salarial SV
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            textAlign: "center",
            marginTop: 24,
            marginBottom: 48,
            color: "rgba(255, 255, 255, 0.85)",
            maxWidth: 850,
            lineHeight: 1.45,
          }}
        >
          Calcula tu salario neto al instante con las retenciones de ley: AFP
          (7.25%), ISSS (3.0% tope) e Impuesto sobre la Renta (ISR) para 2026.
        </p>

        {/* Badges specifications */}
        <div
          style={{
            display: "flex",
            gap: 20,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "14px 28px",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            AFP 7.25%
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "14px 28px",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            ISSS (Tope $30)
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "14px 28px",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Tablas ISR 2026
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              padding: "14px 28px",
              borderRadius: 20,
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "bold",
            }}
          >
            Presupuesto 50/30/20
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
