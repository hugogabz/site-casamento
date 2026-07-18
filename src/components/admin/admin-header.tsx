import { ExternalLink, Gift, ListChecks, LogOut } from "lucide-react";
import Link from "next/link";

import { logoutAdmin } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  return (
    <header className="border-b border-white/70 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/admin/presentes" className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-[#596653] text-white">
            <Gift className="size-5" />
          </span>
          <span>
            <span className="block font-serif text-lg text-[#44362f]">Painel de presentes</span>
            <span className="block text-xs text-[#7e7868]">Administração do casamento</span>
          </span>
        </Link>
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link
            href="/admin/presentes"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-[#665a52] transition hover:bg-white"
          >
            <Gift className="size-4" />
            <span className="hidden md:inline">Presentes</span>
          </Link>
          <Link
            href="/admin/pedidos"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-[#665a52] transition hover:bg-white"
          >
            <ListChecks className="size-4" />
            <span className="hidden md:inline">Pedidos</span>
          </Link>
          <Link
            href="/presentes"
            target="_blank"
            className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-[#665a52] transition hover:bg-white"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">Ver lista pública</span>
          </Link>
          <form action={logoutAdmin}>
            <Button type="submit" size="sm" variant="ghost" className="rounded-full">
              <LogOut />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
