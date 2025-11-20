"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URLのハッシュフラグメントからトークンを確認
        const hashParams = new URLSearchParams(
          typeof window !== "undefined"
            ? window.location.hash.substring(1)
            : "",
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        console.log("[AuthCallback] URL解析:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          currentUrl:
            typeof window !== "undefined"
              ? window.location.href
              : "サーバーサイド",
        });

        // OAuth認証のトークンがある場合、少し長めに待機
        const waitTime = accessToken && refreshToken ? 2000 : 1000;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        // セッション取得を複数回試行
        let sessionData = null;
        let sessionError = null;

        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`[AuthCallback] セッション取得試行 ${attempt}/3`);
          const { data, error } = await supabase.auth.getSession();

          if (data.session) {
            sessionData = data;
            break;
          }

          if (error) {
            sessionError = error;
            console.warn(
              `[AuthCallback] セッション取得エラー (試行${attempt}):`,
              error,
            );
          }

          // 次の試行まで待機
          if (attempt < 3) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }

        if (sessionError && !sessionData) {
          console.error("[AuthCallback] 最終的な認証エラー:", sessionError);
          router.push("/login?error=auth_failed");
          return;
        }

        if (sessionData?.session) {
          // 認証成功 - プロフィールページにリダイレクト
          console.log(
            "[AuthCallback] セッション確認済み、プロフィールページに遷移:",
            {
              userEmail: sessionData.session.user.email,
              sessionId:
                sessionData.session.access_token?.substring(0, 10) + "...",
            },
          );

          // より確実なリダイレクト（router.pushよりもwindow.location.hrefの方が確実）
          if (typeof window !== "undefined") {
            window.location.href = "/profile?tab=profile";
          } else {
            router.push("/profile?tab=profile");
          }
        } else {
          // セッションがない場合はログインページにリダイレクト
          console.log("[AuthCallback] セッションなし、ログインページに遷移");
          router.push("/login");
        }
      } catch (error) {
        console.error("[AuthCallback] 認証処理例外:", error);
        router.push("/login?error=auth_failed");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          認証処理中...
        </h2>
        <p className="text-gray-600">しばらくお待ちください</p>
      </div>
    </div>
  );
}
