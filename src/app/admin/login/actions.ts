"use server";

import {
  createAdminSession,
  isAdminConfigured,
  isValidAdminPassword,
} from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export type LoginState = {
  error?: string;
};

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "Defina ADMIN_PASSWORD no arquivo .env antes de entrar." };
  }

  const password = String(formData.get("password") ?? "");
  if (!isValidAdminPassword(password)) {
    return { error: "Senha incorreta. Tente novamente." };
  }

  await createAdminSession();
  redirect("/admin/presentes");
}
