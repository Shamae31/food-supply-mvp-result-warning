// モックデータ（fixture）
// RFP サンプル（鶏もも肉／丸紅畜産・¥620/kg 等）に合わせて現実的に用意する。
// バックエンド API 未完成のため、当面フロントはこのデータで動く（NEXT_PUBLIC_USE_MOCK=true）。

import type {
  CaseDetail,
  CaseSummary,
  Citation,
  CompanyPlan,
  PastCase,
  RateInfo,
  ReasonTag,
  Supplier,
} from "@/lib/types";

/** 案件一覧の初期データ（デザインガイド §3.1 のサンプル行を踏襲） */
export const MOCK_CASES: CaseSummary[] = [
  {
    caseNo: "No.500001",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "negotiating",
    updatedAt: "07/09",
    assignee: "田中",
  },
  {
    caseNo: "No.499998",
    company: "伊藤忠食品",
    product: "豚バラ（デンマーク産・冷凍）",
    status: "before",
    updatedAt: "07/08",
    assignee: "佐藤",
  },
  {
    caseNo: "No.499987",
    company: "日本ハム商事",
    product: "牛肩ロース（豪州産・チルド）",
    status: "done",
    updatedAt: "07/01",
    assignee: "田中",
  },
  {
    // No.500001 の過去経緯で「決着 ¥415/kg」として引用される案件。決着済みのため done。
    caseNo: "No.499960",
    company: "丸紅畜産",
    product: "鶏むね肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "06/28",
    assignee: "鈴木",
  },
  {
    caseNo: "No.499921",
    company: "三菱食品",
    product: "冷凍ポテト（オランダ産）",
    status: "done",
    updatedAt: "06/20",
    assignee: "佐藤",
  },
  {
    // No.500001 の過去経緯で「決着 ¥598/kg」として引用される同一商材×取引先の決着済み案件。
    // 引用元をたどると done ステータスの案件に到達する（m-4 整合）。
    caseNo: "No.499801",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "02/12",
    assignee: "田中",
  },
  {
    caseNo: "No.123456-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "negotiating",
    updatedAt: "07/05",
    assignee: "佐藤",
  },
  {
    caseNo: "No.123455-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "03/15",
    assignee: "佐藤",
  },
  {
    caseNo: "No.123454-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "12/10",
    assignee: "佐藤",
  },
  {
    caseNo: "No.123453-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "09/18",
    assignee: "田中",
  },
  {
    caseNo: "No.123452-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "06/20",
    assignee: "田中",
  },
  {
    caseNo: "No.123457-a",
    company: "東日本ミート",
    product: "鶏むね肉（国産・チルド）",
    status: "negotiating",
    updatedAt: "07/05",
    assignee: "佐藤",
  },
  {
    caseNo: "No.123458-a",
    company: "グローバルフーズ商事",
    product: "牛バラ肉（豪州産・チルド）",
    status: "done",
    updatedAt: "12/20",
    assignee: "鈴木",
  },
  {
    caseNo: "No.123459-a",
    company: "グローバルフーズ商事",
    product: "牛バラ肉（豪州産・チルド）",
    status: "negotiating",
    updatedAt: "07/10",
    assignee: "鈴木",
  },
  {
    caseNo: "GRAG-001",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "negotiating",
    updatedAt: "07/22",
    assignee: "田中",
  },
  {
    caseNo: "GRAG-002",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "negotiating",
    updatedAt: "07/22",
    assignee: "佐藤",
  },
  {
    caseNo: "GRAG-003",
    company: "東日本ミート",
    product: "鶏むね肉（国産・チルド）",
    status: "negotiating",
    updatedAt: "07/22",
    assignee: "田中",
  },
  {
    caseNo: "GRAG-004",
    company: "グローバルフーズ商事",
    product: "牛バラ肉（豪州産・チルド）",
    status: "negotiating",
    updatedAt: "07/22",
    assignee: "鈴木",
  },
  {
    caseNo: "GRAG-005",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "negotiating",
    updatedAt: "07/22",
    assignee: "山田",
  },
];

