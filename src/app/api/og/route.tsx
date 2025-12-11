import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { OGP_CONFIG } from "@/lib/ogp-utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#3b82f6", // balubo blue
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "180px",
            fontWeight: "bold",
            color: "white",
            letterSpacing: "-8px",
            lineHeight: 1,
            marginBottom: "20px", // Visual optical centering
          }}
        >
          balubo
        </div>
      </div>
    ),
    {
      width: OGP_CONFIG.width,
      height: OGP_CONFIG.height,
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
        "Content-Type": "image/png",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    },
  );
}
