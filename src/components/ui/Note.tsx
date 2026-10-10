import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NoteProps {
  children: ReactNode;
  className?: string;
}

/**
 * A working note from Senovra to the Offscript team. Used wherever the site
 * still needs Offscript's own words, details or decisions. Remove each note
 * once the real content is in.
 */
export default function Note({ children, className }: NoteProps) {
  return (
    <aside className={cn("max-w-[60ch] border border-ash/40 p-4 md:p-5", className)}>
      <p className="type-mono mb-2 text-paper">Note from Senovra</p>
      <div className="space-y-2 text-[0.9375rem] leading-relaxed text-fog">{children}</div>
    </aside>
  );
}