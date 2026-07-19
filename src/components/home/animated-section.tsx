"use client";

import { motion } from "framer-motion";

export function AnimatedSection({
  children,
  className = "",
  hero = false,
}: {
  children: React.ReactNode;
  className?: string;
  hero?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: hero ? 28 : 24 }}
      {...(hero
        ? { animate: { opacity: 1, y: 0 } }
        : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.25 } })}
      transition={{ duration: hero ? 0.9 : 0.7 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
