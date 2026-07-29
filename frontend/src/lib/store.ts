// モック用の簡易ストア
// 案件・自社計画・3ラインの手修正など、セッション中に変化する状態を保持する。
// localStorage をバックにしてリロードをまたいで永続化する（ブラウザ内のみ・デモ用）。
// 実 API 接続時（NEXT_PUBLIC_USE_MOCK=false）は使用しない。

import {
  EMPTY_PLAN,
  MOCK_CASES,
  MOCK_CASE_DETAILS,
  MOCK_PLANS,
  MOCK_RATES,
  MOCK_RESULTS,
} from "@/lib/mock/data";
import { isResultComplete } from "@/lib/resultCompletion";
import type {
  CaseStatus,
  CaseSummary,
  CompanyPlan,
  RateManualInput,
  RateInfo,
  ResultRecord,
  StrategyDraft,
  ThreeLine,
  WorkspaceStep,
} from "@/lib/types";

// スキーマ拡張のため v2 にバージョンを上げる（旧 v1 の破損/欠損キーを避ける）。
const KEY = "freeradicals.mockstore.v2";
const DEMO_DATA_REVISION = "demo-flow-create-500002-from-500001-v4";
const DEMO_VISIBLE_CASE_NOS = new Set(["No.500001"]);
const DEMO_HIDDEN_CASE_NOS = new Set(["No.500002"]);
const DEMO_REMOVED_CASE_NOS = new Set(["No.500002", "No.500003", "No.500010", "No.500011"]);

interface StoreShape {
  cases: CaseSummary[];
  caseExtra: Record<string, { quotedPrice: number; targetPeriod: string }>;
  plans: Record<string, CompanyPlan>;
  manualRates: Record<string, Record<string, RateManualInput>>;
  lines: Record<string, ThreeLine[]>; // 手修正を含む確定ライン
  strategies: Record<string, StrategyDraft>; // ④作戦シートの保存済み下書き
  results: Record<string, ResultRecord>; // ⑤結果記録
  lastStep: Record<string, WorkspaceStep>; // 案件ごとの最後にいたステップ（m-2）
  dataRevision?: string; // デモ用seed補正の適用済みバージョン
}

