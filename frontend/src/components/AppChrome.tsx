"use client";

// アプリ共通クローム: 認証ガード＋トップバー
// - AuthGuard: 未ログインなら /login へリダイレクト（モック認証・Sprint 2 で Entra 置換）。
// - TopBar: ロゴ・グローバルナビ・ユーザーメニュー（デザインガイド §3.1 ヘッダー）。
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Spinner } from "@/components/ui/Spinner";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }
  return <>{children}</>;
}

export function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  function onLogout() {
    logout();
    router.replace("/login");
  }

  const navItems = [
    { href: "/cases", label: "案件一覧" },
    { href: "/master", label: "マスタ管理" },
  ];

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
        <Link href="/cases" className="flex items-center gap-3 font-bold text-slate-900">
          <Image
            src="/negotius-logo.png"
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl object-contain"
          />
          <span className="leading-tight">
            <span className="block text-lg">Negotius</span>
            <span className="block text-xs font-medium text-slate-500">購買交渉支援MVP</span>
          </span>
        </Link>

        <nav className="ml-2 flex items-center gap-1" aria-label="グローバルナビ">
          {navItems.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-md px-3 py-1.5 text-sm ${
                  active
                    ? "bg-blue-50 font-medium text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5 ring-1 ring-slate-200 sm:flex">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white"
              aria-hidden="true"
            >
              {user?.displayName?.slice(0, 1) ?? "U"}
            </span>
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-slate-400">ログイン中</p>
              <p className="text-sm font-semibold text-slate-700">{user?.displayName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
