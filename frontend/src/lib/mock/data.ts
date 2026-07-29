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
  ResultRecord,
  Supplier,
} from "@/lib/types";

/** 案件一覧の初期データ（デザインガイド §3.1 のサンプル行を踏襲） */
export const MOCK_CASES: CaseSummary[] = [
  {
    caseNo: "No.500001",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    status: "done",
    updatedAt: "07/10",
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
];

/** 案件詳細（ワークスペースヘッダー用）。一覧に無い項目を補完する。 */
export const MOCK_CASE_DETAILS: Record<string, Omit<CaseDetail, keyof CaseSummary>> = {
  "No.500002": { quotedPrice: 615, targetPeriod: "2026-07", currentStep: "collect" },
  "No.500001": { quotedPrice: 615, targetPeriod: "2026-04", currentStep: "result" },
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
};

/** 相場情報（案件番号 → 相場）。デザインガイド §3.2 のサンプル ¥620/kg。
 *  currentPrice（現行仕入単価）・yoyRate（相場前年同月比）は CALC_RULE_V1 の撤退ライン算出に使用。 */
export const MOCK_RATES: Record<string, RateInfo> = {
  "No.500002": {
    registered: true,
    latestPrice: 600,
    currentPrice: 598, // 前回決着を踏まえた現行の仕入単価
    yoyRate: 0.047, // 相場前年同月比 +4.7%（デモ値）
    yearMonth: "2026-07",
    source: "MVP検証用デモデータ",
    inputMethod: "手入力",
    updatedAt: "2026-07-29T09:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "相場価格はMVP検証用のデモ値。実運用では取得元・更新頻度・商材粒度の確定が必要。",
  },
  "No.500001": {
    registered: true,
    latestPrice: 600,
    currentPrice: 598,
    yoyRate: 0.047,
    yearMonth: "2026-04",
    source: "MVP検証用デモデータ",
    inputMethod: "手入力",
    updatedAt: "2026-07-10T09:00:00Z",
    unit: "円/kg",
    normalizedCount: 12,
    note: "前回案件の確認用デモデータ。",
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
};

/** 過去経緯（案件番号 → 過去案件）。KRE スタブ相当のモック。
 *  同一取引先の別商材（same_supplier）をグラフ補完として含める（要件 §5.4 受け入れ条件3）。 */
export const MOCK_PAST_CASES: Record<string, PastCase[]> = {
  "No.500002": [
    {
      caseNo: "No.500001",
      company: "丸紅畜産",
      product: "鶏もも肉（ブラジル産・冷凍）",
      period: "2026-04",
      settledPrice: 598,
      relation: undefined,
      citations: [
        {
          caseNo: "No.500001",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "前回は615円/kgの見積に対し、598円/kgで決着。見積比 -2.8%。",
        },
        {
          caseNo: "No.500001",
          company: "丸紅畜産",
          product: "鶏もも肉（ブラジル産・冷凍）",
          snippet: "次回も598円/kgを起点に、数量継続と相場差を確認して交渉する。",
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
};

/** 自社計画の初期値（案件番号 → 計画）。②で保存すると③の算出に反映される。 */
export const MOCK_PLANS: Record<string, CompanyPlan> = {
  "No.500002": {
    targetCostRate: 30,
    planPrice: 612,
    monthlyVolume: 10000,
    ceilingPrice: 626,
  },
  "No.500001": {
    targetCostRate: 30,
    planPrice: 612,
    monthlyVolume: 10000,
    ceilingPrice: 626,
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
};

/** 空の自社計画（未入力状態のデフォルト） */
export const EMPTY_PLAN: CompanyPlan = {
  targetCostRate: 0,
  planPrice: 0,
  monthlyVolume: 0,
  ceilingPrice: 0,
};

export const MOCK_RESULTS: Record<string, ResultRecord> = {
  "No.500001": {
    caseNo: "No.500001",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2026-04",
    settledPrice: 598,
    deliveryTiming: "2026-04",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-03", "RC-04"],
    staffMemo: "為替影響と原材料価格を理由に615円/kgの見積提示があったが、前回実績と数量継続を根拠に598円/kgで決着した。",
    handoverNote: "次回も丸紅畜産から値上げ見積が出る可能性あり。598円/kgを起点に、数量継続と相場差を確認して交渉する。",
    quoteDiffPct: -2.8,
    achievementPct: 88,
    savedAt: "2026-07-10T09:00:00Z",
  },
  "No.499987": {
    caseNo: "No.499987",
    company: "日本ハム商事",
    product: "牛肩ロース（豪州産・チルド）",
    period: "2026Q2",
    settledPrice: 1540,
    deliveryTiming: "2026-07",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-03", "RC-04"],
    staffMemo: "豪州産牛肉の相場上昇を確認しつつ、既存取引量を根拠に見積から一部圧縮できた。",
    handoverNote: "次回は相見積と月間数量を早めに提示し、チルド品の納入頻度も交換条件として確認する。",
    quoteDiffPct: -2.5,
    achievementPct: 82,
    savedAt: "2026-07-01T09:00:00Z",
  },
  "No.499960": {
    caseNo: "No.499960",
    company: "丸紅畜産",
    product: "鶏むね肉（ブラジル産・冷凍）",
    period: "2025Q4",
    settledPrice: 415,
    deliveryTiming: "2025-12",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-02", "RC-08"],
    staffMemo: "需給逼迫の説明があったが、数量拡大を条件に上げ幅を抑制できた。",
    handoverNote: "丸紅畜産は数量条件に反応あり。次回も月間数量と納入頻度を先に提示する。",
    quoteDiffPct: -3.5,
    achievementPct: 90,
    savedAt: "2026-06-28T09:00:00Z",
  },
  "No.499921": {
    caseNo: "No.499921",
    company: "三菱食品",
    product: "冷凍ポテト（オランダ産）",
    period: "2026Q2",
    settledPrice: 330,
    deliveryTiming: "2026-07",
    paymentTerms: "月末締め翌々月10日払い",
    reasonCodes: ["RC-01", "RC-04"],
    staffMemo: "供給不安を理由に値上げ提示があったが、期間固定を条件に計画内で決着した。",
    handoverNote: "次回は在庫状況と代替規格を確認し、早めに数量計画を共有する。",
    quoteDiffPct: -2.9,
    achievementPct: 78,
    savedAt: "2026-06-20T09:00:00Z",
  },
  "No.499801": {
    caseNo: "No.499801",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2026Q1",
    settledPrice: 598,
    deliveryTiming: "2026-04",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-03", "RC-04"],
    staffMemo: "為替影響と原材料価格を理由に見積提示があったが、前回実績と年間数量を根拠に598円/kgで決着した。",
    handoverNote: "次回も丸紅畜産から値上げ見積が出る可能性あり。598円/kgを起点に、数量継続と相場差を確認して交渉する。",
    quoteDiffPct: -3.5,
    achievementPct: 88,
    savedAt: "2026-02-12T09:00:00Z",
  },
  "No.123455-a": {
    caseNo: "No.123455-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2026Q2",
    settledPrice: 609,
    deliveryTiming: "2026-05",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-03", "RC-05"],
    staffMemo: "数量提示が遅れ、物流費を理由に押し込まれ気味の決着となった。",
    handoverNote: "次回は数量見通しを前倒しで提示し、物流費影響の内訳を確認する。",
    quoteDiffPct: -1.8,
    achievementPct: 65,
    savedAt: "2026-03-15T09:00:00Z",
  },
  "No.123454-a": {
    caseNo: "No.123454-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2026Q1",
    settledPrice: 604,
    deliveryTiming: "2026-02",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-02", "RC-04"],
    staffMemo: "需要増加の説明に対し、対象店舗の継続発注を条件に見積から圧縮した。",
    handoverNote: "需要期は強気提示になりやすい。早めに数量と期間を固めて提示する。",
    quoteDiffPct: -2.3,
    achievementPct: 72,
    savedAt: "2025-12-10T09:00:00Z",
  },
  "No.123453-a": {
    caseNo: "No.123453-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2025Q4",
    settledPrice: 602,
    deliveryTiming: "2025-10",
    paymentTerms: "月末締め翌々月10日払い",
    reasonCodes: ["RC-07", "RC-08"],
    staffMemo: "規格条件の確認に時間を要したが、納入条件を調整して計画内に収めた。",
    handoverNote: "規格変更が出た場合は、代替規格と価格差を先に確認する。",
    quoteDiffPct: -3.7,
    achievementPct: 80,
    savedAt: "2025-09-18T09:00:00Z",
  },
  "No.123452-a": {
    caseNo: "No.123452-a",
    company: "丸紅畜産",
    product: "鶏もも肉（ブラジル産・冷凍）",
    period: "2025Q3",
    settledPrice: 598,
    deliveryTiming: "2025-08",
    paymentTerms: "月末締め翌月末払い",
    reasonCodes: ["RC-02", "RC-08"],
    staffMemo: "数量増を先に提示したことで、目標に近い価格で決着できた。",
    handoverNote: "数量カードは丸紅畜産に有効。次回も月間数量を早めに提示する。",
    quoteDiffPct: -2.8,
    achievementPct: 92,
    savedAt: "2025-06-20T09:00:00Z",
  },
  "No.123458-a": {
    caseNo: "No.123458-a",
    company: "グローバルフーズ商事",
    product: "牛バラ肉（豪州産・チルド）",
    period: "2026Q1",
    settledPrice: 1215,
    deliveryTiming: "2026-02",
    paymentTerms: "月末締め翌々月末払い",
    reasonCodes: ["RC-03", "RC-04"],
    staffMemo: "輸入牛は為替と原材料価格の影響が大きく、相見積を根拠に上げ幅を抑制した。",
    handoverNote: "次回は別ソースの相見積を早めに用意し、代替規格も確認する。",
    quoteDiffPct: -2,
    achievementPct: 74,
    savedAt: "2025-12-20T09:00:00Z",
  },
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

/** 変動理由マスタ（RC-01〜10）。バックエンド初期マスタとラベルを揃える。 */
export const MOCK_REASON_TAGS: ReasonTag[] = [
  { code: "RC-01", label: "供給不安", direction: "up" },
  { code: "RC-02", label: "需要増加", direction: "up" },
  { code: "RC-03", label: "為替影響", direction: "up" },
  { code: "RC-04", label: "原材料・飼料価格", direction: "up" },
  { code: "RC-05", label: "物流費・燃料費", direction: "up" },
  { code: "RC-06", label: "人件費・加工費", direction: "up" },
  { code: "RC-07", label: "品質・規格変更", direction: "both" },
  { code: "RC-08", label: "取引条件変更", direction: "both" },
  { code: "RC-09", label: "政策・規制", direction: "both" },
  { code: "RC-10", label: "不明・要確認", direction: "both" },
];