function seed(): StoreShape {
  const caseExtra: StoreShape["caseExtra"] = {};
  for (const [caseNo, d] of Object.entries(MOCK_CASE_DETAILS)) {
    caseExtra[caseNo] = { quotedPrice: d.quotedPrice, targetPeriod: d.targetPeriod };
  }
  return {
    cases: [...MOCK_CASES],
    caseExtra,
    plans: { ...MOCK_PLANS },
    manualRates: {},
    lines: {},
    strategies: {},
    results: { ...MOCK_RESULTS },
    lastStep: {},
    dataRevision: DEMO_DATA_REVISION,
  };
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function shouldRemoveDemoCaseNo(caseNo: string): boolean {
  if (caseNo.startsWith("GRAG-")) return true;
  if (DEMO_REMOVED_CASE_NOS.has(caseNo)) return true;
  const match = caseNo.match(/^No\.(\d+)(?:-.+)?$/);
  if (!match) return false;
  const numeric = Number(match[1]);
  return numeric > 500001 && numeric < 500100;
}

function mergeSeedData(s: StoreShape): { store: StoreShape; changed: boolean } {
  let changed = false;
  const shouldRepairDemoFlow = s.dataRevision !== DEMO_DATA_REVISION;
  let cases = [...(s.cases ?? [])];
  const caseNos = new Set(cases.map((c) => c.caseNo));

  for (const mockCase of MOCK_CASES) {
    if (!caseNos.has(mockCase.caseNo)) {
      cases.push(mockCase);
      caseNos.add(mockCase.caseNo);
      changed = true;
    }
  }

  if (shouldRepairDemoFlow) {
    cases = cases.filter((item) => !shouldRemoveDemoCaseNo(item.caseNo));
    changed = true;

    for (const mockCase of MOCK_CASES.filter((item) => DEMO_VISIBLE_CASE_NOS.has(item.caseNo))) {
      const index = cases.findIndex((item) => item.caseNo === mockCase.caseNo);
      if (index >= 0) {
        cases[index] = mockCase;
      } else {
        cases.unshift(mockCase);
      }
      changed = true;
    }
  }

  const caseExtra = { ...(s.caseExtra ?? {}) };
  for (const [caseNo, detail] of Object.entries(MOCK_CASE_DETAILS)) {
    if (!caseExtra[caseNo]) {
      caseExtra[caseNo] = { quotedPrice: detail.quotedPrice, targetPeriod: detail.targetPeriod };
      changed = true;
    }
  }
  if (shouldRepairDemoFlow) {
    for (const caseNo of [...DEMO_VISIBLE_CASE_NOS, ...DEMO_HIDDEN_CASE_NOS]) {
      const detail = MOCK_CASE_DETAILS[caseNo];
      if (detail) {
        caseExtra[caseNo] = { quotedPrice: detail.quotedPrice, targetPeriod: detail.targetPeriod };
        changed = true;
      }
    }
    delete caseExtra["No.500003"];
    for (const caseNo of Object.keys(caseExtra)) {
      if (shouldRemoveDemoCaseNo(caseNo) && !DEMO_HIDDEN_CASE_NOS.has(caseNo)) {
        delete caseExtra[caseNo];
      }
    }
  }

  const plans = { ...(s.plans ?? {}) };
  for (const [caseNo, plan] of Object.entries(MOCK_PLANS)) {
    if (!plans[caseNo]) {
      plans[caseNo] = plan;
      changed = true;
    }
  }
  if (shouldRepairDemoFlow) {
    for (const caseNo of [...DEMO_VISIBLE_CASE_NOS, ...DEMO_HIDDEN_CASE_NOS]) {
      const plan = MOCK_PLANS[caseNo];
      if (plan) {
        plans[caseNo] = plan;
        changed = true;
      }
    }
    delete plans["No.500003"];
    for (const caseNo of Object.keys(plans)) {
      if (shouldRemoveDemoCaseNo(caseNo) && !DEMO_HIDDEN_CASE_NOS.has(caseNo)) {
        delete plans[caseNo];
      }
    }
  }

  const results = { ...(s.results ?? {}) };
  for (const [caseNo, result] of Object.entries(MOCK_RESULTS)) {
    const current = results[caseNo];
    // デモ用の完了済み seed 案件は、古い localStorage に未完成データが残っていても
    // 過去経緯として安定して見せられるように初期データで補修する。
    if (!current || !isResultComplete(current)) {
      results[caseNo] = result;
      changed = true;
    }
  }
  const manualRates = { ...(s.manualRates ?? {}) };
  const lines = { ...(s.lines ?? {}) };
  const strategies = { ...(s.strategies ?? {}) };
  const lastStep = { ...(s.lastStep ?? {}) };
  if (shouldRepairDemoFlow) {
    results["No.500001"] = MOCK_RESULTS["No.500001"];
    for (const caseNo of Object.keys(results)) {
      if (shouldRemoveDemoCaseNo(caseNo)) delete results[caseNo];
    }
    for (const caseNo of Object.keys(manualRates)) {
      if (shouldRemoveDemoCaseNo(caseNo)) delete manualRates[caseNo];
    }
    for (const caseNo of Object.keys(lines)) {
      if (shouldRemoveDemoCaseNo(caseNo)) delete lines[caseNo];
    }
    for (const caseNo of Object.keys(strategies)) {
      if (shouldRemoveDemoCaseNo(caseNo)) delete strategies[caseNo];
    }
    lastStep["No.500001"] = "result";
    for (const caseNo of Object.keys(lastStep)) {
      if (shouldRemoveDemoCaseNo(caseNo)) delete lastStep[caseNo];
    }
    changed = true;
  }

  const resultCaseNos = new Set(Object.keys(results));
  const casesWithSyncedStatus = cases.map((item) => {
    const result = results[item.caseNo];
    if (!result) return item;
    const nextStatus: CaseStatus = isResultComplete(result) ? "done" : "negotiating";
    if (item.status === nextStatus) return item;
    changed = true;
    return { ...item, status: nextStatus };
  });

  for (const item of casesWithSyncedStatus) {
    if (item.status === "done" && !resultCaseNos.has(item.caseNo)) {
      changed = true;
      item.status = "negotiating";
    }
  }

  return {
    store: {
      ...s,
      cases: casesWithSyncedStatus,
      caseExtra,
      plans,
      manualRates,
      lines,
      strategies,
      results,
      lastStep,
      dataRevision: DEMO_DATA_REVISION,
    },
    changed,
  };
}

export function loadStore(): StoreShape {
  if (!isBrowser()) return seed();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    const merged = mergeSeedData(JSON.parse(raw) as StoreShape);
    if (merged.changed) window.localStorage.setItem(KEY, JSON.stringify(merged.store));
    return merged.store;
  } catch {
    return seed();
  }
}

