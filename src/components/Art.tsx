import { useLayoutEffect, useRef } from "react";

export const stepCount = (svg: string) => Math.max(0, ...Array.from(svg.matchAll(/data-step="(\d+)"/g), (m) => Number(m[1])));

/** Inline SVG illustration. `revealed` = how many data-step groups are visible (undefined = all). */
export function Art({ svg, revealed, className = "", keep }: { svg: string; revealed?: number; className?: string; keep?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    ref.current?.querySelectorAll<SVGElement>("[data-step]").forEach((el) => {
      el.classList.toggle("hidden-step", revealed !== undefined && Number(el.dataset.step) > revealed);
    });
  }, [svg, revealed]);
  return <div ref={ref} aria-hidden className={`art ${keep ? "keep" : ""} ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
