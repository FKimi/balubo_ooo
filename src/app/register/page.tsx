"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import { isValidEmail } from "@/utils/validation";

interface FormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "予期しないエラーが発生しました";
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // エラーをクリア
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ガード節パターンでバリデーション
    if (!formData.displayName.trim()) {
      newErrors.displayName = "表示名を入力してください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "有効なメールアドレスを入力してください";
    }

    if (!formData.password) {
      newErrors.password = "パスワードを入力してください";
    } else if (formData.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "パスワードが一致しません";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms =
        "利用規約とプライバシーポリシーに同意してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ガード節：バリデーション失敗時は早期return
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        formData.displayName,
      );

      // ガード節：エラー時は早期return
      if (error) {
        if (error.message.includes("User already registered")) {
          setErrors({ email: "このメールアドレスは既に登録されています" });
        } else if (error.message.includes("Password should be at least")) {
          setErrors({ password: "パスワードは6文字以上で入力してください" });
        } else {
          setErrors({ general: getErrorMessage(error) });
        }
        return;
      }

      // ガード節：ユーザーデータなし時は早期return
      if (!data?.user) {
        setErrors({ general: "ユーザー作成に失敗しました" });
        return;
      }

      // 成功パス：メール確認を促すため、ログイン画面に遷移
      router.push("/login?message=registration_success");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: getErrorMessage(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);

    try {
      const { data: _data, error } = await signInWithGoogle();

      // ガード節：エラー時は早期return
      if (error) {
        setErrors({
          general: `Googleアカウントでの登録に失敗しました: ${getErrorMessage(error)}`,
        });
        return;
      }

      // 成功時はコールバックページで処理される
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ general: "Googleアカウントでの登録に失敗しました" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gray-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gray-50 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full max-w-md">
        {/* ロゴ */}
        <div className="text-center mb-8 relative z-10">
          <Link href="/">
            <div className="inline-block">
              <h1 className="text-4xl font-bold text-gray-900">balubo</h1>
              <div className="h-1 w-full bg-blue-600 rounded-full mt-1"></div>
            </div>
          </Link>
          <p className="text-gray-600 mt-3 font-medium">
            クリエイターのためのAI分析型ポートフォリオ
          </p>
        </div>

        {/* 新規登録フォーム */}
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border-0 relative z-10 rounded-3xl">
          <CardHeader className="text-center pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              新規登録
            </CardTitle>
            <CardDescription className="text-gray-600">
              クリエイターとしてbaluboに参加しましょう
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 全般的なエラー */}
              {errors.general && (
                <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200/50 relative">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-700 font-medium">
                      {errors.general}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <Label htmlFor="displayName">表示名</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  placeholder="あなたの名前またはニックネーム"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white focus:bg-white focus:shadow-lg focus:shadow-gray-200/20 ${errors.displayName ? "border-red-300 focus:border-red-400" : "border-gray-300 focus:border-gray-400 hover:border-gray-400"}`}
                  required
                />
                {errors.displayName && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.displayName}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white focus:bg-white focus:shadow-lg focus:shadow-gray-200/20 ${errors.email ? "border-red-300 focus:border-red-400" : "border-gray-300 focus:border-gray-400 hover:border-gray-400"}`}
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="8文字以上のパスワード"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white focus:bg-white focus:shadow-lg focus:shadow-gray-200/20 ${errors.password ? "border-red-300 focus:border-red-400" : "border-gray-300 focus:border-gray-400 hover:border-gray-400"}`}
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="パスワードを再入力"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`transition-all duration-300 border-2 rounded-2xl px-5 py-4 bg-white focus:bg-white focus:shadow-lg focus:shadow-gray-200/20 ${errors.confirmPassword ? "border-red-300 focus:border-red-400" : "border-gray-300 focus:border-gray-400 hover:border-gray-400"}`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* 利用規約同意 */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-5 rounded-2xl border-2 border-gray-200 bg-gray-50/30 hover:border-gray-300 hover:bg-gray-100/50 transition-all duration-300">
                  <input
                    id="agreeToTerms"
                    name="agreeToTerms"
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:border-blue-500 mt-0.5 transition-colors duration-200"
                    required
                  />
                  <Label
                    htmlFor="agreeToTerms"
                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                  >
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                    >
                      利用規約
                    </Link>
                    および
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
                    >
                      プライバシーポリシー
                    </Link>
                    に同意します
                  </Label>
                </div>
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.agreeToTerms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
                disabled={isLoading}
              >
                <div className="flex items-center justify-center gap-2">
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                  {isLoading ? "登録中..." : "アカウントを作成"}
                </div>
              </Button>

              {/* 区切り線 */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-6 text-gray-500 font-medium">
                    または
                  </span>
                </div>
              </div>

              {/* Googleログインボタン */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full h-14 border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isLoading ? "処理中..." : "Googleアカウントで登録"}
                </div>
              </Button>
            </form>

            {/* ログインリンク */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                すでにアカウントをお持ちですか？{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-700 hover:underline font-semibold transition-colors duration-200"
                >
                  ログイン
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
