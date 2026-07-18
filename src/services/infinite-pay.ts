import "server-only";

const API_URL = "https://api.checkout.infinitepay.io";

function getHandle() {
  const handle = process.env.INFINITEPAY_HANDLE?.replace(/^\$/, "").trim();
  if (!handle) throw new Error("A InfiniteTag ainda não foi configurada.");
  return handle;
}

async function request<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("A InfinitePay não conseguiu iniciar o pagamento.");
  }

  return response.json() as Promise<T>;
}

export async function createInfinitePayLink(input: {
  orderId: string;
  description: string;
  quantity: number;
  priceInCents: number;
  customerName: string;
  customerEmail: string;
  returnPath?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) throw new Error("O endereço público do site ainda não foi configurado.");

  return request<{ url: string }>("/links", {
    handle: getHandle(),
    order_nsu: input.orderId,
    redirect_url: `${siteUrl}${input.returnPath ?? `/presente-confirmado/${input.orderId}`}`,
    ...(siteUrl.startsWith("https://")
      ? { webhook_url: `${siteUrl}/api/webhooks/infinite-pay` }
      : {}),
    customer: {
      name: input.customerName,
      email: input.customerEmail,
    },
    items: [{
      quantity: input.quantity,
      price: input.priceInCents,
      description: input.description,
    }],
  });
}

export async function checkInfinitePayPayment(input: {
  orderId: string;
  transactionNsu: string;
  invoiceSlug: string;
}) {
  return request<{
    success: boolean;
    paid: boolean;
    amount: number;
    paid_amount: number;
    installments: number;
    capture_method: string;
  }>("/payment_check", {
    handle: getHandle(),
    order_nsu: input.orderId,
    transaction_nsu: input.transactionNsu,
    slug: input.invoiceSlug,
  });
}
