export interface RecentWork {
  id: string;
  title: string;
  description: string;
  externalUrl: string;
  previewImage?: string;
  tags: string[];
  createdAt: string;
  author?: {
    id: string;
    displayName: string;
    avatarImageUrl?: string | null;
  };
}

/**
 * LPで利用する最新の作品ダイジェスト。
 * 本番ではAPI応答を使用予定のため、ここでは軽量なスタブを定義しています。
 */
export const recentWorks: RecentWork[] = [
  {
    id: "d99bd4c5-def5-4d1b-92e0-511d333c7c89",
    title:
      "加藤文元×三宅陽一郎 果てしない数学の世界 ──ZEN大学×ゲンロン共同公開講座",
    description:
      "数学者による特別講座の告知記事。オンライン配信を活用し、専門性の高いテーマを広く届ける取り組みです。",
    externalUrl: "https://peatix.com/event/4449711/",
    previewImage:
      "https://cdn.peatix.com/event/4449711/cover-oWBQWntxvBEKogJcsvHGNe2cQPXefUfE.png",
    tags: ["数学", "イベントレポート", "オンライン配信"],
    createdAt: "2025-06-08T16:11:09.77+00:00",
    author: {
      id: "sample-author-1",
      displayName: "balubo編集部",
      avatarImageUrl: null,
    },
  },
  {
    id: "230b947e-204c-45e0-9227-ed56e14663d0",
    title:
      "信頼醸成とリード獲得を両立する動画施策「Triangle」紹介記事（NewsPicks）",
    description:
      "ブランドデザインチームが手掛ける新動画コンテンツの背景と、マーケティング施策としての役割を紹介した特集記事。",
    externalUrl: "https://newspicks.com/news/14313158/",
    previewImage:
      "https://contents.newspicks.com/images/news/14313158/share?updatedAt=20250604090126&blur=false",
    tags: ["BtoBマーケ", "動画制作", "信頼醸成"],
    createdAt: "2025-06-04T09:08:05.203+00:00",
    author: {
      id: "sample-author-2",
      displayName: "balubo編集部",
      avatarImageUrl: null,
    },
  },
  {
    id: "1748185931552",
    title: "Fumiya Kimiwada のプロフィール（YOUTRUST）",
    description:
      "キャリアの実績と担当領域を端的にまとめた自己紹介ページ。継続案件獲得のために専門性を可視化しています。",
    externalUrl:
      "https://youtrust.jp/users/d221b2efc95707b44ab019b8297d7e3b",
    previewImage:
      "https://daxgddo8oz9ps.cloudfront.net/user_ogps/ogp_images/000/006/109/original/mini_magick20210407-1325-7crjdy.png",
    tags: ["プロフィール", "キャリア可視化", "Newspicks"],
    createdAt: "2025-05-25T15:12:11.552Z",
    author: {
      id: "sample-author-3",
      displayName: "balubo編集部",
      avatarImageUrl: null,
    },
  },
];

