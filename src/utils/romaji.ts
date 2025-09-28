// 日本語をローマ字に変換するユーティリティ関数

// 基本的なひらがな・カタカナからローマ字への変換テーブル
const hiraganaToRomaji: Record<string, string> = {
  // あ行
  あ: "a",
  い: "i",
  う: "u",
  え: "e",
  お: "o",
  ア: "a",
  イ: "i",
  ウ: "u",
  エ: "e",
  オ: "o",

  // か行
  か: "ka",
  き: "ki",
  く: "ku",
  け: "ke",
  こ: "ko",
  カ: "ka",
  キ: "ki",
  ク: "ku",
  ケ: "ke",
  コ: "ko",
  が: "ga",
  ぎ: "gi",
  ぐ: "gu",
  げ: "ge",
  ご: "go",
  ガ: "ga",
  ギ: "gi",
  グ: "gu",
  ゲ: "ge",
  ゴ: "go",

  // さ行
  さ: "sa",
  し: "shi",
  す: "su",
  せ: "se",
  そ: "so",
  サ: "sa",
  シ: "shi",
  ス: "su",
  セ: "se",
  ソ: "so",
  ざ: "za",
  じ: "ji",
  ず: "zu",
  ぜ: "ze",
  ぞ: "zo",
  ザ: "za",
  ジ: "ji",
  ズ: "zu",
  ゼ: "ze",
  ゾ: "zo",

  // た行
  た: "ta",
  ち: "chi",
  つ: "tsu",
  て: "te",
  と: "to",
  タ: "ta",
  チ: "chi",
  ツ: "tsu",
  テ: "te",
  ト: "to",
  だ: "da",
  ぢ: "ji",
  づ: "zu",
  で: "de",
  ど: "do",
  ダ: "da",
  ヂ: "ji",
  ヅ: "zu",
  デ: "de",
  ド: "do",

  // な行
  な: "na",
  に: "ni",
  ぬ: "nu",
  ね: "ne",
  の: "no",
  ナ: "na",
  ニ: "ni",
  ヌ: "nu",
  ネ: "ne",
  ノ: "no",

  // は行
  は: "ha",
  ひ: "hi",
  ふ: "fu",
  へ: "he",
  ほ: "ho",
  ハ: "ha",
  ヒ: "hi",
  フ: "fu",
  ヘ: "he",
  ホ: "ho",
  ば: "ba",
  び: "bi",
  ぶ: "bu",
  べ: "be",
  ぼ: "bo",
  バ: "ba",
  ビ: "bi",
  ブ: "bu",
  ベ: "be",
  ボ: "bo",
  ぱ: "pa",
  ぴ: "pi",
  ぷ: "pu",
  ぺ: "pe",
  ぽ: "po",
  パ: "pa",
  ピ: "pi",
  プ: "pu",
  ペ: "pe",
  ポ: "po",

  // ま行
  ま: "ma",
  み: "mi",
  む: "mu",
  め: "me",
  も: "mo",
  マ: "ma",
  ミ: "mi",
  ム: "mu",
  メ: "me",
  モ: "mo",

  // や行
  や: "ya",
  ゆ: "yu",
  よ: "yo",
  ヤ: "ya",
  ユ: "yu",
  ヨ: "yo",

  // ら行
  ら: "ra",
  り: "ri",
  る: "ru",
  れ: "re",
  ろ: "ro",
  ラ: "ra",
  リ: "ri",
  ル: "ru",
  レ: "re",
  ロ: "ro",

  // わ行
  わ: "wa",
  ゐ: "wi",
  ゑ: "we",
  を: "wo",
  ん: "n",
  ワ: "wa",
  ヰ: "wi",
  ヱ: "we",
  ヲ: "wo",
  ン: "n",

  // 小文字
  ゃ: "ya",
  ゅ: "yu",
  ょ: "yo",
  っ: "tsu",
  ャ: "ya",
  ュ: "yu",
  ョ: "yo",
  ッ: "tsu",

  // 長音記号
  ー: "-",
  "−": "-",
};

// 拗音の変換テーブル
const youonToRomaji: Record<string, string> = {
  きゃ: "kya",
  きゅ: "kyu",
  きょ: "kyo",
  しゃ: "sha",
  しゅ: "shu",
  しょ: "sho",
  ちゃ: "cha",
  ちゅ: "chu",
  ちょ: "cho",
  にゃ: "nya",
  にゅ: "nyu",
  にょ: "nyo",
  ひゃ: "hya",
  ひゅ: "hyu",
  ひょ: "hyo",
  みゃ: "mya",
  みゅ: "myu",
  みょ: "myo",
  りゃ: "rya",
  りゅ: "ryu",
  りょ: "ryo",
  ぎゃ: "gya",
  ぎゅ: "gyu",
  ぎょ: "gyo",
  じゃ: "ja",
  じゅ: "ju",
  じょ: "jo",
  びゃ: "bya",
  びゅ: "byu",
  びょ: "byo",
  ぴゃ: "pya",
  ぴゅ: "pyu",
  ぴょ: "pyo",
};

/**
 * 日本語文字列をローマ字に変換する（簡易版）
 * @param text 変換する日本語文字列
 * @returns ローマ字に変換された文字列
 */
