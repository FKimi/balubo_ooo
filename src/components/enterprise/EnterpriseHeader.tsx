"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EnterpriseHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-base-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-text-primary">balubo</span>
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-primary-blue">
                            Enterprise
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#why" className="text-sm font-medium text-text-secondary hover:text-primary-blue transition-colors">
                            選ばれる理由
                        </a>
                        <a href="#pricing" className="text-sm font-medium text-text-secondary hover:text-primary-blue transition-colors">
                            料金プラン
                        </a>
                        <a href="#faq" className="text-sm font-medium text-text-secondary hover:text-primary-blue transition-colors">
                            よくある質問
                        </a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button asChild variant="ghost" className="hidden sm:inline-flex text-text-secondary hover:text-text-primary">
                        <Link href="/login">ログイン</Link>
                    </Button>
                    <Button asChild className="rounded-full bg-primary-blue hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 border-0">
                        <a href="#waitlist">ウェイトリスト登録</a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
