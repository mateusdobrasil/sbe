import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "SBE — Sociedade Beneficente Evangélica de Cuiabá";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagem de compartilhamento.
 *
 * O site antigo não tinha og:image — links colados no WhatsApp apareciam
 * como texto cru, sem nenhuma prévia visual.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0b3b46 0%, #082b33 55%, #0e4c5a 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="84" viewBox="0 0 48 56">
            <path
              d="M30 2c1.8 10-5.3 13-8.6 18.9-4.1 7.4.9 12.7 4.2 13.6-1.5-4.8 1.1-8.8 3.9-10.9.6 4.8 3.8 6.5 6.4 9.8 3.3 3.8 3 8.8-.3 12.1C43.1 41.3 47 34.5 47 26.6 47 14.1 37.6 7.2 30 2Z"
              fill="#e08a0b"
            />
            <path
              d="M14 14c1.2 6.4-3.4 8.3-5.5 12.1-2.7 4.7.6 8.1 2.7 8.7-1-3.1.7-5.6 2.5-7 .4 3.1 2.4 4.2 4.1 6.3 2.1 2.4 1.9 5.6.2 7.7 4.8-1.6 7.3-6 7.3-11 0-8-6.6-13.5-11.3-16.8Z"
              fill="#f2a036"
            />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 52, fontWeight: 800, color: "#ffffff", letterSpacing: -1 }}>
              SBE
            </span>
            <span style={{ fontSize: 19, fontWeight: 600, color: "#a6d9e3", letterSpacing: 2 }}>
              SOCIEDADE BENEFICENTE EVANGÉLICA
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Cuidado em saúde ao alcance de quem precisa
          </span>
          <span style={{ fontSize: 30, color: "#d0ecf1", marginTop: 24 }}>
            Consultas, exames e assistência social em {site.address.city}/{site.address.state}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {["26 credenciados", "18 especialidades", "Sem carência"].map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#082b33",
                background: "#e08a0b",
                padding: "10px 24px",
                borderRadius: 999,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
