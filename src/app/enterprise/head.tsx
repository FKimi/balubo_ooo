export default function Head() {
  const title = "balubo for Enterprise | 3分で最適なクリエイターと出会う";
  const description =
    "BtoB企業向けの専門性マッチング。AIが事業理解の深いプロを可視化し、最短3分で発見。ウェイトリスト登録で先行案内・限定特典を受け取る。";
  const url = "https://balubo.app/enterprise";
  const ogImage = "/og-image.svg";
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}



