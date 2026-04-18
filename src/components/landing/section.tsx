"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className={cn("mx-auto flex max-w-2xl flex-col items-center text-center", className)}
    >
      {eyebrow ? (
        <span className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-balance text-base text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative w-full py-20 md:py-28", className)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">{children}</div>
    </section>
  );
}