export function toRomaji(text: string): string {
  if (!text) return "";

  let result = text;

  // 拗音を先に処理
  for (const [youon, romaji] of Object.entries(youonToRomaji)) {
    result = result.replace(new RegExp(youon, "g"), romaji);
  }

  // 基本的な文字を変換
  for (const [hiragana, romaji] of Object.entries(hiraganaToRomaji)) {
    result = result.replace(new RegExp(hiragana, "g"), romaji);
  }

  // 連続する子音を処理（例：っか -> kka）
  result = result.replace(
    /([bcdfghjklmnpqrstvwxyz])\1/g,
    (match, char) => char + char,
  );

  // 特殊な処理
  result = result.replace(
    /っ([bcdfghjklmnpqrstvwxyz])/g,
    (match, char) => char + char,
  );

  return result;
}

/**
 * 簡易的な日本語からローマ字変換（フォールバック用）
 * @param text 変換する日本語文字列
 * @returns ローマ字に変換された文字列
 */
export function simpleToRomaji(text: string): string {
  if (!text) return "";

  // よくある名前の特別な変換
  const nameMap: Record<string, string> = {
    杉山: "sugiyama",
    行子: "yukiko",
    加藤: "kato",
    太郎: "taro",
    花子: "hanako",
    一郎: "ichiro",
    次郎: "jiro",
    三郎: "saburo",
    美咲: "misaki",
    さくら: "sakura",
    あい: "ai",
    ゆう: "yuu",
    まい: "mai",
    りん: "rin",
    あおい: "aoi",
    ひなた: "hinata",
    みく: "miku",
    あや: "aya",
    みゆき: "miyuki",
    ゆき: "yuki",
    はな: "hana",
    みき: "miki",
    あき: "aki",
  };

  let result = text;

  // 特別な名前を先に処理
  for (const [japanese, romaji] of Object.entries(nameMap)) {
    result = result.replace(new RegExp(japanese, "g"), romaji);
  }

  // 基本的なひらがな・カタカナ変換
  const basicMap: Record<string, string> = {
    あ: "a",
    い: "i",
    う: "u",
    え: "e",
    お: "o",
    か: "ka",
    き: "ki",
    く: "ku",
    け: "ke",
    こ: "ko",
    さ: "sa",
    し: "shi",
    す: "su",
    せ: "se",
    そ: "so",
    た: "ta",
    ち: "chi",
    つ: "tsu",
    て: "te",
    と: "to",
    な: "na",
    に: "ni",
    ぬ: "nu",
    ね: "ne",
    の: "no",
    は: "ha",
    ひ: "hi",
    ふ: "fu",
    へ: "he",
    ほ: "ho",
    ま: "ma",
    み: "mi",
    む: "mu",
    め: "me",
    も: "mo",
    や: "ya",
    ゆ: "yu",
    よ: "yo",
    ら: "ra",
    り: "ri",
    る: "ru",
    れ: "re",
    ろ: "ro",
    わ: "wa",
    を: "wo",
    ん: "n",
    が: "ga",
    ぎ: "gi",
    ぐ: "gu",
    げ: "ge",
    ご: "go",
    ざ: "za",
    じ: "ji",
    ず: "zu",
    ぜ: "ze",
    ぞ: "zo",
    だ: "da",
    ぢ: "ji",
    づ: "zu",
    で: "de",
    ど: "do",
    ば: "ba",
    び: "bi",
    ぶ: "bu",
    べ: "be",
    ぼ: "bo",
    ぱ: "pa",
    ぴ: "pi",
    ぷ: "pu",
    ぺ: "pe",
    ぽ: "po",
  };

  for (const [hiragana, romaji] of Object.entries(basicMap)) {
    result = result.replace(new RegExp(hiragana, "g"), romaji);
  }

  return result;
}

/**
 * 日本語名からURL用のスラッグを生成する
 * @param displayName 表示名
 * @returns URL用のスラッグ
 */
export function generateRomajiSlug(displayName: string): string {
  if (!displayName) return "";

  // 簡易ローマ字変換を使用
  let slug = simpleToRomaji(displayName);

  // 英数字以外を削除し、小文字に変換
  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") // 先頭末尾の-を削除
    .replace(/-{2,}/g, "-"); // 連続する-を1つに

  // 長すぎる場合は切り詰める
  if (slug.length > 50) {
    slug = slug.substring(0, 50);
  }

  return slug;
}

/**
 * よくある名前の特別な変換
 */
const specialNames: Record<string, string> = {
  太郎: "taro",
  花子: "hanako",
  一郎: "ichiro",
  次郎: "jiro",
  三郎: "saburo",
  美咲: "misaki",
  さくら: "sakura",
  あい: "ai",
  ゆう: "yuu",
  まい: "mai",
  りん: "rin",
  あおい: "aoi",
  ひなた: "hinata",
  みく: "miku",
  あや: "aya",
  みゆき: "miyuki",
  ゆき: "yuki",
  はな: "hana",
  みき: "miki",
  あき: "aki",
};

/**
 * 特別な名前を考慮したローマ字変換
 * @param displayName 表示名
 * @returns ローマ字に変換された文字列
 */
export function toRomajiWithSpecialNames(displayName: string): string {
  if (!displayName) return "";

  let result = displayName;

  // 特別な名前を先に処理
  for (const [japanese, romaji] of Object.entries(specialNames)) {
    result = result.replace(new RegExp(japanese, "g"), romaji);
  }

  // 通常のローマ字変換
  return toRomaji(result);
}
