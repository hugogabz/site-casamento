"use client";

import { motion } from "framer-motion";
import { CalendarDays, Gift, Heart } from "lucide-react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { create } from "zustand";

import { Button } from "@/components/ui/button";

type ConfirmationStore = {
  confirmed: boolean;
  confirm: () => void;
};

const useConfirmation = create<ConfirmationStore>((set) => ({
  confirmed: false,
  confirm: () => set({ confirmed: true }),
}));

export default function Home() {
  const { confirmed, confirm } = useConfirmation();

  function handleConfirmation() {
    confirm();
    toast.success("Presença confirmada!", {
      description: "Que alegria ter você conosco neste dia.",
    });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8f2ea] px-6 py-16 text-[#44362f]">
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d7b9a3]/30 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#9faf94]/30 blur-3xl" />

      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-3xl rounded-[2rem] border border-white/70 bg-white/65 px-6 py-14 text-center shadow-xl shadow-[#6f5745]/10 backdrop-blur md:px-16"
      >
        <Heart className="mx-auto mb-7 size-9 fill-[#9f6d65] text-[#9f6d65]" />
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#7e7868]">
          Reserve esta data
        </p>
        <h1 className="font-serif text-5xl leading-tight md:text-7xl">
          Nosso casamento
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-[#665a52] md:text-lg">
          Estamos preparando cada detalhe para celebrar o amor ao lado das
          pessoas mais importantes da nossa história.
        </p>

        <div className="my-9 flex items-center justify-center gap-3 text-sm font-medium uppercase tracking-[0.18em] text-[#596653]">
          <CalendarDays className="size-5" />
          <span>Data e local em breve</span>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            onClick={handleConfirmation}
            disabled={confirmed}
            className="h-11 rounded-full bg-[#596653] px-8 text-white hover:bg-[#46513f]"
          >
            {confirmed ? "Presença confirmada" : "Quero participar"}
          </Button>
          <Link
            href="/presentes"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#9f6d65]/35 bg-white/45 px-7 text-sm font-medium text-[#76564f] transition-colors hover:bg-white/80"
          >
            <Gift className="size-4" />
            Ver lista de presentes
          </Link>
        </div>
      </motion.section>

      <Toaster richColors position="top-center" />
    </main>
  );
}
