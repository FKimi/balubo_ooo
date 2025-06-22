-- Migration: Add introduction column to profiles table
-- このマイグレーションは、profilesテーブルに詳細な自己紹介用の
-- introductionカラムを追加します

-- profilesテーブルにintroductionカラムを追加
ALTER TABLE profiles
ADD COLUMN introduction TEXT;

-- introductionカラムにコメントを追加（説明のため）
COMMENT ON COLUMN profiles.introduction IS '詳細な自己紹介文。プロフィール編集のbioとは別の、より詳細な自己紹介用フィールド';

-- 既存のRLSポリシーは引き続き適用されるため、追加のセキュリティ設定は不要

-- インデックスは必要に応じて後で追加可能
-- （検索機能を実装する場合など） 