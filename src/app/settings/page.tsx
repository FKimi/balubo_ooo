"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "privacy">("account");

  // アカウント設定
  const [accountData, setAccountData] = useState({
    displayName: user?.user_metadata?.display_name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // プライバシー設定
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public" as "public" | "connections_only" | "private",
    showEmail: false,
    showLocation: true,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: アカウント情報更新API呼び出し
      await new Promise(resolve => setTimeout(resolve, 800)); // 擬似的な遅延
      showSuccess("アカウント情報を更新しました");
    } catch (error) {
      console.error("Account update error:", error);
      showError("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (accountData.newPassword !== accountData.confirmPassword) {
      showError("新しいパスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: パスワード変更API呼び出し
      await new Promise(resolve => setTimeout(resolve, 800)); // 擬似的な遅延

      setAccountData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      showSuccess("パスワードを変更しました");
    } catch (error) {
      console.error("Password change error:", error);
      showError("パスワード変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: プライバシー設定更新API呼び出し
      await new Promise(resolve => setTimeout(resolve, 800)); // 擬似的な遅延
      showSuccess("プライバシー設定を更新しました");
    } catch (error) {
      console.error("Privacy settings update error:", error);
      showError("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    if (deleteConfirmationInput !== "削除") {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: アカウント削除API呼び出し
      await new Promise(resolve => setTimeout(resolve, 800)); // 擬似的な遅延

      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      showError("アカウント削除に失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-light-gray fade-in">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                アカウント設定
              </h1>
              <p className="text-slate-600">
                アカウント情報、通知設定、プライバシー設定を管理できます
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* サイドナビゲーション */}
              <div className="lg:col-span-1">
                <Card className="rounded-2xl shadow-sm border-none">
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("account")}
                        className={`w-full text-left px-4 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === "account"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        アカウント情報
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("privacy")}
                        className={`w-full text-left px-4 py-3 rounded-full text-sm font-medium transition-colors ${activeTab === "privacy"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        プライバシー
                      </Button>
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* メインコンテンツ */}
              <div className="lg:col-span-3 space-y-8">
                {/* アカウント情報タブ */}
                {activeTab === "account" && (
                  <>
                    {/* 基本情報 */}
                    <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-none">
                      <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                        <CardDescription>
                          表示名とメールアドレスを変更できます
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handleAccountUpdate}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="displayName">表示名</Label>
                            <Input
                              id="displayName"
                              value={accountData.displayName}
                              onChange={(e) =>
                                setAccountData((prev) => ({
                                  ...prev,
                                  displayName: e.target.value,
                                }))
                              }
                              placeholder="あなたの名前またはニックネーム"
                              required
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                              id="email"
                              type="email"
                              value={accountData.email}
                              onChange={(e) =>
                                setAccountData((prev) => ({
                                  ...prev,
                                  email: e.target.value,
                                }))
                              }
                              placeholder="your@email.com"
                              required
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full px-8 h-12"
                          >
                            {isLoading ? "更新中..." : "基本情報を更新"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* パスワード変更 */}
                    <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-none">
                      <CardHeader>
                        <CardTitle>パスワード変更</CardTitle>
                        <CardDescription>
                          セキュリティのため定期的にパスワードを変更することをお勧めします
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handlePasswordChange}
                          className="space-y-6"
                        >
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              現在のパスワード
                            </Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={accountData.currentPassword}
                              onChange={(e) =>
                                setAccountData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
                              required
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="newPassword">
                              新しいパスワード
                            </Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={accountData.newPassword}
                              onChange={(e) =>
                                setAccountData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              minLength={8}
                              required
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              新しいパスワード（確認）
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={accountData.confirmPassword}
                              onChange={(e) =>
                                setAccountData((prev) => ({
                                  ...prev,
                                  confirmPassword: e.target.value,
                                }))
                              }
                              minLength={8}
                              required
                              className="h-12 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full px-8 h-12"
                          >
                            {isLoading ? "変更中..." : "パスワードを変更"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* アカウント削除 */}
                    <Card className="rounded-2xl shadow-sm border border-red-100 bg-red-50/30">
                      <CardHeader>
                        <CardTitle className="text-red-600">
                          危険な操作
                        </CardTitle>
                        <CardDescription>
                          アカウントを削除すると、すべてのデータが永久に失われます
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteModalOpen(true)}
                          disabled={isLoading}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 rounded-full px-8 h-12"
                        >
                          アカウントを削除
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* プライバシー設定タブ */}
                {activeTab === "privacy" && (
                  <Card className="rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-none">
                    <CardHeader>
                      <CardTitle>プライバシー設定</CardTitle>
                      <CardDescription>
                        プロフィールの公開範囲と表示する情報を設定してください
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                      <div className="space-y-6">
                        <div>
                          <Label className="text-base font-medium">
                            プロフィール公開範囲
                          </Label>
                          <div className="mt-4 space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: "public" }))}>
                              <div className="flex items-center h-5">
                                <input
                                  type="radio"
                                  id="public"
                                  name="profileVisibility"
                                  value="public"
                                  checked={
                                    privacySettings.profileVisibility === "public"
                                  }
                                  onChange={(e) =>
                                    setPrivacySettings((prev) => ({
                                      ...prev,
                                      profileVisibility: e.target.value as any,
                                    }))
                                  }
                                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor="public" className="cursor-pointer">
                                  <div>
                                    <p className="font-medium text-slate-900">全体公開</p>
                                    <p className="text-sm text-slate-500">
                                      すべてのユーザーが閲覧可能
                                    </p>
                                  </div>
                                </Label>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: "connections_only" }))}>
                              <div className="flex items-center h-5">
                                <input
                                  type="radio"
                                  id="connections_only"
                                  name="profileVisibility"
                                  value="connections_only"
                                  checked={
                                    privacySettings.profileVisibility ===
                                    "connections_only"
                                  }
                                  onChange={(e) =>
                                    setPrivacySettings((prev) => ({
                                      ...prev,
                                      profileVisibility: e.target.value as any,
                                    }))
                                  }
                                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <Label
                                  htmlFor="connections_only"
                                  className="cursor-pointer"
                                >
                                  <div>
                                    <p className="font-medium text-slate-900">つながりのみ</p>
                                    <p className="text-sm text-slate-500">
                                      つながっているクリエイターのみ
                                    </p>
                                  </div>
                                </Label>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setPrivacySettings(prev => ({ ...prev, profileVisibility: "private" }))}>
                              <div className="flex items-center h-5">
                                <input
                                  type="radio"
                                  id="private"
                                  name="profileVisibility"
                                  value="private"
                                  checked={
                                    privacySettings.profileVisibility ===
                                    "private"
                                  }
                                  onChange={(e) =>
                                    setPrivacySettings((prev) => ({
                                      ...prev,
                                      profileVisibility: e.target.value as any,
                                    }))
                                  }
                                  className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                              </div>
                              <div className="flex-1">
                                <Label htmlFor="private" className="cursor-pointer">
                                  <div>
                                    <p className="font-medium text-slate-900">非公開</p>
                                    <p className="text-sm text-slate-500">
                                      自分のみ閲覧可能
                                    </p>
                                  </div>
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <hr className="border-slate-100" />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">メールアドレスを表示</p>
                            <p className="text-sm text-slate-500">
                              プロフィールにメールアドレスを表示する
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showEmail}
                            onChange={(e) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                showEmail: e.target.checked,
                              }))
                            }
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900">居住地を表示</p>
                            <p className="text-sm text-slate-500">
                              プロフィールに居住地を表示する
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showLocation}
                            onChange={(e) =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                showLocation: e.target.checked,
                              }))
                            }
                            className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handlePrivacyUpdate}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full px-8 h-12"
                      >
                        {isLoading ? "更新中..." : "プライバシー設定を保存"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>


      {/* フィードバックメッセージ（トースト風） */}
      {
        (successMessage || errorMessage) && (
          <div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 ${successMessage ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
              }`}>
              {successMessage ? (
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="font-medium">{successMessage || errorMessage}</span>
            </div>
          </div>
        )
      }

      {/* アカウント削除確認モーダル */}
      {
        isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">アカウントを削除</h3>
                  <p className="text-sm text-gray-500">この操作は取り消せません</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-gray-600 leading-relaxed">
                  アカウントを削除すると、プロフィール、作品、設定などすべてのデータが永久に失われます。
                </p>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    確認のため「削除」と入力してください
                  </label>
                  <Input
                    value={deleteConfirmationInput}
                    onChange={(e) => setDeleteConfirmationInput(e.target.value)}
                    placeholder="削除"
                    className="bg-white rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteConfirmationInput("");
                  }}
                  disabled={isLoading}
                  className="rounded-full px-6 hover:bg-gray-50"
                >
                  キャンセル
                </Button>
                <Button
                  onClick={handleAccountDelete}
                  disabled={isLoading || deleteConfirmationInput !== "削除"}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 shadow-md shadow-red-500/20"
                >
                  {isLoading ? "削除中..." : "削除する"}
                </Button>
              </div>
            </div>
          </div>
        )
      }
    </ProtectedRoute >
  );
}