/** 案件詳細（ワークスペースヘッダー用）。一覧に無い項目を補完する。 */
export const MOCK_CASE_DETAILS: Record<string, Omit<CaseDetail, keyof CaseSummary>> = {
  "No.500001": { quotedPrice: 620, targetPeriod: "2026Q3", currentStep: "collect" },
  "No.499998": { quotedPrice: 780, targetPeriod: "2026Q3", currentStep: "collect" },
  "No.499987": { quotedPrice: 1580, targetPeriod: "2026Q2", currentStep: "result" },
  "No.499960": { quotedPrice: 430, targetPeriod: "2025Q4", currentStep: "result" },
  "No.499921": { quotedPrice: 340, targetPeriod: "2026Q2", currentStep: "result" },
  "No.499801": { quotedPrice: 620, targetPeriod: "2026Q1", currentStep: "result" },
  "No.123456-a": { quotedPrice: 620, targetPeriod: "2026Q3", currentStep: "collect" },
  "No.123455-a": { quotedPrice: 620, targetPeriod: "2026Q2", currentStep: "result" },
  "No.123454-a": { quotedPrice: 618, targetPeriod: "2026Q1", currentStep: "result" },
  "No.123453-a": { quotedPrice: 625, targetPeriod: "2025Q4", currentStep: "result" },
  "No.123452-a": { quotedPrice: 615, targetPeriod: "2025Q3", currentStep: "result" },
  "No.123457-a": { quotedPrice: 690, targetPeriod: "2026Q3", currentStep: "collect" },
  "No.123458-a": { quotedPrice: 1240, targetPeriod: "2026Q1", currentStep: "result" },
  "No.123459-a": { quotedPrice: 1260, targetPeriod: "2026Q3", currentStep: "collect" },
  "GRAG-001": { quotedPrice: 640, targetPeriod: "2026-08", currentStep: "collect", targetYearMonth: "2026-08" },
  "GRAG-002": { quotedPrice: 642, targetPeriod: "2026-08", currentStep: "collect", targetYearMonth: "2026-08" },
  "GRAG-003": { quotedPrice: 710, targetPeriod: "2026-08", currentStep: "collect", targetYearMonth: "2026-08" },
  "GRAG-004": { quotedPrice: 1280, targetPeriod: "2026-08", currentStep: "collect", targetYearMonth: "2026-08" },
  "GRAG-005": { quotedPrice: 638, targetPeriod: "2026-09", currentStep: "collect", targetYearMonth: "2026-09" },
};

/** 相場情報（案件番号 → 相場）。デザインガイド §3.2 のサンプル ¥620/kg。
 *  currentPrice（現行仕入単価）・yoyRate（相場前年同月比）は CALC_RULE_V1 の撤退ライン算出に使用。 */
