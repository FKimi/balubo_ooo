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

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: アカウント情報更新API呼び出し

      // 成功メッセージ表示
      alert("アカウント情報を更新しました");
    } catch (error) {
      console.error("Account update error:", error);
      alert("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (accountData.newPassword !== accountData.confirmPassword) {
      alert("新しいパスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      // TODO: パスワード変更API呼び出し

      // パスワードフィールドをクリア
      setAccountData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      alert("パスワードを変更しました");
    } catch (error) {
      console.error("Password change error:", error);
      alert("パスワード変更に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setIsLoading(true);

    try {
      // TODO: プライバシー設定更新API呼び出し

      alert("プライバシー設定を更新しました");
    } catch (error) {
      console.error("Privacy settings update error:", error);
      alert("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDelete = async () => {
    const confirmation = prompt(
      "アカウントを削除すると、すべてのデータが永久に失われます。\n削除を確認するには「削除」と入力してください。",
    );

    if (confirmation !== "削除") {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: アカウント削除API呼び出し

      // ログアウトしてトップページにリダイレクト
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      alert("アカウント削除に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-light-gray">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                アカウント設定
              </h1>
              <p className="text-text-secondary">
                アカウント情報、通知設定、プライバシー設定を管理できます
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* サイドナビゲーション */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("account")}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === "account"
                            ? "bg-accent-dark-blue text-white"
                            : "text-text-secondary hover:text-text-primary hover:bg-ui-background-gray"
                        }`}
                      >
                        アカウント情報
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveTab("privacy")}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === "privacy"
                            ? "bg-accent-dark-blue text-white"
                            : "text-text-secondary hover:text-text-primary hover:bg-ui-background-gray"
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
                    <Card>
                      <CardHeader>
                        <CardTitle>基本情報</CardTitle>
                        <CardDescription>
                          表示名とメールアドレスを変更できます
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handleAccountUpdate}
                          className="space-y-4"
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
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-accent-dark-blue hover:bg-primary-blue"
                          >
                            {isLoading ? "更新中..." : "基本情報を更新"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* パスワード変更 */}
                    <Card>
                      <CardHeader>
                        <CardTitle>パスワード変更</CardTitle>
                        <CardDescription>
                          セキュリティのため定期的にパスワードを変更することをお勧めします
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form
                          onSubmit={handlePasswordChange}
                          className="space-y-4"
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
                            />
                          </div>

                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-accent-dark-blue hover:bg-primary-blue"
                          >
                            {isLoading ? "変更中..." : "パスワードを変更"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {/* アカウント削除 */}
                    <Card className="border-error-red">
                      <CardHeader>
                        <CardTitle className="text-error-red">
                          危険な操作
                        </CardTitle>
                        <CardDescription>
                          アカウントを削除すると、すべてのデータが永久に失われます
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          variant="outline"
                          onClick={handleAccountDelete}
                          disabled={isLoading}
                          className="border-error-red text-error-red hover:bg-error-red hover:text-white"
                        >
                          アカウントを削除
                        </Button>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* プライバシー設定タブ */}
                {activeTab === "privacy" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>プライバシー設定</CardTitle>
                      <CardDescription>
                        プロフィールの公開範囲と表示する情報を設定してください
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-base font-medium">
                            プロフィール公開範囲
                          </Label>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center space-x-2">
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
                                className="rounded border-border-color"
                              />
                              <Label htmlFor="public" className="flex-1">
                                <div>
                                  <p className="font-medium">全体公開</p>
                                  <p className="text-sm text-text-tertiary">
                                    すべてのユーザーが閲覧可能
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
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
                                className="rounded border-border-color"
                              />
                              <Label
                                htmlFor="connections_only"
                                className="flex-1"
                              >
                                <div>
                                  <p className="font-medium">つながりのみ</p>
                                  <p className="text-sm text-text-tertiary">
                                    つながっているクリエイターのみ
                                  </p>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
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
                                className="rounded border-border-color"
                              />
                              <Label htmlFor="private" className="flex-1">
                                <div>
                                  <p className="font-medium">非公開</p>
                                  <p className="text-sm text-text-tertiary">
                                    自分のみ閲覧可能
                                  </p>
                                </div>
                              </Label>
                            </div>
                          </div>
                        </div>

                        <hr className="border-border-color" />

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">メールアドレスを表示</p>
                            <p className="text-sm text-text-secondary">
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
                            className="rounded border-border-color"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">居住地を表示</p>
                            <p className="text-sm text-text-secondary">
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
                            className="rounded border-border-color"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handlePrivacyUpdate}
                        disabled={isLoading}
                        className="bg-accent-dark-blue hover:bg-primary-blue"
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
    </ProtectedRoute>
  );
}
