import { Heart } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "@/app/admin/login/login-form";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/presentes");
  const configured = isAdminConfigured();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f2ea] px-5 py-12 text-[#44362f]">
      <section className="w-full max-w-md rounded-[2rem] border border-white/80 bg-white/65 p-7 text-center shadow-xl shadow-[#6f5745]/10 backdrop-blur sm:p-10">
        <Heart className="mx-auto size-8 fill-[#9f6d65] text-[#9f6d65]" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-[#7e7868]">
          Área reservada
        </p>
        <h1 className="mt-3 font-serif text-3xl">Painel do casamento</h1>
        <p className="mt-3 text-sm leading-6 text-[#665a52]">
          Entre para organizar a lista de presentes com tranquilidade.
        </p>
        {!configured ? (
          <p className="mt-6 rounded-xl bg-[#d7b9a3]/20 p-4 text-left text-sm leading-6 text-[#76564f]">
            Configure <code>ADMIN_PASSWORD</code> no arquivo <code>.env</code> para liberar o painel.
          </p>
        ) : null}
        <LoginForm />
      </section>
    </main>
  );
}
