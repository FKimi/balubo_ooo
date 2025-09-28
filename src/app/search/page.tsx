"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface Creator {
  id: string;
  displayName: string;
  bio: string;
  professions: string[];
  skills: string[];
  experienceYears: string;
  location: string;
  avatarUrl?: string;
  portfolioVisibility: "public" | "connections_only" | "private";
  connectionStatus?: "none" | "pending" | "connected";
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Creator[]>([]);

  // サンプルデータ（実際はSupabaseから取得）
  const sampleCreators: Creator[] = [
    {
      id: "1",
      displayName: "田中 太郎",
      bio: "UI/UXデザイナーとして5年の経験があります。ユーザー中心設計を重視し、使いやすいインターフェースの設計を得意としています。",
      professions: ["UI/UXデザイナー", "Webデザイナー"],
      skills: ["Figma", "Adobe XD", "Sketch", "HTML/CSS"],
      experienceYears: "3-5年",
      location: "東京都",
      portfolioVisibility: "public",
      connectionStatus: "none",
    },
    {
      id: "2",
      displayName: "佐藤 花子",
      bio: "フロントエンドエンジニアとして、React/Next.jsを使った開発を専門としています。デザインシステムの構築も得意です。",
      professions: ["フロントエンドエンジニア"],
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      experienceYears: "3-5年",
      location: "大阪府",
      portfolioVisibility: "public",
      connectionStatus: "connected",
    },
    {
      id: "3",
      displayName: "山田 次郎",
      bio: "ライター・編集者として10年以上の経験があります。テクノロジー分野の記事執筆を中心に活動しています。",
      professions: ["ライター", "編集者"],
      skills: ["SEO", "WordPress", "Google Analytics"],
      experienceYears: "10年以上",
      location: "神奈川県",
      portfolioVisibility: "public",
      connectionStatus: "pending",
    },
  ];

  const professionOptions = [
    "UI/UXデザイナー",
    "グラフィックデザイナー",
    "Webデザイナー",
    "フロントエンドエンジニア",
    "バックエンドエンジニア",
    "フルスタックエンジニア",
    "ライター",
    "編集者",
    "コピーライター",
    "イラストレーター",
    "フォトグラファー",
    "動画編集者",
    "マーケター",
    "プロダクトマネージャー",
  ];

  const skillOptions = [
    "Figma",
    "Adobe XD",
    "Sketch",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "HTML/CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Vue.js",
    "Angular",
    "Node.js",
    "Python",
    "PHP",
    "WordPress",
    "Shopify",
    "SEO",
    "Google Analytics",
  ];

  const locationOptions = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      // TODO: 実際の検索API呼び出し
      // 現在はサンプルデータをフィルタリング
      let results = sampleCreators;

      if (searchQuery) {
        results = results.filter(
          (creator) =>
            creator.displayName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            creator.bio.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      if (selectedProfessions.length > 0) {
        results = results.filter((creator) =>
          creator.professions.some((profession) =>
            selectedProfessions.includes(profession),
          ),
        );
      }

      if (selectedSkills.length > 0) {
        results = results.filter((creator) =>
          creator.skills.some((skill) => selectedSkills.includes(skill)),
        );
      }

      if (selectedLocation) {
        results = results.filter(
          (creator) => creator.location === selectedLocation,
        );
      }

      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProfession = (profession: string) => {
    setSelectedProfessions((prev) =>
      prev.includes(profession)
        ? prev.filter((p) => p !== profession)
        : [...prev, profession],
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleConnectionRequest = async (creatorId: string) => {
    try {
      // TODO: つながり申請API呼び出し
      console.log("Connection request sent to:", creatorId);

      // 結果を更新
      setSearchResults((prev) =>
        prev.map((creator) =>
          creator.id === creatorId
            ? { ...creator, connectionStatus: "pending" }
            : creator,
        ),
      );
    } catch (error) {
      console.error("Connection request error:", error);
    }
  };

  const getConnectionButtonText = (status?: string) => {
    switch (status) {
      case "connected":
        return "つながり済み";
      case "pending":
        return "申請中";
      default:
        return "つながりを申請";
    }
  };

  const getConnectionButtonVariant = (status?: string) => {
    switch (status) {
      case "connected":
        return "outline" as const;
      case "pending":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-base-light-gray">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* ページヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                クリエイター検索
              </h1>
              <p className="text-text-secondary">
                あなたと一緒に働きたいクリエイターを見つけましょう
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* 検索フィルター */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>検索条件</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* キーワード検索 */}
                    <div className="space-y-2">
                      <Label htmlFor="searchQuery">キーワード</Label>
                      <Input
                        id="searchQuery"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="名前、自己紹介で検索"
                      />
                    </div>

                    {/* 職種フィルター */}
                    <div className="space-y-2">
                      <Label>職種</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {professionOptions.map((profession) => (
                          <div
                            key={profession}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`profession-${profession}`}
                              checked={selectedProfessions.includes(profession)}
                              onChange={() => toggleProfession(profession)}
                              className="rounded border-border-color"
                            />
                            <Label
                              htmlFor={`profession-${profession}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {profession}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* スキルフィルター */}
                    <div className="space-y-2">
                      <Label>スキル</Label>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {skillOptions.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`skill-${skill}`}
                              checked={selectedSkills.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                              className="rounded border-border-color"
                            />
                            <Label
                              htmlFor={`skill-${skill}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {skill}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 居住地フィルター */}
                    <div className="space-y-2">
                      <Label htmlFor="location">居住地</Label>
                      <select
                        id="location"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">すべて</option>
                        {locationOptions.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 検索ボタン */}
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-accent-dark-blue hover:bg-primary-blue"
                      disabled={isLoading}
                    >
                      {isLoading ? "検索中..." : "検索"}
                    </Button>

                    {/* フィルタークリア */}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedProfessions([]);
                        setSelectedSkills([]);
                        setSelectedLocation("");
                        setSearchResults([]);
                      }}
                      className="w-full"
                    >
                      条件をクリア
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* 検索結果 */}
              <div className="lg:col-span-3">
                {searchResults.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="text-text-tertiary mb-4">
                        <svg
                          className="w-16 h-16 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        検索条件を設定してクリエイターを探しましょう
                      </h3>
                      <p className="text-text-secondary">
                        左側の検索条件を設定して「検索」ボタンをクリックしてください
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-text-primary">
                        検索結果 ({searchResults.length}件)
                      </h2>
                    </div>

                    <div className="grid gap-6">
                      {searchResults.map((creator) => (
                        <Card
                          key={creator.id}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              {/* アバター */}
                              <div className="w-16 h-16 bg-primary-light-blue rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-accent-dark-blue font-bold text-xl">
                                  {creator.displayName.charAt(0)}
                                </span>
                              </div>

                              {/* プロフィール情報 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-lg font-semibold text-text-primary">
                                      {creator.displayName}
                                    </h3>
                                    <p className="text-text-secondary text-sm">
                                      {creator.location} •{" "}
                                      {creator.experienceYears}
                                    </p>
                                  </div>
                                  <Button
                                    variant={getConnectionButtonVariant(
                                      creator.connectionStatus,
                                    )}
                                    size="sm"
                                    onClick={() =>
                                      handleConnectionRequest(creator.id)
                                    }
                                    disabled={
                                      creator.connectionStatus !== "none"
                                    }
                                    className={
                                      creator.connectionStatus === "none"
                                        ? "bg-accent-dark-blue hover:bg-primary-blue"
                                        : ""
                                    }
                                  >
                                    {getConnectionButtonText(
                                      creator.connectionStatus,
                                    )}
                                  </Button>
                                </div>

                                {/* 職種タグ */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {creator.professions.map((profession) => (
                                    <span
                                      key={profession}
                                      className="px-2 py-1 bg-primary-light-blue/20 text-accent-dark-blue rounded text-sm"
                                    >
                                      {profession}
                                    </span>
                                  ))}
                                </div>

                                {/* 自己紹介 */}
                                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                                  {creator.bio}
                                </p>

                                {/* スキルタグ */}
                                <div className="flex flex-wrap gap-1">
                                  {creator.skills.slice(0, 6).map((skill) => (
                                    <span
                                      key={skill}
                                      className="px-2 py-1 bg-ui-background-gray text-text-secondary rounded text-xs"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                  {creator.skills.length > 6 && (
                                    <span className="px-2 py-1 text-text-tertiary text-xs">
                                      +{creator.skills.length - 6}個
                                    </span>
                                  )}
                                </div>

                                {/* プロフィールリンク */}
                                <div className="mt-4">
                                  <Link href={`/profile/${creator.id}`}>
                                    <Button variant="outline" size="sm">
                                      プロフィールを見る
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