export function saveStore(s: StoreShape): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(s));
}

export function resetDemoStore(): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(seed()));
}

export function getPlan(caseNo: string): CompanyPlan {
  const s = loadStore();
  return s.plans[caseNo] ?? { ...EMPTY_PLAN };
}

export function setPlan(caseNo: string, plan: CompanyPlan): void {
  const s = loadStore();
  s.plans[caseNo] = plan;
  saveStore(s);
}

export function saveManualRate(caseNo: string, input: RateManualInput): RateInfo {
  const s = loadStore();
  s.manualRates = s.manualRates ?? {};
  s.manualRates[caseNo] = { ...(s.manualRates[caseNo] ?? {}), [input.yearMonth]: input };
  saveStore(s);

  const base = findLinkedRateInfo(caseNo, s);
  const latestManual = Object.values(s.manualRates[caseNo]).sort((a, b) =>
    a.yearMonth.localeCompare(b.yearMonth),
  ).at(-1);
  const manualCount = Object.keys(s.manualRates[caseNo]).length;
  return {
    registered: true,
    latestPrice: latestManual?.priceYenKg ?? base?.latestPrice ?? null,
    currentPrice: base?.currentPrice ?? 0,
    // 手入力は前年同月比を再算出できないため未算出（null）扱い（issue #7 申し送り対応・backend と一致）。
    yoyRate: null,
    yearMonth: latestManual?.yearMonth ?? base?.yearMonth ?? null,
    source: latestManual?.source ?? null,
    inputMethod: "手入力",
    updatedAt: new Date().toISOString(),
    unit: "円/kg",
    normalizedCount: (base?.normalizedCount ?? 0) + manualCount,
    note: "手入力の相場情報を保存しました。",
  };
}

function findLinkedRateInfo(caseNo: string, s = loadStore()): RateInfo | undefined {
  if (MOCK_RATES[caseNo]) return MOCK_RATES[caseNo];
  const self = s.cases.find((item) => item.caseNo === caseNo);
  if (!self) return undefined;
  const exact = s.cases.find(
    (item) =>
      item.caseNo !== caseNo &&
      item.company === self.company &&
      item.product === self.product &&
      MOCK_RATES[item.caseNo],
  );
  if (exact) return MOCK_RATES[exact.caseNo];
  const sameProduct = s.cases.find(
    (item) => item.caseNo !== caseNo && item.product === self.product && MOCK_RATES[item.caseNo],
  );
  return sameProduct ? MOCK_RATES[sameProduct.caseNo] : undefined;
}

export function getLinkedRateInfo(caseNo: string): RateInfo | undefined {
  return findLinkedRateInfo(caseNo);
}

export function getLines(caseNo: string): ThreeLine[] | null {
  const s = loadStore();
  return s.lines[caseNo] ?? null;
}

export function setLines(caseNo: string, lines: ThreeLine[]): void {
  const s = loadStore();
  // 手修正済み（isEdited=true）のラインのみ永続化する。未修正ラインは保存せず、
  // 取得時に毎回そのときの相場・計画から再算出させる（3本まとめて凍結しない）。
  const edited = lines.filter((l) => l.isEdited);
  if (edited.length > 0) {
    s.lines[caseNo] = edited;
  } else {
    delete s.lines[caseNo];
  }
  saveStore(s);
}

export function getCases(): CaseSummary[] {
  return loadStore().cases;
}

export function getCaseExtra(caseNo: string): { quotedPrice: number; targetPeriod: string } {
  const s = loadStore();
  return s.caseExtra[caseNo] ?? { quotedPrice: 0, targetPeriod: "" };
}

export function addCase(summary: CaseSummary, quotedPrice: number, targetPeriod: string): void {
  const s = loadStore();
  s.cases = [summary, ...s.cases];
  s.caseExtra[summary.caseNo] = { quotedPrice, targetPeriod };
  saveStore(s);
}

