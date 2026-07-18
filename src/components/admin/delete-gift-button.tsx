"use client";

import { Trash2 } from "lucide-react";

import { deleteGift } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function DeleteGiftButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteGift}
      onSubmit={(event) => {
        if (!window.confirm(`Excluir o presente “${name}”? Esta ação não pode ser desfeita.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant="destructive" className="rounded-full">
        <Trash2 />
        Excluir
      </Button>
    </form>
  );
}
