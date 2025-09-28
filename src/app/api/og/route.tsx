import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import {
  OGP_CONFIG,
  BACKGROUND_COLORS,
  sanitizeOGPInput,
  getBackgroundColor,
  type OGImageType,
} from "@/lib/ogp-utils";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // パラメータの取得とサニタイズ
    const _title = sanitizeOGPInput(
      searchParams.get("title"),
      100,
      OGP_CONFIG.defaultTitle,
    );
    const _description = sanitizeOGPInput(
      searchParams.get("description"),
      200,
      OGP_CONFIG.defaultDescription,
    );
    const type = sanitizeOGPInput(
      searchParams.get("type"),
      20,
      "default",
    ) as OGImageType;
    const _author = sanitizeOGPInput(searchParams.get("author"), 50, "");

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
            background: getBackgroundColor(type),
            position: "relative",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* メインコンテンツ - シンプルなデザイン */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* ロゴエリア - 添付画像のデザインに合わせて */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "120px",
                  fontWeight: "400",
                  color: "white",
                  fontFamily:
                    "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                  letterSpacing: "-2px",
                }}
              >
                balubo
              </div>
            </div>
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
  } catch (error) {
    console.error("OGP画像生成エラー:", error);

    // エラー時のフォールバック画像
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: BACKGROUND_COLORS.default,
            color: "white",
            fontSize: "32px",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          balubo - クリエイターのためのポートフォリオプラットフォーム
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
}
