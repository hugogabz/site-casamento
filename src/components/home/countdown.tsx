"use client";

import { useEffect, useState } from "react";

function getRemaining(targetDate: string) {
  const difference = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
  return {
    dias: Math.floor(difference / 86_400_000),
    horas: Math.floor((difference / 3_600_000) % 24),
    minutos: Math.floor((difference / 60_000) % 60),
    segundos: Math.floor((difference / 1_000) % 60),
  };
}

export function Countdown({ targetDate }: { targetDate: string }) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetDate));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(targetDate)), 1_000);
    return () => window.clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {Object.entries(remaining).map(([label, value]) => (
        <div key={label} className="rounded-2xl border border-white/70 bg-white/45 px-2 py-4 text-center backdrop-blur sm:px-5 sm:py-5">
          <strong className="block font-serif text-2xl font-normal text-[#44362f] sm:text-4xl">
            {String(value).padStart(2, "0")}
          </strong>
          <span className="mt-1 block text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#7e7868] sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