export const MOCK_RATES: Record<string, RateInfo> = {
  "No.500001": {
    registered: true,
    latestPrice: 620,
    currentPrice: 610, // 現行の仕入単価
    yoyRate: 0.03, // 相場前年同月比 +3%（上昇局面）
    yearMonth: "2026-07",
    source: "農水省 卸売市場統計",
    inputMethod: "CSV",
    updatedAt: "2026-07-10T09:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "日付・%表記ゆれを自動補正済み（Jul-25→2025-07 等）",
  },
  "No.499998": {
    registered: true,
    latestPrice: 780,
    currentPrice: 770,
    yoyRate: 0.04,
    yearMonth: "2026-06",
    source: "農水省 卸売市場統計",
    inputMethod: "CSV",
    updatedAt: "2026-06-30T09:00:00Z",
    unit: "円/kg",
    normalizedCount: 8,
    note: "日付・%表記ゆれを自動補正済み",
  },
  "No.499960": {
    registered: true,
    latestPrice: 430,
    currentPrice: 420,
    yoyRate: 0.02,
    yearMonth: "2026-05",
    source: "農水省 卸売市場統計",
    inputMethod: "CSV",
    updatedAt: "2026-05-31T09:00:00Z",
    unit: "円/kg",
    normalizedCount: 10,
    note: "日付・%表記ゆれを自動補正済み",
  },
  "No.123456-a": {
    registered: true,
    latestPrice: 609,
    currentPrice: 609,
    yoyRate: 0.03,
    yearMonth: "2026-07",
    source: "初期データ",
    inputMethod: "CSV",
    updatedAt: "2026-07-05T14:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "元MVPのseedデータから反映",
  },
  "No.123457-a": {
    registered: true,
    latestPrice: 670,
    currentPrice: 670,
    yoyRate: 0.02,
    yearMonth: "2026-07",
    source: "初期データ",
    inputMethod: "CSV",
    updatedAt: "2026-07-05T14:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "元MVPのseedデータから反映",
  },
  "No.123459-a": {
    registered: true,
    latestPrice: 1215,
    currentPrice: 1215,
    yoyRate: 0.04,
    yearMonth: "2026-07",
    source: "初期データ",
    inputMethod: "CSV",
    updatedAt: "2026-07-10T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "元MVPのseedデータから反映",
  },
  "GRAG-001": {
    registered: true,
    latestPrice: 600,
    currentPrice: 598,
    yoyRate: 0.047,
    yearMonth: "2026-08",
    source: "検証用合成データ（相場上昇局面）",
    inputMethod: "CSV",
    updatedAt: "2026-07-22T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "ハイパフォーマー成功ケース。相場・前回決着・数量提案の根拠探索用。",
  },
  "GRAG-002": {
    registered: true,
    latestPrice: 600,
    currentPrice: 609,
    yoyRate: 0.047,
    yearMonth: "2026-08",
    source: "検証用合成データ（相場上昇局面）",
    inputMethod: "CSV",
    updatedAt: "2026-07-22T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "若手失敗ケース。判断材料不足と圧縮率差の比較用。",
  },
  "GRAG-003": {
    registered: true,
    latestPrice: 670,
    currentPrice: 665,
    yoyRate: 0.035,
    yearMonth: "2026-08",
    source: "検証用合成データ（供給不安局面）",
    inputMethod: "CSV",
    updatedAt: "2026-07-22T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "需給逼迫でも条件調整で一部圧縮できるかの探索用。",
  },
  "GRAG-004": {
    registered: true,
    latestPrice: 1215,
    currentPrice: 1215,
    yoyRate: 0.04,
    yearMonth: "2026-08",
    source: "検証用合成データ（輸入牛・相見積）",
    inputMethod: "CSV",
    updatedAt: "2026-07-22T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "相見積カードの有効性と失敗要因の比較用。",
  },
  "GRAG-005": {
    registered: true,
    latestPrice: 600,
    currentPrice: 612,
    yoyRate: 0.047,
    yearMonth: "2026-09",
    source: "検証用合成データ（申し送り活用）",
    inputMethod: "CSV",
    updatedAt: "2026-07-22T10:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "前回の申し送りが次回の判断材料として拾えるかの確認用。",
  },
};

/** 過去経緯（案件番号 → 過去案件）。KRE スタブ相当のモック。
 *  同一取引先の別商材（same_supplier）をグラフ補完として含める（要件 §5.4 受け入れ条件3）。 */
