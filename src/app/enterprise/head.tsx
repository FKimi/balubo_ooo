export default function Head() {
  const title = "balubo for Enterprise | AIが3分で最適なプロクリエイターとマッチング";
  const description =
    "BtoB企業向けの専門性マッチングプラットフォーム。AIがクリエイターの専門性を可視化し、最短3分で事業を深く理解したプロを発見。採用工数70%削減、満足度95%。ウェイトリスト登録で先行案内・限定特典を受け取る。";
  const url = "https://balubo.app/enterprise";
  const ogImage = "https://balubo.app/og-image.svg";
  const keywords = "クリエイター マッチング, BtoB マーケティング, コンテンツ制作, AIマッチング, 専門性分析, フリーランス, ライター 採用, クリエイター 探し, マッチングプラットフォーム";
  
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* AI検索最適化 */}
      <meta name="author" content="balubo" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={url} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="balubo" />
      <meta property="og:locale" content="ja_JP" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@balubo_official" />
      <meta name="twitter:creator" content="@balubo_official" />
    </>
  );
}



