"use client";

// 画面⑤ 結果記録（デザインガイド §3.5 / FR-11・FR-12・FR-13）
// 決着単価・見積比・達成度（自動計算）、変動理由タグ（複数選択・必須）、所感。
// 保存で案件ステータスを「完了」化し、結果は判断継承で次の同一商材×取引先案件の過去経緯に現れる。
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { SelectField, TextField } from "@/components/ui/Form";
import { ReasonTagSelector } from "@/components/ui/ReasonTagSelector";
import { AchievementField, QuoteDiffField } from "@/components/ui/AutoCalcField";
import { ErrorBanner } from "@/components/ui/states";
import { api } from "@/lib/api";
import { getMissingResultCompletionItems, isResultComplete } from "@/lib/resultCompletion";
import {
  calcAchievementPct,
  calcQuoteDiffPct,
  calcSettledPriceDeviation,
  findPreviousSettledPrice,
  getReasonTags,
  getResult,
  saveResult,
  selectSettledPriceComparisonBase,
} from "@/lib/workspaceApi";
import type { ReasonTag, ResultRecord } from "@/lib/types";

function validateSettledPriceInput(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return "決着単価を入力してください。";
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return "有効な数値を入力してください。";
  if (parsed <= 0) return "0より大きい金額を入力してください。";
  if (!/^\d+$/.test(trimmed)) {
    return "決着単価は1以上の整数で入力してください。";
  }
  return null;
}