export const MOCK_PAST_CASES: Record<string, PastCase[]> = {
  "No.500001": [
    {
      caseNo: "No.499801",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026Q1",
      settledPrice: 598,
      relation: undefined,
      citations: [
        {
          caseNo: "No.499801",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "為替影響を根拠に据え置きで決着。決着単価 ¥598/kg（見積比 -3.5%）。",
        },
        {
          caseNo: "No.499801",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "長期契約（年間96,000kg）を条件に数量メリットを訴求。",
        },
      ],
    },
    {
      caseNo: "No.499960",
      company: "丸紅畜産",
      product: "鶏むね肉（ブラジル産・冷凍）",
      period: "2025Q4",
      settledPrice: 415,
      relation: "same_supplier",
      citations: [
        {
          caseNo: "No.499960",
          company: "丸紅畜産",
          product: "鶏むね肉（ブラジル産・冷凍）",
          snippet: "同一取引先の別商材。需給逼迫下でも数量拡大で ¥415/kg に抑制。",
        },
      ],
    },
  ],
  // No.499998（伊藤忠食品・豚バラ）は過去取引なし → 空状態のデモ
  "No.499998": [],
  "No.123456-a": [
    {
      caseNo: "No.123455-a",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026Q2",
      settledPrice: 609,
      citations: [
        {
          caseNo: "No.123455-a",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "数量提示が遅れ押し込まれ気味。次回は前倒しで数量提示を。",
        },
      ],
    },
    {
      caseNo: "No.123452-a",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2025Q3",
      settledPrice: 598,
      citations: [
        {
          caseNo: "No.123452-a",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "数量増（+2,000kg/月）で目標超え決着。数量カードは丸紅に有効。",
        },
      ],
    },
  ],
  "No.123459-a": [
    {
      caseNo: "No.123458-a",
      company: "グローバルフーズ商事",
      product: "牛バラ肉（豪州産・チルド）",
      period: "2026Q1",
      settledPrice: 1215,
      citations: [
        {
          caseNo: "No.123458-a",
          company: "グローバルフーズ商事",
          product: "牛バラ肉（豪州産・チルド）",
          snippet: "輸入牛は相見積カードで¥1215に収めた。次回は別ソースの相見積を早めに用意。",
        },
      ],
    },
  ],
  "GRAG-001": [
    {
      caseNo: "GRAG-H01",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026-07",
      settledPrice: 612,
      citations: [
        {
          caseNo: "GRAG-H01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "ハイパフォーマー案件。見積640円に対し、相場600円・前回598円・月次数量+2,000kgを根拠に612円で決着（圧縮率4.4%）。",
        },
        {
          caseNo: "GRAG-H01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "所感: 先方は数量確約に反応。次回は早めに数量計画を提示し、値上げ幅の説明根拠を求めるとよい。",
        },
      ],
    },
  ],
  "GRAG-002": [
    {
      caseNo: "GRAG-Y01",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026-07",
      settledPrice: 632,
      citations: [
        {
          caseNo: "GRAG-Y01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "若手案件。見積640円に対し、相場・前回決着を提示できず632円で決着（圧縮率1.3%）。",
        },
        {
          caseNo: "GRAG-Y01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "申し送り: 値上げ理由を確認できなかった。次回は相場600円前後、前回598〜612円の範囲を先に確認して交渉に入る。",
        },
      ],
    },
  ],
  "GRAG-003": [
    {
      caseNo: "GRAG-S01",
      company: "東日本ミート",
      product: "鶏むね肉（国産・チルド）",
      period: "2026-07",
      settledPrice: 682,
      citations: [
        {
          caseNo: "GRAG-S01",
          company: "東日本ミート",
          product: "鶏むね肉（国産・チルド）",
          snippet:
            "供給不安ケース。相場上昇は認めつつ、納入頻度を週2回から週1回に調整し、見積700円から682円へ圧縮。",
        },
        {
          caseNo: "GRAG-S01",
          company: "東日本ミート",
          product: "鶏むね肉（国産・チルド）",
          snippet:
            "所感: 価格だけでなく納入条件を交換条件にしたことが有効。数量を減らさず配送負荷を下げる提案が通りやすい。",
        },
      ],
    },
  ],
  "GRAG-004": [
    {
      caseNo: "No.123458-a",
      company: "グローバルフーズ商事",
      product: "牛バラ肉（豪州産・チルド）",
      period: "2026Q1",
      settledPrice: 1215,
      citations: [
        {
          caseNo: "No.123458-a",
          company: "グローバルフーズ商事",
          product: "牛バラ肉（豪州産・チルド）",
          snippet:
            "相見積カードで1215円に収めた成功案件。次回は別ソースの見積を交渉前に用意すること。",
        },
        {
          caseNo: "GRAG-B01",
          company: "グローバルフーズ商事",
          product: "牛バラ肉（豪州産・チルド）",
          snippet:
            "失敗要因: 為替急変と在庫薄を理由に相見積が弱く、数量条件なしでは圧縮が限定的だった。",
        },
      ],
    },
  ],
  "GRAG-005": [
    {
      caseNo: "GRAG-H01",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026-07",
      settledPrice: 612,
      citations: [
        {
          caseNo: "GRAG-H01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "前回申し送り: 数量確約に反応。次回は月次数量計画を先に提示し、相場600円との差分理由を確認する。",
        },
      ],
    },
    {
      caseNo: "GRAG-Y01",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026-07",
      settledPrice: 632,
      relation: "same_supplier",
      citations: [
        {
          caseNo: "GRAG-Y01",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet:
            "比較用の若手案件。相場・前回決着の確認不足で圧縮率が低かったため、準備チェックに使う。",
        },
      ],
    },
  ],
};

