import { ImageResponse } from "next/og";

import { BRAND } from "@/lib/brand";

export const alt = "Resume Scope — see how well your resume fits the role";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: 80,
          background: BRAND.background,
          color: BRAND.cream,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, color: BRAND.muted, display: "flex" }}>
          RESUME SCOPE
        </div>
        <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05, display: "flex" }}>
          Know where your resume stands.
        </div>
        <div style={{ fontSize: 32, color: BRAND.muted, display: "flex" }}>
          Match any resume to any job description. Deterministic and explainable.
        </div>
      </div>
    ),
    size
  );
}