export function updateCase(
  caseNo: string,
  patch: Pick<CaseSummary, "company" | "product" | "updatedAt"> & {
    quotedPrice: number;
    targetPeriod: string;
  },
): void {
  const s = loadStore();
  s.cases = s.cases.map((item) =>
    item.caseNo === caseNo
      ? {
          ...item,
          company: patch.company,
          product: patch.product,
          updatedAt: patch.updatedAt,
          status: item.status === "done" ? "negotiating" : item.status,
        }
      : item,
  );
  s.caseExtra[caseNo] = { quotedPrice: patch.quotedPrice, targetPeriod: patch.targetPeriod };
  delete s.lines[caseNo];
  delete s.strategies[caseNo];
  delete s.results[caseNo];
  saveStore(s);
}

/** 次の案件番号を採番する（"No.500001" → "No.500002"）。デモ用の単純採番。 */
export function nextCaseNo(): string {
  const s = loadStore();
  const nums = s.cases
    .map((c) => parseInt(c.caseNo.replace(/[^0-9]/g, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 500000;
  return `No.${max + 1}`;
}

// ---- ④ 作戦シート ----

export function getStrategy(caseNo: string): StrategyDraft | null {
  const s = loadStore();
  return s.strategies?.[caseNo] ?? null;
}

export function setStrategy(caseNo: string, draft: StrategyDraft): void {
  const s = loadStore();
  s.strategies = { ...(s.strategies ?? {}), [caseNo]: draft };
  saveStore(s);
}

// ---- ⑤ 結果記録 ----

export function getResult(caseNo: string): ResultRecord | null {
  const s = loadStore();
  return s.results?.[caseNo] ?? null;
}

export function setResult(caseNo: string, record: ResultRecord): void {
  const s = loadStore();
  s.results = { ...(s.results ?? {}), [caseNo]: record };
  saveStore(s);
}

/** 案件ステータスを更新する（結果保存時に "done" 化する）。 */
export function setCaseStatus(caseNo: string, status: CaseStatus): void {
  const s = loadStore();
  s.cases = s.cases.map((c) => (c.caseNo === caseNo ? { ...c, status } : c));
  saveStore(s);
}

/** 過去経緯マッチ（backend の related_past_results と同じ意味論の relation を付与）。 */
export interface PastResultMatch {
  record: ResultRecord;
  /** direct=同一 spec（＝商材キー一致）/ same_supplier=同一取引先の別商材。 */
  relation: "direct" | "same_supplier";
}

/**
 * 判断継承（BR-10）: 決着済みの結果を過去経緯候補として返す。自分自身の案件は除外する。
 * backend（repository.related_past_results）と意味論を揃える:
 *   - 商材キー（product＝spec 相当）一致 → direct（数値算出に使う直接一致）
 *   - 取引先キー（company＝supplier 相当）一致（別商材） → same_supplier（グラフ補完・数値には使わない）
 * ※モックは spec_id/supplier_id を持たないため、表示文字列 product/company を spec/supplier の
 *   代理キーとして用いる（company×product の AND 一致ではなく、backend と同じ OR＋relation 判定）。
 */
export function getPastResults(
  company: string,
  product: string,
  excludeCaseNo: string,
): PastResultMatch[] {
  const s = loadStore();
  return Object.values(s.results ?? {})
    .filter(
      (r) =>
        r.caseNo !== excludeCaseNo &&
        isResultComplete(r) &&
        (r.product === product || r.company === company),
    )
    .map<PastResultMatch>((r) => ({
      record: r,
      relation: r.product === product ? "direct" : "same_supplier",
    }));
}

// ---- 進捗（最後にいたステップ・m-2） ----

export function getLastStep(caseNo: string): WorkspaceStep {
  const s = loadStore();
  return s.lastStep?.[caseNo] ?? "collect";
}

export function setLastStep(caseNo: string, step: WorkspaceStep): void {
  const s = loadStore();
  if ((s.lastStep?.[caseNo] ?? "collect") === step) return; // 変化なしなら書かない
  s.lastStep = { ...(s.lastStep ?? {}), [caseNo]: step };
  saveStore(s);
}