function formatSignedNumber(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}`;
}

const PAYMENT_TERM_OPTIONS = [
  { value: "", label: "選択してください" },
  { value: "月末締め翌月末払い", label: "月末締め翌月末払い" },
  { value: "月末締め翌々月10日払い", label: "月末締め翌々月10日払い" },
  { value: "月末締め翌々月末払い", label: "月末締め翌々月末払い" },
];

function normalizeDeliveryMonth(value: string): string {
  const match = value.match(/(\d{4})[/-](\d{1,2})/);
  if (!match) return "";
  return `${match[1]}-${match[2].padStart(2, "0")}`;
}

function paymentOptionsWithLegacyValue(value: string) {
  if (!value || PAYMENT_TERM_OPTIONS.some((option) => option.value === value)) {
    return PAYMENT_TERM_OPTIONS;
  }
  return [...PAYMENT_TERM_OPTIONS, { value, label: `既存値: ${value}` }];
}

export default function ResultPage() {
  const params = useParams<{ caseNo: string }>();
  const router = useRouter();
  const caseNo = decodeURIComponent(params.caseNo);

  const [loading, setLoading] = useState(true);
  const [notReady, setNotReady] = useState(false);
  const [quoted, setQuoted] = useState(0);
  const [planPrice, setPlanPrice] = useState<number | null>(null);
  const [previousSettledPrice, setPreviousSettledPrice] = useState<number | null>(null);
  const [target, setTarget] = useState(0);
  const [walkaway, setWalkaway] = useState(0);
  const [tags, setTags] = useState<ReasonTag[]>([]);

  // フォーム状態
  const [settledPrice, setSettledPrice] = useState("");
  const [deliveryTiming, setDeliveryTiming] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [reasonCodes, setReasonCodes] = useState<string[]>([]);
  const [staffMemo, setStaffMemo] = useState(""); // 所感（今回案件の記録）
  const [handoverNote, setHandoverNote] = useState(""); // 次回への申し送り（次回案件への判断材料）
  const [errors, setErrors] = useState<{ settled?: string }>({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [completed, setCompleted] = useState<ResultRecord | null>(null);
  const [needsSaveConfirm, setNeedsSaveConfirm] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [detail, lines, reasonTags, existing, plan, past] = await Promise.all([
        api.getCase(caseNo),
        api.getThreeLines(caseNo),
        getReasonTags(),
        getResult(caseNo),
        api.getCompanyPlan(caseNo).catch(() => null),
        api.getPastCases(caseNo).catch(() => null),
      ]);
      if (!alive) return;
      if (lines.lines.length === 0 && !existing) {
        setNotReady(true);
        setLoading(false);
        return;
      }
      setQuoted(detail.quotedPrice);
      setPlanPrice(plan?.planPrice ?? null);
      setPreviousSettledPrice(past?.state === "ready" ? findPreviousSettledPrice(past.items) : null);
      setTarget(lines.lines.find((l) => l.type === "target")?.value ?? existing?.settledPrice ?? detail.quotedPrice);
      setWalkaway(lines.lines.find((l) => l.type === "walkaway")?.value ?? detail.quotedPrice);
      setTags(reasonTags);
      // 既存の結果があれば入力欄に復元（再編集可能）
      if (existing) {
        setSettledPrice(String(existing.settledPrice));
        setDeliveryTiming(normalizeDeliveryMonth(existing.deliveryTiming));
        setPaymentTerms(existing.paymentTerms);
        setReasonCodes(existing.reasonCodes);
        setStaffMemo(existing.staffMemo);
        setHandoverNote(existing.handoverNote);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [caseNo]);

  const settledNum = Number(settledPrice);
  const settledValidationError = useMemo(
    () => validateSettledPriceInput(settledPrice),
    [settledPrice],
  );
  const hasSettled = settledValidationError === null;
  const comparisonBase = useMemo(
    () =>
      selectSettledPriceComparisonBase({
        quotedPrice: quoted,
        planPrice,
        previousSettledPrice,
      }),
    [quoted, planPrice, previousSettledPrice],
  );
  const settledDeviation = useMemo(
    () => (hasSettled ? calcSettledPriceDeviation(settledNum, comparisonBase) : null),
    [comparisonBase, hasSettled, settledNum],
  );
  const exceedsWalkawayLine = hasSettled && walkaway > 0 && settledNum > walkaway;
  const hasSaveWarning = Boolean(settledDeviation?.shouldWarn || exceedsWalkawayLine);
  const paymentOptions = useMemo(() => paymentOptionsWithLegacyValue(paymentTerms), [paymentTerms]);
  const currentResultInput = useMemo(
    () => ({
      settledPrice: settledNum,
      deliveryTiming: deliveryTiming.trim(),
      paymentTerms: paymentTerms.trim(),
      reasonCodes,
      staffMemo: staffMemo.trim(),
      handoverNote: handoverNote.trim(),
    }),
    [deliveryTiming, handoverNote, paymentTerms, reasonCodes, settledNum, staffMemo],
  );
  const missingCompletionItems = useMemo(
    () => (hasSettled ? getMissingResultCompletionItems(currentResultInput) : []),
    [currentResultInput, hasSettled],
  );
  const resultWillComplete = hasSettled && missingCompletionItems.length === 0;

  // 自動計算（決着単価の入力に追従）
  const quoteDiff = useMemo(
    () => (hasSettled ? calcQuoteDiffPct(settledNum, quoted) : null),
    [hasSettled, settledNum, quoted],
  );
  const quoteDifference = hasSettled ? settledNum - quoted : null;
  const achievement = useMemo(
    () => (hasSettled ? calcAchievementPct(settledNum, target, walkaway) : null),
    [hasSettled, settledNum, target, walkaway],
  );

  const save = useCallback(async (allowDeviation = false) => {
    const errs: typeof errors = {};
    const settledError = validateSettledPriceInput(settledPrice);
    if (settledError) errs.settled = settledError;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const deviation = calcSettledPriceDeviation(settledNum, comparisonBase);
    const exceedsWalkaway = walkaway > 0 && settledNum > walkaway;
    if (!allowDeviation && (deviation?.shouldWarn || exceedsWalkaway)) {
      setNeedsSaveConfirm(true);
      return;
    }

    setSaving(true);
    setSaveError(false);
    setNeedsSaveConfirm(false);
    try {
      const record = await saveResult(caseNo, {
        ...currentResultInput,
      });
      setCompleted(record);
    } catch {
      setSaveError(true);
    } finally {
      setSaving(false);
    }
  }, [
    caseNo,
    comparisonBase,
    currentResultInput,
    settledNum,
    settledPrice,
    walkaway,
  ]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (notReady) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">結果記録</h1>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <p className="text-sm text-amber-800">
            結果記録の前に、先に③3ライン算出を完了してください。
          </p>
          <div className="mt-3">
            <Button
              variant="secondary"
              onClick={() => router.push(`/cases/${encodeURIComponent(caseNo)}/lines`)}
            >
              ③ へ戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 保存完了（一時保存または案件完了）
  if (completed) {
    const completedResult = isResultComplete(completed);
    const completedMissingItems = getMissingResultCompletionItems(completed);
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">結果記録</h1>
        <div
          className={`rounded-lg border p-6 ${
            completedResult
              ? "border-emerald-200 bg-emerald-50"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <p
            className={`text-base font-semibold ${
              completedResult ? "text-emerald-800" : "text-blue-800"
            }`}
          >
            {completedResult ? "✓ 保存して案件を完了しました" : "✓ 結果記録を一時保存しました"}
          </p>
          <p
            className={`mt-2 num text-sm ${
              completedResult ? "text-emerald-700" : "text-blue-700"
            }`}
          >
            決着 ¥{completed.settledPrice.toLocaleString("ja-JP")}/kg ／ 見積比{" "}
            {completed.quoteDiffPct >= 0 ? "+" : ""}
            {completed.quoteDiffPct}% ／ 達成度 {completed.achievementPct}%
          </p>
          {completedResult ? (
            <p className="mt-2 text-sm text-emerald-700">
              この決着結果は、次に同一商材×取引先で作成した案件の②情報収集「過去経緯」に自動で参照されます（判断継承 BR-10）。
            </p>
          ) : (
            <p className="mt-2 text-sm text-blue-700">
              不足項目（{completedMissingItems.join("・")}）があるため、案件ステータスは交渉中のままです。次回交渉に使える記録として完了するには、足りない項目を追記してください。
            </p>
          )}
          <div className="mt-4">
            <Button onClick={() => router.push("/cases")}>案件一覧へ戻る</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">結果記録</h1>

      {saveError && (
        <ErrorBanner
          message="保存に失敗しました。入力内容はそのままです。もう一度お試しください。"
          onRetry={() => save(false)}
        />
      )}

      {/* 決着結果 */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">決着結果</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            label="決着単価（円/kg）"
            required
            numeric
            type="number"
            value={settledPrice}
            onChange={(e) => {
              setSettledPrice(e.target.value);
              setNeedsSaveConfirm(false);
              if (e.target.value.trim() !== "") setErrors((p) => ({ ...p, settled: undefined }));
            }}
            error={errors.settled}
            placeholder="例: 620"
          />
          <TextField
            label="納入年月"
            type="month"
            value={deliveryTiming}
            onChange={(e) => setDeliveryTiming(e.target.value)}
            hint="年月を統一形式で保存します。例: 2026年8月"
          />
          <SelectField
            label="支払条件"
            value={paymentTerms}
            onChange={(e) => setPaymentTerms(e.target.value)}
            options={paymentOptions}
          />
        </div>
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-500">見積単価</p>
              <p className="num mt-1 text-xl font-semibold text-slate-900">
                ¥{quoted.toLocaleString("ja-JP")}
                <span className="ml-1 text-sm font-medium text-slate-500">/kg</span>
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">決着単価</p>
              <p className="num mt-1 text-xl font-semibold text-slate-900">
                {hasSettled ? (
                  <>
                    ¥{settledNum.toLocaleString("ja-JP")}
                    <span className="ml-1 text-sm font-medium text-slate-500">/kg</span>
                  </>
                ) : (
                  <span className="text-base font-medium text-slate-400">入力待ち</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">見積との差額</p>
              <p
                className={`num mt-1 text-xl font-semibold ${
                  quoteDifference === null
                    ? "text-slate-400"
                    : quoteDifference <= 0
                      ? "text-emerald-700"
                      : "text-red-700"
                }`}
              >
                {quoteDifference === null
                  ? "入力待ち"
                  : `${formatSignedNumber(quoteDifference)}円/kg`}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <QuoteDiffField label="見積比（自動計算）" pct={quoteDiff ?? 0} />
          <AchievementField label="目標達成度（自動計算）" pct={achievement ?? 0} />
        </div>
        {settledDeviation?.shouldWarn && (
          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">
              入力された決着単価は、{settledDeviation.base.label}
              から大きく乖離しています。桁間違いや入力内容をご確認ください。
            </p>
            <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-amber-700">比較基準</dt>
                <dd className="num font-semibold">
                  {settledDeviation.base.value?.toLocaleString("ja-JP")}円/kg
                </dd>
              </div>
              <div>
                <dt className="text-xs text-amber-700">決着単価</dt>
                <dd className="num font-semibold">
                  {settledDeviation.settledPrice.toLocaleString("ja-JP")}円/kg
                </dd>
              </div>
              <div>
                <dt className="text-xs text-amber-700">差額</dt>
                <dd className="num font-semibold">
                  {formatSignedNumber(settledDeviation.difference)}円/kg
                </dd>
              </div>
              <div>
                <dt className="text-xs text-amber-700">乖離率</dt>
                <dd className="num font-semibold">
                  {formatSignedNumber(settledDeviation.deviationRate)}%
                </dd>
              </div>
            </dl>
          </div>
        )}
        {exceedsWalkawayLine && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <p className="font-semibold">
              決着単価が撤退ラインを超えています。内容を確認してください。
            </p>
            <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-red-700">撤退ライン</dt>
                <dd className="num font-semibold">{walkaway.toLocaleString("ja-JP")}円/kg</dd>
              </div>
              <div>
                <dt className="text-xs text-red-700">決着単価</dt>
                <dd className="num font-semibold">{settledNum.toLocaleString("ja-JP")}円/kg</dd>
              </div>
              <div>
                <dt className="text-xs text-red-700">撤退ラインとの差</dt>
                <dd className="num font-semibold">
                  {formatSignedNumber(settledNum - walkaway)}円/kg
                </dd>
              </div>
            </dl>
          </div>
        )}
        {!hasSettled && (
          <p className="mt-2 text-xs text-slate-500">
            決着単価を入力すると見積比・目標達成度が自動計算されます。
          </p>
        )}
      </section>

      {/* 決着理由 */}
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">
          決着理由 <span className="text-red-600">*</span>
          <span className="ml-2 text-sm font-normal text-slate-500">（複数選択可）</span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          決着理由タグだけでは伝わらない背景は、所感・申し送りに具体的に残してください。
        </p>
        <div className="mt-4">
          <ReasonTagSelector
            tags={tags}
            selected={reasonCodes}
            onChange={(codes) => {
              setReasonCodes(codes);
            }}
          />
        </div>
      </section>

      {/* 所感・申し送り（別項目。所感=今回案件の記録／申し送り=次回案件への判断材料） */}
      <section className="rounded-lg border border-slate-200 bg-white p-5 space-y-5">
        {/* 所感（今回案件の記録） */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">所感</h2>
          <p className="mt-1 text-sm text-slate-500">
            今回の交渉で、何が決着価格に影響したかを残します。相場・過去実績・数量条件・先方反応など、圧縮に効いた要因を書いてください。
          </p>
          <textarea
            value={staffMemo}
            onChange={(e) => setStaffMemo(e.target.value)}
            rows={3}
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            placeholder="例: 相場600円/kg、前回598円/kgを根拠に、提示640円/kgから626円/kgまで圧縮。数量増の余地を示したことが効いた。"
          />
        </div>
        {/* 次回への申し送り（次回案件への判断材料） */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900">次回への申し送り</h2>
          <p className="mt-1 text-sm text-slate-500">
            次回の同一取引先・同一商材の交渉で使える情報を残します。相手の反応、次に使えそうな交渉カード、注意点を書いてください。
          </p>
          <textarea
            value={handoverNote}
            onChange={(e) => setHandoverNote(e.target.value)}
            rows={3}
            className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
            placeholder="例: 先方は数量コミットに反応あり。次回は対象店舗拡大・期間固定を条件に、600円台前半を狙える可能性あり。"
          />
          <p className="mt-2 text-xs text-slate-500">
            保存後、次に同一商材×取引先で案件を作成したとき、②情報収集「過去経緯」に表示されます。
          </p>
        </div>
      </section>

      {needsSaveConfirm && (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h2 className="text-base font-semibold text-amber-900">保存前の確認</h2>
          <p className="mt-2 text-sm text-amber-900">
            {hasSaveWarning
              ? "確認が必要な決着単価が入力されています。この内容で保存しますか？"
              : "入力内容を確認してください。"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setNeedsSaveConfirm(false)}>
              入力内容を修正する
            </Button>
            <Button onClick={() => save(true)} loading={saving}>
              このまま保存する
            </Button>
          </div>
        </section>
      )}

      {hasSettled && !resultWillComplete && (
        <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
          <p className="font-semibold">この内容は一時保存できますが、案件はまだ完了になりません。</p>
          <p className="mt-1">
            次回交渉に活かすには、{missingCompletionItems.join("・")}まで入力してください。
          </p>
        </section>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="secondary"
          onClick={() => router.push(`/cases/${encodeURIComponent(caseNo)}/strategy`)}
        >
          ← 作戦シートへ戻る
        </Button>
        <Button onClick={() => save(false)} loading={saving}>
          {resultWillComplete ? "保存して案件を完了 ✓" : "結果記録を保存"}
        </Button>
      </div>
    </div>
  );
}
