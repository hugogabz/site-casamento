"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { destroyAdminSession, requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { uploadGiftImage } from "@/lib/cloudinary";

export type GiftFormState = {
  error?: string;
};

function getRequiredText(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) throw new Error(`Preencha o campo ${name}.`);
  return value;
}

function getNonNegativeInteger(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} deve ser um número inteiro maior ou igual a zero.`);
  }
  return value;
}

async function parseGiftForm(formData: FormData) {
  const price = Number(String(formData.get("price") ?? "").replace(",", "."));
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Informe um valor maior que zero.");
  }

  const quantity = getNonNegativeInteger(formData, "quantity");
  if (quantity < 1) throw new Error("A quantidade total deve ser pelo menos 1.");

  const giftedQuantity = getNonNegativeInteger(formData, "giftedQuantity");
  if (giftedQuantity > quantity) {
    throw new Error("A quantidade presenteada não pode superar o total.");
  }

  const imageFile = formData.get("imageFile");
  const imageUrl = imageFile instanceof File && imageFile.size > 0
    ? await uploadGiftImage(imageFile)
    : getRequiredText(formData, "imageUrl");
  if (!imageUrl.startsWith("/") && !imageUrl.startsWith("https://")) {
    throw new Error("Use uma imagem local iniciada por / ou uma URL https://.");
  }

  return {
    name: getRequiredText(formData, "name"),
    description: getRequiredText(formData, "description"),
    imageUrl,
    priceInCents: Math.round(price * 100),
    quantity,
    giftedQuantity,
    isActive: formData.get("isActive") === "on",
  };
}

export async function createGift(
  _previousState: GiftFormState,
  formData: FormData,
): Promise<GiftFormState> {
  await requireAdmin();
  try {
    await prisma.gift.create({ data: await parseGiftForm(formData) });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível criar o presente." };
  }
  revalidatePath("/");
  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
  redirect("/admin/presentes");
}

export async function updateGift(
  id: string,
  _previousState: GiftFormState,
  formData: FormData,
): Promise<GiftFormState> {
  await requireAdmin();
  try {
    await prisma.gift.update({ where: { id }, data: await parseGiftForm(formData) });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Não foi possível salvar o presente." };
  }
  revalidatePath("/");
  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
  redirect("/admin/presentes");
}

export async function toggleGift(formData: FormData) {
  await requireAdmin();
  const id = getRequiredText(formData, "id");
  const gift = await prisma.gift.findUniqueOrThrow({ where: { id } });
  await prisma.gift.update({ where: { id }, data: { isActive: !gift.isActive } });
  revalidatePath("/");
  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
}

export async function deleteGift(formData: FormData) {
  await requireAdmin();
  const id = getRequiredText(formData, "id");
  const orders = await prisma.giftOrder.count({ where: { giftId: id } });
  if (orders > 0) throw new Error("Presentes com pedidos não podem ser excluídos; desative-os.");
  await prisma.gift.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/presentes");
  revalidatePath("/admin/presentes");
}

export async function logoutAdmin() {
  await destroyAdminSession();
  redirect("/admin/login");
}
