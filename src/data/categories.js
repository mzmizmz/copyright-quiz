// 分野の一覧。k はバッジに出る漢字1文字、col は色（sky / grape / sun / mint / coral）
export const CATS = {
  kiso:  { name: "基礎知識",             k: "基", col: "sky",   desc: "契約・所有権・知的財産権" },
  mono:  { name: "著作物",               k: "物", col: "grape", desc: "何が保護され、何が保護されないか" },
  sha:   { name: "著作者",               k: "者", col: "sun",   desc: "職務著作・映画の著作者" },
  jin:   { name: "著作者人格権",         k: "人", col: "coral", desc: "公表権・氏名表示権・同一性保持権" },
  shi:   { name: "著作権（支分権）",     k: "支", col: "mint",  desc: "複製権・公衆送信権・譲渡権など" },
  sei:   { name: "著作権の制限",         k: "制", col: "sky",   desc: "私的複製・引用・教育・AI学習" },
  ki:    { name: "保護期間・譲渡・登録", k: "期", col: "grape", desc: "死後70年、権利の移転と登録" },
  rin:   { name: "著作隣接権",           k: "隣", col: "sun",   desc: "実演家・レコード・放送" },
  shin:  { name: "侵害と救済",           k: "侵", col: "coral", desc: "みなし侵害・差止め・刑事罰" },
  jitsu: { name: "周辺の権利と実務",     k: "実", col: "mint",  desc: "肖像権・条約・委託契約・情報モラル" },
};
