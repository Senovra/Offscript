import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EyebrowProps {
  index?: string;
  children: ReactNode;
  className?: string;
}

/** Small mono label with an optional index number, used to number the chapters. */
export default function Eyebrow({ index, children, className }: EyebrowProps) {
  return (
    <p className={cn("type-mono flex items-center gap-3 text-fog", className)}>
      {index && <span className="text-paper">{index}</span>}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{children}</span>
    </p>
  );
}