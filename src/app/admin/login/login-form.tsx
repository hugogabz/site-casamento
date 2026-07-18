"use client";

import { useActionState } from "react";
import { LockKeyhole, LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { loginAdmin, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-[#596653] text-white hover:bg-[#46513f]"
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" /> : <LockKeyhole />}
      {pending ? "Entrando..." : "Entrar no painel"}
    </Button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(loginAdmin, initialState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block text-left">
        <span className="mb-2 block text-sm font-medium text-[#665a52]">
          Senha administrativa
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="h-12 w-full rounded-2xl border border-[#d8cbc0] bg-white/75 px-4 outline-none transition focus:border-[#596653] focus:ring-4 focus:ring-[#9faf94]/20"
          placeholder="Digite sua senha"
        />
      </label>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-[#9f6d65]/10 p-3 text-sm text-[#76564f]">
          {state.error}
        </p>
      ) : null}
      <LoginButton />
    </form>
  );
}
