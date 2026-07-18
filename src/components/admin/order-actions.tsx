"use client";

import { Ban, Check, LoaderCircle, RotateCcw } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { updateOrderStatus } from "@/app/admin/pedidos/actions";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS, type OrderStatus } from "@/types/order";

export function OrderActions({ orderId, status }: { orderId: string; status: string }) {
  const [pending, startTransition] = useTransition();

  function update(nextStatus: OrderStatus) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);
      if (result.error) toast.error(result.error);
      else toast.success("Pedido atualizado com sucesso.");
    });
  }

  if (pending) {
    return <span className="inline-flex items-center gap-2 text-sm text-[#7e7868]"><LoaderCircle className="size-4 animate-spin" /> Atualizando...</span>;
  }

  if (status === ORDER_STATUS.PENDING) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => update(ORDER_STATUS.PAID)} className="rounded-full bg-[#596653] text-white hover:bg-[#46513f]">
          <Check /> Confirmar pagamento
        </Button>
        <Button size="sm" variant="outline" onClick={() => update(ORDER_STATUS.CANCELED)} className="rounded-full">
          <Ban /> Cancelar
        </Button>
      </div>
    );
  }

  if (status === ORDER_STATUS.PAID) {
    return (
      <Button size="sm" variant="outline" onClick={() => update(ORDER_STATUS.REFUNDED)} className="rounded-full">
        <RotateCcw /> Marcar reembolso
      </Button>
    );
  }

  return null;
}
