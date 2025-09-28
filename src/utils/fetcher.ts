// Supabase クライアントのシングルトン
import { supabase } from "@/lib/supabase";

/**
 * APIレスポンスの共通型
 */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
  profile?: T;
  [key: string]: any;
}

/**
 * Minimal fetch wrapper that automatically attaches JSON headers and, if available,
 * the current Supabase session's `access_token` as a Bearer token. Returns parsed
 * JSON for convenience and throws on non-2xx responses.
 */
export async function fetcher<T = unknown>(
  input: string | URL | Request,
  init: RequestInit = {},
  options?: { requireAuth?: boolean },
): Promise<T> {
  const { requireAuth = true } = options || {};

  // 共有 Supabase クライアントからアクセストークンを取得
  let token: string | undefined;
  try {
    // 現在のセッションを取得
    const result = await supabase.auth.getSession();
    let session = result.data.session;
    const sessionError = result.error;

    if (sessionError) {
      console.warn("[fetcher] getSession error:", sessionError);
    }

    const needsRefresh =
      session &&
      session.expires_at &&
      session.expires_at * 1000 < Date.now() + 60_000;

    if (needsRefresh) {
      const { data: refreshed, error: refreshError } =
        await supabase.auth.refreshSession();
      if (refreshError) {
        console.warn("[fetcher] refreshSession error:", refreshError);
      } else {
        session = refreshed.session;
      }
    }

    token = session?.access_token;

    if (requireAuth && !token) {
      console.error("[fetcher] 認証トークンが取得できませんでした");
      throw new Error("認証が必要です");
    }
  } catch (err) {
    if (requireAuth) {
      console.warn("[fetcher] セッショントークン取得失敗:", err);
      throw new Error("認証が必要です");
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(input, { ...init, headers });
  if (!response.ok) {
    // Try to parse error payload but fall back to status text
    let message: string;
    try {
      const data = await response.json();
      message =
        data && typeof data === "object" && "error" in data
          ? data.error
          : JSON.stringify(data);
      console.error("[fetcher] API Error:", response.status, message);
    } catch (_) {
      message = response.statusText;
      console.error("[fetcher] API Error:", response.status, message);
    }
    throw new Error(message || "Fetch error");
  }

  // Assume JSON response by default
  return (await response.json()) as T;
}

/**
 * 共通のAPI呼び出しヘルパー関数群
 */
export const api = {
  // GET リクエスト
  get: <T = unknown>(
    url: string,
    params?: Record<string, string>,
  ): Promise<T> => {
    const searchParams = params ? new URLSearchParams(params) : "";
    const fullUrl = searchParams ? `${url}?${searchParams}` : url;
    return fetcher<T>(fullUrl);
  },

  // POST リクエスト
  post: <T = unknown>(url: string, data?: any): Promise<T> => {
    return fetcher<T>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // PUT リクエスト
  put: <T = unknown>(url: string, data?: any): Promise<T> => {
    return fetcher<T>(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // DELETE リクエスト
  delete: <T = unknown>(url: string): Promise<T> => {
    return fetcher<T>(url, {
      method: "DELETE",
    });
  },

  // PATCH リクエスト
  patch: <T = unknown>(url: string, data?: any): Promise<T> => {
    return fetcher<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },
};

/**
 * 特定のAPIエンドポイント用のヘルパー関数
 */
export const apiEndpoints = {
  // プロフィール関連
  profile: {
    get: (userId?: string): Promise<ApiResponse<any>> => {
      const params = userId ? { userId } : undefined;
      return api.get("/api/profile", params);
    },
    save: (profileData: any): Promise<ApiResponse<any>> => {
      return api.post("/api/profile", profileData);
    },
    update: (profileData: any): Promise<ApiResponse<any>> => {
      return api.put("/api/profile", profileData);
    },
  },

  // 作品関連
  works: {
    list: (userId?: string): Promise<ApiResponse<any[]>> => {
      const params = userId ? { userId } : undefined;
      return api.get("/api/works", params);
    },
    get: (id: string): Promise<ApiResponse<any>> => {
      return api.get(`/api/works/${id}`);
    },
    create: (workData: any): Promise<ApiResponse<any>> => {
      return api.post("/api/works", workData);
    },
    update: (id: string, workData: any): Promise<ApiResponse<any>> => {
      return api.put(`/api/works/${id}`, workData);
    },
    delete: (id: string): Promise<ApiResponse<any>> => {
      return api.delete(`/api/works/${id}`);
    },
  },

  // インプット関連（廃止）

  // フィード関連
  feed: {
    get: (): Promise<ApiResponse<any[]>> => {
      return api.get("/api/feed");
    },
  },

  // 接続関連
  connections: {
    stats: (userId?: string): Promise<ApiResponse<any>> => {
      const params = userId ? { userId } : undefined;
      return api.get("/api/connections/stats", params);
    },
    follow: (targetUserId: string): Promise<ApiResponse<any>> => {
      return api.post("/api/connections", { targetUserId, action: "follow" });
    },
    unfollow: (targetUserId: string): Promise<ApiResponse<any>> => {
      return api.post("/api/connections", { targetUserId, action: "unfollow" });
    },
  },
};

/**
 * エラーハンドリング付きのAPI呼び出し
 */
export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  errorMessage = "APIエラーが発生しました",
): Promise<{ data: T | null; error: string | null }> {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    console.error("API呼び出しエラー:", error);
    const message = error instanceof Error ? error.message : errorMessage;
    return { data: null, error: message };
  }
}
