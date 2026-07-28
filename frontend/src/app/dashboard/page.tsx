"use client";

// ダッシュボード — 本スプリントでは枠のみ。
// 圧縮率・見積差額・決着理由・担当者/取引先/商材別の傾向分析は後続スプリントで実装する。
import { AuthGuard, TopBar } from "@/components/AppChrome";
import { EmptyState } from "@/components/ui/states";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <TopBar />
      <main className="mx-auto max-w-7xl px-6 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-900">ダッシュボード</h1>
        <div className="rounded-lg border border-slate-200 bg-white">
          <EmptyState
            icon="📊"
            title="ダッシュボードは後続スプリントで実装します"
            description="圧縮率、見積との差額、決着理由、担当者・取引先・商材別の傾向を可視化し、交渉結果を振り返るための画面を予定しています。"
          />
        </div>
      </main>
    </AuthGuard>
  );
}