/** 自社計画の初期値（案件番号 → 計画）。②で保存すると③の算出に反映される。 */
export const MOCK_PLANS: Record<string, CompanyPlan> = {
  "No.500001": {
    targetCostRate: 30,
    planPrice: 615,
    monthlyVolume: 8000,
    ceilingPrice: 625,
  },
  "No.499960": {
    targetCostRate: 28,
    planPrice: 425,
    monthlyVolume: 6000,
    ceilingPrice: 440,
  },
  "No.123456-a": {
    targetCostRate: 30,
    planPrice: 595,
    monthlyVolume: 18000,
    ceilingPrice: 615,
  },
  "No.123457-a": {
    targetCostRate: 31,
    planPrice: 680,
    monthlyVolume: 6000,
    ceilingPrice: 700,
  },
  "No.123459-a": {
    targetCostRate: 34,
    planPrice: 1200,
    monthlyVolume: 4500,
    ceilingPrice: 1250,
  },
  "GRAG-001": {
    targetCostRate: 30,
    planPrice: 612,
    monthlyVolume: 10000,
    ceilingPrice: 626,
  },
  "GRAG-002": {
    targetCostRate: 30,
    planPrice: 612,
    monthlyVolume: 10000,
    ceilingPrice: 626,
  },
  "GRAG-003": {
    targetCostRate: 31,
    planPrice: 680,
    monthlyVolume: 7000,
    ceilingPrice: 702,
  },
  "GRAG-004": {
    targetCostRate: 34,
    planPrice: 1210,
    monthlyVolume: 4500,
    ceilingPrice: 1260,
  },
  "GRAG-005": {
    targetCostRate: 30,
    planPrice: 612,
    monthlyVolume: 12000,
    ceilingPrice: 626,
  },
};

/** 空の自社計画（未入力状態のデフォルト） */
export const EMPTY_PLAN: CompanyPlan = {
  targetCostRate: 0,
  planPrice: 0,
  monthlyVolume: 0,
  ceilingPrice: 0,
};

/** モック認証で受理する資格情報（デモ用。実認証は Entra・Sprint 2）。 */
export const MOCK_CREDENTIAL = {
  tenant: "freeradicals",
  userId: "tanaka",
  password: "demo1234",
};

/** ログイン成功時に返すユーザー */
export const MOCK_AUTH_USER = {
  tenantId: "freeradicals",
  userId: "tanaka",
  displayName: "田中 太郎",
  role: "member" as const,
};

/** 案件作成の選択肢。実 API と同じ取引先マスタ契約をモックでも提供する。 */
export const MOCK_SUPPLIERS: Supplier[] = [
  { supplierId: 1, supplierName: "丸紅畜産", supplierCategory: "食肉（輸入鶏肉）", supplierMemo: "取引8年・数量重視" },
  { supplierId: 2, supplierName: "伊藤忠食品", supplierCategory: "総合食品商社", supplierMemo: "冷凍食品を中心に取引" },
  { supplierId: 3, supplierName: "日本ハム商事", supplierCategory: "食肉", supplierMemo: "チルド商材に強み" },
  { supplierId: 4, supplierName: "三菱食品", supplierCategory: "総合食品商社", supplierMemo: "加工食品も取扱い" },
];

/** Citation を過去案件から平坦化して取り出すヘルパ */
export function flattenCitations(cases: PastCase[]): Citation[] {
  return cases.flatMap((c) => c.citations);
}

/** 変動理由マスタ（RC-01〜10。デザインガイド §3.5 ReasonTagSelector）。
 *  方向は色ではなく矢印記号（↑上げ要因 / ↓下げ要因 / ±両方向）で示す。 */
export const MOCK_REASON_TAGS: ReasonTag[] = [
  { code: "RC-01", label: "為替変動", direction: "up" },
  { code: "RC-02", label: "需給逼迫", direction: "up" },
  { code: "RC-03", label: "原油・燃料高", direction: "up" },
  { code: "RC-04", label: "長期契約", direction: "down" },
  { code: "RC-05", label: "数量拡大", direction: "down" },
  { code: "RC-06", label: "相見積・競合提示", direction: "down" },
  { code: "RC-07", label: "品質・規格調整", direction: "both" },
  { code: "RC-08", label: "季節・天候要因", direction: "both" },
  { code: "RC-09", label: "在庫・生産調整", direction: "both" },
  { code: "RC-10", label: "為替安定・円高", direction: "down" },
];
