export interface ProfileData {
  displayName: string;
  title?: string; // 肩書き・役職
  bio: string;
  introduction?: string; // 詳細な自己紹介
  professions: string[];
  skills: string[];
  location: string;
  websiteUrl: string;
  portfolioVisibility: "public" | "connections_only" | "private";
  backgroundImageUrl?: string;
  avatarImageUrl?: string;
  slug?: string;
  desiredRate?: string;
  jobChangeIntention:
  | "not_considering"
  | "good_opportunity"
  | "actively_looking";
  sideJobIntention: "not_considering" | "good_opportunity" | "actively_looking";
  projectRecruitmentStatus: "recruiting" | "paused" | "not_recruiting";
  experienceYears?: number;
  workingHours?: string;
  career: CareerItem[];
}

export interface CareerItem {
  id: string;
  company: string;
  position: string;
  department?: string;
  startDate: string;
  endDate?: string; // 現在の職歴の場合はundefined
  description: string;
  isCurrent: boolean;
}

import { AIAnalysisResult } from "@/features/work/types";

export interface Work {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
  tags: string[];
  imageUrl?: string | undefined;
  roles?: string[];
  productionDate?: string | undefined;
  externalUrl?: string | undefined;
  aiAnalysisResult?: AIAnalysisResult | undefined;
}

// デフォルトのプロフィールデータ
export const defaultProfileData: Partial<ProfileData> = {
  displayName: "",
  title: "",
  bio: "",
  introduction: "",
  professions: [],
  skills: [],
  location: "",
  websiteUrl: "",
  portfolioVisibility: "public",
  backgroundImageUrl: "",
  avatarImageUrl: "",
  slug: "",
  desiredRate: "",
  jobChangeIntention: "not_considering",
  sideJobIntention: "not_considering",
  projectRecruitmentStatus: "not_recruiting",
  workingHours: "",
  career: [],
};

// インプットデータの型定義
export interface InputData {
  id: string;
  title: string;
  type: string; // book, manga, movie, anime, tv, game, etc.
  status: string; // completed, reading, watching, planning, dropped
  review?: string;
  tags: string[];
  genres: string[];
  externalUrl?: string;
  coverImageUrl?: string;
  notes?: string;
  favorite: boolean;
  aiAnalysisResult?: any; // 必要に応じて詳細な型を定義
  createdAt: string;
  consumptionDate?: string;
}
